// import statements
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import client from "~/graphql/client.server";
import { pokemonDetailsQuery } from "~/graphql/query.server";
import {
  Image,
  Typography,
  Flex,
} from "antd";

const { Title } = Typography;

// define interface for data
interface PokemonData {
  pokemon_v2_pokemon: Array<{
    base_experience: number,
    height: number,
    weight: number,
    id: number,
    name: string,
    pokemon_v2_pokemonmoves: Array<{
      level: number,
      pokemon_v2_move: {
        name: string
      }
    }>,
    pokemon_v2_pokemonstats: Array<{
      base_stat: number,
      pokemon_v2_stat: {
        name: string
      }
    }>,
    pokemon_v2_pokemontypes: Array<{
      pokemon_v2_type: {
        name: string
      }
    }>
  }>
}

// loader function
export async function loader({
  params,
}: LoaderFunctionArgs) {
  // request details data from PokeAPI
  let data: PokemonData;
  try {
    data = await client.request(pokemonDetailsQuery, { id: params.id });
  } catch {
    throw new Response("Oh no! Unable to fetch request data from PokeAPI!", {
      status: 503,
    });
  }
  return json({ data })
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

  // retrieve pokemon info from data
  const pokemonInfo = data.pokemon_v2_pokemon[0];
  const pokemonMoves = pokemonInfo.pokemon_v2_pokemonmoves;
  const pokemonTypes = pokemonInfo.pokemon_v2_pokemontypes;
  const pokemonStats = pokemonInfo.pokemon_v2_pokemonstats;

  return (
    <div>
      <Title className="!text-stone-600 capitalize mt-[24px] sm:ml-[24px]">
        {pokemonInfo.name} #{pokemonInfo.id}
      </Title>
      <div className="flex items-center">
        <Image
          width={150}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonInfo.id}.png`}
          preview={false}
        />
        <div className="flex flex-col">
          <span>Base Experience: {pokemonInfo.base_experience}</span>
          <span>Height: {pokemonInfo.height}</span>
          <span>Weight: {pokemonInfo.weight}</span>
        </div>
      </div>
    </div>
  )
}
