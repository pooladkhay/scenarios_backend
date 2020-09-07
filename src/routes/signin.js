const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const Password = require("../services/password");
const User = require("../models/user");
const Scenario = require("../models/scenario");
const validateRequest = require("../middlewares/validate-request");

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		// post params validation using express-validator
		body("email").isEmail().withMessage("Please enter a valid Email"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4-20 chars"),
	],
	validateRequest,
	async (req, res) => {
		const { email, password } = req.body;

		// check if provided email exists on our db
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			// if user does not exists, throws an error
			const error = new Error("Invalid Credentials.");
			error.statusCode = 401;
			throw error;
		} else {
			// if user exists:

			// check for password validity
			const passwordsMatch = await Password.compare(existingUser.password, password);
			if (!passwordsMatch) {
				const error = new Error("Invalid Credentials.");
				error.statusCode = 401;
				throw error;
			}

			// retrieve user's scenario from db
			const scenarioForUser = await Scenario.findOne({ userUId: existingUser.uId });
			console.log(scenarioForUser);

			// Generate JWT
			const userJwt = jwt.sign(
				{
					uId: existingUser.uId,
					email: existingUser.email,
				},
				process.env.JWT_KEY
			);

			// Store it on Session Object
			req.session = { jwt: userJwt };

			res.status(201).send(existingUser);
		}
	}
);

module.exports = router;
