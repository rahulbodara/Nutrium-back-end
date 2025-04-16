const User = require("../../model/User");
const UserRole = require("../../model/Roles-Permission/UserRole");
const UserPermission = require("../../model/Roles-Permission/UserPermission");
const RolePermission = require("../../model/Roles-Permission/RolePermission");
const Permission = require("../../model/Roles-Permission/Permission");

exports.assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const userRole = new UserRole({ userId, roleId });
        await userRole.save();
        res.status(201).json({ message: 'Role assigned to user', userRole });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserRoles = async (req, res) => {
    try {
        const userRoles = await UserRole.find().populate('userId roleId');
        res.json(userRoles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        const updated = await UserRole.findByIdAndUpdate(id, { roleId }, { new: true });
        if (!updated) return res.status(404).json({ message: 'UserRole not found' });

        res.json({ message: 'User role updated', userRole: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserRole = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await UserRole.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'UserRole not found' });

        res.json({ message: 'User role deleted', userRole: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUsersWithRoles = async (req, res) => {
    try {
        const users = await User.find();

        const userRoles = await UserRole.find().populate('roleId');

        const rolesByUserId = userRoles.reduce((acc, ur) => {
            const uid = ur.userId.toString();
            if (!acc[uid]) acc[uid] = [];
            acc[uid].push(ur.roleId);
            return acc;
        }, {});

        const usersWithRoles = users.map(user => ({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            roles: rolesByUserId[user._id.toString()] || []
        }));

        res.json(usersWithRoles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserRoleByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const userRole = await UserRole.find({ userId: userId }).populate('roleId');

        if (!userRole) {
            return res.status(404).json({ message: 'User role not found' });
        }

        return res.status(200).json(userRole);
    } catch (err) {
        console.error("Error fetching user role:", err);
        return res.status(500).json({ message: 'An error occurred while fetching the user role' });
    }
};


exports.getUsersWithPermissionsOnly = async (req, res) => {
    try {
        const users = await User.find();
        const userRoles = await UserRole.find().populate("roleId");
        const rolePermissions = await RolePermission.find().populate("permissionIds");
        const userPermissions = await UserPermission.find().populate("permissionIds");

        const permissionsByRoleId = rolePermissions.reduce((acc, rp) => {
            const roleId = rp.roleId.toString();
            acc[roleId] = rp.permissionIds || [];
            return acc;
        }, {});

        const rolesByUserId = userRoles.reduce((acc, ur) => {
            const uid = ur.userId.toString();
            if (!acc[uid]) acc[uid] = [];
            acc[uid].push(ur.roleId._id.toString());
            return acc;
        }, {});

        const permissionsByUserId = userPermissions.reduce((acc, up) => {
            const uid = up.userId.toString();
            acc[uid] = up.permissionIds || [];
            return acc;
        }, {});

        const usersWithPermissions = users.map(user => {
            const userId = user._id.toString();
            const permissionSet = new Set();
            const permissions = [];

            const directPerms = permissionsByUserId[userId] || [];
            directPerms.forEach(perm => {
                if (perm && !permissionSet.has(perm._id.toString())) {
                    permissionSet.add(perm._id.toString());
                    permissions.push({ _id: perm._id, name: perm.name });
                }
            });

            const roleIds = rolesByUserId[userId] || [];
            roleIds.forEach(roleId => {
                const perms = permissionsByRoleId[roleId] || [];
                perms.forEach(perm => {
                    if (perm && !permissionSet.has(perm._id.toString())) {
                        permissionSet.add(perm._id.toString());
                        permissions.push({ _id: perm._id, name: perm.name });
                    }
                });
            });

            return {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                permissions
            };
        });

        res.json(usersWithPermissions);
    } catch (error) {
        console.error("Error in getUsersWithPermissionsOnly:", error);
        res.status(500).json({ message: "Failed to fetch user permissions" });
    }
};

