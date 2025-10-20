const { User } = require("../database");

const resolvers = {
	Query: {
		// Check authentication status
		isAuth: async (_, __, context) => {
			const { req } = context;
			if (req.session && req.session.userId) {
				return {
					success: true,
					message: "User is authenticated",
					user: null,
				};
			}
			return {
				success: false,
				message: "User is not authenticated",
				user: null,
			};
		},

		// Get current user data
		userdata: async (_, __, context) => {
			const { req } = context;

			if (!req.session.userId) {
				throw new Error("Not authenticated");
			}

			const userData = await User.getUserData(req.session.userId);

			if (!userData) {
				throw new Error("User not found");
			}

			return {
				success: true,
				message: "Successfully got user data",
				userdata: {
					id: userData.id,
					email: userData.email,
				},
			};
		},
	},

	Mutation: {
		// Login mutation
		login: async (_, { email, password }, context) => {
			const { req } = context;

			const userId = await User.getUserId(email);
			if (!userId) {
				throw new Error("User doesn't exist or password is incorrect.");
			}

			const canLogin = await User.canLoginUser(email, password);
			if (!canLogin) {
				throw new Error("User doesn't exist or password is incorrect.");
			}

			// Set session
			req.session.userId = userId;

			const userData = await User.getUserData(userId);

			return {
				success: true,
				message: "Successfully authenticated",
				user: {
					id: userData.id,
					email: userData.email,
				},
			};
		},

		// Register mutation
		register: async (_, { email, password }, context) => {
			const { req } = context;

			const userId = await User.getUserId(email);
			if (userId) {
				throw new Error("An account with this email already exists.");
			}

			await User.registerUser(email, password);

			return {
				success: true,
				message: "Successfully registered",
				user: null,
			};
		},

		// Logout mutation
		logout: async (_, __, context) => {
			const { req } = context;

			return new Promise((resolve, reject) => {
				req.session.destroy((err) => {
					if (err) {
						reject(new Error(`Internal server error: ${err}`));
					} else {
						resolve({
							success: true,
							message: "Successfully logged out",
							user: null,
						});
					}
				});
			});
		},

		// Delete account mutation
		deleteAccount: async (_, __, context) => {
			const { req } = context;

			if (!req.session.userId) {
				throw new Error("Not authenticated");
			}

			await User.deleteAccount(req.session.userId);

			return new Promise((resolve, reject) => {
				req.session.destroy((err) => {
					if (err) {
						resolve({
							success: true,
							message: "Account deleted but session error",
							user: null,
						});
					} else {
						resolve({
							success: true,
							message: "Account successfully deleted",
							user: null,
						});
					}
				});
			});
		},

		// Forgot password mutation
		forgotPassword: async (_, { email }) => {
			if (!email) {
				throw new Error("Email is required");
			}

			const resetToken = await User.createPasswordReset(email);

			if (!resetToken) {
				throw new Error("User not found");
			}

			return {
				success: true,
				message: "Password reset token created",
				resetToken: resetToken, // In production, send via email instead
			};
		},

		// Reset password mutation
		resetPassword: async (_, { token, password }) => {
			if (!token || !password) {
				throw new Error("Token and password are required");
			}

			const success = await User.completePasswordReset(token, password);

			if (!success) {
				throw new Error("Invalid or expired reset token");
			}

			return {
				success: true,
				message: "Password successfully reset",
				user: null,
			};
		},
	},
};

module.exports = resolvers;
