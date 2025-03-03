// const { default: Stripe } = require("stripe");
const Subscription = require("../model/Subscription");
const User = require("../model/User");
const stripe = require("stripe")("sk_test_51QmqKWAEL1nWMYVA15oy89EpEgBSNiVlrwwwqrg6wER1sSSR9pxLw53i7YRFa91JmHpQqUBws6iD5JEhJOpO2yRg00rl2tRLHa")

// const charge = await stripe.charges.create({
//   amount: 1099,
//   currency: 'usd',
//   source: 'tok_visa',
// });



const getSubscription = async (req, res, next) => {
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

const plans = [
  {
    plan_id: "price_1Qmqz4AEL1nWMYVA38qpKSqy",
    plan_name: "Nutrium_Yearly",
    duration: "year"

  },
  {
    plan_id: "price_1QmqxbAEL1nWMYVAOaHpxtW0",
    plan_name: "Nutrium_monthly",
    duration: "month"
  }
]


const createSubscriptionDoc = async (req, res, next) => {
  const userId = req.userId;
  const { duration, plan_name } = req.body;

  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const plan = plans.find((p) => p.plan_name === plan_name && p.duration === duration);
    if (!plan) {
      throw new Error("Invalid plan");
    }

    const { email, fullName } = user;

    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      name: fullName,
      email,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{
        price: plan.plan_id,
        quantity: 1,
      }],
      success_url: `http://localhost:3000/admin/professionals/Subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/admin/professionals/Subscription/fails`,
      customer: customer.id,
    });


    await User.findByIdAndUpdate(
      { _id: userId },
      { subscriptionId: session.id }
    );

    const subscriptionData = {
      userId: userId,
      subscriptionStatus: "Active",
      currentPlan: plan_name === "Nutrium_Yearly" ? "Meal Plans" : "Follow-up",
      limitOfActiveClientsPerMonth: plan_name === "Nutrium_Yearly" ? "Unlimited" : "10",
      subscriptionPeriod: {
        period: duration === "year" ? "Annual" : "Monthly",
        currency: "US$",
        discount: duration === "year" ? -10 : 0,
        value: duration === "year" ? 68.4 : 76.0,
      },
      price: {
        priceCurrency: "US$",
        priceValue: duration === "year" ? 68.4 : 76.0,
      },
    };

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { userId: userId },
      subscriptionData,
      { upsert: true, new: true }
    );

    return res.status(200).json({
      data: session,
      subscription: updatedSubscription,
      message: "Purchased successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getPaymentData = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    let actualSubscriptionId = subscriptionId;
    if (subscriptionId.startsWith("cs_")) {
      const session = await stripe.checkout.sessions.retrieve(subscriptionId);
      actualSubscriptionId = session.subscription;
      if (!actualSubscriptionId) {
        return res.status(404).json({ message: "No subscription found for this session." });
      }
    }

    const subscription = await stripe.subscriptions.retrieve(actualSubscriptionId);

    if (!subscription.latest_invoice) {
      return res.status(404).json({ message: "No invoices found for this subscription." });
    }

    const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);

    if (!invoice.payment_intent) {
      return res.status(404).json({ message: "No payment intent found for this invoice." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);

    res.status(200).json({
      success: true,
      paymentData: paymentIntent,
      subscription: subscription,
    });
  } catch (error) {
    console.error("Error fetching payment data:", error);
    res.status(500).json({ message: "Error fetching payment data" });
  }
};



module.exports = { getSubscription, createSubscription, updateSubscription, createSubscriptionDoc, getPaymentData };
