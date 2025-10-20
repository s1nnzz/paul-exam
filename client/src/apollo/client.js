import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create HTTP link with credentials
const httpLink = new HttpLink({
	uri: "http://localhost:5000/graphql",
	credentials: "include", // Important: This sends cookies with requests
});

// Create Apollo Client
const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
		query: {
			fetchPolicy: "network-only",
		},
	},
});

export default client;
