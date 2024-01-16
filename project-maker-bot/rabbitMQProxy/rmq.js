const amqp = require('amqplib/callback_api');

exports.connection = null;
exports.producerChannel = null;
exports.consumerChannel = null;

exports.openConnection = function(rabbitMQhost,callback){
    amqp.connect(`amqp://${rabbitMQhost}`, function(err,conn){
        if(err){
            throw err;
        }

        conn.on("error", function(err) {
            console.log("ERROR", err);
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
      
        conn.on("close", function() {
            // Reconnect when connection was closed
            console.error("[AMQP] reconnecting");
            return setTimeout(() => { exports.openConnection() }, 1000);
        });

        console.log("AMQP connection established");
        exports.connection = conn;
        callback();
    });
}

exports.createProducer = function(queue){
      exports.connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue, {
            durable: true
        });
        console.log(` [*] Producer ready to produce messages on ${queue}`)
        exports.producerChannel = channel;
    });
}

exports.createConsumer = function(queue,callback){
  exports.connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    //Prefetch ensures that only a specified number of unacknoledged messages are consumed, 
    //in this case 1, meaning unless the one consumed message is ack-ed, the consumer will
    //NOT consume any further
    channel.prefetch(1);
    channel.assertQueue(queue, { durable: true }, function(err,ok){
        if(err){
            throw err;
        }
        channel.consume(queue, callback, { noAck: false });
        console.log(` [*] Consumer waiting for messages in ${queue} To exit press CTRL+C`);
        exports.consumerChannel = channel;
    });
});

exports.sendToQueue = function(payload){
    exports.producerChannel.sendToQueue(queue, Buffer.from(payload), {
        persistent: true
    });
    console.log(" [x] Sent '%s'", payload);
    }
}