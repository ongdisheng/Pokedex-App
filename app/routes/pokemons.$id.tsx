// import statements
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import client from "~/graphql/client.server";
import { pokemonDetailsQuery } from "~/graphql/query.server";

// loader function
export async function loader({
  params,
}: LoaderFunctionArgs) {
  // request details data from PokeAPI
  const data = await client.request(pokemonDetailsQuery, { id: params.id });
  console.log(JSON.stringify(data));
  return json({ data: params.id })
}

export default function PokemonDetails() {
  // get data from loader function
  const { data } = useLoaderData<typeof loader>();

  return (
    <div>{data}</div>
  )
}
