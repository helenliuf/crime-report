const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
	rewardId: {
		type: mongoose.Schema.Types.ObjectId,
		default: mongoose.Types.ObjectId,
		index: true,
		unique: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", RewardSchema);
