const Service = require('../model/Service');

const createService = (req, res) => {
  const serviceData = req.body;

  const service = new Service(serviceData);
  service.save()
    .then(savedService => {
      res.status(201).json(savedService);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to save service' });
    });
};

const getAllServices = (req, res) => {
  Service.find()
    .then(services => {
      res.json(services);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch services' });
    });
};

const getServiceById = (req, res) => {
  const serviceId = req.params.id;

  Service.findById(serviceId)
    .then(service => {
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch service' });
    });
};

const updateService = (req, res) => {
  const serviceId = req.params.id;
  const updates = req.body;

  Service.findByIdAndUpdate(serviceId, updates, { new: true })
    .then(updatedService => {
      if (updatedService) {
        res.json(updatedService);
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to update service' });
    });
};

const deleteService = (req, res) => {
  const serviceId = req.params.id;

  Service.findByIdAndRemove(serviceId)
    .then(deletedService => {
      if (deletedService) {
        res.json({ message: 'Service deleted successfully' });
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete service' });
    });
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
