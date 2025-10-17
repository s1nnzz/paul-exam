const mysql = require("mysql2/promise");
const chalk = require("chalk");

const DATABASE_NAME = "restaurant_db";

/** @type {import("mysql2/promise").Pool | undefined} */
let pool;

function createPool() {
	if (!pool) {
		pool = mysql.createPool({
			host: "localhost",
			user: "root",
			password: "",
			database: DATABASE_NAME,
			connectionLimit: 10,
			waitForConnections: true,
			queueLimit: 0,
		});
		console.log(chalk.greenBright("Pool created!"));
	}
	return pool;
}

function getPool() {
	if (!pool) {
		throw new Error(
			"Database pool not initialized. Call createPool() first."
		);
	}
	return pool;
}

module.exports = {
	DATABASE_NAME,
	createPool,
	getPool,
};
