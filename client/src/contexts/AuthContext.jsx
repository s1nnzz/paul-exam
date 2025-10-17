const { createContext } = require("react");

export const AuthContext = createContext({
	authenticated: false,
	loading: true,
});
