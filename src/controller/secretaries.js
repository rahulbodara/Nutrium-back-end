const Secretaries = require('../model/Secretaries');
const fs = require('fs');

const createSecretaries = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, email, workplace } = req.body;
    const existingSecretary = await Secretaries.findOne({ email });
    if (existingSecretary) {
      if (req.file && req.file.filename) {
      fs.unlinkSync(`${__dirname}/../uploads/${req.file.filename}`);
      }
      return res.status(400).json({ message: 'Email already exists' });
    }
    const secretariesData = {
      userId,
      name,
      email,
      workplace,
    };

    const service = new Secretaries(secretariesData);
    if (req.file && req.file.filename) {
      service.image = req.file.filename;
    }
    const savedSecretaries = await service.save();
    res.status(200).json(savedSecretaries);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getAllSecretaries = async (req, res, next) => {
  try {
    const query = {
      userId: req.userId,
      isActive: 1,
    };
    const secretaries = await Secretaries.find(query);
    if (!secretaries) {
      return res.status(404).json({ message: 'Secretaries Not Found!' });
    }
    res.status(200).json(secretaries);
  } catch (error) {
    next(error);
  }
};

const getSecretariesById = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
      isActive: 1,
    };

    const secretaries = await Secretaries.findOne(query);

    if (secretaries) {
      res.status(200).json(secretaries);
    } else {
      res.status(404).json({ message: 'Secretaries not found' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateSecretaries = async (req, res, next) => {
  try {
    const secretariesId = req.params.id;
    let { name, email, workplace } = req.body
    const secretaries = await Secretaries.findOne({ _id: secretariesId });
    if (!secretaries) {
      return res.status(404).json({ message: 'Secretaries not found' });
    }
    if (email !== secretaries.email) {
      const existingSecretary = await Secretaries.findOne({ email });

      if (existingSecretary) {
        fs.unlinkSync(`${__dirname}/../uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    const updates = {
      name,
      email,
      workplace
    };

    if (req.file && req.file.filename) {
      if (secretaries.image) {
        fs.unlinkSync(
          `${__dirname}/../uploads/${secretaries.image}`
        );
      }
      updates.image = req.file.filename;
    } else {
      updates.image = secretaries.image;
    }

    const updatedSecretaries = await Secretaries.findByIdAndUpdate(
      secretariesId,
      updates,
      {
        new: true,
      }
    );

    if (updatedSecretaries) {
      res.status(200).json(updatedSecretaries);
    } else {
      res.status(404).json({ message: 'Secretaries not found' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteSecretaries = async (req, res, next) => {
  try {
    const secretariesId = req.params.id;
    const query = {
      _id: secretariesId,
      userId: req.userId,
      isActive: 1,
    };
    const deletedSecretaries = await Secretaries.findOneAndUpdate(
      query,
      { $set: { isActive: 0 } },
      { new: true }
    );

    if (deletedSecretaries) {
      res.status(200).json({ message: 'Secretaries deleted successfully' });
    } else {
      res.status(404).json({ message: 'Secretaries not found' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  createSecretaries,
  getAllSecretaries,
  getSecretariesById,
  updateSecretaries,
  deleteSecretaries,
};
