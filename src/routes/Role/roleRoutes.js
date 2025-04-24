const express = require('express');
const router = express.Router();
const { checkPermission } = require('../../middleware/checkPermission');
const { createRole, getRoles, updateRole, deleteRole } = require('../../controller/Role/roleController');
const { isAuthenticated } = require('../../middleware/auth');


router.post('/role', isAuthenticated, checkPermission('create', 'Create Role'), createRole);
router.get('/role', isAuthenticated, checkPermission('read', 'Read Role'), getRoles);
router.put('/role/:id', isAuthenticated, checkPermission('update', 'Role'), updateRole);
router.delete('/role/:id', isAuthenticated, checkPermission('delete', 'Role'), deleteRole);

module.exports = router;
