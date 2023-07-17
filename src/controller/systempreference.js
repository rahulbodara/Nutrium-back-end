const SystemPreference = require("../model/SystemPreference");

const createSystemPreference = async (req, res, next) => {
  const userId = req.userId;
  try {
    const {
      timeZone,
      language,
      weightUnit,
      lengthUnit,
      energyUnit,
      volumeUnit,
      distanceUnit,
      statisticMeasure,
    } = req.body;

    const newSystemPreference = new SystemPreference({
      userId,
      timeZone,
      language,
      weightUnit,
      lengthUnit,
      energyUnit,
      volumeUnit,
      distanceUnit,
      statisticMeasure,
    });

    const savedSystemPreference = await newSystemPreference.save();

    res.status(200).json(savedSystemPreference);
  } catch (error) {
    next(error);
  }
};

const getSystemPreference = async ( res, next) => {
  try {
    const systemPreference = await SystemPreference.findOne();
    res.status(200).json(systemPreference);
  } catch (error) {
    next(error);
  }
};

const updateSystemPreference = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      timeZone,
      language,
      weightUnit,
      lengthUnit,
      energyUnit,
      volumeUnit,
      distanceUnit,
      statisticMeasure,
    } = req.body;

    const updatedSystemPreference = await SystemPreference.findByIdAndUpdate(
      id,
      {
        timeZone,
        language,
        weightUnit,
        lengthUnit,
        energyUnit,
        volumeUnit,
        distanceUnit,
        statisticMeasure,
      },
      { new: true }
    );

    if (!updatedSystemPreference) {
      return res.status(404).json({ error: "System preference not found" });
    }

    res.json(updatedSystemPreference);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSystemPreference,
  getSystemPreference,
  updateSystemPreference,
};
