const AWS = require("aws-sdk");
require("dotenv").config();
const { Gallery } = require("../models");

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

exports.uploadPhoto = async (req, res) => {
  try {
    const files = req.files,
      foto = files.photos;

    if (foto[0].size === undefined) {
      res.status(400).json({
        code: 400,
        statustext: "Bad Request",
        success: false,
        message: "Please upload at least a photo",
      });
      return;
    }

    //Preparing the params for uploading to AWS S3
    var params = [];
    function paramsLoop(x) {
      for (let i = 0; i < foto.length; i++) {
        if (typeof x[i] !== undefined) {
          params.push(x[i]);
        }
        x[i] = {
          ACL: "public-read",
          Body: foto[i].buffer,
          Bucket: process.env.AWS_BUCKET_NAME,
          ContentType: "image/jpeg",
          Key: `user/img${i}/${new Date().getTime()}`,
        };
      }
      return;
    }
    paramsLoop(params);

    const responseData = [];
    var uploaded = [];

    for (i = 0; i < foto.length; i++) {
      responseData.push(await s3.upload(params[i]).promise());
      uploaded.push(responseData[i].Location);
    }

    function arrayOfObject() {
      var respLink = [];
      for (let i = 0; i < foto.length; i++) {
        const linkAOO = {
          ["image" + i]: uploaded[i],
        };
        respLink.push(linkAOO);
      }
      return respLink;
    }
    const imgURL = arrayOfObject();

    const sendToDB = await Gallery.create({
      photos: imgURL,
    });

    return res.status(201).json({
      code: 201,
      statustext: "Created",
      success: true,
      message: "Upload success!",
      data: sendToDB,
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      statustext: "Internal Server Error",
      success: false,
      message: "Failed to get data",
    });
    console.log(err);
  }
  return;
};