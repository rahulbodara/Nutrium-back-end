const express = require('express');
const { checkPermission } = require('../../middleware/checkPermission');
const { createPermission, getPermissions, deletePermission, updatePermission } = require('../../controller/Role/permissionController');
const { isAuthenticated } = require('../../middleware/auth');


const router = express.Router();

// router.post('/permission', isAuthenticated, checkPermission('create', 'Permission'), createPermission);
// router.get('/permission', isAuthenticated, checkPermission('read', 'Permission'), getPermissions);
// router.delete('/permission/:id', isAuthenticated, checkPermission('delete', 'Permission'), deletePermission);
// router.put('/permission/:id', isAuthenticated, checkPermission('update', 'Permission'), updatePermission);

router.post('/permission', isAuthenticated, createPermission);
router.get('/permission', isAuthenticated, getPermissions);
router.delete('/permission/:id', isAuthenticated, deletePermission);
router.put('/permission/:id', isAuthenticated, updatePermission);


module.exports = router;
