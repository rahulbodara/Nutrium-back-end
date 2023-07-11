const Workplace = require("../model/Workplace");

const createWorkplace = (req, res) => {
  const workplaceData = req.body;

  const workplace = new Workplace(workplaceData);
  workplace
    .save()
    .then((savedWorkplace) => {
      res.status(201).json(savedWorkplace);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to save workplace" });
    });
};

const getAllWorkplaces = (req, res) => {
  Workplace.find()
    .then((workplaces) => {
      res.json(workplaces);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch workplaces" });
    });
};

const getWorkplaceById = (req, res) => {
  const workplaceId = req.params.id;

  Workplace.findById(workplaceId)
    .then((workplace) => {
      if (workplace) {
        res.json(workplace);
      } else {
        res.status(404).json({ error: "Workplace not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch workplace" });
    });
};

const updateWorkplace = (req, res) => {
  const workplaceId = req.params.id;
  const updates = req.body;

  Workplace.findByIdAndUpdate(workplaceId, updates, { new: true })
    .then((updatedWorkplace) => {
      if (updatedWorkplace) {
        res.json(updatedWorkplace);
      } else {
        res.status(404).json({ error: "Workplace not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to update workplace" });
    });
};

const deleteWorkplace = (req, res) => {
  const workplaceId = req.params.id;

  Workplace.findByIdAndRemove(workplaceId)
    .then((deletedWorkplace) => {
      if (deletedWorkplace) {
        res.json({ message: "Workplace deleted successfully" });
      } else {
        res.status(404).json({ error: "Workplace not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to delete workplace" });
    });
};

module.exports = {
  createWorkplace,
  getAllWorkplaces,
  getWorkplaceById,
  updateWorkplace,
  deleteWorkplace,
};
