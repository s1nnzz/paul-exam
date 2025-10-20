// imports
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const chalk = require("chalk");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const bodyParser = require("body-parser");

// database
const { initializeDatabase } = require("./database");

// GraphQL schema and resolvers
const typeDefs = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers.js");

const app = express();

// Session middleware - MUST be before Apollo
const sessionMiddleware = session({
	secret: "supersecretkeyz",
	saveUninitialized: false,
	resave: true,
});

app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

// Create Apollo Server
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Start server
async function startServer() {
	await initializeDatabase();
	await server.start();

	// Apply GraphQL middleware manually
	app.post(
		"/graphql",
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		}),
		bodyParser.json(),
		async (req, res) => {
			// Pass session through context
			const contextValue = { req, res };

			// Convert Express headers to Map for Apollo Server
			const headersMap = new Map();
			Object.entries(req.headers).forEach(([key, value]) => {
				headersMap.set(key.toLowerCase(), value);
			});

			// Use Apollo Server's executeHTTPGraphQLRequest
			const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
				httpGraphQLRequest: {
					body: req.body,
					headers: headersMap,
					method: req.method,
					search: "",
				},
				context: async () => contextValue,
			});

			// Send response
			for (const [key, value] of httpGraphQLResponse.headers) {
				res.setHeader(key, value);
			}
			res.status(httpGraphQLResponse.status || 200);

			if (httpGraphQLResponse.body.kind === "complete") {
				res.send(httpGraphQLResponse.body.string);
			}
		}
	);

	// For GraphQL Playground/introspection (GET requests)
	app.get("/graphql", (req, res) => {
		res.send(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>GraphQL Server</title>
			</head>
			<body>
				<h1>GraphQL Server is Running</h1>
				<p>POST to /graphql to execute queries</p>
				<p>Use Apollo Client or any GraphQL client to interact with the API</p>
			</body>
			</html>
		`);
	});

	app.listen(5000, () => {
		console.log(chalk.blueBright("App listening on port 5000!"));
		console.log(
			chalk.greenBright(
				"GraphQL server ready at http://localhost:5000/graphql"
			)
		);
	});
}

startServer().catch((err) => {
	console.error("Failed to start server:", err);
});
