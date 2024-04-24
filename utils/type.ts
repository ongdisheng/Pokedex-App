// import statements
import { PokemonData } from "./interface";

// form data type
export type FormData = {
  id: string,
  name: string,
  action: string
}

export type BasicPokemonData = Partial<PokemonData>;