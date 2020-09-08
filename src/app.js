require("dotenv").config();
const express = require("express");
require("express-async-errors"); // lets us use "async" in error handling w/o calling "next()"
const { json } = require("body-parser");
const cookieSession = require("cookie-session");
const errorHandler = require("./middlewares/error-handler");

// Routes
const SignUpRoute = require("./routes/signup");
const SignInRoute = require("./routes/signin");
const SignOutRoute = require("./routes/signout");
const scenariosRoute = require("./routes/scenarios");
const currentUser = require("./routes/currentUser");

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

app.use(json());
app.set("trust proxy", true);
app.use(cookieSession({ signed: false }));

app.use(SignUpRoute);
app.use(SignInRoute);
app.use(SignOutRoute);
app.use(scenariosRoute);
app.use(currentUser);

// Not fount route err handler
app.all("*", () => {
	const error = new Error("404 - Route not found.");
	error.statusCode = 404;
	throw error;
});

app.use(errorHandler);

module.exports = app;
