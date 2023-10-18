const Workplace = require('../model/Workplace');

const createWorkplace = async (req, res, next) => {
  try {
    const userId = req.userId;
    const workplaceData = {
      ...req.body,
      userId: userId,
    };

    if (req.body.associateAddress == false) {
      workplaceData.address = '';
    }

    const workplace = new Workplace(workplaceData);
    const savedWorkplace = await workplace.save();

    res.status(201).json(savedWorkplace);
  } catch (error) {
    next(error);
  }
};

const getAllWorkplaces = async (req, res, next) => {
  try {
    const query = {
      userId: req.userId,
    };
    const workplace = await Workplace.find(query);
    if (!workplace) {
      return res.status(404).json({ message: 'Workplace Not Found!' });
    }
    res.status(200).json(workplace);
  } catch (error) {
    next(error);
  }
};

const getWorkplaceById = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
    };
    const workplace = await Workplace.findOne(query);

    if (workplace) {
      res.status(200).json(workplace);
    } else {
      res.status(404).json({ message: 'Workplace not found' });
    }
  } catch (error) {
    next(error);
  }
};

const updateWorkplace = async (req, res, error) => {
  try {
    const workplaceId = req.params.id;
    const userId = req.userId;
    const updates = req.body;
    const query = {
      _id: workplaceId,
      userId: userId,
    };

    const updatedWorkplace = await Workplace.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true }
    );

    if (updatedWorkplace) {
      res.status(200).json(updatedWorkplace);
    } else {
      res.status(404).json({ message: 'Workplace not found' });
    }
  } catch (error) {
    next(error);
  }
};

const deleteWorkplace = async (req, res, next) => {
  try {
    const workplaceId = req.params.id;
    const query = {
      _id: workplaceId,
      userId: req.userId,
    };
    const deletedWorkplace = await Workplace.findOneAndDelete(
      query,
      { new: true }
    );

    if (deletedWorkplace) {
      res.status(200).json({ message: 'Workplace deleted successfully' });
    } else {
      res.status(404).json({ message: 'Workplace not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkplace,
  getAllWorkplaces,
  getWorkplaceById,
  updateWorkplace,
  deleteWorkplace,
};
