// import statements
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  Form
} from "@remix-run/react";
import { useState } from "react";
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import client from "~/graphql/client.server";
import { pokemonDetailsQuery } from "~/graphql/query.server";
import { getTypeColor } from "utils/getTypeColor";
import { PokemonData } from "utils/interface";
import { FormData } from "utils/type";
import supabase from "utils/supabase";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Image,
  Typography,
} from "antd";

const { Title, Text } = Typography;

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

  // query if this pokemon exists from db 
  const isOwned = await supabase
    .from("Pokemons_Owned")
    .select()
    .eq("id", params.id!);

  return json({ data, isOwned: isOwned.data?.length === 1 })
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

// action function
export const action = async ({
  request,
}: ActionFunctionArgs) => {
  // retrieve action type
  const formData = await request.formData();
  const { action, ...pokemon } = Object.fromEntries(formData) as FormData;

  // delete or add pokemon depending on action value
  if (action === "Remove") {
    await supabase
      .from("Pokemons_Owned")
      .delete()
      .eq('id', pokemon.id);
  } else {
    await supabase
      .from("Pokemons_Owned")
      .insert({ id: parseInt(pokemon.id), name: pokemon.name })
  }

  return redirect(`/pokemons/${pokemon.id}`)
};

export default function PokemonDetails() {
  // get data from loader function
  const { data, isOwned } = useLoaderData<typeof loader>();

  // retrieve pokemon info from data
  const pokemonInfo = data.pokemon_v2_pokemon[0];
  const pokemonMoves = pokemonInfo.pokemon_v2_pokemonmoves;
  const pokemonTypes = pokemonInfo.pokemon_v2_pokemontypes;
  const pokemonStats = pokemonInfo.pokemon_v2_pokemonstats;

  // retrieve stats with max value
  const maxStat = pokemonStats.reduce((prev, current) => {
    return prev.base_stat > current.base_stat ? prev : current
  });

  // display moves using pagination
  const movesPerPage = 6;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(movesPerPage);

  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="flex flex-row justify-center items-center">
        <Title className="capitalize mt-[24px]">
          {pokemonInfo.name} #{pokemonInfo.id}
        </Title>
        <Form method="post">
          <input
            type="hidden"
            name="action"
            value={isOwned ? "Remove" : "Add"}
          />
          <input
            type="hidden"
            name="id"
            value={pokemonInfo.id}
          />
          <input
            type="hidden"
            name="name"
            value={pokemonInfo.name}
          />
          <Button
            type="submit"
            className={`m-4 ${isOwned ? "bg-red-500 hover:bg-red-400" : "bg-blue-500 hover:bg-blue-400"}`}>
            {isOwned ? "Remove" : "Add"}
          </Button>
        </Form>
      </div>
      <div className="flex items-center">
        <Image
          width={150}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonInfo.id}.png`}
          preview={false}
        />
        <div className="flex flex-col p-2">
          <div className="flex justify-evenly">
            {pokemonTypes.map(type => {
              const typeColor = getTypeColor(type.pokemon_v2_type.name);

              return (
                <Text
                  key={type.pokemon_v2_type.name}
                  className="capitalize px-2 py-1 rounded"
                  style={{ backgroundColor: `${typeColor}` }}
                >
                  {type.pokemon_v2_type.name}
                </Text>
              )
            })}
          </div>
          <div className="flex flex-col m-1">
            <Text>Base Experience: {pokemonInfo.base_experience}</Text>
            <Text>Height: {pokemonInfo.height}</Text>
            <Text>Weight: {pokemonInfo.weight}</Text>
          </div>
        </div>
      </div>
      <div>
        <Tabs defaultValue="stats" className="w-[300px] sm:w-[500px] m-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            {pokemonStats.map(stat => (
              <div key={stat.pokemon_v2_stat.name} className="m-4">
                <Text className="uppercase">
                  {stat.pokemon_v2_stat.name} {stat.base_stat}
                  <Progress
                    value={maxStat.base_stat > 100 ? stat.base_stat / maxStat.base_stat * 100 : stat.base_stat}
                  />
                </Text>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="moves">
            <div className="grid grid-cols-2 gap-4">
              {pokemonMoves.slice(startIndex, endIndex).map(move => (
                <Card key={move.pokemon_v2_move.name}>
                  <CardHeader className="capitalize">
                    <CardTitle>{move.pokemon_v2_move.name.split("-").join(" ")}</CardTitle>
                    <CardDescription>Level {move.level}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      startIndex === 0 ? "pointer-events-none opacity-50" : undefined
                    }
                    onClick={() => {
                      setStartIndex(startIndex - movesPerPage);
                      setEndIndex(endIndex - movesPerPage);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={
                      pokemonMoves.length <= endIndex ? "pointer-events-none opacity-50" : undefined
                    }
                    onClick={() => {
                      setStartIndex(startIndex + movesPerPage);
                      setEndIndex(endIndex + movesPerPage);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
