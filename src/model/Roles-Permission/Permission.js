const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    action: { type: String, required: true },
    subject: { type: String, required: true }
});

const Permission = mongoose.model('Permission', PermissionSchema);
module.exports = Permission;
