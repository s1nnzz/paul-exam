const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { getPool } = require("../connection");

async function getUserId(email) {
	const pool = getPool();
	const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
		email,
	]);

	console.log(users);
	console.log(users.length);

	if (users.length >= 1) {
		return users[0].id;
	} else {
		return false;
	}
}

async function canLoginUser(email, password) {
	const pool = getPool();
	const [rows] = await pool.query(
		"SELECT password_hash FROM users WHERE email = ?",
		[email]
	);

	if (rows.length === 0) return false;

	const user = rows[0];
	const hashed_password = user.password_hash;

	const passwordCorrect = await bcrypt.compare(password, hashed_password);
	return passwordCorrect;
}

async function registerUser(email, password) {
	const pool = getPool();
	const hashedPassword = await bcrypt.hash(password, 10);

	const [result] = await pool.query(
		"INSERT INTO users (email, password_hash) VALUES (?, ?)",
		[email, hashedPassword]
	);

	console.log(result);
	return result;
}

async function getUserData(id) {
	const pool = getPool();
	const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

	if (rows.length === 0) {
		return null;
	}

	return rows[0];
}

async function createPasswordReset(email) {
	const pool = getPool();

	// Check if user exists
	const userId = await getUserId(email);
	if (!userId) {
		return null;
	}

	// Generate a random token
	const resetToken = crypto.randomBytes(32).toString("hex");

	// Set expiration to 1 hour from now
	const resetExpires = new Date(Date.now() + 3600000);

	await pool.query(
		"UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
		[resetToken, resetExpires, email]
	);

	return resetToken;
}

async function completePasswordReset(token, newPassword) {
	const pool = getPool();

	// Find user with valid token
	const [rows] = await pool.query(
		"SELECT id, email FROM users WHERE reset_token = ? AND reset_expires > NOW()",
		[token]
	);

	if (rows.length === 0) {
		return false;
	}

	const user = rows[0];
	const hashedPassword = await bcrypt.hash(newPassword, 10);

	// Update password and clear reset token
	await pool.query(
		"UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
		[hashedPassword, user.id]
	);

	return true;
}

async function deleteAccount(userId) {
	const pool = getPool();
	await pool.query("DELETE FROM users WHERE id = ?", [userId]);
	return true;
}

module.exports = {
	getUserId,
	canLoginUser,
	registerUser,
	getUserData,
	createPasswordReset,
	completePasswordReset,
	deleteAccount,
};
