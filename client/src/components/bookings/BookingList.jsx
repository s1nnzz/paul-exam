import BookingCard from "./BookingCard";

function BookingList({ bookings, onDelete, onCreateNew }) {
	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h1>My Bookings</h1>
				<button onClick={onCreateNew} className="btn-primary">
					Create New Booking
				</button>
			</div>

			{bookings.length === 0 ? (
				<p>You have no bookings yet.</p>
			) : (
				<div className="bookings-list">
					{bookings.map((booking) => (
						<BookingCard
							key={booking.booking_id}
							booking={booking}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default BookingList;
