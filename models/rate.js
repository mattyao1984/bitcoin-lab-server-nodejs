const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  rate: {
    type: String,
    required: true
  },
  rate_float: {
    type: Number,
    require: true
  },
  description: {
    type: String
  },
  updated: {
    type: String
  }
});

module.exports = mongoose.model('rate', rateSchema);