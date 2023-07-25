const Event = require('../model/Event');

const createEvent = async (req, res, next) => {
  try {
    const { title, start, end } = req.body;

    const event = new Event({
      title,
      start,
      end,
    });

    const savedEvent = await event.save();
    res.status(200).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    next(error);
  }
};
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    next(error);
  }
};


const updateEvent = async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const { title, start, end } = req.body;
  
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      event.title = title;
      event.start = start;
      event.end = end;
  
      const updatedEvent = await event.save();
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      next(error);
    }
  };

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent
};
