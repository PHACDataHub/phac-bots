const axios = require('axios');
const rmq = require('./rmq');
const rabbitMQhost = process.env.rabbitMQhost;
const server = process.env.server;
const port = process.env.port;
const producerQueue = process.env.producerQueue;
const consumerQueue = process.env.consumerQueue;

const sendAck = (msg) => {
    rmq.consumerChannel.ack(msg);
    console.log(" [x] Sending Ack Done");
}

const sendMessage = function(res,originalPayload,projectPayload){
    //console.log(`statusCode: ${res.statusCode}`)
    originalPayload.pull_url = res.data.html_url;
    originalPayload.responseText = `Pull Request created for project : ${projectPayload["project-vanity-name"]} at ${res.headers.date}`;
    rmq.producerChannel.sendToQueue(producerQueue, Buffer.from(JSON.stringify(originalPayload)), {
        persistent: true
    });
    console.log(" [x] Sent to completedQueue '%s'", JSON.stringify(originalPayload));
}

const consumerCallback = function(msg){
        console.log(" [x] Received %s", msg.content.toString());
        const res= true;
        const payloadJSON = JSON.parse(msg.content.toString());
        const msgStr = payloadJSON["text"].split("> ")[1];
        const projectPayload = JSON.parse(msgStr.substring(1,msgStr.length-1));
        console.log(projectPayload);
        axios
            .post(`http://${server}:${port}`, 
                 projectPayload//JSON.parse(msg.content.toString())
            )
            .then(function(res){
                sendAck(msg);
                let originalPayload = JSON.parse(this.originalPayload);
                let projectPayload = JSON.parse(this.projectPayload);
                sendMessage(res,originalPayload,projectPayload);
            }.bind({"originalPayload" : JSON.stringify(payloadJSON),
                    "projectPayload" : JSON.stringify(projectPayload)}))
            .catch((error) => {
                console.error(error)
            })

}

const createProducerConsumer = () => {
    rmq.createProducer(producerQueue);
    rmq.createConsumer(consumerQueue,consumerCallback);
}

rmq.openConnection(rabbitMQhost, createProducerConsumer);