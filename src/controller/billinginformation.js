const BillingInformation = require("../model/BillingInformation");
const User = require("../model/User");

const getBillingInformation = async (res, next) => {
  try {
    const billingInformation = await BillingInformation.findOne();
    res.status(200).json(billingInformation);
  } catch (error) {
    console.error("Error retrieving billingInformation:", error);
    next(error);
  }
};
const createBillingInformation = async (userId, billingData, next) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { name, vatIdentificationNumber, address, city, zipcode } =
      billingData;
    const { fullName, country } = user;

    const newBillingInformation = new BillingInformation({
      userId,
      name: fullName,
      country,
      vatIdentificationNumber,
      address,
      city,
      zipcode,
    });

    const savedBillingInformation = await newBillingInformation.save();

    res.status(200).json(savedBillingInformation);
  } catch (error) {
    console.error("Error creating billing information:", error);
  }
};
const updateBillingInformation = async (req, res, next) => {
  try {
    const billingInformationId = req.params.id;
    console.log(billingInformationId);
    const { name, country, vatIdentificationNumber, address, city, zipcode } =
      req.body;

    const updatedBillingInformation =
      await BillingInformation.findByIdAndUpdate(
        billingInformationId,
        { name, country, vatIdentificationNumber, address, city, zipcode },
        { new: true }
      );
    console.log(updatedBillingInformation, "qewed");
    if (!updatedBillingInformation) {
      return res.status(404).json({ message: "Billing information not found" });
    }

    res.status(200).json(updatedBillingInformation);
  } catch (error) {
    console.error("Error updating billing information:", error);
    next(error);
  }
};

module.exports = {
  createBillingInformation,
  updateBillingInformation,
  getBillingInformation,
};
