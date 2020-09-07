const express = require("express");
// const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");

const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");
const Scenario = require("../models/scenario");
// const validateRequest = require("../middlewares/validate-request");

const router = express.Router();

// Assign scenario to authenticated users
router.get("/api/scenarios/", currentUser, requireAuth, async (req, res) => {
	if (req.session.jwt) {
		// console.log(req.currentUser);
		const scenario = await Scenario.findOne({ userUId: req.currentUser.uId });
		res.status(200).send({
			msg: "You ALREADY have a Scenario",
			scenario: {
				uId: scenario.uId,
				color1: scenario.color1,
				color2: scenario.color2,
				color3: scenario.color3,
			},
		});
	}
});

// Assign scenario to non-authenticated users
router.get("/api/scenarios/assign", currentUser, async (req, res) => {
	if (req.session.jwt) {
		const scenario = await Scenario.findOne({ userUId: req.currentUser.uId });
		if (!scenario) {
			return res.status(200).send({ msg: "No scenario available" });
		}
		res.status(200).send({
			msg: "You ALREADY have a Scenario",
			scenario: { uId: scenario.uId, color1: scenario.color1 },
		});
	} else {
		const randomUserId = randomBytes(5).toString("hex");
		const userJwt = jwt.sign(
			{
				uId: randomUserId,
			},
			process.env.JWT_KEY
		);
		// Store uId on Session Object
		req.session = { jwt: userJwt };

		const scenarios = await Scenario.find({ isAssigned: false });

		if (scenarios.length > 1) {
			const randomIndex = Math.floor(Math.random() * 2);
			selectedScenarioUId = scenarios[randomIndex].uId;

			const selectedScenario = await Scenario.findOne({ uId: selectedScenarioUId });
			selectedScenario.userUId = randomUserId;
			selectedScenario.isAssigned = true;
			await selectedScenario.save();

			return res.status(200).send({
				msg: "You now have a scenario!!",
				scenario: { uId: selectedScenario.uId, color1: selectedScenario.color1 },
			});
		} else if (scenarios.length === 0) {
			return res.status(200).send({ msg: "No scenario available" });
		} else {
			const selectedScenario = await Scenario.findOne({ isAssigned: false });
			selectedScenario.userUId = randomUserId;
			selectedScenario.isAssigned = true;
			await selectedScenario.save();

			return res.status(200).send({
				msg: "You now have a scenario!",
				scenario: { uId: selectedScenario.uId, color1: selectedScenario.color1 },
			});
		}
	}
});

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

	res.status(200).send({ msg: "Scenario created", scenario });
});

module.exports = router;
