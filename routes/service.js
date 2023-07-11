const express = require('express');
const serviceController = require('../controller/service');

const router = express.Router();

router.post('/services', serviceController.createService);
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);
router.put('/services/:id', serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;
