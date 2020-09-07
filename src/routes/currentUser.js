const express = require("express");
const User = require("../models/user");
const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");

const router = express.Router();

router.get("/api/users/current", currentUser, requireAuth, async (req, res) => {
	const user = await User.findOne({ email: req.currentUser.email });
	if (user) {
		const dataToSend = {
			name: user.name,
			email: user.email,
			referedBy: user.referedBy,
			uId: user.uId,
			scenarioUId: user.scenarioUId,
			points: user.points,
		};
		res.send({ error: false, user: dataToSend });
	} else {
		res.send({ error: true, message: "Not Authorized." });
	}
});

module.exports = router;
