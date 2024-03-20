const ObjectID = require("mongoose").Types.ObjectId;
const fetch = require("node-fetch");

const URLBUY = process.env.URLBUY;

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

    // const message = {
    //   userId: jsonDatato.user,
    //   title: `M/Mme vous avez recu  ${jsonDatato}`,
    //   message: `M/Mme vous avez recu  ${jsonDatato}`,
    // };

    // fetch(URLNOFTIF, {
    //   method: "POST",
    //   body: JSON.stringify(message),
    //   headers: { "Content-Type": "application/json" },
    // })
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));

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
