const Workplace = require("../model/Workplace");
const path = require("path");
const fs = require("fs");

const createWorkplace = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { associateAddress, isPublic } = req.body;
    const workplaceData = {
      ...req.body,
      userId: userId,
      isPublic: isPublic || false,
    };

    if (associateAddress == false) {
      workplaceData.address = {};
    }
    if (req.file) {
      workplaceData.image = `/uploads/${req.file.filename}`;
    }

    const workplace = new Workplace(workplaceData);
    const savedWorkplace = await workplace.save();

    res.status(201).json(savedWorkplace);
  } catch (error) {
    next(error);
  }
};

const getAllWorkplaces = async (req, res, next) => {
  try {
    const query = {
      userId: req.userId,
    };
    const workplace = await Workplace.find(query);
    if (!workplace) {
      return res.status(404).json({ message: "Workplace Not Found!" });
    }
    res.status(200).json(workplace);
  } catch (error) {
    next(error);
  }
};

const getWorkplaceById = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
    };
    const workplace = await Workplace.findOne(query);

    if (workplace) {
      res.status(200).json(workplace);
    } else {
      res.status(404).json({ message: "Workplace not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateWorkplace = async (req, res, next) => {
  try {
    const workplaceId = req.params.id;
    const userId = req.userId;
    const updates = { ...req.body };

    const workplace = await Workplace.findOne({ _id: workplaceId, userId });
    if (!workplace) {
      return res.status(404).json({
        success: false,
        message: "Workplace not found",
      });
    }

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;

      if (workplace.image) {
        const oldImagePath = path.join(__dirname, "..", workplace.image);
        console.log("🚀 ~ updateWorkplace ~ oldImagePath:", oldImagePath)
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error removing old image:", err);
        });
      }
      if (workplace.image) {
        fs.unlink(workplace.image, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    }

    const updatedWorkplace = await Workplace.findByIdAndUpdate(
      workplaceId,
      { $set: updates },
      { new: true }
    );

    if (!updatedWorkplace) {
      return res.status(404).json({
        success: false,
        message: "Workplace not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workplace updated successfully",
      data: updatedWorkplace,
    });
  } catch (error) {
    next(error);
  }
};

const deleteWorkplace = async (req, res, next) => {
  try {
    const workplaceId = req.params.id;
    const query = {
      _id: workplaceId,
      userId: req.userId,
    };
    const deletedWorkplace = await Workplace.findOneAndDelete(query, {
      new: true,
    });

    if (deletedWorkplace) {
      res.status(200).json({ message: "Workplace deleted successfully" });
    } else {
      res.status(404).json({ message: "Workplace not found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkplace,
  getAllWorkplaces,
  getWorkplaceById,
  updateWorkplace,
  deleteWorkplace,
};
