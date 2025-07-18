const mongoose = require("mongoose");
const { BidSchema } = require("../schemas/BidSchema");


const BidModel = mongoose.model("bid", BidSchema);

module.exports = { BidModel };