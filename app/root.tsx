import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import { NavBar } from "./components/custom/navbar";
import styles from "./tailwind.css?url";
import client from "~/graphql/client";
import { pokemonQuery } from "./graphql/query";
import { BasicPokemonData } from "utils/type";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

// loader function
export async function loader({
  request,
}: LoaderFunctionArgs) {
  // retrieve pokemon name
  const pokemonName = new URL(request.url)
    .searchParams
    .get("pokemonName");

  // query pokemons with given name
  const pokemonData: BasicPokemonData = await client.request(
    pokemonQuery, 
    { namePrefix: `${pokemonName ? pokemonName + "%" : ""}` }
  );
  
  const data = pokemonData.pokemon_v2_pokemon;
  return json({ data });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pokedex</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar />
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
