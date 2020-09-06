const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const validateRequest = require("../middlewares/validate-request");

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Please enter a valid Email"),
		body("name").isString().withMessage("Name is required"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4-20 chars"),
	],
	validateRequest,
	async (req, res) => {
		const { email, password, name, referedBy } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			const error = new Error("User already exists.");
			error.statusCode = 409;
			error.data = errors.array();
			throw error;
		} else {
			const user = new User({
				name,
				email,
				password,
				referedBy,
			});
			await user.save();
			// Generate JWT
			const userJwt = jwt.sign(
				{
					id: user.id,
					email: user.email,
				},
				process.env.JWT_KEY
			);

			// Store it on Session Object
			req.session = { jwt: userJwt };

			res.status(201).send(user);
		}
	}
);

module.exports = router;
