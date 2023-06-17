'use strict';
var kafka = require("kafka-node");

const Producer = kafka.HighLevelProducer;
const client = new kafka.KafkaClient({
    kafkaHost: "localhost:9092"
});
const producer = new Producer(client, {
    partitionerType: 1
});

producer.on("ready", () => {
    //プログラム引数で受け取る
    const fruit = process.argv[2];
    const count = process.argv[3];
    const message = [
        {
            topic: "input-topic",
            messages: fruit + " " + count
        }
    ];

    producer.send(message, (err, data) => {
        if (err) console.log(err);
        else console.log('send messages');
        process.exit();
    });
});
