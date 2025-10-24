const crypto = require("crypto");
const { getPool } = require("../connection");

async function checkBookingConflict(table, datetime) {
	const pool = getPool();

	const [rows] = await pool.query(
		`SELECT 1 FROM bookings WHERE
            table_number = ?
            AND booking_dt = ?;
        `,
		[table, datetime]
	);

	return rows.length > 0;
}

async function bookingIdConflict(id) {
	const pool = getPool();

	const [rows] = await pool.query(
		"SELECT 1 FROM bookings WHERE booking_id = ?",
		[id]
	);

	return rows.length > 0;
}

async function createBooking(
	booking_id,
	count,
	special_instructions,
	table_number,
	booking_dt,
	id
) {
	const pool = getPool();

	if (!special_instructions) special_instructions = "";

	const [rows] = await pool.query(
		`
        INSERT INTO bookings
        (booking_id, people_count, special_instructions, table_number, booking_dt, id)   
        VALUES
        (?, ?, ?, ?, ?, ?);
    `,
		[booking_id, count, special_instructions, table_number, booking_dt, id]
	);
}

async function getUserBookings(userId) {
	const pool = getPool();

	const [rows] = await pool.query(
		"SELECT * FROM bookings WHERE id = ? ORDER BY booking_dt DESC",
		[userId]
	);

	return rows;
}

async function deleteBooking(bookingId, userId) {
	const pool = getPool();

	const [result] = await pool.query(
		"DELETE FROM bookings WHERE booking_id = ? AND id = ?",
		[bookingId, userId]
	);

	return result.affectedRows > 0;
}

module.exports = {
	checkBookingConflict,
	createBooking,
	bookingIdConflict,
	getUserBookings,
	deleteBooking,
};
