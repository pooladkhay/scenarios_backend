const NotAuthorizedError = require("../errors/not-authorized-error");

module.exports = requireAuth = (req, res, next) => {
	if (!req.currentUser) {
		throw new NotAuthorizedError();
	}
	next();
};
