const mysql = require("mysql2/promise");
const chalk = require("chalk");
const fs = require("fs");
const { DATABASE_NAME, createPool } = require("./connection");

const dbSchema = "src/schemas/db.sql";

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
			createPool();
		}
	} catch (err) {
		console.log(chalk.red.bold("Failed to run SQL file!", err));
		throw err;
	}
}

async function initializeDatabase() {
	const connection = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		multipleStatements: true,
	});

	try {
		const dbExisting = await dbExists(connection);

		if (dbExisting) {
			console.log(
				chalk.cyanBright(
					`Database ${DATABASE_NAME} exists! Continuing...\nWill run SQL to create any missing tables!`
				)
			);
		} else {
			console.log(
				chalk.yellow.bold(`Database ${DATABASE_NAME} not existing...`)
			);
		}

		await runSQL(dbSchema, connection);
		connection.destroy();
	} catch (err) {
		console.log(chalk.red.bold("Failed to connect to sql database!"));
		console.error(err);
		throw err;
	}
}

module.exports = {
	initializeDatabase,
};
