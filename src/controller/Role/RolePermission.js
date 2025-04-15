const RolePermission = require('../../model/Roles-Permission/RolePermission');

exports.assignPermissionsToRole = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        if (!roleId || !Array.isArray(permissionIds)) {
            return res.status(400).json({ message: 'roleId and permissionIds[] are required' });
        }

        let rolePermission = await RolePermission.findOne({ roleId });

        if (rolePermission) {

            rolePermission.permissionIds = permissionIds;
            await rolePermission.save();
            rolePermission = await RolePermission.findOne({ roleId }).populate('permissionIds');
        } else {

            rolePermission = await RolePermission.create({ roleId, permissionIds });
            rolePermission = await RolePermission.findById(rolePermission._id).populate('permissionIds');
        }

        res.status(201).json({
            message: 'Permissions updated for role',
            data: rolePermission,
        });
    } catch (error) {
        console.log("🚀 ~ assignPermissionsToRole error:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.getRolePermissions = async (req, res) => {
    try {
        const data = await RolePermission.find()
            .populate('roleId')
            .populate('permissionIds');

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRolePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissionIds } = req.body;

        const updated = await RolePermission.findByIdAndUpdate(
            id,
            { permissionIds },
            { new: true }
        ).populate('roleId permissionIds');

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

exports.getRolpermissionByRoleId = async (req, res) => {
    const roleId = req.params.id
    try {
        const data = await RolePermission.find({ roleId })
            .populate('roleId')
            .populate('permissionIds');

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
