const User = require('../model/User');

const createPersonalDetail = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { presentation, aboutMe, url } = req.body;

    // Check if the user exists
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the URLs
    url.forEach((urlObj) => {
      const indexToUpdate = existingUser.url.findIndex(
        (item) => item._id.toString() === urlObj._id
      );
      if (indexToUpdate !== -1) {
        // If the URL object ID matches, update the object
        existingUser.url[indexToUpdate].platform = urlObj.platform;
        existingUser.url[indexToUpdate].link = urlObj.link;
      } else {
        // If the URL object ID is not found, create a new object
        existingUser.url.push(urlObj);
      }
    });

    existingUser.presentation = presentation;
    existingUser.aboutMe = aboutMe;

    // Save the updated user
    const updatedUser = await existingUser.save();

    return res
      .status(200)
      .json({ message: 'User data updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPersonalDetail };
