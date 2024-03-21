const { Buy } = require("../models/buyModel");
const ObjectID = require("mongoose").Types.ObjectId;

exports.index = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10; // Nombre de résultats par page
  const page = parseInt(req.query.page) || 1; // Numéro de la page

  try {
    const totalCount = await Buy.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const buy = await Buy.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).send({
      status: "Success",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      buy: buy,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching accounts",
      error: error.message,
    });
  }
};

exports.findByUserId = async (req, res) => {
  const id = req.params.id;
  try {
    const buy = await Buy.find({ user: id });
    res.status(200).send(buy);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching accounts",
      error: error.message,
    });
  }
};

exports.findByEventId = async (req, res) => {
  const id = req.params.id;
  try {
    const buy = await Buy.find({ event: id });
    res.status(200).send(buy);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching accounts",
      error: error.message,
    });
  }
}

exports.insert = async (req, res) => {
  try {
    const { user, event, count } = req.body;
    const newBuy = new Buy({
      user: user,
      event: event,
      count: count,
    });

    const savedBuy = await newBuy.save();

    res.status(201).send(savedBuy);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while creating the Buy.",
      error: error.message,
    });
  }
};
