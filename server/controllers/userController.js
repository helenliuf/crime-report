const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

exports.register = async (req, res) => {
	try {
		const { name, email, password, role, phone } = req.body;
		console.log(req.body);

		// Check if email exists
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res
				.status(400)
				.json({ message: "Email already registered" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role,
			phone,
		});

		if (user) {
			res.status(201).json({ message: "User registered successfully" });
		} else {
			console.log(user);
			res.status(400).json({ message: "User registration failed" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Missing email or password" });
		}

		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({ message: "Invalid Email/Password" });

		const doesPwdMatch = await bcrypt.compare(password, user.password);
		if (!doesPwdMatch)
			return res.status(400).json({ message: "Invalid Email/Password" });

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.cookie("token", token, { httpOnly: false }).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				rewardPoints: user.rewardPoints, // newly added
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: error.message });
	}
};

// newly added
exports.getRewardPoints = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ rewardPoints: user.rewardPoints });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
