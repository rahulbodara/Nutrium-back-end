// scripts/seedPermissions.js
const mongoose = require('mongoose');
const Permission = require('../model/Roles-Permission/Permission');
require('dotenv').config();

const permissions = [
    { name: 'Create Client Form', action: 'create', subject: 'ClientForm' },
    { name: 'Read Client Form', action: 'read', subject: 'ClientForm' },
    { name: 'Update Profile', action: 'update', subject: 'Profile' },
    { name: 'Delete Account', action: 'delete', subject: 'Account' },
    { name: 'Create workplace', action: 'create', subject: 'Workplace' }
];

async function seed() {
    await mongoose.connect(process.env.MongoURL);
    await Permission.deleteMany({});
    await Permission.insertMany(permissions);
    console.log('✅ Permissions seeded');
    mongoose.disconnect();
}

seed();
