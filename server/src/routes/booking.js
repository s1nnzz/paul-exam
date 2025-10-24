const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { Booking, User } = require("../database");
const {
	checkBookingConflict,
	createBooking,
	bookingIdConflict,
	getUserBookings,
	deleteBooking,
} = require("../database/models/Booking");

router.post("/book/create", async (req, res) => {
	if (!req.session.userId) {
		res.status(403).json({ message: "Missing authentication" });
		return;
	}

	const { people_count, table_number, datetime, special_instructions } =
		req.body;

	if (!people_count || !table_number || !datetime) {
		res.status(400).json({ message: "Invalid request" });
		return;
	}

	const isConflict = await checkBookingConflict(table_number, datetime);

	if (isConflict) {
		res.status(409).json({ message: "Booking conflict" });
		return;
	}

	let bookingId = crypto.randomBytes(4).toString("hex");
	while (await bookingIdConflict(bookingId)) {
		bookingId = crypto.randomBytes(4).toString("hex");
	}

	await createBooking(
		bookingId,
		people_count,
		special_instructions,
		table_number,
		datetime,
		req.session.userId
	);

	res.status(201).json({
		message: "Booking created successfully",
		bookingId,
	});
});

router.get("/book/list", async (req, res) => {
	if (!req.session.userId) {
		res.status(403).json({ message: "Missing authentication" });
		return;
	}

	const bookings = await getUserBookings(req.session.userId);
	res.status(200).json({ bookings });
});

router.delete("/book/delete/:bookingId", async (req, res) => {
	if (!req.session.userId) {
		res.status(403).json({ message: "Missing authentication" });
		return;
	}

	const { bookingId } = req.params;

	const deleted = await deleteBooking(bookingId, req.session.userId);

	if (deleted) {
		res.status(200).json({ message: "Booking deleted successfully" });
	} else {
		res.status(404).json({ message: "Booking not found" });
	}
});

module.exports = router;
