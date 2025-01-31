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
  const { duration, plan_name } = req.body
  try {
    const user = await User.findById({ _id: userId })
    const plan = plans.find((p) => p.plan_name === plan_name && p.duration === duration)
    console.log("🚀 ~ createSubscriptionDoc ~ plan:", plan)
    if (!plan) {
      throw new Error("Invalid plan");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const { email, fullName } = user


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
      success_url: `http://localhost:3000/admin/professionals/Subscription/success?session_id={CHECKOUT_SESSION_ID} `,
      cancel_url: `http://localhost:3000/admin/professionals/Subscription/fails`,
      customer: customer.id,


    })
    console.log("🚀 ~ createSubscriptionDoc ~ session:", session)

    const saveSessionId = await User.findByIdAndUpdate({ _id: userId }, { subscriptionId: session.id })


    return res.status(200).json({ data: session, message: "Purchased successfully" });
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}




module.exports = { getSubscription, createSubscription, updateSubscription, createSubscriptionDoc };
