// import statements
import { Link } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { BasicPokemonData } from "utils/type";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Typography } from "antd";
import client from "~/graphql/client";
import { pokemonQuery } from "~/graphql/query";
const { Text } = Typography;

export const NavBar = () => {
  const [inputVal, setInputVal] = useState("");
  const [pokemonList, setPokemonList] = useState<{ id: number, name: string }[]>([]);

  // event handler for input change
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const pokemonName = event.target.value;
    setInputVal(pokemonName);

    // query pokemons with given name
    const pokemonData: BasicPokemonData = await client.request(
      pokemonQuery,
      { namePrefix: `${pokemonName ? pokemonName.toLowerCase() + "%" : ""}` }
    );
    setPokemonList(pokemonData.pokemon_v2_pokemon!);
  }

  return (
    <nav className="bg-gray-800 py-2 flex justify-center">
      <div className="flex justify-center items-center w-2/5 sm:w-1/2">
        <div className="relative h-14 items-center flex-initial">
          <Link to="/">
            <img
              className="h-14 w-auto"
              src="https://cdn.worldvectorlogo.com/logos/pokemon-23.svg"
              alt="Pokemon image"
            />
          </Link>
        </div>
        <div className="ml-8 sm:block flex-grow text-center">
          <div className="mx-auto flex items-center justify-center space-x-2">
            <div className="flex-grow flew-col">
              <Input
                name="pokemonName"
                placeholder="Type Pokemon Name"
                value={inputVal}
                onChange={handleChange}
              />
              <div className="bg-white rounded">
                {pokemonList.map(p => (
                  <Link key={p.id} to={`/pokemons/${p.id}`}>
                    <div className="p-2 hover:bg-gray-100">
                      <Text>
                        {p.name}
                      </Text>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500" type="submit">Search</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}