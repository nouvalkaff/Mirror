const express = require("express");

const router = express.Router();
const {
  uploadPhoto,
  // getAllPhoto,
  // getOnePhotoID,
  // deleteAllPhotos,
} = require("../controllers/gallery-cont");

const { s3upload } = require("../middleware/s3upload");

// const {
//   tokenLoginHost,
//   tokenLoginAdmin,
//   tokenLoginTraveller,
//   roleAdmin,
// } = require("../middleware/auth");

router.post("/photos/post", s3upload, uploadPhoto);
// router.get("/photos/all", getAllPhoto);
// router.get("/photos", getOnePhotoID);
// router.delete("/photos/delete", deleteAllPhotos);

module.exports = router;
