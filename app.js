require("dotenv").config();
const express = require("express");
require("express-async-errors"); // lets us use "async" in error handling w/o calling "next()"
const { json } = require("body-parser");
const cookieSession = require("cookie-session");

const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test", // ensures that cookies are set only when HTTPS
	})
);

app.get("/", (req, res) => {
	res.send("OK");
});

// Not fount route err handler
// must be after actual routes and before errorHandler
app.all("*", () => {
	throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
