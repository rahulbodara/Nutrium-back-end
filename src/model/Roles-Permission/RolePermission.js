const mongoose = require('mongoose')

const RolePermissionSchema = new mongoose.Schema({
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true }
}, { timestamps: true });

const RolePermission = mongoose.model('RolePermission', RolePermissionSchema);
module.exports = RolePermission;
