const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getCommonmeasures,  deleteMeasures, addOrUpdateCommonMeasures } = require('../controller/Commonmeasures');
const router = express.Router();


router.post('/Commonmeasures', isAuthenticated, addOrUpdateCommonMeasures);
router.get('/getCommonmeasures', isAuthenticated, getCommonmeasures);
// router.put('/updateCommonmeasures/:id', isAuthenticated, updatedMeasures);
router.delete('/deleteCommonmeasures/:id', isAuthenticated, deleteMeasures);


module.exports = router;


