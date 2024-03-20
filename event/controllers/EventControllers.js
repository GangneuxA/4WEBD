const { Event } = require("../models/EventModel");
const ObjectID = require("mongoose").Types.ObjectId;

exports.index = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;

  try {
    const totalCount = await Event.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const events = await Event.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).send({
      status: "Success",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      events: events,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching event",
      error: error.message,
    });
  }
};

exports.indexOfid = async (req, res) => {
  const Eventid = req.params.id;

  try {
    const event = await Event.findById(Eventid);

    if (!event) {
      return res.status(404).send({
        status: "Error",
        message: `No event found with id: ${Eventid}`,
      });
    }
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching event",
      error: error.message,
    });
  }
};

exports.insert = async (req, res) => {
  try {
    const { name, desc, numberDispo, price } = req.body;
    const newEvent = new Event({ name, desc, numberDispo, price });
    const savedEvent = await newEvent.save();
    res.status(201).send(savedEvent);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while inserting new Event",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { name, desc, numberDispo, price } = req.body;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).send({
        status: "Error",
        message: `No event found with id: ${id}`,
      });
    }

    event.name = name;
    event.desc = desc;
    event.numberDispo = numberDispo;
    event.price = price;
    const updatedEvent = await event.save();

    res.status(200).send({
      status: "Success",
      message: "Event updated successfully",
      updatedAccount: updatedEvent,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while updating event with id: ${id}`,
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send({
      status: "Error",
      message: `Invalid ID: ${id}`,
    });
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).send({
        status: "Error",
        message: `No event found with id: ${id}`,
      });
    }

    res.status(200).send(deletedEvent);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while deleting event with id: ${id}`,
      error: error.message,
    });
  }
};
