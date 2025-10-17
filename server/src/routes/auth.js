const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/isauth", (req, res) => {
	if (req.session && req.session.userId) {
		res.status(200).json({ authenticated: true });
	} else {
		res.status(200).json({ authenticated: false });
	}
});

module.exports = router;
