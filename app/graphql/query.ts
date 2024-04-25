// import statements
import { gql } from "graphql-request";

// define graphql queries
export const pokemonDetailsQuery = gql`
  query pokemonDetailsQuery($id: Int!) {
    pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemonmoves(distinct_on: move_id, order_by: {move_id: asc}) {
        level
        pokemon_v2_move {
          name
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
    }
  }
`

export const pokemonQuery = gql`
  query pokemonQuery($namePrefix: String!) {
    pokemon_v2_pokemon(where: {name: {_like: $namePrefix}}, limit: 8) {
      id
      name
    }
  }
`
