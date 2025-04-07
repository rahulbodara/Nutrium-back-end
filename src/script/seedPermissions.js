// scripts/seedPermissions.js
const mongoose = require('mongoose');
const Permission = require('../model/Roles-Permission/Permission');
require('dotenv').config();

const permissions = [
    { name: "Create Role permission", action: 'create', subject: 'RoleToPermission' }
];

async function seed() {
    await mongoose.connect(process.env.MongoURL);
    // await Permission.deleteMany({});
    await Permission.insertMany(permissions);
    console.log('✅ Permissions seeded');
    mongoose.disconnect();
}

seed();
