import { gql } from "@apollo/client";

// Queries
export const IS_AUTH = gql`
	query IsAuth {
		isAuth {
			success
			message
		}
	}
`;

export const GET_USER_DATA = gql`
	query GetUserData {
		userdata {
			success
			message
			userdata {
				id
				email
			}
		}
	}
`;
