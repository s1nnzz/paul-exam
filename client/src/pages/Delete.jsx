import { useContext } from "react";
import { useMutation } from "../apollo/hooks.js";
import { DELETE_ACCOUNT } from "../apollo/mutations.js";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Delete() {
	const authenticated = useContext(AuthContext);
	const { setFlash } = useContext(FlashContext);
	const nav = useNavigate();

	// GraphQL mutation
	const [deleteAccount] = useMutation(DELETE_ACCOUNT);

	if (!authenticated) {
		return <Navigate to="/" replace={true} />;
	}

	const handleDelete = async () => {
		if (
			!confirm(
				"Are you sure you want to delete your account? This cannot be undone."
			)
		) {
			return;
		}

		try {
			const { data } = await deleteAccount();

			if (data.deleteAccount.success) {
				setFlash("Account deleted successfully");
				nav("/", { replace: true });
			}
		} catch (err) {
			setFlash(err.message);
		}
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
