import { useState } from "react";

function BookingForm({ onSubmit, onCancel }) {
	const getMinDate = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split("T")[0];
	};

	const generateTimeOptions = () => {
		const times = [];
		for (let hour = 0; hour < 24; hour++) {
			const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
			const period = hour < 12 ? "AM" : "PM";
			const hourStr = hour.toString().padStart(2, "0");
			times.push({
				value: `${hourStr}:00`,
				label: `${displayHour}:00 ${period}`,
			});
		}
		return times;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const date = formData.get("date");
		const time = formData.get("time");
		const datetime = `${date}T${time}`;

		const data = {
			people_count: parseInt(formData.get("people_count")),
			table_number: parseInt(formData.get("table_number")),
			datetime: datetime,
			special_instructions: formData.get("special_instructions") || "",
		};

		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<div>
				<label htmlFor="people_count">Number of People</label>
				<input
					type="number"
					name="people_count"
					id="people_count"
					min="1"
					max="20"
					required
				/>
			</div>

			<div>
				<label htmlFor="table_number">Table Number</label>
				<input
					type="number"
					name="table_number"
					id="table_number"
					min="1"
					required
				/>
			</div>

			<div>
				<label htmlFor="date">Date</label>
				<input
					type="date"
					name="date"
					id="date"
					min={getMinDate()}
					required
				/>
			</div>

			<div>
				<label htmlFor="time">Time</label>
				<select name="time" id="time" required>
					<option value="">Select a time</option>
					{generateTimeOptions().map((time) => (
						<option key={time.value} value={time.value}>
							{time.label}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="special_instructions">
					Special Instructions (Optional)
				</label>
				<textarea
					name="special_instructions"
					id="special_instructions"
					rows="4"
				/>
			</div>

			<button type="submit">Create Booking</button>

			{onCancel && (
				<button
					type="button"
					onClick={onCancel}
					className="btn-secondary"
				>
					Cancel
				</button>
			)}
		</form>
	);
}

export default BookingForm;
