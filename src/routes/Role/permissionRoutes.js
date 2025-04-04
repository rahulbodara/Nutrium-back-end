const express = require('express');
const { checkPermission } = require('../../middleware/checkPermission');
const { createPermission, getPermissions, deletePermission, updatePermission } = require('../../controller/Role/permissionController');
const { isAuthenticated } = require('../../middleware/auth');


const router = express.Router();

router.post('/permission', isAuthenticated, checkPermission('create', 'Permission'), createPermission);
router.get('/permission', isAuthenticated, checkPermission('read', 'Permission'), getPermissions);
router.delete('/permission/:id', isAuthenticated, checkPermission('delete', 'Permission'), deletePermission);
router.put('/permission/:id', isAuthenticated, checkPermission('update', 'Permission'), updatePermission);


module.exports = router;
