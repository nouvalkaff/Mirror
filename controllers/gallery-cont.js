const AWS = require("aws-sdk");
require("dotenv").config();
const { Gallery, User } = require("../models");
const jwt = require("jsonwebtoken")
var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

exports.uploadPhoto = async (req, res) => {
  try {
    const files = req.files,
      foto = files.photos;

    // if (foto[0].size >= undefined) {
    //   res.status(400).json({
    //     code: 400,
    //     statustext: "Bad Request",
    //     success: false,
    //     message: "Please upload at least a photo",
    //   });
    //   return;
    // }

    //Get user id
    const emailUser = req.session.email;

    if (!emailUser) {
      return res.status(409).send({
        code: 409,
        statustext: "Conflict",
        success: false,
        message: "Please login first",
      });
    }

    const userData = await User.findOne({
      where: { email: emailUser },
    });

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
        let index = i + 1;
        const linkAOO = {
          ["image" + index]: uploaded[i],
        };
        respLink.push(linkAOO);
      }
      return respLink;
    }
    const imgURL = arrayOfObject();

    const sendToDB = await Gallery.create({
      user_id: userData.dataValues.id,
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

exports.getAllPhoto = async (req, res) => {
  try {
    const allPhotos = await Gallery.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });
    res.status(200).json({
      code: 200,
      statustext: "OK",
      success: true,
      message: "All user photos have been retrieved succesfully",
      data: allPhotos,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      code: 500,
      statustext: "Internal Server Error",
      success: false,
      message: "Failed to get data",
    });
  }
};

exports.getOnePhotobyUserID = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const getImgByID = await Gallery.findOne({
      where: {
        user_id: user_id,
      },
    });

    if (!getImgByID) {
      res.status(404).json({
        code: 404,
        statustext: "Not Found",
        success: false,
        message: "User ID is not found",
      });
			return
    }

		const userData = await User.findOne({
			where: {
				id: user_id
			}
		})

		const token = jwt.sign(
			{
				id: userData.dataValues.id,
				full_name: userData.dataValues.full_name,
				email: userData.dataValues.email,
				profile_bio: userData.dataValues.profile_bio,
				followers: userData.dataValues.followers,
				following: userData.dataValues.following
			},
			process.env.SECRET_KEY,
			{ expiresIn: "12h" }
		)

    return res.status(200).json({
      code: 200,
      statustext: "OK",
      success: true,
      message: "Successfully retrieve user's photos",
      data: {
				getImgByID,
				token,
			}
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      code: 500,
      statustext: "Internal Server Error",
      success: false,
      message: "Failed to get data",
    });
  }
};

exports.deletePhotosbyUserID = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const delPhotos = await Gallery.destroy({
      where: {
        user_id: user_id,
      },
    });
    if (!delPhotos) {
      res.status(404).json({
        code: 404,
        statustext: "Not Found",
        success: false,
        message: `User ID is not found`,
      });
      return;
    }

    return res.status(200).json({
      code: 200,
      statustext: "OK",
      success: true,
      message: "All photos of this user are deleted succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      code: 500,
      statustext: "Internal Server Error",
      success: false,
      message: "Failed to get data",
    });
  }
};
