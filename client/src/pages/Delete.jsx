import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Delete() {
	const authenticated = useContext(AuthContext);
	const nav = useNavigate();

	if (!authenticated) {
		return <Navigate to="/" replace={true} />;
	}

	const handleDelete = () => {
		if (
			!confirm(
				"Are you sure you want to delete your account? This cannot be undone."
			)
		) {
			return;
		}

		fetch("/api/delete", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (res.status === 200) {
					alert("Account deleted successfully");
					nav("/", { replace: true });
				}
				return res.json();
			})
			.then((json) => {
				console.log(json);
			});
	};

	return (
		<>
			<h1>Delete Account</h1>
			<p>
				This action cannot be undone. Your account and all data will be
				permanently deleted.
			</p>
			<button
				onClick={handleDelete}
				style={{ backgroundColor: "red", color: "white" }}
			>
				Delete My Account
			</button>
			<br />
			<Link to="/profile">Go Back</Link>
		</>
	);
}

export default Delete;
