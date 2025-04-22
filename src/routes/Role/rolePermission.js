const express = require('express');
const { assignPermissionsToRole, getRolePermissions, updateRolePermission, deleteRolePermission, getRolpermissionByRoleId } = require('../../controller/Role/RolePermission');
const { isAuthenticated } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/checkPermission');
const router = express.Router();



router.post('/permission-role', isAuthenticated, checkPermission('create', 'Assign role to permission'), assignPermissionsToRole);
router.get('/permission-role', isAuthenticated, checkPermission('read', 'RoleToPermission'), getRolePermissions);
router.put('/permission-role/:id', isAuthenticated, checkPermission('update', 'RoleToPermission'), updateRolePermission);
router.delete('/permission-role/:id', isAuthenticated, checkPermission('delete', 'RoleToPermission'), deleteRolePermission);
router.get('/permission-role/role/:id', isAuthenticated, checkPermission('read', 'RoleToPermission'), getRolpermissionByRoleId)

module.exports = router;
