// scripts/seedRoles.js
const mongoose = require('mongoose');
const Role = require('../model/Roles-Permission/Role');
require('dotenv').config();

const roles = [
    { name: 'Admin' },
    { name: 'Nutritionist' },
    { name: 'Client' },
];

async function seed() {
    await mongoose.connect(process.env.MongoURL);
    await Role.deleteMany({});
    await Role.insertMany(roles);
    console.log('✅ Roles seeded');
    mongoose.disconnect();
}

seed();
