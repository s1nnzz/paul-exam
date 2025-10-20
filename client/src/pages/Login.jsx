import { useContext, useEffect } from "react";
import { useMutation } from "../apollo/hooks.js";
import { LOGIN } from "../apollo/mutations.js";
import Form from "../components/common/Form";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";

function Login() {
	const authenticated = useContext(AuthContext);
	const nav = useNavigate();
	const { setFlash } = useContext(FlashContext);

	// GraphQL mutation
	const [login, { loading, error }] = useMutation(LOGIN);

	const formDetails = {
		Email: {
			Type: "email",
			Label: "Email",
		},
		Password: {
			Type: "password",
			Label: "Password",
		},
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const email = e.target.Email.value;
		const password = e.target.Password.value;

		console.log(email, password);

		try {
			const { data } = await login({
				variables: { email, password },
			});

			if (data.login.success) {
				setFlash(data.login.message);
				nav("/", { replace: true });
			}
		} catch (err) {
			setFlash(err.message);
		}
	};

	return (
		<>
			<Form FormDetails={formDetails} SubmitCallback={onSubmit}></Form>
			<Link to="/register">No account? Register here</Link>
			<Link to="/forgot">Want to reset your password? Click here</Link>
		</>
	);
}

export default Login;
