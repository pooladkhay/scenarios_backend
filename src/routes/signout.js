const express = require("express");
const jwt = require("jsonwebtoken");
const currentUser = require("../middlewares/current-user");

const router = express.Router();

// signout will delete cookie and next visit will be
// like it's user's first visit!
router.post("/api/users/signout", currentUser, async (req, res) => {
	// const scenarioForUser = await Scenario.findOne({ userUId: req.currentUser.uId });
	// console.log(scenarioForUser);

	// Generate JWT
	const userJwt = jwt.sign(
		{
			uId: req.currentUser.uId,
		},
		process.env.JWT_KEY
	);

	// Store it on Session Object
	req.session = { jwt: userJwt };

	// req.session = null;
	res.send({});
});

module.exports = router;
