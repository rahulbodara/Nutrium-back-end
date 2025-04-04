const express = require('express');
const router = express.Router();

const {
    assignRoleToUser,
    getUserRoles,
    updateUserRole,
    deleteUserRole
} = require('../../controller/Role/userRoleController');

router.post('/role-user', assignRoleToUser);
router.get('/role-user', getUserRoles);
router.put('/role-user/:id', updateUserRole);
router.delete('/role-user/:id', deleteUserRole);

module.exports = router;
