const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  numberDispo: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = { Event };
