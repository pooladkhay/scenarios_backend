const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema(
	{
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
		isAssigned: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

const Scenario = mongoose.model("Scenario", scenarioSchema);

module.exports = Scenario;
