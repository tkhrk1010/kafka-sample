# Kafka-sample

# Set up
```
$ docker-compose up -d
$ npm install
$ tsc
```

Then, create topic.
```
$ docker-compose exec kafka \
    kafka-topics --create \
    --zookeeper zookeeper:2181 \
    --topic my-topic \
    --partitions 3 \
    --replication-factor 1
```

You can confirm topic is created. 
```
$ docker-compose exec kafka \
    kafka-topics --list \
    --zookeeper zookeeper:2181
my-topic
test
```

# Test
```
$ node dist/producer.js taro 30
$ node dist/consumer.js
$ node dist/producer.js jiro 29
$ node dist/consumer.js
```


# References
https://dev.classmethod.jp/articles/kafka-streams/

