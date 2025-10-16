const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")
const chalk = require("chalk")
const fs = require("fs")

const DATABASE_NAME = "restaurant_db"

const dbSchema = "src/schemas/db.sql"
let pool

async function dbExists(connection) {
    const [databases] = await connection.query(`SHOW DATABASES LIKE '${DATABASE_NAME}'`)
    return databases.length > 0;
}

async function runSQL(filePath, connection) {
    try {
        const file = fs.readFileSync(filePath, "utf8")
        
        const statements = file.split(";").map((stmt) => stmt.trim().replace("$", DATABASE_NAME)).filter((stmt) => stmt.length > 0)
        
        console.log(chalk.yellow.bold("Running SQL file..."))

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement)
            }
        }

        const dbExisting = await dbExists(connection);
        if (dbExisting) {
            console.log(chalk.greenBright("Database created!"))
        }
    } catch(err) {
        console.log(chalk.red.bold("Failed to connect to sql database!", err))
    }
}

async function testDB() {
    const connection = await mysql.createConnection({
        host:"localhost",
        user:"root",
        password:""
    })

    try {
        const dbExisting = await dbExists(connection);

        if (dbExisting) { 
            console.log(chalk.cyanBright(`Database ${DATABASE_NAME} existing! Continuing...`))
            return
        }

        console.log(chalk.yellow.bold(`Database ${DATABASE_NAME} not existing...`))
        await runSQL(dbSchema, connection)
    } catch (err) {
        console.log(chalk.red.bold("Failed to connect to sql database!"))
        console.error(err)
    }
}



module.exports = {
    testDB
}