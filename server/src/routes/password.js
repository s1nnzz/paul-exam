const express = require("express");
const router = express.Router();
const { User } = require("../database");

router.post("/forgot", async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(400).json({ message: "Email is required" });
		return;
	}

	const resetToken = await User.createPasswordReset(email);

	if (!resetToken) {
		res.status(404).json({ message: "User not found" });
		return;
	}

	res.status(200).json({
		message: "Password reset token created",
		resetToken: resetToken, // In production, send via email instead
	});
});

router.post("/reset", async (req, res) => {
	const { token, password } = req.body;

	if (!token || !password) {
		res.status(400).json({ message: "Token and password are required" });
		return;
	}

	const success = await User.completePasswordReset(token, password);

	if (!success) {
		res.status(400).json({ message: "Invalid or expired reset token" });
		return;
	}

	res.status(200).json({ message: "Password successfully reset" });
});

module.exports = router;
