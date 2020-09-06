module.exports = class CustomError extends Error {
	statusCode;

	constructor(message) {
		super(message);

		// Because we are extending a built-in class
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	serializeErrors() {}
};
