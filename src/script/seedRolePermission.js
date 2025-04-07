// scripts/seedRolePermissions.js
const mongoose = require('mongoose');
const Role = require('../model/Roles-Permission/Role');
const Permission = require('../model/Roles-Permission/Permission');
const RolePermission = require('../model/Roles-Permission/RolePermission');
require('dotenv').config();

async function seed() {
    await mongoose.connect(process.env.MongoURL);

    const adminRole = await Role.findOne({ name: 'Nutritionist' });
    const permissions = await Permission.find({ name: "Create Role permission" });

    await RolePermission.deleteMany({});

    const rolePermissions = permissions.map((perm) => ({
        roleId: adminRole._id,
        permissionIds: perm._id,
    }));

    await RolePermission.insertMany(rolePermissions);

    console.log('✅ RolePermissions seeded');
    mongoose.disconnect();
}

seed();
