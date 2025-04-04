const RolePermission = require("../../model/Roles-Permission/RolePermission");
const UserPermission = require("../../model/Roles-Permission/UserPermission");
const UserRole = require("../../model/Roles-Permission/UserRole");


const assignPermissionToUser = async (req, res) => {
    try {
        const { userId, permissionId } = req.body;

        if (!userId || !permissionId) {
            return res.status(400).json({ message: 'userId and permissionId are required' });
        }

        const userRoles = await UserRole.find({ userId }).populate('roleId');
        const roleIds = userRoles.map((ur) => ur.roleId._id);

        const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } });

        const alreadyHasViaRole = rolePermissions.some(
            (rp) => rp.permissionId.toString() === permissionId
        );

        if (alreadyHasViaRole) {
            return res.status(200).json({ message: 'Permission already granted via role. No need to assign directly.' });
        }

        await UserPermission.updateOne(
            { userId },
            { $addToSet: { permissionIds: permissionId } },
            { upsert: true }
        );

        return res.status(201).json({ message: 'Permission assigned directly to user.' });
    } catch (error) {
        console.error("Error assigning permission:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { assignPermissionToUser };
