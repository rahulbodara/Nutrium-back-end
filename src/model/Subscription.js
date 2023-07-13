const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  trialPeriodEndDate: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    enum: ["In trial", "Active"],
    default: "In trial",
  },
  currentPlan: {
    type: String,
    enum: ["Follow-up", "Meal Plans"],
    default: "Follow-up",
  },
  limitOfActiveClientsPerMonth: {
    type: String,
    enum: ["10", "25", "75", "Unlimited"],
    default: "10",
  },
  subscriptionPeriod: {
    month: {
      type: String,
      enum: ["Monthly", "Quarterly", "Semiannual", "Annual"],
      default: "Monthly",
    },
    currency: {
      type: String,
      default: "US$",
    },
    discount: {
      type: Number,
      enum: [-5, -10, -20],
    },
    value: {
      type: Number,
      enum: [56.0, 53.2, 50.4, 44.8],
      default: 50.4,
    },
  },
  price: {
    priceCurrency: {
      type: String,
      default: "US$",
    },
    priceValue: {
      type: Number,
    },
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
