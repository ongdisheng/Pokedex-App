// import statements
import { GraphQLClient } from "graphql-request";

// setup graphql client
const endpoint = "https://beta.pokeapi.co/graphql/v1beta";
const client = new GraphQLClient(endpoint);
export default client;