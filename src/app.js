require("dotenv").config();
const express = require("express");
require("express-async-errors"); // lets us use "async" in error handling w/o calling "next()"
const { json } = require("body-parser");
const cookieSession = require("cookie-session");
const errorHandler = require("./middlewares/error-handler");

const SignUpRoute = require("./routes/signup");

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({ signed: false }));

app.get("/", (req, res) => {
	res.send("OK");
});

app.use(SignUpRoute);

// Not fount route err handler
app.all("*", () => {
	const error = new Error("404 - Route not found.");
	error.statusCode = 404;
	throw error;
});

app.use(errorHandler);

module.exports = app;
