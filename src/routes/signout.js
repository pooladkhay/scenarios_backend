const express = require("express");

const router = express.Router();

// signout will delete cookie and next visit will be
// like it's user's first visit!
router.post("/api/users/signout", (req, res) => {
	req.session = null;
	res.send({});
});

module.exports = router;
