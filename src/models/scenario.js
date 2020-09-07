const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema(
	{
		uId: { type: String, required: true },
		color1: {
			type: String,
			required: true,
		},
		color2: {
			type: String,
			required: true,
		},
		color3: {
			type: String,
			required: true,
		},
		userUId: { type: String },
		isAssigned: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

const Scenario = mongoose.model("Scenario", scenarioSchema);

module.exports = Scenario;
