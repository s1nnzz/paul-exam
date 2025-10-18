import { createContext, useEffect, useState, useRef } from "react";

export const FlashContext = createContext({
	setFlash: () => {},
	flash: "",
});

export const FlashProvider = ({ children }) => {
	const [flash, setFlash] = useState("");
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		if (flash !== "") {
			timeoutRef.current = setTimeout(() => {
				setFlash("");
			}, 5000); // 5 seconds
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [flash]);

	return (
		<FlashContext.Provider value={{ flash, setFlash }}>
			{children}
		</FlashContext.Provider>
	);
};
