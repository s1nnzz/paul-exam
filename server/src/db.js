const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const chalk = require("chalk");
const fs = require("fs");
const crypto = require("crypto");

const DATABASE_NAME = "restaurant_db";

const dbSchema = "src/schemas/db.sql";
/** @type {import("mysql2/promise").Pool | undefined} */
let pool;

async function dbExists(connection) {
	const [databases] = await connection.query(
		`SHOW DATABASES LIKE '${DATABASE_NAME}'`
	);
	return databases.length > 0;
}

async function runSQL(filePath, connection) {
	try {
		const file = fs.readFileSync(filePath, "utf8");

		const statements = file
			.split(";")
			.map((stmt) => stmt.trim().replace("$", DATABASE_NAME))
			.filter((stmt) => stmt.length > 0);

		console.log(chalk.yellow.bold("Running SQL file..."));

		for (const statement of statements) {
			if (statement.trim()) {
				await connection.query(statement);
			}
		}

		const dbExisting = await dbExists(connection);
		if (dbExisting) {
			console.log(chalk.greenBright("Database created!"));
			pool = mysql.createPool({
				host: "localhost",
				user: "root",
				password: "",
				database: DATABASE_NAME,
				connectionLimit: 10,
				waitForConnections: true,
				queueLimit: 0,
			});
		}
	} catch (err) {
		console.log(chalk.red.bold("Failed to connect to sql database!", err));
	}
}

async function testDB() {
	const connection = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
	});

	try {
		const dbExisting = await dbExists(connection);

		if (dbExisting) {
			console.log(
				chalk.cyanBright(
					`Database ${DATABASE_NAME} existing! Continuing...`
				)
			);

			pool = mysql.createPool({
				host: "localhost",
				user: "root",
				password: "",
				database: DATABASE_NAME,
				connectionLimit: 10,
				waitForConnections: true,
				queueLimit: 0,
			});
			return;
		}

		console.log(
			chalk.yellow.bold(`Database ${DATABASE_NAME} not existing...`)
		);
		await runSQL(dbSchema, connection);
	} catch (err) {
		console.log(chalk.red.bold("Failed to connect to sql database!"));
		console.error(err);
	}
}

async function getUserId(email) {
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
	const [rows] = await pool.query(
		"SELECT password_hash FROM users WHERE email = ?",
		[email]
	);

	// by this point we have checked if the user exists
	const user = rows[0];
	const hashed_password = user.password_hash;

	const passwordCorrect = await bcrypt.compare(password, hashed_password);
	if (passwordCorrect) return true;
	return false;
}

async function registerUser(email, password) {
	const hashedPassword = await bcrypt.hash(password, 10);

	const [r] = await pool.query(
		"INSERT INTO users (email, password_hash) VALUES (?, ?)",
		[email, hashedPassword]
	);

	console.log(r);
}

async function getData(id) {
	const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

	if (rows.length === 0) {
		return null;
	}

	return rows[0];
}

async function createPasswordReset(email) {
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
	await pool.query("DELETE FROM users WHERE id = ?", [userId]);
	return true;
}

module.exports = {
	testDB,
	getUserId,
	canLoginUser,
	registerUser,
	getData,
	createPasswordReset,
	completePasswordReset,
	deleteAccount,
};
