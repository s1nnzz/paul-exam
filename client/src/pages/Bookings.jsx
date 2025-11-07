import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";
import { useNavigate } from "react-router-dom";
import BookingList from "../components/bookings/BookingList";
import BookingForm from "../components/bookings/BookingForm";

function Bookings() {
	const { authenticated, loading } = useContext(AuthContext);
	const { setFlash } = useContext(FlashContext);
	const nav = useNavigate();
	const [bookings, setBookings] = useState([]);
	const [loadingBookings, setLoadingBookings] = useState(true);
	const [view, setView] = useState("list");

	useEffect(() => {
		if (!loading && !authenticated) {
			nav("/login");
		}
	}, [authenticated, loading, nav]);

	useEffect(() => {
		if (authenticated) {
			fetchBookings();
		}
	}, [authenticated]);

	const fetchBookings = () => {
		setLoadingBookings(true);
		fetch("/api/book/list", {
			method: "GET",
			credentials: "include",
		})
			.then((res) => res.json())
			.then((json) => {
				setBookings(json.bookings || []);
				setLoadingBookings(false);
			})
			.catch(() => {
				setFlash("Failed to load bookings");
				setLoadingBookings(false);
			});
	};

	const handleCreateBooking = (bookingData) => {
		fetch("/api/book/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(bookingData),
		})
			.then((res) => {
				if (res.status === 201) {
					setView("list");
					fetchBookings();
				}
				return res.json();
			})
			.then((json) => {
				setFlash(json.message);
			});
	};

	const handleDeleteBooking = (bookingId) => {
		if (!confirm("Are you sure you want to delete this booking?")) {
			return;
		}

		fetch(`/api/book/delete/${bookingId}`, {
			method: "DELETE",
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) {
					fetchBookings();
				}
				return res.json();
			})
			.then((json) => {
				setFlash(json.message);
			});
	};

	if (loading || loadingBookings) {
		return <main>Loading...</main>;
	}

	return (
		<main>
			{view === "list" ? (
				<BookingList
					bookings={bookings}
					onDelete={handleDeleteBooking}
					onCreateNew={() => setView("create")}
				/>
			) : (
				<div>
					<h1>Create New Booking</h1>
					<BookingForm
						onSubmit={handleCreateBooking}
						onCancel={() => setView("list")}
					/>
				</div>
			)}
		</main>
	);
}

export default Bookings;
