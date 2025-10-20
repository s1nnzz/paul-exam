const gql = require("graphql-tag");

const typeDefs = gql`
	type User {
		id: ID!
		email: String!
	}

	type AuthResponse {
		success: Boolean!
		message: String!
		user: User
	}

	type UserDataResponse {
		success: Boolean!
		message: String!
		userdata: User
	}

	type PasswordResetResponse {
		success: Boolean!
		message: String!
		resetToken: String
	}

	type Query {
		# Check if user is authenticated
		isAuth: AuthResponse!

		# Get current user's data
		userdata: UserDataResponse!
	}

	type Mutation {
		# User authentication
		login(email: String!, password: String!): AuthResponse!
		register(email: String!, password: String!): AuthResponse!
		logout: AuthResponse!

		# Account management
		deleteAccount: AuthResponse!

		# Password reset
		forgotPassword(email: String!): PasswordResetResponse!
		resetPassword(token: String!, password: String!): AuthResponse!
	}
`;

module.exports = typeDefs;
