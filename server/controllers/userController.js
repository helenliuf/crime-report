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

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({ message: "Invalid Email/Password" });

		const doesPwdMatch = await bcrypt.compare(password, user.password);
		if (!doesPwdMatch)
			return res.status(400).json({ message: "Invalid Email/Password" });

		// Token Generation
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.cookie("token", token, {
			httpOnly: false,
		}).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
