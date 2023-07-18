const express = require('express');
const router = express.Router();
const multer = require('multer');

const { isAuthenticated } = require('../middleware/auth');
const {
  registerClient,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
} = require('../controller/client/client');

const upload = multer({ dest: 'src/uploads/' });

router.post('/client', isAuthenticated, registerClient);
router.delete('/client/:id', isAuthenticated, deleteClient);
router.get('/client', isAuthenticated, getAllClient);
router.get('/client/:id', isAuthenticated, getClientByID);
router.put(
  '/client/:id',
  upload.single('image'),
  isAuthenticated,
  updateClient
);

module.exports = router;
