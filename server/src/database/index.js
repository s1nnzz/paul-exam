const { initializeDatabase } = require("./setup");
const User = require("./models/User.js");
const Booking = require("./models/Booking.js");

module.exports = {
	initializeDatabase,
	User,
	Booking,
};
