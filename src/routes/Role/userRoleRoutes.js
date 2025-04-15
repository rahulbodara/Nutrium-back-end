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

router.post('/role-user', assignRoleToUser);
router.get('/role-user', getUserRoles);
router.put('/role-user/:id', updateUserRole);
router.delete('/role-user/:id', deleteUserRole);
router.get('/role-user/user', getUsersWithRoles)
router.get('/role-user/user/:id', getUserRoleByUserId)
router.get('/user-permission', getUsersWithPermissionsOnly)

module.exports = router;
