// imports
const express = require("express")
const session = require("express-session")
const cors = require("cors")

const chalk = require("chalk")

// components
const db = require("./db.js")

//

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))


app.post("/api/isauth", (req, res) => {
    if (req.session && req.session.userId) {
        res.status(200).json({ authenticated: true })
    } else {
        res.status(200).json({ authenticated: false })
    }
})

app.listen(5000, async (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(chalk.blueBright("App listening on port 5000!"))
        db.testDB()
    }
})