import axios from "axios";

export interface Pokemon {
  id: number;
  abilities: Abilities[];
  height: number;
  name: string;
  sprites: Sprites;
  stats: Stats[];
  types: Types[];
  weight: number;
  species: Species;
}

interface Abilities {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

interface Ability {
  name: string;
  url: string;
}

interface Sprites {
  other: Other;
}

interface Other {
  dream_world: DreamWorld;
}

interface DreamWorld {
  front_default: string;
}

interface Stats {
  base_stat: number;
  effort: number;
  stat: Stat;
}

interface Stat {
  name: string;
  url: string;
}

interface Types {
  slot: number;
  type: Type;
}

interface Type {
  name: string;
  url: string;
}

interface Species {
  name: string;
  url: string;
}

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemons(
  limit: number = 20,
  offset: number = 0
): Promise<Pokemon[]> {
  return axios
    .get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Pokemons não encontrados");
      }
      return response.data.results;
    })
    .then((pokemons) => pokemons.map((pokemon: any) => axios.get(pokemon.url)))
    .then((requests) =>
      Promise.all(requests)
        .then((resp) => resp.map((r) => r.data))
        .then((pokemons) =>
          pokemons.map(
            (pokemon) =>
              ({
                id: pokemon.id,
                abilities: pokemon.abilities,
                height: pokemon.height,
                name: pokemon.name,
                sprites: pokemon.sprites,
                types: pokemon.types,
                weight: pokemon.weight,
                stats: pokemon.stats,
                species: pokemon.species,
              } as Pokemon)
          )
        )
    );
}

export async function getPokemonByName(pokemonName: string): Promise<any> {
  return axios
    .get(`${BASE_URL}/pokemon/${pokemonName.toLowerCase()}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Pokemon não encontrado");
      }
      return response.data;
    })
    .then(
      (pokemon) =>
        ({
          id: pokemon.id,
          abilities: pokemon.abilities,
          height: pokemon.height,
          name: pokemon.name,
          sprites: pokemon.sprites,
          types: pokemon.types,
          weight: pokemon.weight,
          stats: pokemon.stats,
          species: pokemon.species,
        } as Pokemon)
    );
}

export async function getPokemonByNumber(pokemonNumber: number) {
  return axios
    .get(`${BASE_URL}/pokemon/${pokemonNumber}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Pokemon não encontrado");
      }
      return response.data;
    })
    .then(
      (pokemon) =>
        ({
          id: pokemon.id,
          abilities: pokemon.abilities,
          height: pokemon.height,
          name: pokemon.name,
          sprites: pokemon.sprites,
          types: pokemon.types,
          weight: pokemon.weight,
          stats: pokemon.stats,
          species: pokemon.species,
        } as Pokemon)
    );
}
