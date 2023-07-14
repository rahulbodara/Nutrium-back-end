const Subscription = require("../model/Subscription");

const getSubscription = async (res, next) => {
  try {
    const subscription = await Subscription.findOne();
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  const userId = req.userId;
  const {
    trialPeriodEndDate,
    subscriptionStatus,
    currentPlan,
    limitOfActiveClientsPerMonth,
    subscriptionPeriod: { month, currency, discount, value },
    price: { priceCurrency, priceValue },
  } = req.body;

  try {
    const newSubscription = new Subscription({
      userId,
      trialPeriodEndDate,
      subscriptionStatus,
      currentPlan,
      limitOfActiveClientsPerMonth,
      subscriptionPeriod: {
        month,
        currency,
        discount,
        value,
      },
      price: { priceCurrency, priceValue },
    });

    const savedSubscription = await newSubscription.save();
    res.status(200).json(savedSubscription);
  } catch (error) {
    next(error);
  }
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
      {
        currentPlan,
        limitOfActiveClientsPerMonth,
        subscriptionPeriod,
        price,
      },
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
module.exports = {
  getSubscription,
  createSubscription,
  updateSubscription,
};
