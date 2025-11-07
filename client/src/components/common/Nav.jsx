import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function Nav() {
	const authenticated = useContext(AuthContext);
	return (
		<nav>
			<div id="nav-left">
				<Link to="/">
					<h1>Restaurant</h1>
				</Link>
			</div>
			<div id="nav-right">
				{!authenticated.authenticated ? (
					<Link to="/login">Login</Link>
				) : (
					<>
						<Link to="/bookings">Bookings</Link>
						<Link to="/profile">Profile</Link>
					</>
				)}
				<Link to="/about">About</Link>
				<Link to="/contact">Contact</Link>
			</div>
		</nav>
	);
}

export default Nav;
