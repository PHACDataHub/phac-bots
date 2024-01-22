require('dotenv').config()
const { App } = require('@slack/bolt');
const { WebClient, LogLevel } = require("@slack/web-api");
const { projectDetailsForm,creatingProject,invalidCommand } = require("./blocks.js");
const rmq = require('./rmq');
const rabbitMQhost = process.env.rabbitMQhost;
const producerQueue = process.env.producerQueue;
const consumerQueue = process.env.consumerQueue;

const app = new App({
  token: process.env.BOT_TOKEN, 
  appToken: process.env.APP_TOKEN,
  socketMode: true,
});

let slack_web_client = null;

const sendAck = (msg) => {
    //console.log(`statusCode: ${res.statusCode}`)
    //console.log(res)
    console.log(" [x] Sending Ack Done");
    rmq.consumerChannel.ack(msg);
}


const consumerCallback = (msg) => {
        //const secs = Number(msg.content.toString().split('m')[1]);
        console.log(" [x] Received %s", msg.content.toString());
        const payloadJSON = JSON.parse(msg.content.toString());
        const splitText = payloadJSON.responseText.split("Pull Request ")[1];
        const text = `<${payloadJSON.pull_url}|Pull Request> ` + splitText;
        const block = [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": text
              }
            }
          ]
        sendAck(msg);
        slack_web_client.chat.postMessage({
            channel: payloadJSON.channel,
            blocks: block
        })
}

const createProducerConsumer = () => {
    rmq.createProducer(producerQueue);
    rmq.createConsumer(consumerQueue,consumerCallback);
}


(async () => {
    await app.start();
    console.log('⚡️ Bolt app started');
    slack_web_client = new WebClient(process.env.BOT_TOKEN);
    rmq.openConnection(rabbitMQhost, createProducerConsumer);
})();

// subscribe to 'app_mention' event in your App config
// need app_mentions:read and chat:write scopes
app.event('app_mention', async ({ event, context, client, say }) => {
  try {
    let split = event.text.split(">")[1];
    let match = true;
    if(split.includes(" make")){
        split = split.split(" ");
        let matchCount = 0;
        split.forEach(el=>{
            if(match){
                if(el === ''){
                    match = true;
                }
                else if(el.toLowerCase() === 'make'){
                    matchCount += 1;
                    match = matchCount == 1 ? true:false;
                }
                else{
                    match = false;
                }}});
        match = (matchCount == 1 && match) ? true:false;
    }
    else
      match = false;
    if(match)
      await say(projectDetailsForm);
    else
      await say(invalidCommand)
  }
  catch (error) {
    console.error(error);
  }
});

app.action('submit_project_create_data', async ({ ack, body, client, logger, say }) => {
  try {
    await ack();
    let event = {};
    let data = {}

    Object.entries(body.state.values).forEach(([key,value])=>{
        const [k,val] = (Object.entries(value))[0];
        if(val.type === 'plain_text_input'){
            data[k] = val.value;
        }
        else if(val.type === 'multi_static_select'){
            data[k] = val.selected_options.map(el=>el.value);
        }
    });

    event.team = body.team.id;
    event.user = body.user.id;
    event.channel = body.channel.id;
    event.event_ts = body.message.ts;
    event.trigger_id = body.trigger_id;
    event.token = body.token;
    event.text = "> '"+JSON.stringify(data)+"'"
    rmq.producerChannel.sendToQueue(producerQueue, Buffer.from(JSON.stringify(event)), {
        persistent: true
    });
    console.log(" [x] Sent '%s'", JSON.stringify(event));
    //slack_web_client.chat.postMessage({
        //channel: event.channel,
        //text: "Processing project creation request"
    //})
    await say(creatingProject);
  }
  catch (error) {
    console.error(error);
  }
});