function BookingCard({ booking, onDelete }) {
	const formatDateTime = (datetime) => {
		return new Date(datetime).toLocaleString();
	};

	return (
		<div className="booking-card">
			<div className="booking-info">
				<h3>Booking #{booking.booking_id}</h3>
				<p>
					<strong>Date & Time:</strong>{" "}
					{formatDateTime(booking.booking_dt)}
				</p>
				<p>
					<strong>Table Number:</strong> {booking.table_number}
				</p>
				<p>
					<strong>People Count:</strong> {booking.people_count}
				</p>
				{booking.special_instructions && (
					<p>
						<strong>Special Instructions:</strong>{" "}
						{booking.special_instructions}
					</p>
				)}
			</div>
			<button
				onClick={() => onDelete(booking.booking_id)}
				className="btn-danger"
			>
				Delete
			</button>
		</div>
	);
}

export default BookingCard;
