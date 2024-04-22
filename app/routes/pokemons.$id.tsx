// import statements
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import client from "~/graphql/client.server";
import { pokemonDetailsQuery } from "~/graphql/query.server";

// loader function
export async function loader({
  params,
}: LoaderFunctionArgs) {
  // request details data from PokeAPI
  let data;
  try {
    data = await client.request(pokemonDetailsQuery, { id: params.id });
  } catch {
    throw new Response("Oh no! Unable to fetch request data from PokeAPI!", {
      status: 503,
    });
  }
  console.log(JSON.stringify(data));
  return json({ data: params.id })
}

// handle errors from loader function
export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.data}</p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function PokemonDetails() {
  // get data from loader function
  const { data } = useLoaderData<typeof loader>();

  return (
    <div>{data}</div>
  )
}
