import { useContext } from "react";
import { FlashContext } from "../../contexts/FlashContext";

function Flash() {
	const { flash } = useContext(FlashContext);

	return (
		<div
			className="flash-holder"
			style={{ display: flash !== "" ? "block" : "none" }}
		>
			<h3 className="flash-text">{flash}</h3>
		</div>
	);
}

export default Flash;
