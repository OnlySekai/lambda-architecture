const fs = require('fs');
const readline = require('readline');
const { Kafka } = require('kafkajs');
const path = require('path');
const http = require('http');

async function produceMessages() {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['simple-kafka:9092']
  });

  const producer = kafka.producer();
  await producer.connect();

  const fileStream = fs.createReadStream(path.resolve(__dirname, 'log_action.csv'));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const [student_code,activity, numberOfFile, timestamp] = line.split(',');

    const message = {
      student_code: parseInt(student_code, 10),
      activity,
      numberOfFile: parseInt(numberOfFile, 10),
      timestamp
    };

    await producer.send({
      topic: 'vdt2024',
      messages: [
        { value: JSON.stringify(message) }
      ],
    });

    console.log(`Message sent: ${JSON.stringify(message)}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
  }

  await producer.disconnect();
}
const server = http.createServer(async (req, res) => {
try {
  await produceMessages()
  res.end('OK');}
  catch (error) {
    console.error(error);
    res.end('Error');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});