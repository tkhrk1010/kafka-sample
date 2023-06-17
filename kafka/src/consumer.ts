import { Consumer, KafkaClient, Message } from 'kafka-node';

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new Consumer(
  client,
  [{ topic: 'test', partition: 0 }],
  {
    groupId: 'my-consumer',
    autoCommit: true,
    fromOffset: true,
  }
);

consumer.on('message', (message: Message) => {
  const value = message.value instanceof Buffer ? message.value.toString() : message.value;
  const json = JSON.parse(value);
  console.log('JSON:', JSON.stringify(json));
  console.log('Name:', json.name);
  console.log('Age:', json.age);
});

consumer.on('error', (error: Error) => {
  console.log('error', error);
});
