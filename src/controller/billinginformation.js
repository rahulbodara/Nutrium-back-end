const BillingInformation = require("../model/BillingInformation");
const User = require("../model/User");

const getBillingInformation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const billingInformation = await BillingInformation.findOne({ userId });
    if (!billingInformation) {
      return res.status(404).json({ message: "Billing information not found" });
    }
    return res.status(200).json({ data: billingInformation });
  } catch (error) {
    console.error("Error retrieving billingInformation:", error);
    next(error);
    return res.json(500).json({ message: error })
  }
};

const createBillingInformation = async (_, res, userId, billingData) => {
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

    return res.status(200).json(savedBillingInformation);
  } catch (error) {
    console.error("Error creating billing information:", error);
  }
};
const updateBillingInformation = async (req, res, next) => {
  try {
    const billingInformationId = req.params.id;

    const {
      name,
      country,
      vatIdentificationNumber,
      address,
      city,
      zipcode,
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (country) updateFields.country = country;
    if (vatIdentificationNumber)
      updateFields.vatIdentificationNumber = vatIdentificationNumber;
    if (address) updateFields.address = address;
    if (city) updateFields.city = city;
    if (zipcode) updateFields.zipcode = zipcode;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updatedBillingInformation =
      await BillingInformation.findByIdAndUpdate(
        billingInformationId,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

    if (!updatedBillingInformation) {
      return res.status(404).json({ message: "Billing information not found" });
    }

    res.status(200).json(updatedBillingInformation);
  } catch (error) {
    console.error("Error updating billing information:", error);
    next(error);
  }
};

const createBillingInformationAPI = async (req, res) => {
  const userId = req.userId
  const billingData = req.body
  try {

    const user = await User.findOne({ _id: userId })

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

    return res.status(200).json({ success: true, data: savedBillingInformation });
  } catch (error) {
    console.error("Error creating billing information:", error);
    return res.status(500).json({ message: error })
  }
};

module.exports = {
  createBillingInformation,
  updateBillingInformation,
  getBillingInformation,
  createBillingInformationAPI
};
