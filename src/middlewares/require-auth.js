const User = require("../models/user");

module.exports = requireAuth = async (req, res, next) => {
	if (req.currentUser) {
		if (!req.currentUser.email) {
			const error = new Error("Not Authorized.");
			error.statusCode = 401;
			throw error;
		} else {
			const user = await User.findOne({ email: req.currentUser.email });
			console.log(user);
			if (!user) {
				const error = new Error("Not Authorized.");
				error.statusCode = 401;
				throw error;
			}
		}
	} else {
		const error = new Error("Not Authorized.");
		error.statusCode = 401;
		throw error;
	}
	next();
};
