import express, { Request, Response } from 'express';
import { Producer, KafkaClient, ConsumerGroup } from 'kafka-node';
import { Pool } from 'pg';

const app = express();
const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(kafkaClient);

// PostgreSQLの接続プールの設定
const pool = new Pool({
  user: 'kafka-user',
  password: 'kafka-user-pass',
  host: 'localhost',
  database: 'kafka-target-rdb',
  port: 5432,
});

app.use(express.json());

// APIエンドポイントの定義
app.post('/api/message', (req: Request, res: Response) => {
  const message = req.body;

  // Kafkaにメッセージをプロデュース
  const payloads = [{ topic: 'my-topic', messages: JSON.stringify(message) }];
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error producing message:', err);
      res.status(500).json({ error: 'Error producing message' });
    } else {
      console.log('Message produced:', data);
      res.status(200).json({ success: true });
    }
  });
});

// Kafkaコンシューマの設定
const consumerOptions = {
  kafkaHost: 'localhost:9092',
  groupId: 'my-consumer-group',
  fromOffset: 'latest' as const,
};
const consumer = new ConsumerGroup(consumerOptions, ['my-topic']);

// Kafkaコンシューマのメッセージ処理
consumer.on('message', async (message) => {
  const msg = JSON.parse(message.value.toString());

  // メッセージをRDBに保存
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO messages (data) VALUES ($1)', [msg]);
    client.release();
    console.log('Message saved to RDB:', msg);
  } catch (error) {
    console.error('Error saving message to RDB:', error);
  }
});

// Expressサーバーの起動
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
