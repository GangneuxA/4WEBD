const fetch = require("node-fetch");
const amqp = require("amqplib");

const URLBUY = process.env.URLBUY;
const RABBIT = process.env.RABBIT;

exports.index = async (req, res) => {
  try {
    const response = await fetch(
      `${URLBUY}`, //+
      // new URLSearchParams({
      //   perPage: parseInt(req.query.perPage) || 10,
      //   page: parseInt(req.query.page) || 1,
      // })
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const jsonData = await response.json();

    res.status(200).send(jsonData);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching transfers",
      error: error.message,
    });
  }
};

exports.insert = async (req, res) => {
  try {
    const { eventid, count } = req.body;
    const id = req.auth.user._id;

    const connection = await amqp.connect(RABBIT);
    const channel = await connection.createChannel();
    const queueName = "mail";

    const message = { data: "vous avez acheter vos billet" };
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    console.log("Message envoyé à la file d'attente RabbitMQ");

    await channel.close();
    await connection.close();

    const buybody = {
      event: eventid,
      user: id,
      count: count,
    };
    const savedBuy = await fetch(URLBUY, {
      method: "POST",
      body: JSON.stringify(buybody),
      headers: { "Content-Type": "application/json" },
    });
    if (!savedBuy.ok) {
      throw new Error("Failed to get account to");
    }
    const savedBuyJSON = await savedBuy.json();

    res.status(201).send({
      status: "Success",
      data: savedBuyJSON,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while creating the buy.",
      error: error.message,
    });
  }
};
