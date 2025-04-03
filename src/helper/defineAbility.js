const { AbilityBuilder, Ability } = require('@casl/ability');
const UserRole = require('../model/Roles-Permission/UserRole');
const RolePermission = require('../model/Roles-Permission/RolePermission');
const Permission = require('../model/Roles-Permission/Permission');
Permission


async function defineAbilityFor(userId) {
    const { can, cannot, build } = new AbilityBuilder(Ability);

    const userRoles = await UserRole.find({ userId }).populate('roleId');

    if (!userRoles.length) {
        return build();
    }

    const roleIds = userRoles.map((ur) => ur.roleId._id);

    const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).populate('permissionId');

    rolePermissions.forEach((rp) => {
        if (rp.permissionId) {
            can(rp.permissionId.action, rp.permissionId.subject);
        }
    });

    return build();
}

module.exports = { defineAbilityFor };
