const functions = require('@google-cloud/functions-framework');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager').v1;
const { WebClient, LogLevel } = require("@slack/web-api");

const secretmanagerClient = new SecretManagerServiceClient();

let SLACK_WEB_CLIENT = null;
let CHANNEL_ID = null;

const request = {
  name : "projects/332560742969/secrets/slack-bot-api-token/versions/4"
};

// Function to access secret
function loadSlackChannelandWebClient(){
  return new Promise((resolve,reject)=>{
    if(SLACK_WEB_CLIENT !== null && CHANNEL_ID !== null){
      resolve({
                slack_web_client : SLACK_WEB_CLIENT,
                channelId : CHANNEL_ID  
              });
    }
    else{
      secretmanagerClient.accessSecretVersion(request).then(result => {
        const [version] = result;
        secret = JSON.parse(version.payload.data.toString('utf8'));
        let {slack_bot_token, channelId} = secret;
        SLACK_WEB_CLIENT =new WebClient(slack_bot_token, {
            logLevel: LogLevel.DEBUG
        });
        CHANNEL_ID = channelId;
        resolve({
                slack_web_client : SLACK_WEB_CLIENT,
                channelId : CHANNEL_ID
              });
      });
    }
  });
}

// Register a CloudEvent function with the Functions Framework
functions.cloudEvent('myCloudEventFunction', cloudEvent => {
  // Your code here
  // Access the CloudEvent data payload via cloudEvent.data
  loadSlackChannelandWebClient()
  .then(result => {
    let {slack_web_client,channelId} = result;
    const base64Data = cloudEvent.data.message.data;
    const buffer = new Buffer(base64Data,'base64');
    const message = buffer.toString('ascii');
    try {
      // Call the chat.postMessage method using the WebClient
      const postMessage_result = slack_web_client.chat.postMessage({
        channel: channelId,
        text: message
      });
    }
    catch (error) {
      console.error(error);
    }
  });
});