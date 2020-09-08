const express = require("express");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");

const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");
const Scenario = require("../models/scenario");

const router = express.Router();

// Assign scenario to authenticated users
// this users will receive 3 colors
router.get("/api/scenarios/", currentUser, requireAuth, async (req, res) => {
	if (req.session.jwt) {
		// Finding user's scenario using his/her uId which we receive as a cookie
		const scenario = await Scenario.findOne({ userUId: req.currentUser.uId });

		// sending scenario to user
		res.status(200).send({
			error: false,
			message: "Here are your Scenarios",
			scenarios: {
				uId: scenario.uId,
				color1: scenario.color1,
				color2: scenario.color2,
				color3: scenario.color3,
			},
		});
	}
});

// Assign scenario to non-authenticated users
// they will receive 1 color
router.get("/api/scenarios/assign", currentUser, async (req, res) => {
	// Check if user has visited our app before
	if (req.session.jwt) {
		const scenario = await Scenario.findOne({ userUId: req.currentUser.uId });

		//check if there are any available scenarios
		if (!scenario) {
			return res.status(200).send({ error: true, message: "No scenario available" });
		}

		// If user has visited our app before and has a scenario,
		// send senario to user again
		res.status(200).send({
			error: false,
			message: "You ALREADY have a Scenario",
			scenario: { uId: scenario.uId, color1: scenario.color1 },
		});
	} else {
		// If its user's first visit:

		//Generate a random string as Users Unique Id (uId)
		const randomUserId = randomBytes(5).toString("hex");

		// Add uId to a JWT and set send it on Cookies
		const userJwt = jwt.sign(
			{
				uId: randomUserId,
			},
			process.env.JWT_KEY
		);
		// Store uId on Session Object
		req.session = { jwt: userJwt };

		// Finding all scenarios that are available
		const scenarios = await Scenario.find({ isAssigned: false });

		/*
		If there is more that one scenario available,
		we will pick a random one using Math.random() and assign it to user.

		If there is no scenarios available, we will let the user know.

		Finally, if there is just one scenario available, we will assign it to user.
		*/
		if (scenarios.length > 1) {
			// More that one scenario available:

			// generating a random uId
			const randomIndex = Math.floor(Math.random() * scenarios.length);
			selectedScenarioUId = scenarios[randomIndex].uId;

			// adding user's uId to scenario and mark is as isAssigned=true
			const selectedScenario = await Scenario.findOne({ uId: selectedScenarioUId });
			selectedScenario.userUId = randomUserId;
			selectedScenario.isAssigned = true;
			await selectedScenario.save();

			// sending scenario to user
			return res.status(200).send({
				error: false,
				message: "You now have a scenario!!",
				scenario: { uId: selectedScenario.uId, color1: selectedScenario.color1 },
			});
		} else if (scenarios.length === 0) {
			// No scenario available:
			// req.session = null;
			return res.status(200).send({ error: true, message: "No scenario available" });
		} else {
			// One scenario available:

			// adding user's uId to scenario and mark is as isAssigned=true
			const selectedScenario = await Scenario.findOne({ isAssigned: false });
			selectedScenario.userUId = randomUserId;
			selectedScenario.isAssigned = true;
			await selectedScenario.save();

			// sending scenario to user
			return res.status(200).send({
				error: false,
				message: "You now have a scenario!",
				scenario: { uId: selectedScenario.uId, color1: selectedScenario.color1 },
			});
		}
	}
});

// Create new scenario and save it to db
router.post("/api/scenarios/create", currentUser, async (req, res) => {
	const { uId, color1, color2, color3 } = req.body;

	const scenario = new Scenario({
		uId,
		color1,
		color2,
		color3,
		isAssigned: false,
	});
	await scenario.save();

	res.status(200).send({ message: "Scenario created", scenario });
});

// Resets scenarios
router.post("/api/scenarios/reset", currentUser, async (req, res) => {
	const scenarios = await Scenario.find();
	console.log(scenarios.length);

	for (let i = 0; i < scenarios.length; i++) {
		await Scenario.findOneAndUpdate(
			{ isAssigned: true },
			{ isAssigned: false, userUId: "" }
		);
	}

	res.status(200).send({ message: "Reset done." });
});

module.exports = router;
