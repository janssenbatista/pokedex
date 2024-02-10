import "./style.css";
import "./assets/css/home.css";
import { Pokemon } from "../src/repositories/pokemon.repository";

function createPokemonCard(pokemon: Pokemon): HTMLElement {
  // pokemon-card
  const pokemonCard = document.createElement("div") as HTMLDivElement;
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.style.backgroundColor = `var(--background-type-${pokemon.types[0].type.name})`;

  // pokemon-card__image
  const cardImage = document.createElement("div") as HTMLDivElement;
  cardImage.classList.add("pokemon-card__image");

  // img
  const img = document.createElement("img") as HTMLImageElement;
  img.src = pokemon.sprites.other.dream_world.front_default;
  img.alt = pokemon.name;
  cardImage.appendChild(img);
  pokemonCard.appendChild(cardImage);

  // pokemon-card__infos
  const pokemonCardInfos = document.createElement("div") as HTMLDivElement;
  pokemonCardInfos.classList.add("pokemon-card__infos");

  // pokemon-card__infos__pokemon-number
  const pokemonNumber = document.createElement("span") as HTMLSpanElement;
  pokemonNumber.classList.add("pokemon-card__infos__pokemon-number");
  pokemonNumber.textContent = `#${pokemon.id.toString().padStart(3, "0")}`;
  pokemonCardInfos.appendChild(pokemonNumber);
  // pokemon-card__infos__pokemon-name
  const pokemonName = document.createElement("p") as HTMLParagraphElement;
  pokemonName.classList.add("pokemon-card__infos__pokemon-name");
  pokemonName.textContent = capitalizeWord(pokemon.name);
  pokemonCardInfos.appendChild(pokemonName);

  // pokemon-card__infos__pokemon-types
  const pokemonTypes = document.createElement("div") as HTMLDivElement;
  pokemonTypes.classList.add("pokemon-card__infos__types");

  // pokemon-card__infos__pokemon-types__type
  pokemon.types.forEach((type) => {
    const pokemonType = document.createElement("img") as HTMLImageElement;
    pokemonType.classList.add("pokemon-card__infos__types__type");
    pokemonType.src = `src/assets/images/pokemon-types/${type.type.name}.svg`;
    pokemonType.alt = type.type.name;
    pokemonTypes.appendChild(pokemonType);
  });
  pokemonCardInfos.appendChild(pokemonTypes);
  pokemonCard.appendChild(pokemonCardInfos);

  return pokemonCard;
}

function capitalizeWord(word: string): string {
  return `${word[0].toUpperCase()}${word.substring(1)}`;
}
