// A helper for hashing and comparing passwords upon SignIn

const { scrypt, randomBytes } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

module.exports = class Password {
	// Takes a String and returns the hashed version.
	static async toHash(password) {
		const salt = randomBytes(8).toString("hex");
		const buf = await scryptAsync(password, salt, 64);

		return `${buf.toString("hex")}.${salt}`;
	}

	// compares entered password and stored password when signing in
	static async compare(storedPassword, suppliedPassword) {
		const [hashedPassword, salt] = storedPassword.split(".");
		const buf = await scryptAsync(suppliedPassword, salt, 64);

		return hashedPassword === buf.toString("hex");
	}
};
