const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addLabTestRequest, getAllLabTest, getOneLabTest, updateLabTestRequest, deleteLabTestRequest } = require('../controller/client/client');

const router = express.Router();

router.post('/add-new-lab-test/:clientId', isAuthenticated, addLabTestRequest);
router.get("/get-all-lab-test/:clientId", isAuthenticated, getAllLabTest);
router.get("/get-lab-test-id/:clientId/:labTestId", isAuthenticated, getOneLabTest);
router.put('/update-lab-test/:labTestId', isAuthenticated, updateLabTestRequest);
router.delete('/delete-lab-test-request/:labTestId', isAuthenticated, deleteLabTestRequest);

module.exports = router;