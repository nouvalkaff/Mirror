const express = require("express");

const router = express.Router();
const {
  uploadPhoto,
  getAllPhoto,
  getOnePhotobyUserID,
  deletePhotosbyUserID,
} = require("../controllers/gallery-cont");

const { s3upload } = require("../middleware/s3upload");

// const {
//   tokenLoginHost,
//   tokenLoginAdmin,
//   tokenLoginTraveller,
//   roleAdmin,
// } = require("../middleware/auth");

router.post("/photos/post", s3upload, uploadPhoto);
router.get("/photos/all", getAllPhoto);
router.get("/photos", getOnePhotobyUserID);
router.delete("/photos/delete", deletePhotosbyUserID);

module.exports = router;
