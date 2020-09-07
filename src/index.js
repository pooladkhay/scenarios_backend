const mongoose = require("mongoose");
const app = require("./app");

// Start function will setup a connection to db
const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined.");
	}

	console.log("Connecting to MongoDB, Please wait...");

	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined.");
	}

	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Connected to MongoDB.");
	} catch (err) {
		console.error(err);
	}

	const port = process.env.PORT || 4004;

	app.listen(port, () => {
		console.log(`Listening on Port ${port}`);
	});
};

start();
