
const bcrypt = require("bcrypt")
const faker = require("faker")
const { Op } = require("sequelize")

const { User } = require("../models/index")

exports.register = async (req,res) => {
	try {
		const { Full_name, Username, Email, Password, Profile_Bio } = req.body
		console.log(req.session)
		const existingUserByEmail = await User.findOne({
			where: { Email }
		})

		const	existingUserByUsername = await User.findOne({
			where: { Username }
		})

		if (existingUserByEmail) {
			res.status(409).json({
				code: 409,
				success: false,
				statusText: "Conflict",
				message: "Email is already registered."
			})
			return
		} 

		if (existingUserByUsername) {
			res.status(409).json({
				code: 409,
				success: false,
				statusText: "Conflict",
				message: "Username is already registered."
			})
			return
		}

		var timestamp = Date.now()
		await User.create({
			...req.body,
			id: faker.datatype.uuid(),
			Password: bcrypt.hashSync(Password, 15),
			Timestamp: timestamp,
			Followers: Math.round(Math.random()*10),
			Following: Math.round(Math.random()*10),
		})

		const userData = await User.findOne({
			where: { Email },
			attributes: { 
				exclude: [
					'createdAt', 
					'updatedAt', 
					'Timestamp',
					'Password',
					'Session_id',
					'id',
				],
			},
		})
		

		res.status(201).json({
			code: 201,
			success: true,
			statusText: "Created",
			message: "Successfully created a user",
			result: userData,
		})

	} catch (error) {
		console.log(error)
		res.status(500).json({
			code: 500,
			success: false,
			statusText: "Internal Server Error",
			message: "Failed to register, please try again",
		})
	}
}

exports.login = async (req,res) => {
	try {
		const { Email, Username, Password } = req.body

		if(!Email && !Username) {
			res.status(500).json({
				code: 500,
				success: false,
				statusText: "Internal Server Error",
				message: "Please input your email or username",
			})
		} else if(!Password) {
			res.status(500).json({
				code: 500,
				success: false,
				statusText: "Internal Server Error",
				message: "Please input your password",
			})
		}

		const existingUser = await User.findOne({
			where: {	
				[Op.or]: [
					{	Email },
					{	Username }
				]
			 }
		})
		// console.log(session.store)
		if (!existingUser) {
			res.status(404).json({
				code: 404,
				success: false,
				statusText: "Not Found",
				message: "Email or Username is not registered"
			})
			return
		}

		if (existingUser) {
			const verifyPwd = await bcrypt.compare(Password, existingUser.dataValues.Password)
			
			if (verifyPwd == false) {
				res.status(401).json({
					code: 401,
					success: false,
					statusText: "Unauthorized",
					message: "Wrong password, please try again"
				})
				return
			}

			//Update session Id coloumn
			if ( verifyPwd == true ) {
				req.session.email = existingUser.dataValues.Email
				await User.update(
					{ Session_id: req.sessionID },
					{ where: {	
						[Op.or]: [
							{	Email },
							{	Username }
						]
				 		}
					}
				)
			}

			if(req.session.authenticated) {
				res.status(200).json({
					code: 200,
					success: true,
					statusText: "OK",
					message: "Login success",
					// verifyPwd: verifyPwd,
					// sessionInfo: req.session,
				})
				return
			} else if (verifyPwd == true) {
				req.session.authenticated = true,

				res.status(200).json({
					code: 200,
					success: true,
					statusText: "OK",
					message: "Login success",
					// verifyPwd: verifyPwd,
					// sessionInfo: req.session,
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
				// verifyPwd: verifyPwd,
				// sessionInfo: req.session,
			})
			return
		}

		

	} catch (error) {
		console.log(error)
		res.status(500).json({
			code: 500,
			success: false,
			statusText: "Internal Server Error",
			message: "Failed to login, please try again",
		})
	}
}

exports.logout = async (req,res) => {
	try {
		if (req.session.email) {
			await User.update(
					{ Session_id: null },
					{ where: { Email: req.session.email}}
				)

			req.session.destroy((err) => {
				if (err) {
					console.log(err)
					res.status(500).json({
						code: 500,
						success: false,
						statusText: "Internal Server Error",
						message: "Failed to logout"
					})
					return
				}
				res.status(200).json({
					code: 200,
					success: false,
					statusText: "OK",
					message: "Logout success",
				})
			})
		} else {
			res.status(200).json({
				code: 200,
				success: false,
				statusText: "OK",
				message: "Already Logout",
			})
		}

	} catch (error) {
		console.log(error)
		res.status(500).json({
			code: 500,
			success: false,
			statusText: "Internal Server Error",
			message: "Failed to logout, please try again",
		})
	}
}