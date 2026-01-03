const amqp = require("amqplib");
const express = require("express");
const faker = require("@faker-js/faker").faker;

const app = express();

const PRODUCER_NAME = "ProducerB";
const RABBITMQ_URL = "amqp://localhost";
const QUEUE = "messages";

let channel;

function generateFakeMessage() {
  return {
    source: PRODUCER_NAME,
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    content: faker.lorem.sentence(),
    timestamp: new Date().toISOString(),
  };
}

async function initRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);

    console.log("RabbitMQ connected, queue ready");
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    process.exit(1);
  }
}

function startAutoProducer() {
  setInterval(() => {
    const message = generateFakeMessage();
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
    console.log("Message sent:", message);
  }, 5000);
}

const PORT = 3002;

app.listen(PORT, async () => {
  console.log(`Producer running on http://localhost:${PORT}`);
  await initRabbitMQ();
  startAutoProducer();
});
