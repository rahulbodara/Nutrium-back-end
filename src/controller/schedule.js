const Schedule = require("../model/Schedule");

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

    schedule.schedules = schedules.map((newSchedule) => {
      if (newSchedule.isEnabled === false) return null;

      const updatedWorkplace = newSchedule.workplace.map(workplace => {
        workplace.notes = workplace.notes || "";
        return workplace;
      });

      return { ...newSchedule, workplace: updatedWorkplace };
    }).filter(Boolean);

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
  setSchedule,
  getScheduleById,
};
