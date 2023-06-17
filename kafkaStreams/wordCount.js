"use strict";

//wordCount.js

const { KafkaStreams } = require("kafka-streams");
const { nativeConfig: config } = require("./kafka/config.js");

const keyMapperEtl = (kafkaMessage) => {
    const value = kafkaMessage.value.toString("utf8");
    console.log("message : " + value);
    const elements = value.toLowerCase().split(" ");
    return {
        someField: elements[0],
    };
};

const kafkaStreams = new KafkaStreams(config);

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

const stream = kafkaStreams.getKStream();

//input-topicから取得したデータを
//キー毎にカウントしてoutput-topicに送る（count >= 3のキー）
stream
    .from("input-topic")
    .map(keyMapperEtl)
    .countByKey("someField", "count")
    .filter(kv => kv.count >= 3) 
    .map(kv => kv.someField + " " + kv.count)
    .tap(kv => console.log(kv))
    .to("output-topic");


Promise.all([
    stream.start()
]).then(() => {
    console.log("started..");
    // 50秒したらStreamをclose
    setTimeout(() => {
        kafkaStreams.closeAll();
        console.log("stopped..");
    }, 50000);
});
