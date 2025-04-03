const RolePermission = require("../../model/Roles-Permission/RolePermission");

exports.assignPermissionToRole = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        const rolePermission = new RolePermission({ roleId, permissionId });
        await rolePermission.save();
        res.status(201).json({ message: 'Permission assigned to role', rolePermission });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRolePermissions = async (req, res) => {
    try {
        const rolePermissions = await RolePermission.find().populate('roleId permissionId');
        res.json(rolePermissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
