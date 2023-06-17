import { KafkaClient, HighLevelProducer, ProduceRequest } from 'kafka-node';

const client: KafkaClient = new KafkaClient({
    kafkaHost: 'localhost:9092'
});

const producer: HighLevelProducer = new HighLevelProducer(client, {
    partitionerType: 1
});

producer.on('ready', () => {
    // Command line arguments for name and age
    const name: string = process.argv[2];
    const age: string = process.argv[3];

    const message: ProduceRequest[] = [
        {
            topic: 'my-topic',
            messages: JSON.stringify({ name: name, age: age })
        }
    ];

    producer.send(message, (err: Error | null, data: any) => {
        if (err) {
            console.log(err);
        } else {
            console.log('send messages');
        }
        process.exit();
    });
});
