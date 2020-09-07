// This middleware catches Errors and gives them a structure

module.exports = (error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ error: true, message: message, data: data });
};
