const express = require('express');
const { checkPermission } = require('../../middleware/checkPermission');
const { createPermission, getPermissions } = require('../../controller/Role/permissionController');


const router = express.Router();

router.post('/', checkPermission('create', 'Permission'), createPermission);
router.get('/', checkPermission('read', 'Permission'), getPermissions);

module.exports = router;
