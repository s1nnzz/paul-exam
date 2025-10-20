function Form({ FormDetails, SubmitCallback }) {
	function DoNothing() {}

	return (
		<form
			onSubmit={SubmitCallback ? SubmitCallback : DoNothing}
			autoComplete="off"
		>
			{Object.entries(FormDetails).map(([key, val]) => {
				if (key != "$submit") {
					return (
						<div key={key}>
							{val.Label ? (
								<label htmlFor={key}>{val.Label}</label>
							) : null}
							<input
								type={val.Type || "text"}
								name={key}
								id={key}
							/>
						</div>
					);
				}
				return null;
			})}
			<button type="submit">{FormDetails["$submit"] || "Submit"}</button>
		</form>
	);
}

export default Form;
