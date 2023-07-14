const Service = require("../model/Service");

const createService = async (req, res, next) => {
  try {
    const userId = req.userId;
    const serviceData = {
      ...req.body,
      userId: userId,
    };
    const service = new Service(serviceData);
    const savedService = await service.save();

    res.status(201).json(savedService);
  } catch (error) {
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const userId = req.userId;
    const services = await Service.find({ userId: userId });
    if (!services) {
      return res.status(404).json({ message: "Service Not Found!" });
    }
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);

    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const serviceId = req.params.id;
    const updates = req.body;

    const updatedService = await Service.findByIdAndUpdate(serviceId, updates, {
      new: true,
    });

    if (updatedService) {
      res.status(200).json(updatedService);
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const deletedService = await Service.findByIdAndRemove(serviceId);

    if (deletedService) {
      res.status(200).json({ message: "Service deleted successfully" });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};