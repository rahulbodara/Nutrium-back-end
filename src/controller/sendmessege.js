const SendMessege = require("../model/SendMessege");

const createSendMessege = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { sendTo, category, subject, message } = req.body;
    const file = req.file.filename;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "You need to choose a file",
      });
    }
    const messageData = {
      userId,
      sendTo: sendTo,
      category: category,
      subject: subject,
      message: message,
      attachedFiles: file,
    };

    const createMessage = await SendMessege.create(messageData);

    return res.status(201).json(createMessage);
  } catch (error) {
    next(error);
  }
};
const getAllMessages = async (req, res, next) => {
  try {
    const allMessages = await SendMessege.find();

    return res.status(200).json(allMessages);
  } catch (error) {
    next(error);
  }
};

module.exports = { createSendMessege, getAllMessages };
