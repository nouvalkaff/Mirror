const multer = require("multer");
const path = require("path");

const s3storage = multer.memoryStorage();

const s3upload = multer({
  s3storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(
        new Error("Only image formats are allowed! (.PNG, .JPG AND .JPEG).")
      );
    }
    callback(null, true);
  },
}).fields([{ name: "photos", maxCount: 9 }]);

module.exports = { s3upload };
