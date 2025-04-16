const UserPermission = require('../../model/Roles-Permission/UserPermission');

exports.assignPermissionsToUser = async (req, res) => {
    try {
        const { userId, permissionIds } = req.body;
        const permissions = Array.isArray(permissionIds) ? permissionIds : [permissionIds];

        let record = await UserPermission.findOne({ userId });

        if (record) {
            const unique = Array.from(new Set([...record.permissionIds.map(id => id.toString()), ...permissions]));
            record.permissionIds = unique;
            await record.save();
        } else {
            record = new UserPermission({ userId, permissionIds: permissions });
            await record.save();
        }

        res.status(201).json({ message: 'Permissions assigned to user', userPermission: record });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserPermissions = async (req, res) => {
    try {
        const data = await UserPermission.find()
            .populate('userId', 'fullName email') // limit user fields
            .populate('permissionIds', 'name subject');

        const formatted = data.map(record => ({
            _id: record._id,
            user: record.userId,
            permissions: record.permissionIds,
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateUserPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissionIds } = req.body;

        const updated = await UserPermission.findByIdAndUpdate(
            id,
            { permissionIds },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'UserPermission not found' });

        res.json({ message: 'User permissions updated', userPermission: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserPermissions = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await UserPermission.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'UserPermission not found' });

        res.json({ message: 'User permissions deleted', userPermission: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
