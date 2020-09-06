const CustomError = require("./custom-error");

module.exports = class NotFoundError extends CustomError {
	statusCode = 404;
	constructor() {
		super("Route Not Found");
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

	serializeErrors() {
		return [{ message: "Not Found" }];
	}
};
