// define interface for data
export interface PokemonData {
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