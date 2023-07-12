const express = require('express');

const workplaceController = require('../controller/workplace');

const router = express.Router();

router.post('/workplaces', workplaceController.createWorkplace);
router.get('/workplaces', workplaceController.getAllWorkplaces);
router.get('/workplaces/:id', workplaceController.getWorkplaceById);
router.put('/workplaces/:id', workplaceController.updateWorkplace);
router.delete('/workplaces/:id', workplaceController.deleteWorkplace);

module.exports = router;
