const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", async (req, res) => {
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

router.post("/register", async (req, res) => {
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
	res.status(200).json({ message: "Successfully registered" });
});

router.post("/logout", async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(500).json({ message: `Internal server error: ${err}` });
		} else {
			res.status(200).json({ message: "Successfully logged out" });
		}
	});
});

router.post("/userdata", async (req, res) => {
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

router.post("/delete", async (req, res) => {
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

module.exports = router;
