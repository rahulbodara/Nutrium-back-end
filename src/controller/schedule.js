const Schedule = require("../model/Schedule");

const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find();
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: "No schedules found" });
    }
    res.status(200).json(schedules);
  } catch (error) {
    next({ status: 500, message: "Error fetching schedules", error });
  }
};

const setSchedule = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from request parameters
    if (!userId) {
      return res.status(400).json({ message: "User ID is required in the URL" });
    }

    const { schedules } = req.body;
    if (!Array.isArray(schedules)) {
      return res.status(400).json({ message: "Schedules must be an array" });
    }

    let schedule = await Schedule.findOne({ userId });

    if (!schedule) {
      schedule = new Schedule({ userId, schedules: [] });
    }

    schedules.forEach((newSchedule) => {
      const existingSchedule = schedule.schedules.find((s) => s.day === newSchedule.day);

      if (existingSchedule) {
        existingSchedule.isEnabled = newSchedule.isEnabled;
        existingSchedule.workplace = newSchedule.workplace;
      } else {
        schedule.schedules.push(newSchedule);
      }
    });

    const savedSchedule = await schedule.save();
    res.status(200).json({ userId, schedules: savedSchedule.schedules });
  } catch (error) {
    next({ status: 500, message: "Error saving schedule", error });
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from request parameters
    if (!userId) {
      return res.status(400).json({ message: "User ID is required in the URL" });
    }

    const schedule = await Schedule.findOne({ userId });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found for the given user ID" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    next({ status: 500, message: "Error fetching schedule by user ID", error });
  }
};

module.exports = {
  getAllSchedules,
  setSchedule,
  getScheduleById,
};
