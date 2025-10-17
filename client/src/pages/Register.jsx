import Form from "../components/common/Form";
import { Link, useNavigate } from "react-router-dom";

function Component() {
	const navigate = useNavigate();

	const formDetails = {
		Email: {
			Type: "email",
			Label: "Email",
		},
		ConfirmEmail: {
			Type: "email",
			Label: "Confirm Email",
		},
		Password: {
			Type: "password",
			Label: "Password",
		},
		ConfirmPassword: {
			Type: "password",
			Label: "Confirm Password",
		},
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const email = e.target.Email.value;
		const confirmemail = e.target.ConfirmEmail.value;
		const password = e.target.Password.value;
		const confirmpassword = e.target.ConfirmPassword.value;

		if (email != confirmemail) {
			console.log("Email not the same as confirm email");
			return;
		}

		if (password != confirmpassword) {
			console.log("Password not the same as confirm password");
			return;
		}

		const res = fetch("/api/register", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then((res) => {
				console.log(res.status);
				if (res.status === 200) {
					console.log("yay");
					navigate("/login", { replace: true });
				}

				return res.json();
			})
			.then((json) => {
				console.log(json);
			});
	};

	return (
		<>
			<Form FormDetails={formDetails} SubmitCallback={onSubmit}></Form>
			<Link to="/login">Already registered? Click here to log in.</Link>
		</>
	);
}

export default Component;
