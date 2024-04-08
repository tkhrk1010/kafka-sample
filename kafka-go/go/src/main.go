package main

import (
    "fmt"
    "github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
    fmt.Println("Start Kafka Sample")
    
    // Kafkaブローカーのアドレス
    broker := "host.docker.internal:9092"
    // 使用するトピック
    topic := "test-topic"

    // プロデューサーの作成
    p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": broker})
    if err != nil {
        panic(err)
    }
    defer p.Close()

    // メッセージの送信
    value := "Hello Kafka"
    p.Produce(&kafka.Message{
        TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
        Value:          []byte(value),
    }, nil)

    // コンシューマーの作成
    c, err := kafka.NewConsumer(&kafka.ConfigMap{
        "bootstrap.servers": broker,
        "group.id":          "myGroup",
        "auto.offset.reset": "earliest",
    })
    if err != nil {
        panic(err)
    }
    defer c.Close()

    // トピックの購読
    c.SubscribeTopics([]string{topic}, nil)

    // メッセージの受信と表示
    for {
        msg, err := c.ReadMessage(-1)
        if err == nil {
            fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
            break // サンプルなので1メッセージ受け取ったら終了
        } else {
            fmt.Printf("Consumer error: %v (%v)\n", err, msg)
            break
        }
    }
}
