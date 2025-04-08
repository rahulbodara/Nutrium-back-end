// scripts/assignRoleToUser.js
const mongoose = require('mongoose');

const UserRole = require('../model/Roles-Permission/UserRole');
const Role = require('../model/Roles-Permission/Role');
const User = require('../model/User');
require('dotenv').config();

async function assignRole(email, roleName) {
    await mongoose.connect(process.env.MongoURL);

    const user = await User.findOne({ email });
    const role = await Role.findOne({ name: roleName });

    if (!user || !role) {
        console.log('❌ User or Role not found');
        return;
    }

    await UserRole.create({ userId: user._id, roleId: role._id });

    console.log(`✅ Assigned ${roleName} role to ${email}`);
    mongoose.disconnect();
}

assignRole('vatsal.r.lakhani2626+88@gmail.com', 'Admin');
