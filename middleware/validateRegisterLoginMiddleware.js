const joi = require("joi")

exports.validateRegister = async (req,res,next) => {
	try {
		const { Full_name, Username, Email, Password } = req.body

		const userSchema = joi.object({
			Full_name: joi
				.string()
				.required(),
			Username: joi
				.string()
				.alphanum()
				.min(4)
				.max(20)
				.required(),
			Email: joi
				.string()
				.email()
				.required(),
			Password: joi
				.string()
				.min(8)
				.max(30)
				// .pattern(/^[a-zA-Z0-9!@#$&()`.+,/"-]*$/)
				.required(),

		})

		const { err } = userSchema.validate(...req.body);
		if (err) {
			res.status(400).json({
				code: 400,
				success: false,
				statusText: "Bad Request",
				message: err.details[0].message,
			})
			return
		}

		next()

	} catch (error) {
		console.log(error)
		res.status(500).json({
			code: 500,
			success: false,
			statusText: "Internal Server Error",
			message: "Validation is failed"
		})
	}
}

exports.validateLogin = async (req,res,next) => {
	try {
		const userSchema = joi.object({
			Username: joi
				.string()
				.alphanum()
				.min(4)
				.max(20)
				.required(),
			Email: joi
				.string()
				.email()
				.required(),
			Password: joi
				.string()
				.min(8)
				.max(30)
				// .pattern(/^[a-zA-Z0-9!@#$&()`.+,/"-]*$/)
				.required(),

		}).or('Username', 'Email')

		const { err } = userSchema.validate(req.body);
		if (err) {
			res.status(400).json({
				code: 400,
				success: false,
				statusText: "Bad Request",
				message: err
			})
			return
		}

		next()
		
	} catch (error) {
		console.log(error)
		res.status(500).json({
			code: 500,
			success: false,
			statusText: "Internal Server Error",
			message: "Validation is failed"
		})
	}
}