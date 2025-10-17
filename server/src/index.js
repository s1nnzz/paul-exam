// imports
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const chalk = require("chalk");

// database
const { initializeDatabase } = require("./database");

// routes
const userRouter = require("./routes/user.js");
const passwordRouter = require("./routes/password.js");
const authRouter = require("./routes/auth.js");
const bookingRouter = require("./routes/booking.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(
	session({
		secret: "supersecretkeyz",
		saveUninitialized: false,
		resave: true,
	})
);

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", passwordRouter);
app.use("/api", bookingRouter);

app.listen(5000, async (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(chalk.blueBright("App listening on port 5000!"));
		await initializeDatabase();
	}
});
