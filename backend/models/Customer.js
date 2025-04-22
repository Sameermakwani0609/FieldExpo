const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerMobile: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Customer', customerSchema);