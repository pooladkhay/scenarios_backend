// import { ValidationError } from "express-validator";
const CustomError = require("./custom-error");

module.exports = class RequestValidationError extends CustomError {
	statusCode = 400;

	constructor(errors) {
		this.errors = errors;
		super("Invalid request params");
		// Because we are extending a built-in class
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map((error) => {
			return { message: error.msg, field: error.param };
		});
	}
};
