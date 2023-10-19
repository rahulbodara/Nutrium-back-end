const CalenderSetting = require('../model/CalenderSetting');

const createCalenderSetting = async (req, res, next) => {
  const userId = req.userId;
  try {
    const { birthdaySystem, appointmentRequestSystem } = req.body;

    const newCalenderSetting = new CalenderSetting({
      userId,
      birthdaySystem,
      appointmentRequestSystem,
    });

    const savedCalenderSetting = await newCalenderSetting.save();

    res.status(200).json(savedCalenderSetting);
  } catch (error) {
    console.error('Error creating calender setting:', error);
    next(error);
  }
};
const getCalenderSetting = async (req, res, next) => {
  try {
    const calenderSettings = await CalenderSetting.findOne();

    res.status(200).json(calenderSettings);
  } catch (error) {
    console.error('Error retrieving calendar settings:', error);
    next(error);
  }
};
const updateCalenderSetting = async (req, res, next) => {
  try {
    const calenderSettingId = req.params.id;
    const { birthdaySystem, appointmentRequestSystem } = req.body;

    const updatedCalenderSetting = await CalenderSetting.findByIdAndUpdate(
      calenderSettingId,
      { birthdaySystem, appointmentRequestSystem },
      { new: true }
    );

    if (!updatedCalenderSetting) {
      return res.status(404).json({ message: 'Calender setting not found' });
    }
    res.status(200).json(updatedCalenderSetting);
  } catch (error) {
    console.error('Error updating calender setting:', error);
    next(error);
  }
};

module.exports = {
  createCalenderSetting,
  updateCalenderSetting,
  getCalenderSetting,
};
