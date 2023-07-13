const Workplace = require("../model/Workplace");

const createWorkplace = async (req, res) => {
  try {
    const userId = req.userId;
    const workplaceData = {
      ...req.body,
      userId: userId,
    };

    const workplace = new Workplace(workplaceData);
    const savedWorkplace = await workplace.save();

    res.status(201).json(savedWorkplace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save workplace" });
  }
};

const getAllWorkplaces = async (req, res, next) => {
  try {
    const userId = req.userId;
    const workplace = await Workplace.find({ userId: userId });
    console.log("workplace,", workplace);
    if (!workplace) {
      return res.status(404).json({ message: "Workplace Not Found!" });
    }
    res.status(200).json(workplace);
  } catch (error) {
    next(error);
  }
};

const getWorkplaceById = async (req, res) => {
  try {
    const workplaceId = req.params.id;
    const workplace = await Workplace.findById(workplaceId);

    if (workplace) {
      res.status(200).json(workplace);
    } else {
      res.status(404).json({ message: "Workplace not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workplace" });
  }
};

const updateWorkplace = async (req, res) => {
  try {
    const workplaceId = req.params.id;
    const updates = req.body;

    const updatedWorkplace = await Workplace.findByIdAndUpdate(
      workplaceId,
      updates,
      { new: true }
    );

    if (updatedWorkplace) {
      res.status(200).json(updatedWorkplace);
    } else {
      res.status(404).json({ message: "Workplace not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update workplace" });
  }
};

const deleteWorkplace = async (req, res) => {
  try {
    const workplaceId = req.params.id;

    const deletedWorkplace = await Workplace.findByIdAndRemove(workplaceId);

    if (deletedWorkplace) {
      res.status(200).json({ message: "Workplace deleted successfully" });
    } else {
      res.status(404).json({ message: "Workplace not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete workplace" });
  }
};

module.exports = {
  createWorkplace,
  getAllWorkplaces,
  getWorkplaceById,
  updateWorkplace,
  deleteWorkplace,
};
