// import statements
import { Link } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BasicPokemonData } from "utils/type";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Typography } from "antd";
import client from "~/graphql/client";
import { pokemonQuery } from "~/graphql/query";
const { Text } = Typography;

export const NavBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [pokemonList, setPokemonList] = useState<{ id: number, name: string }[]>([]);

  // debounce mechanism
  useEffect(() => {
    const id = setTimeout(async () => {
      // query pokemons with given name
      const pokemonData: BasicPokemonData = await client.request(
        pokemonQuery,
        { namePrefix: `${inputVal ? inputVal.toLowerCase() + "%" : ""}` }
      );
      setPokemonList(pokemonData.pokemon_v2_pokemon!);
    }, 500);

    return () => clearTimeout(id);
  }, [inputVal, 500]);

  // event handler for input change
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const pokemonName = event.target.value;
    setInputVal(pokemonName);

    // display pokemon list
    setVisible(true);
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
          <div className="mx-auto flex items-center justify-end space-x-2">
            <div className="flex-grow flew-col">
              <div className="relative">
                <Input
                  name="pokemonName"
                  placeholder="Type Pokemon Name"
                  value={inputVal}
                  ref={inputRef}
                  onChange={handleChange}
                  onFocus={() => {
                    setVisible(true);
                  }}
                  onBlur={() => {
                    setVisible(false);
                  }}
                />
                <div
                  className="bg-white/75 rounded z-10 absolute w-full"
                  style={{ display: visible ? "" : "none" }}
                >
                  {pokemonList.map(p => (
                    <Link
                      key={p.id}
                      to={`/pokemons/${p.id}`}
                      onMouseDown={event => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        setInputVal("");
                        setPokemonList([]);
                        setVisible(false);
                        inputRef.current?.blur();
                      }}
                    >
                      <div className="p-2 hover:bg-gray-100">
                        <Text className="capitalize">
                          {p.name}
                        </Text>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500" type="submit">Search</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}