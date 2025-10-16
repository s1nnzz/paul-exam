// imports
const express = require("express")
const session = require("express-session")
const cors = require("cors")

const chalk = require("chalk")

// components
const db = require("./db.js")

//

const app = express()



app.listen(5000, async (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(chalk.blueBright("App listening on port 5000!"))
        db.testDB()
    }
})