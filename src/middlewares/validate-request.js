const { validationResult } = require("express-validator");

module.exports = validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation Failed.");
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	next();
};
