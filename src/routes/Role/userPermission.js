const express = require('express');
const { assignPermissionsToUser, getUserPermissions, updateUserPermissions, deleteUserPermissions } = require('../../controller/Role/userPermission');
const { isAuthenticated } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/checkPermission');
const router = express.Router();



router.post('/permission-user', isAuthenticated, checkPermission('create', "Assign permission to user API"), assignPermissionsToUser);
router.get('/permission-user', isAuthenticated, checkPermission("read", "Get user permission API"), getUserPermissions);
router.put('/permission-user/:id', isAuthenticated, checkPermission("update", "Update permission user API"), updateUserPermissions);
router.delete('/permission-user/:id', isAuthenticated, checkPermission("delete", "Delete permission user API"), deleteUserPermissions);

module.exports = router;
