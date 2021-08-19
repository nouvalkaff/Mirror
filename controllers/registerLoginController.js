const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const faker = require("faker");
const Joi = require("joi");
const { Op } = require("sequelize");

const {
  registerValidation,
  loginValidation,
  registerSchema,
  loginSchema,
} = require("../middleware/validateRegisterLoginMiddleware");
const { User } = require("../models/index");

exports.register = async (req, res) => {
  try {
    const { full_name, username, email, password, profile_bio } = req.body;

    await registerSchema.validateAsync(req.body);

    const existingUserByemail = await User.findOne({
      where: { email },
    });

    const existingUserByusername = await User.findOne({
      where: { username },
    });

    if (!profile_bio) {
      return res.status(409).send({
        code: 409,
        statustext: "Conflict",
        success: false,
        message: "Please fill in your profile bio",
      });
    }

    if (existingUserByemail) {
      res.status(409).json({
        code: 409,
        success: false,
        statusText: "Conflict",
        message: "email is already registered.",
      });
      return;
    }

    if (existingUserByusername) {
      res.status(409).json({
        code: 409,
        success: false,
        statusText: "Conflict",
        message: "username is already registered.",
      });
      return;
    }

    var timestamp = Date.now();
    await User.create({
      ...req.body,
      id: faker.datatype.uuid(),
      password: bcrypt.hashSync(password, 15),
      timestamp: timestamp,
      followers: Math.round(Math.random() * 10),
      following: Math.round(Math.random() * 10),
    });

    const userData = await User.findOne({
      where: { email },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "timestamp",
          "password",
          "session_id",
          "id",
        ],
      },
    });

    res.status(201).json({
      code: 201,
      success: true,
      statusText: "Created",
      message: "Successfully created a user",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    const err = error.details[0].message || null;
    res.status(500).json({
      code: 500,
      success: false,
      statusText: "Internal Server Error",
      message: {
        shortMessage: "Failed to register, please try again",
        error: err,
      },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    await loginSchema.validateAsync(req.body);

    if (!email && !username) {
      res.status(500).json({
        code: 500,
        success: false,
        statusText: "Internal Server Error",
        message: "Please input your email or username",
      });
    } else if (!password) {
      res.status(500).json({
        code: 500,
        success: false,
        statusText: "Internal Server Error",
        message: "Please input your password",
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    // console.log(session.store)
    if (!existingUser) {
      res.status(404).json({
        code: 404,
        success: false,
        statusText: "Not Found",
        message: "email or username is not registered",
      });
      return;
    }

    if (existingUser) {
      const verifyPwd = await bcrypt.compare(
        password,
        existingUser.dataValues.password
      );

      if (verifyPwd == false) {
        res.status(401).json({
          code: 401,
          success: false,
          statusText: "Unauthorized",
          message: "Wrong password, please try again",
        });
        return;
      }

      //Update session Id coloumn
      if (verifyPwd == true) {
        req.session.email = existingUser.dataValues.email;
        await User.update(
          { session_id: req.sessionID },
          {
            where: {
              [Op.or]: [{ email }, { username }],
            },
          }
        );
      }

      const token = jwt.sign(
				{
					id: existingUser.dataValues.id,
					full_name: existingUser.dataValues.full_name,
					email: existingUser.dataValues.email,
					profile_bio: existingUser.dataValues.profile_bio,
					followers: existingUser.dataValues.followers,
					following: existingUser.dataValues.following
				},
				process.env.SECRET_KEY,
				{ expiresIn: "12h" }
			)

			const sess = req.session
			const sessID = req.sessionID

			if(req.session.authenticated) {
				res.status(200).json({
					code: 200,
					success: true,
					statusText: "OK",
					message: "Login success",
					token: token,
					// verifyPwd: verifyPwd,
					// sessionInfo: {
					// 	sess,
					// 	sessID
					// },
				})
				return
			} else if (verifyPwd == true) {
				req.session.authenticated = true,

				res.status(200).json({
					code: 200,
					success: true,
					statusText: "OK",
					message: "Login success",
					token: token,
					// verifyPwd: verifyPwd,
					// sessionInfo: {
					// 	sess,
					// 	sessID
					// },
				})
				return
			} else {
				res.status(403).json({
					code: 403,
					success: false,
					statusText: "Bad Credentials",
					message: "User is not registered",
					// verifyPwd: verifyPwd,
					// sessionInfo: req.session,
				})
			}

			res.status(200).json({
				code: 200,
				success: true,
				statusText: "OK",
				message: "Login success",
				token: token,
				// verifyPwd: verifyPwd,
				// sessionInfo: {
				// 		sess,
				// 		sessID
				// 	},
			})
			return
		}
  } catch (error) {
    console.log(error);
    const err = error.details[0].message || null;
    res.status(500).json({
      code: 500,
      success: false,
      statusText: "Internal Server Error",
      message: {
        shortMessage: "Failed to register, please try again",
        error: err,
      },
    });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.session.email) {
      await User.update(
        { session_id: null },
        { where: { email: req.session.email } }
      );

      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            code: 500,
            success: false,
            statusText: "Internal Server Error",
            message: "Failed to logout",
          });
          return;
        }
        res.status(200).json({
          code: 200,
          success: false,
          statusText: "OK",
          message: "Logout success",
        });
      });
    } else {
      res.status(200).json({
        code: 200,
        success: false,
        statusText: "OK",
        message: "Already Logout",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      success: false,
      statusText: "Internal Server Error",
      message: "Failed to logout, please try again",
    });
  }
};
