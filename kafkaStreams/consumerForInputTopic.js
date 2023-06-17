'use strict';
var kafka = require('kafka-node');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({kafkaHost: "localhost:9092"});
const consumer = new Consumer(
    client,
    [{topic: "input-topic", partision:0}],
    {
        groupId: "my-consumer",
        autoCommit: true,
        fromOffset: true
    }
);

consumer.on("message", (message, err) => {
    if (err) console.log("error : " + err);
    console.log("message:" + message.value);
});

consumer.on('error', function (err) {
    console.log('error', err);
});
