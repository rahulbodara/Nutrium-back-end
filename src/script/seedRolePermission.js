const mongoose = require('mongoose');
const Role = require('../model/Roles-Permission/Role');
const Permission = require('../model/Roles-Permission/Permission');
const RolePermission = require('../model/Roles-Permission/RolePermission');
require('dotenv').config();

async function seed() {
    await mongoose.connect(process.env.MongoURL);

    const adminRole = await Role.findOne({ name: 'Admin' });
    const permissions = await Permission.find();

    console.log("🚀 ~ Permissions found:", permissions.length);

    await RolePermission.deleteMany({});

    const rolePermissions = [{
        roleId: adminRole._id,
        permissionIds: permissions.map(p => p._id),
    }];

    await RolePermission.insertMany(rolePermissions);

    console.log('✅ RolePermissions seeded');
    mongoose.disconnect();
}

seed();
