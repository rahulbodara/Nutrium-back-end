const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dmracr8nw',
  api_key: '419868172942442',
  api_secret: 'NVEDDyXyqwlJ0UExsubqMECtjLQ',
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'tiff'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const customStorage = {
  _handleFile(req, file, cb) {
    const isImage = file.mimetype.startsWith('image/');

    if (isImage) {
      return cloudinaryStorage._handleFile(req, file, (err, info) => {
        if (!err) {
          file.storageType = 'cloudinary';
        }
        cb(err, info);
      });
    } else {
      return localStorage._handleFile(req, file, (err, info) => {
        if (!err) {
          file.storageType = 'local';
        }
        cb(err, info);
      });
    }
  },

  _removeFile(req, file, cb) {
    if (file.storageType === 'cloudinary') {
      return cloudinaryStorage._removeFile(req, file, cb);
    } else {
      return localStorage._removeFile(req, file, cb);
    }
  },
};

const uploadMessage = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(gif|jpe?g|tiff?|png|webp|bmp|pdf|docx|xlsx)$/i;
    if (!file.originalname.match(allowedExtensions)) {
      req.fileValidationError = 'Only JPG, PNG, PDF, DOC, or Excel files are allowed!';
      return cb(new Error('Only .jpg, .png, .pdf, .doc, or .xlsx are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10485760 } 
});

module.exports = uploadMessage;
