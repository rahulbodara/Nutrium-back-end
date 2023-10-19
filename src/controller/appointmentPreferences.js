const AppointmentPref = require('../model/AppointmentPref');

const createAppointmentPref = async (req, res, next) => {
  try {
    const userId = req.userId;
    const preferenceData = { ...req.body, userId: userId };

    const data = new AppointmentPref(preferenceData);
    const savedPreference = await data.save();

    res.status(200).json(savedPreference);
  } catch (error) {
    next(error);
  }
};

const getAppointmentPref = async (req, res, next) => {
  try {
    const query = {
      userId: req.userId,
    };
    const preferenceData = await AppointmentPref.find(query);
    if (!preferenceData) {
      return res.status(404).json({ message: 'Not Found!' });
    }
    res.status(200).json(preferenceData);
  } catch (error) {
    next(error);
  }
};

const getAppointmentPrefByID = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
    };
    const preferenceData = await AppointmentPref.findOne(query);
    if (!preferenceData) {
      return res.status(404).json({ message: 'Not Found!' });
    }
    res.status(200).json(preferenceData);
  } catch (error) {
    next(error);
  }
};

const updateAppointmentPref = async (req, res, next) => {
  try {
    const prefId = req.params.id;
    const updates = req.body;
    const updatedPreference = await AppointmentPref.findByIdAndUpdate(
      prefId,
      updates,
      { new: true }
    );

    if (updatedPreference) {
      res.status(200).json(updatedPreference);
    } else {
      res.status(404).json({ message: 'not found' });
    }
  } catch (error) {
    next(error);
  }
};

const deleteAppointmentPref = async (req, res, next) => {
  try {
    const prefId = req.params.id;

    const deletedpref = await AppointmentPref.findByIdAndDelete(prefId);

    if (deletedpref) {
      res
        .status(200)
        .json({ message: 'Appointment Preference deleted successfully' });
    } else {
      res.status(404).json({ message: 'not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointmentPref,
  getAppointmentPref,
  deleteAppointmentPref,
  getAppointmentPrefByID,
  updateAppointmentPref,
};
