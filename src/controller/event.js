const Event = require("../model/Event");

const createEvent = async (req, res, next) => {
  const userId = req.userId;

  try {
    const { title, start, end } = req.body;

    const startDateTime = new Date(start); 
    const endDateTime = new Date(end); 
    
    function addTimeZoneOffset(inputDate) {
      const timeZoneOffset = inputDate.getTimezoneOffset();
      const dateWithOffset = new Date(inputDate.getTime() - timeZoneOffset * 60000);
      return dateWithOffset;
    }
    const startWithOffset = addTimeZoneOffset(startDateTime);
    const endWithOffset = addTimeZoneOffset(endDateTime);

    const event = new Event({
      userId,
      title,
      start : startWithOffset,
      end : endWithOffset,
    });

    const savedEvent = await event.save();
    res.status(200).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    next(error);
  }
};
const getAllEvents = async (req, res, next) => {
  try {
    const userId = req.userId;
    const events = await Event.find({userId:userId});
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { title, start, end } = req.body;

    const startDateTime = new Date(start); 
    const endDateTime = new Date(end); 
    
    function addTimeZoneOffset(inputDate) {
      const timeZoneOffset = inputDate.getTimezoneOffset();
      const dateWithOffset = new Date(inputDate.getTime() - timeZoneOffset * 60000);
      return dateWithOffset;
    }
    const startWithOffset = addTimeZoneOffset(startDateTime);
    const endWithOffset = addTimeZoneOffset(endDateTime);

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.title = title;
    event.start = startWithOffset;
    event.end = endWithOffset;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent
};
