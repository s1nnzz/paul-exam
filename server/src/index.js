// imports
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const chalk = require("chalk");

// components
const db = require("./db.js");

//

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(
	session({
		secret: "supersecretkeyz",
		saveUninitialized: false,
		resave: true,
	})
);

app.post("/api/isauth", (req, res) => {
	if (req.session && req.session.userId) {
		res.status(200).json({ authenticated: true });
	} else {
		res.status(200).json({ authenticated: false });
	}
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	if (await db.getUserId(email)) {
		const continueLogin = await db.canLoginUser(email, password);
		if (!continueLogin) {
			res.status(401).json({
				message: "User doesn't exist or password is incorrect.",
			});

			return;
		}

		req.session.userId = await db.getUserId(email);
		res.status(200).json({
			message: "Successfully authenticated.",
		});
		return;
	}
	res.status(401).json({
		message: "User doesn't exist or password is incorrect.",
	});
});

app.post("/api/register", async (req, res) => {
	const { email, password } = req.body;
	// what we send here should be verified by the client
	// to be the same as the confirms
	console.log(email);
	console.log(await db.getUserId(email));
	if (await db.getUserId(email)) {
		res.status(409).json({
			message: "An account with this email already exists.",
		});
		return; // early exit
	}

	db.registerUser(email, password);
});

app.post("/api/logout", async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(500).json({ message: `Internal server error: ${err}` });
		} else {
			res.status(200).json({ message: "Successfully logged out" });
		}
	});
});

app.post("/api/userdata", async (req, res) => {
	console.log(req.session.userId);
	if (!req.session.userId) {
		res.status(401).json({ message: "Not allowed" });
		return;
	}

	const userData = await db.getData(req.session.userId);

	const returnData = {
		id: userData.id,
		email: userData.email,
	};

	res.status(200).json({
		message: "Successfully got user data",
		userdata: returnData,
	});
});

app.post("/api/forgot", async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(400).json({ message: "Email is required" });
		return;
	}

	const resetToken = await db.createPasswordReset(email);

	if (!resetToken) {
		res.status(404).json({ message: "User not found" });
		return;
	}

	res.status(200).json({
		message: "Password reset token created",
		resetToken: resetToken, // In production, send via email instead
	});
});

app.post("/api/reset", async (req, res) => {
	const { token, password } = req.body;

	if (!token || !password) {
		res.status(400).json({ message: "Token and password are required" });
		return;
	}

	const success = await db.completePasswordReset(token, password);

	if (!success) {
		res.status(400).json({ message: "Invalid or expired reset token" });
		return;
	}

	res.status(200).json({ message: "Password successfully reset" });
});

app.post("/api/delete", async (req, res) => {
	if (!req.session.userId) {
		res.status(401).json({ message: "Not authenticated" });
		return;
	}

	await db.deleteAccount(req.session.userId);

	req.session.destroy((err) => {
		if (err) {
			res.status(500).json({
				message: "Account deleted but session error",
			});
		} else {
			res.status(200).json({ message: "Account successfully deleted" });
		}
	});
});

app.listen(5000, async (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(chalk.blueBright("App listening on port 5000!"));
		db.testDB();
	}
});
