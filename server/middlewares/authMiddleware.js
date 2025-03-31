const jwt = require("jsonwebtoken");

// Token Authentication
function authenticate(req, res, next) {
	const token =
		req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
	if (!token)
		return res.status(401).json({ message: "Access token is missing" });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid token" });
		req.user = user;
		console.log(req.user)
		next();
	});
}

// Role Authorization
function authorize(validRoles) {
	return (req, res, next) => {
		if (!req.user || !validRoles.includes(req.user.role)) {
			return res.status(403).json({ message: "Access denied" });
		}
		next();
	};
}

module.exports = {
	authenticate,
	authorize,
};
