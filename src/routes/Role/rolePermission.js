const express = require('express');
const { assignPermissionsToRole, getRolePermissions, updateRolePermission, deleteRolePermission } = require('../../controller/Role/RolePermission');
const router = express.Router();



router.post('/permission-role', assignPermissionsToRole);
router.get('/permission-role', getRolePermissions);
router.put('/permission-role/:id', updateRolePermission);
router.delete('/permission-role/:id', deleteRolePermission);

module.exports = router;
