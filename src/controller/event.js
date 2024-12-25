const Event = require("../model/Event");

const createEvent = async (req, res, next) => {
  const userId = req.userId;

  try {
    const { title, start, end, allDay, googleCalendar, blockCalendar } = req.body;



    const event = new Event({
      userId,
      title,
      start: start,
      end: end,
      allDay, googleCalendar, blockCalendar
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
    const events = await Event.find({ userId: userId });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { title, start, end, allDay, googleCalendar, blockCalendar } = req.body;





    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.title = title;
    event.start = start;
    event.end = end;
    event.allDay = allDay;
    event.googleCalendar = googleCalendar;
    event.blockCalendar = blockCalendar;

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
