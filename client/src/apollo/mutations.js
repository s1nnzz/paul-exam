import { gql } from "@apollo/client";

// Authentication Mutations
export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			success
			message
			user {
				id
				email
			}
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!) {
		register(email: $email, password: $password) {
			success
			message
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout {
			success
			message
		}
	}
`;

// Account Management
export const DELETE_ACCOUNT = gql`
	mutation DeleteAccount {
		deleteAccount {
			success
			message
		}
	}
`;

// Password Reset
export const FORGOT_PASSWORD = gql`
	mutation ForgotPassword($email: String!) {
		forgotPassword(email: $email) {
			success
			message
			resetToken
		}
	}
`;

export const RESET_PASSWORD = gql`
	mutation ResetPassword($token: String!, $password: String!) {
		resetPassword(token: $token, password: $password) {
			success
			message
		}
	}
`;
