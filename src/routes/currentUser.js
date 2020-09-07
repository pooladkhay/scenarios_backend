const express = require("express");
const User = require("../models/user");
const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");

const router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
	const user = User.findOne({ email: req.currentUser.email });
	if (user) {
		res.send({ error: false, user });
	} else {
		res.send({ error: true, msg: "Not Authorized." });
	}
});

module.exports = router;
