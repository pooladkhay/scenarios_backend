const CustomError = require("../errors/custom-error");

module.exports = errorHandler = (err, req, res, next) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	res.status(400).send({ errors: [{ message: "Something went wrong!" }] });
};
