const RolePermission = require('../../model/Roles-Permission/RolePermission');

exports.assignPermissionsToRole = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        const results = [];

        for (const permissionId of permissionIds) {
            const exists = await RolePermission.findOne({ roleId, permissionId });
            if (!exists) {
                const newRecord = new RolePermission({ roleId, permissionId });
                await newRecord.save();
                results.push(newRecord);
            }
        }

        res.status(201).json({ message: 'Permissions assigned to role', data: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRolePermissions = async (req, res) => {
    try {
        const data = await RolePermission.find().populate('roleId permissionId');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRolePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissionId } = req.body;

        const updated = await RolePermission.findByIdAndUpdate(
            id,
            { permissionId },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'RolePermission not found' });

        res.json({ message: 'Role permission updated', rolePermission: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRolePermission = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await RolePermission.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'RolePermission not found' });

        res.json({ message: 'Role permission deleted', rolePermission: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
