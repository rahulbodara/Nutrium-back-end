const express = require('express');
const router = express.Router();
const { checkPermission } = require('../../middleware/checkPermission');
const { createRole, getRoles } = require('../../controller/Role/roleController');


router.post('/', checkPermission('create', 'Role'), createRole);
router.get('/', checkPermission('read', 'Role'), getRoles);

module.exports = router;
