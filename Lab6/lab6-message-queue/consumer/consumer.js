const amqp = require("amqplib");
const mongoose = require("mongoose");

const RABBITMQ_URL = "amqp://localhost";
const QUEUE = "messages";
const MONGO_URL = "mongodb://localhost:27017/rabbitmq";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err));

const messageSchema = new mongoose.Schema({
  sourse: String,
  id: String,
  name: String,
  email: String,
  content: String,
  timestamp: String,
});

const Message = mongoose.model("Message", messageSchema);

async function consumeMessages() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE);

  console.log("Waiting for messages...");

  channel.consume(QUEUE, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log("Message received:", data);

      try {
        await Message.create(data);
        console.log("Saved to MongoDB");
        channel.ack(msg);
      } catch (err) {
        console.error("MongoDB save error:", err);
      }
    }
  });
}

consumeMessages();
