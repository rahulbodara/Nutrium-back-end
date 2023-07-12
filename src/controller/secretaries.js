const Secretaries = require("../model/Secretaries");

const createSecretaries = async (req, res) => {
  try {
    const userId = req.userId;
    const secretariesData = {
      ...req.body,
      userId: userId,
    };
    const service = new Secretaries(secretariesData);
    const savedSecretaries = await service.save();

    res.status(201).json(savedSecretaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save Secretaries" });
  }
};

const getAllSecretaries = async (req, res, next) => {
  try {
    const userId = req.userId;
    const secretaries = await Secretaries.find({ userId: userId });
    if (!secretaries) {
      return res.status(404).json({ message: "Secretaries Not Found!" });
    }
    res.status(200).json(secretaries);
  } catch (error) {
    next(error);
  }
};

const getSecretariesById = async (req, res) => {
  try {
    const secretariesId = req.params.id;

    const secretaries = await Secretaries.findById(secretariesId);

    if (secretaries) {
      res.json(secretaries);
    } else {
      res.status(404).json({ error: "Secretaries not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Secretaries" });
  }
};

const updateSecretaries = async (req, res) => {
  try {
    const secretariesId = req.params.id;
    const updates = req.body;
    const updatedSecretaries = await Secretaries.findByIdAndUpdate(
      secretariesId,
      updates,
      {
        new: true,
      }
    );
    if (updatedSecretaries) {
      res.json(updatedSecretaries);
    } else {
      res.status(404).json({ error: "Secretaries not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update Secretaries" });
  }
};

const deleteSecretaries = async (req, res) => {
  try {
    const secretariesId = req.params.id;

    const deletedSecretaries = await Service.findByIdAndRemove(secretariesId);

    if (deletedSecretaries) {
      res.json({ message: "Secretaries deleted successfully" });
    } else {
      res.status(404).json({ error: "Secretaries not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete Secretaries" });
  }
};

module.exports = {
  createSecretaries,
  getAllSecretaries,
  getSecretariesById,
  updateSecretaries,
  deleteSecretaries,
};
