const express = require('express');
const router = express.Router();

const {
    assignRoleToUser,
    getUserRoles,
    updateUserRole,
    deleteUserRole,
    getRoleByUserId,
    getUsersWithRoles,
    getUserRoleByUserId,
    getUsersWithPermissionsOnly
} = require('../../controller/Role/userRoleController');
const { isAuthenticated } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/checkPermission');

router.post('/role-user', isAuthenticated, checkPermission("create", "Assign role to user API"), assignRoleToUser);
router.get('/role-user', isAuthenticated, checkPermission("read", "Get all role to user API"), getUserRoles);
router.put('/role-user/:id', isAuthenticated, checkPermission("update", "Update role to user API"), updateUserRole);
router.delete('/role-user/:id', isAuthenticated, checkPermission("delete", "Delete role to user API"), deleteUserRole);
router.get('/role-user/user', isAuthenticated, checkPermission("read", "Get all user with role API"), getUsersWithRoles)
router.get('/role-user/user/:id', isAuthenticated, checkPermission("read", "Get user with role API"), getUserRoleByUserId)
router.get('/user-permission', isAuthenticated, checkPermission("read", "Get user with  role-permission"), getUsersWithPermissionsOnly)

module.exports = router;
