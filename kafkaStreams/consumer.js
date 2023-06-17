'use strict';
var kafka = require('kafka-node');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({kafkaHost: "localhost:9092"});
const consumer = new Consumer(
    client,
    [{topic: "test", partision:0}],
    {
        groupId: "my-consumer",
        autoCommit: true,
        fromOffset: true
    }
);

consumer.on("message", (message, err) => {
    if (err) console.log("error : " + err);

    const json = JSON.parse(message.value);
    console.log("JSON:" + JSON.stringify(json));
    console.log("Name:" + json.name);
    console.log("Age:" + json.age);
});

consumer.on('error', function (err) {
    console.log('error', err);
});
