const Schedule = require("../model/Schedule");

const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};

const setSchedule = async (req, res, next) => {
    try {
      const userId = req.userId; 
      console.log(userId, "dddd");
      const { day, isEnabled, startTime, endTime } = req.body;
      let schedule = await Schedule.findOne({ day });
  
      if (!schedule) {
        schedule = new Schedule({ userId: userId, day });
      }
  
      schedule.isEnabled = isEnabled;
      schedule.startTime = startTime;
      schedule.endTime = endTime;
  
      const savedSchedule = await schedule.save();
      res.status(200).json({ userId, ...savedSchedule._doc });
    } catch (error) {
      next(error);
    }
  }; 

module.exports = {
  getAllSchedules,
  setSchedule,
};
