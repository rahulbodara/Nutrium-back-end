const Schedule = require("../model/Schedule");

// const getAllSchedules = async (req, res, next) => {
//   try {
//     const schedules = await Schedule.find();
//     if (!schedules || schedules.length === 0) {
//       return res.status(404).json({ message: "No schedules found" });
//     }
//     res.status(200).json(schedules);
//   } catch (error) {
//     next({ status: 500, message: "Error fetching schedules", error });
//   }
// };

const setSchedule = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { schedules } = req.body;
    if (!Array.isArray(schedules)) {
      return res.status(400).json({ message: "Schedules must be an array" });
    }

    let schedule = await Schedule.findOne({ userId });

    if (!schedule) {
      schedule = new Schedule({ userId, schedules: [] });
    }

    // Filter out schedules that are not in the request (i.e., remove unmentioned days)
    schedule.schedules = schedules.filter((newSchedule) => newSchedule.isEnabled !== false);

    const savedSchedule = await schedule.save();
    res.status(200).json({ message: "Schedule updated successfully", userId, schedules: savedSchedule.schedules });
  } catch (error) {
    console.error("❌ Error in setSchedule:", error);
    next({ status: 500, message: "Error saving schedule", error });
  }
};


const getScheduleById = async (req, res, next) => {
  try {
    const userId = req.userId;
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
  // getAllSchedules,
  setSchedule,
  getScheduleById,
};
