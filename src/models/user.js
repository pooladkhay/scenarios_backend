const mongoose = require("mongoose");
const Password = require("../services/password");

// Model for User
const userSchema = new mongoose.Schema(
	{
		uId: { type: String, required: true },
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		scenarioUId: { type: String },
		referedBy: { type: String },
		points: { type: Number },
	},
	{ timestamps: true }
);

// Logic to hash password right before saving it to DB using custom Password class
// Astualy saves it, hashes it and saves the hashed version again!!
userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashedPass = await Password.toHash(this.get("password"));
		this.set("password", hashedPass);
		done();
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
