const mongoose = require('mongoose');

const observationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Clients',
  },
  registrationDate: {
    type: String,
    required: function () {
      return this.observationDetail && this.observationDetail.length > 0;
    },
    validate: {
      validator: function (value) {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!dateRegex.test(value)) {
          return false;
        }
        const parts = value.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month - 1, day);
        return (
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        );
      },
      message: 'Please enter a valid date in the format DD/MM/YYYY',
    },
  },
  observation: {
    type: String,
  },
});

module.exports = mongoose.model('observations', observationSchema);
