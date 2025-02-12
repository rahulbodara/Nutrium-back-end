const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: 'dmracr8nw',
    api_key: '419868172942442',
    api_secret: 'NVEDDyXyqwlJ0UExsubqMECtjLQ',
});

module.exports = cloudinary;
