import { useEffect, useContext } from "react";
import { useMutation } from "../apollo/hooks.js";
import { LOGOUT } from "../apollo/mutations.js";
import Form from "../components/common/Form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FlashContext } from "../contexts/FlashContext";

function Login() {
	const nav = useNavigate();
	const { setFlash } = useContext(FlashContext);

	// GraphQL mutation
	const [logout] = useMutation(LOGOUT);

	useEffect(() => {
		const performLogout = async () => {
			try {
				const { data } = await logout();
				if (data.logout.success) {
					setFlash("You have been logged out successfully");
					nav("/", { replace: true });
				}
			} catch (err) {
				setFlash(err.message);
				nav("/", { replace: true });
			}
		};

		performLogout();
	}, [logout, setFlash, nav]);

	return (
		<>
			<h1>Logging you out...</h1>
		</>
	);
}

export default Login;
