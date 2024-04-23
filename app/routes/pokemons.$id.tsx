// import statements
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import client from "~/graphql/client.server";
import { pokemonDetailsQuery } from "~/graphql/query.server";
import { getTypeColor } from "utils/getTypeColor";
import { PokemonData } from "utils/interface";
import { Progress } from "~/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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

  // retrieve stats with max value
  const maxStat = pokemonStats.reduce((prev, current) => {
    return prev.base_stat > current.base_stat ? prev : current
  });

  return (
    <div className="flex flex-col min-h-screen items-center">
      <Title className="!text-stone-600 capitalize mt-[24px] sm:ml-[24px]">
        {pokemonInfo.name} #{pokemonInfo.id}
      </Title>
      <div className="flex items-center">
        <Image
          width={150}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonInfo.id}.png`}
          preview={false}
        />
        <div className="flex flex-col p-2">
          <div className="flex justify-evenly">
            {pokemonTypes.map(type => {
              const backgroundColor = getTypeColor(type.pokemon_v2_type.name);

              return (
                <Text key={type.pokemon_v2_type.name} className={`capitalize px-2 py-1 rounded ${backgroundColor}`}>
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
        <Tabs defaultValue="stats" className="w-[500px] m-4">
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
              {pokemonMoves.map(move => (
                <Card>
                  <CardHeader className="capitalize">
                    <CardTitle>{move.pokemon_v2_move.name.split("-").join(" ")}</CardTitle>
                    <CardDescription>Level {move.level}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
