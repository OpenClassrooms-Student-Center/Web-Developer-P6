const mongoose = require("mongoose");

const thingSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  MainPepperIngrediant: { type: String, required: true },
  Heat: { type: String, required: true },
});

module.exports = mongoose.model("Thing", thingSchema);
