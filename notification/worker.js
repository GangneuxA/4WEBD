const amqp = require("amqplib");
require("dotenv").config();

async function listenToQueue() {
  const connection = await amqp.connect(process.env.RABBIT);
  const channel = await connection.createChannel();
  const queueName = "mail";

  await channel.assertQueue(queueName, { durable: false });

  console.log("Le worker écoute les messages de la file d'attente...");

  channel.consume(queueName, (message) => {
    if (message !== null) {
      console.log("Message reçu:", message.content.toString());
      channel.ack(message);
    }
  });

  // Attente indéfinie pour maintenir le worker en cours d'exécution
  await new Promise(() => {});
}

// Exemple d'utilisation
listenToQueue().catch(console.error);
