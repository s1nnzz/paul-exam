import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Delete() {
	const authenticated = useContext(AuthContext);
	const { setFlash } = useContext(FlashContext);
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
					setFlash("Account deleted successfully");
					nav("/", { replace: true });
				}
				return res.json();
			})
			.then((json) => {
				console.log(json);
				if (
					json.message &&
					json.message !== "Account deleted successfully"
				) {
					setFlash(json.message);
				}
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
