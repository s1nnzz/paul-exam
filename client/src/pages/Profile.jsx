import { useContext, useEffect } from "react";
import { useQuery } from "../apollo/hooks.js";
import { GET_USER_DATA } from "../apollo/queries.js";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Component() {
	const authenticated = useContext(AuthContext);
	const navigate = useNavigate();

	// GraphQL query for user data
	const { data, loading, error } = useQuery(GET_USER_DATA, {
		skip: !authenticated.authenticated, // Skip query if not authenticated
	});

	useEffect(() => {
		if (!authenticated.loading) {
			if (!authenticated.authenticated) {
				navigate("/", { replace: true });
			}
		}
	}, [authenticated, navigate]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error loading profile</p>;

	const userData = data?.userdata?.userdata || {};

	return (
		<>
			<h1>Welcome to your profile</h1>
			<h2>Email {userData.email}</h2>
			<h2>Your user Id is {userData.id}</h2>

			<Link to="/logout">Logout</Link>
			<Link to="/delete">Delete Account</Link>
		</>
	);
}

export default Component;
