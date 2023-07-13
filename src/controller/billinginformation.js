const BillingInformation = require("../model/BillingInformation");
const User = require("../model/User");

const getBillingInformation = async (req, res) => {
  try {
    const userId = req.userId;
    const billingInformation = await BillingInformation.find({ userId });
    res.status(200).json(billingInformation);
  } catch (error) {
    console.error("Error retrieving billingInformation:", messege);
    res.status(500).json({ messege: "An error occurred" });
  }
};
const createBillingInformation = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ messege: "User not found" });
    }
    const { name, vatIdentificationNumber, address, city, zipcode } = req.body;
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
    console.error("Error creating billing information:", messege);
    res.status(500).json({ messege: "An error occurred" });
  }
};

const updateBillingInformation = async (req, res) => {
  try {
    const billingInformationId = req.params.id;
    const { name, country, vatIdentificationNumber, address, city, zipcode } =
      req.body;

    const updatedBillingInformation =
      await BillingInformation.findByIdAndUpdate(
        billingInformationId,
        {
          name,
          country,
          vatIdentificationNumber,
          address,
          city,
          zipcode,
        },
        { new: true }
      );
    if (!updatedBillingInformation) {
      return res.status(404).json({ messege: "Billing information not found" });
    }

    res.status(200).json(updatedBillingInformation);
  } catch (error) {
    console.error("Error updating billing information:", messege);
    res.status(500).json({ messege: "An error occurred" });
  }
};

module.exports = {
  createBillingInformation,
  updateBillingInformation,
  getBillingInformation,
};
