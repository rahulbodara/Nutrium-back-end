const Subscription = require("../model/Subscription");

const getSubscription = async (req,res, next) => {
  try {
    const subscription = await Subscription.findOne();
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};
const createSubscription = async (userId) => {
  const subscriptionData = {
    userId: userId,
    trialPeriodEndDate: getFormattedDate(),
    subscriptionStatus: "In trial",
    currentPlan: "Follow-up",
    limitOfActiveClientsPerMonth: 10,
    subscriptionPeriod: {
      month: "Monthly",
      currency: "US$",
      discount: 0,
      value: 76.0,
    },
    price: { priceCurrency: "US$", priceValue: 76.0 },
  };
  function getFormattedDate() {
    const today = new Date();
    const trialEndDate = new Date(today);
    trialEndDate.setDate(trialEndDate.getDate() + 15);

    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = trialEndDate.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  const newSubscription = new Subscription(subscriptionData);
  return newSubscription.save();
};
const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      currentPlan,
      limitOfActiveClientsPerMonth,
      subscriptionPeriod,
      price,
    } = req.body;

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { currentPlan, limitOfActiveClientsPerMonth, subscriptionPeriod, price },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ messege: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};
module.exports = { getSubscription, createSubscription, updateSubscription };
