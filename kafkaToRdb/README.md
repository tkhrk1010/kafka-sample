# Kafka-sample

# Set up
```
$ docker-compose up -d
$ npm install
$ tsc
```

Set up DB in local.
```
# sample code passwrod is kafka-user-pass
$ createuser -U your-username -P -s -e kafka-user
$ createdb -U kafka-user kafka-target-rdb
```

connect to kafka-target-rdb
``` sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL
);
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
```

# Test
```
$ node dist/main.js
$ curl -X POST -H "Content-Type: application/json" -d '{"name": "John", "age": 30}' http://localhost:3000/api/message
```
You can see the data is recorded in messages table.
```
$ psql kafka-target-rdb 
kafka-target-rdb=# select * from messages;
 id |            data             
----+-----------------------------
  1 | {"age": 30, "name": "John"}
(1 row)
```

# monitoring

See topic with GUI.
```
http://localhost:8080/
```


# References
https://dev.classmethod.jp/articles/kafka-streams/

