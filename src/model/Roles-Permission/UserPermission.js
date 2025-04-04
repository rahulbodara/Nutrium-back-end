const mongoose = require('mongoose');

const userPermissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            unique: true,
            required: true,
        },
        permissionIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Permission',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const UserPermission = mongoose.model('UserPermission', userPermissionSchema);
module.exports = UserPermission;
