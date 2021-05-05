import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";

const isDev = process.env.NODE_ENV === "development";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem("jwt")));

const httpLink = createHttpLink({
  uri: isDev
    ? "http://localhost:4000/graphql"
    : "https://nuber-server.herokuapp.com/graphql",
});

const wsLink = new WebSocketLink({
  uri: isDev
    ? "ws://localhost:4000/subscription"
    : "wss://nuber-server.herokuapp.com/subscription",
  options: {
    reconnect: true,
    connectionParams: {
      "X-JWT": localStorage.getItem("jwt"),
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    ...headers,
    "X-JWT": localStorage.getItem("jwt"),
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
