// This middleware checks if user has visited before and has a cookie
// then sets the cookie payload on req.currentUser

const jwt = require("jsonwebtoken");

module.exports = currentUser = (req, res, next) => {
	if (!req.session.jwt) {
		return next();
	}

	try {
		const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
		req.currentUser = payload;
	} catch (err) {}
	next();
};
