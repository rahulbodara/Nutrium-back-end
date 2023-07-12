const mongoose = require("mongoose");

const workplaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,

    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: "Invalid phone number format",
    },
  },
  color: {
    type: String,
  },
  associateAddress: {
    type: Boolean,
  },
  address: {
    street: {
      type: String,
      required: function () {
        return this.associateAddress === true;
      },
    },
    city: {
      type: String,
      required: function () {
        return this.associateAddress === true;
      },
    },
    zipCode: {
      type: String,
      required: function () {
        return this.associateAddress === true;
      },
      validate: {
        validator: function (value) {
          return /^\d{5}(?:-\d{4})?$/.test(value);
        },
        message: "Invalid zip code format",
      },
    },
  },
});

const Workplace = mongoose.model("Workplace", workplaceSchema);

module.exports = Workplace;
