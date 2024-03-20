const ObjectID = require("mongoose").Types.ObjectId;
const fetch = require("node-fetch");

const URLEVENT = process.env.URLEVENT;

exports.index = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    const response = await fetch(
      `${URLEVENT}`, //+
      //   new URLSearchParams({
      //     perPage: parseInt(req.query.perPage) || 10,
      //     page: parseInt(req.query.page) || 1,
      //   })
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const jsonData = await response.json();

    res.status(200).send({ jsonData });
  } catch (err) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching transfers",
      error: err.message,
    });
  }
};

exports.findById = async (req, res) => {
  const id = req.params.id;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    const response = await fetch(`${URLEVENT}${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const jsonData = await response.json();

    res.status(200).send(jsonData);
  } catch (err) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching transfers",
      error: err.message,
    });
  }
};

exports.insert = async (req, res) => {
  const { name, desc, numberDispo, price } = req.body;
  try {
    const message = {
      name: name,
      desc: desc,
      numberDispo: numberDispo,
      price: price,
    };

    const response = await fetch(URLEVENT, {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    res.status(200).send({
      status: "Success",
      data: responseData,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({
      status: "Error",
      message: "An error occurred while inserting data",
      error: err.message,
    });
  }
};

exports.update = async (req, res) => {
  const { name, desc, numberDispo, price } = req.body;
  const id = req.params.id;
  try {
    const message = {
      name: name,
      desc: desc,
      numberDispo: numberDispo,
      price: price,
    };

    const response = await fetch(`${URLEVENT}${id}`, {
      method: "PUT",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    res.status(200).send({
      status: "Success",
      data: responseData,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({
      status: "Error",
      message: "An error occurred while inserting data",
      error: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(`${URLEVENT}${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }

    res.status(200).send({
      status: "Success",
      message: "Account successfully deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "Error",
      message: "An error occurred while deleting account",
      error: err.message,
    });
  }
};
