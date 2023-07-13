const mongoose = require("mongoose");

const billingInformationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vatIdentificationNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
});

const BillingInformation = mongoose.model(
  "BillingInformation",
  billingInformationSchema
);

module.exports = BillingInformation;
