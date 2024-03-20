const mongoose = require("mongoose");
const { Schema } = mongoose;

const BuySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event",
    required: true,
  },
  count: { type: Number, required: true },
  At: { type: Date, default: Date.now },
});

const Buy = mongoose.model("Buy", BuySchema);

module.exports = { Buy };
