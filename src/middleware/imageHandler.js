const multer = require('multer');
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'src/uploads');
    },
    filename: function (req, file, callback) {
      const uniqueFileName = `${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      callback(null, uniqueFileName);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedExtensions =
      /\.(gif|jpe?g|tiff?|png|webp|bmp|pdf|docx?|xlsx?)$/i;

    if (!file.originalname.match(allowedExtensions)) {
      req.fileValidationError = 'Only JPG, PNG, PDF, DOC, or Excel allowed!';
      return cb('Only .jpg, .png, .pdf, .doc, or .xlsx are allowed!', false);
    } else if (file.size >= 10485760) {
      req.fileValidationError = 'File size should be 10MB or less.';
      return cb('File size should be 10MB or less.', false);
    }
    cb(null, true);
  },
});

module.exports = upload;
