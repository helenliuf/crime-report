const mongoose = require("mongoose");

const CrimeReportSchema = new mongoose.Schema({
	//Reference to User schema
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	description: { type: String, required: true },
	location: {
		type: { type: String, enum: ["Point"], default: "Point" },
		coordinates: { type: [Number], required: true }, // [longitude, latitude]
	},
	status: {
		type: String,
		enum: ["Pending", "Verified", "Resolved"],
		default: "Pending",
	},
	createdAt: { type: Date, default: Date.now },
});

//For geospatial queries
CrimeReportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("CrimeReport", CrimeReportSchema);
