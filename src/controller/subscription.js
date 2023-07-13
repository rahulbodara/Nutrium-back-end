const Subscription = require("../model/Subscription");

const getSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const subscription = await Subscription.find({ userId });
    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error retrieving subscription:", messege);
    res.status(500).json({ messege: "An error occurred" });
  }
};

const createSubscription = async (req, res) => {
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
    console.error("Error creating subscription:", messege);
    res.status(500).json({ messege: "An error occurred" });
  }
};
const updateSubscription = async (req, res) => {
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
    console.error("Error updating subscription:", messege);
    res.status(500).json({ messege: "An error occurred" });
  }
};
module.exports = {
  getSubscription,
  createSubscription,
  updateSubscription,
};
