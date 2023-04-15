const mongoose = require("mongoose");

const vttSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  averageRating: { type: String, required: true },
 
});

module.exports = mongoose.model("VttModel", vttSchema);
