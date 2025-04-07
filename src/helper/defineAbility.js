const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

const UserRole = require('../model/Roles-Permission/UserRole');
const RolePermission = require('../model/Roles-Permission/RolePermission');

async function defineAbilityFor(userId) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    const userRoles = await UserRole.find({ userId }).populate('roleId');
    if (!userRoles.length) return build();

    const roleIds = userRoles.map((ur) => ur.roleId._id);
    const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).populate('permissionIds');

    rolePermissions.forEach((rp) => {
        rp.permissionIds.forEach((perm) => {
            can(perm.action, perm.subject);
        });
    });

    return build();
}

module.exports = { defineAbilityFor };
