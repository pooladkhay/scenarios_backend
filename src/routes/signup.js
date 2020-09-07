const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Scenario = require("../models/scenario");
const validateRequest = require("../middlewares/validate-request");
const currentUser = require("../middlewares/current-user");

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
	currentUser,
	async (req, res) => {
		const { email, password, name, referedBy } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			// Check for existing user
			const error = new Error("User already exists.");
			error.statusCode = 409;
			throw error;
		} else {
			// Register new User
			const scenarioForUser = await Scenario.findOne({ userUId: req.currentUser.uId });
			console.log(scenarioForUser);

			// logic for referal system
			let pointsForNewUser = 0;
			if (referedBy) {
				// check if referal code is valid
				const usr = await User.findOne({ uId: referedBy });
				if (usr) {
					pointsForNewUser = 100;
					usr.points += 20;
					await usr.save();
				}
			}

			// logic for saving new user to db
			const user = new User({
				name,
				email,
				password,
				referedBy,
				uId: req.currentUser.uId,
				scenarioUId: scenarioForUser.uId,
				points: pointsForNewUser,
			});
			await user.save();

			// Generate JWT
			const userJwt = jwt.sign(
				{
					uId: user.uId,
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
