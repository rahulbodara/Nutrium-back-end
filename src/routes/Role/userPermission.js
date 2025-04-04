const express = require('express');
const { assignPermissionsToUser, getUserPermissions, updateUserPermissions, deleteUserPermissions } = require('../../controller/Role/userPermission');
const router = express.Router();



router.post('/permission-user', assignPermissionsToUser);
router.get('/permission-user', getUserPermissions);
router.put('/permission-user/:id', updateUserPermissions);
router.delete('/permission-user/:id', deleteUserPermissions);

module.exports = router;
