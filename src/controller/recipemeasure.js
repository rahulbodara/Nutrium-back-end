const Measure = require("../model/RecipsMeasure");

const getAllMeasures = async (req, res, next) => {
  try {
    const measures = await Measure.find();
    res.json(measures);
  } catch (error) {
    next(error);
  }
};

const createMeasure = async (req, res, next) => {
  try {
    const userId = req.userId;
    const newMeasure = new Measure({ userId, ...req.body });
    const savedMeasure = await newMeasure.save();
    res.json(savedMeasure);
  } catch (error) {
    next(error);
  }
};

const updateMeasure = async (req, res, next) => {
  try {
    const updatedMeasure = await Measure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMeasure);
  } catch (error) {
    next(error);
  }
};

const deleteMeasure = async (req, res, next) => {
  try {
    await Measure.findByIdAndDelete(req.params.id);
    res.json({ message: "Measure deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMeasures,
  createMeasure,
  updateMeasure,
  deleteMeasure,
};
