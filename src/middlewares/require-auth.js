module.exports = requireAuth = (req, res, next) => {
	if (!req.currentUser) {
		const error = new Error("Not Authorized.");
		error.statusCode = 401;
		error.data = errors.array();
		throw error;
	}
	next();
};
