import "./style.css";
import "./assets/css/home.css";
import {
  Pokemon,
  getPokemons,
  getPokemonByName,
  getPokemonByNumber,
} from "../src/repositories/pokemon.repository";

const application = document.querySelector(".application") as HTMLBodyElement;
const pokemonListContainer = document.querySelector(
  ".pokemon-list-container"
) as HTMLDivElement;
const loadMoreButton = document.querySelector(
  ".load-more-button"
) as HTMLButtonElement;
const inputPokemonName = document.querySelector(
  ".search-input__pokemon-name"
) as HTMLInputElement;
const searchButton = document.querySelector(
  ".search-button"
) as HTMLButtonElement;

let pokemons: Pokemon[] = [];
let currentOffset: number = 0;

const getPokemonsFunc = async (
  limit: number = 20,
  offset: number = currentOffset
) => {
  try {
    pokemons = await getPokemons(limit, offset);
    pokemons.forEach((pokemon) => {
      const pokemonCard = createPokemonCard(pokemon);
      pokemonCard.addEventListener("click", () => {
        showPokemonDialog(pokemon);
      });
      pokemonListContainer?.appendChild(pokemonCard);
    });
    loadMoreButton.style.display = "block";
  } catch (error: any) {
    console.error(error.message);
  }
};

getPokemonsFunc();

const loadMorePokemons = async (limit: number = 20) => {
  currentOffset = pokemons.length;
  try {
    const newPokemons = await getPokemons((limit = 20), currentOffset);
    pokemons = pokemons.concat(newPokemons);
    clearPokemonList();
    pokemons.forEach((pokemon) => {
      const pokemonCard = createPokemonCard(pokemon);
      pokemonCard.addEventListener("click", () => {
        showPokemonDialog(pokemon);
      });
      pokemonListContainer?.appendChild(pokemonCard);
    });
  } catch (error: any) {
    console.error(error.message);
  }
};

loadMoreButton.addEventListener("click", () => {
  loadMorePokemons();
});

searchButton.addEventListener("click", async () => {
  let pokemon: Pokemon;
  try {
    if (isNaN(Number.parseInt(inputPokemonName.value))) {
      pokemon = await getPokemonByName(inputPokemonName.value);
    } else {
      pokemon = await getPokemonByNumber(
        Number.parseInt(inputPokemonName.value)
      );
    }
    const pokemonDialog = createPokemonDialog(pokemon);
    application.appendChild(pokemonDialog);
  } catch (error: any) {
    const errorDialog = createErrorDialog();
    application.appendChild(errorDialog);
  }
});

function showPokemonDialog(pokemon: Pokemon) {
  const pokemonDialog = createPokemonDialog(pokemon);
  application.appendChild(pokemonDialog);
}

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

function createErrorDialog(): HTMLElement {
  const errorDialog = document.createElement("div") as HTMLDivElement;
  errorDialog.classList.add("error-dialog");

  const messageContainer = document.createElement("div") as HTMLDivElement;
  messageContainer.classList.add("message-container");

  const messageContainerTitle = document.createElement(
    "p"
  ) as HTMLParagraphElement;
  messageContainerTitle.classList.add("message-container__title");
  messageContainerTitle.textContent = "Pokemon não encontrado";
  messageContainer.appendChild(messageContainerTitle);

  const messageContainerButton = document.createElement(
    "button"
  ) as HTMLButtonElement;
  messageContainerButton.classList.add("message-container__button");
  messageContainerButton.textContent = "Fechar";
  messageContainer.addEventListener("click", () => {
    application.removeChild(errorDialog);
  });
  messageContainer.appendChild(messageContainerButton);

  errorDialog.appendChild(messageContainer);
  return errorDialog;
}

function createPokemonDialog(pokemon: Pokemon): HTMLElement {
  // pokemon-dialog
  const pokemonDialog = document.createElement("div") as HTMLDivElement;
  pokemonDialog.classList.add("pokemon-dialog");
  pokemonDialog.style.position = "absolute";
  pokemonDialog.style.top = `${window.scrollY}px`;
  pokemonDialog.style.left = "0px";
  application.style.overflow = "hidden";

  pokemonDialog.addEventListener("click", () => {
    removePokemonDialog(pokemonDialog);
  });

  // pokemon-details
  const pokemonDetails = document.createElement("div") as HTMLDivElement;
  pokemonDetails.classList.add("pokemon-details");
  pokemonDetails.style.backgroundColor = `var(--background-type-${pokemon.types[0].type.name})`;

  // pokemon-details__top
  const pokemonDetailsTop = document.createElement("div") as HTMLDivElement;
  pokemonDetailsTop.classList.add("pokemon-details__top");

  // pokemon-details__top__image
  const pokemonDetailsTopImage = document.createElement(
    "img"
  ) as HTMLImageElement;
  pokemonDetailsTopImage.classList.add("pokemon-details__top__image");
  pokemonDetailsTopImage.src = pokemon.sprites.other.dream_world.front_default;
  pokemonDetailsTopImage.alt = pokemon.name;
  pokemonDetailsTop.appendChild(pokemonDetailsTopImage);

  // pokemon-details__top__infos
  const pokemonDetailsTopInfos = document.createElement(
    "div"
  ) as HTMLDivElement;
  pokemonDetailsTopInfos.classList.add("pokemon-details__top__infos");

  // pokemon-details__top__infos__number
  const pokemonInfosNumber = document.createElement("div") as HTMLDivElement;
  pokemonInfosNumber.classList.add("pokemon-details__top__infos__number");
  pokemonInfosNumber.textContent = `#${pokemon.id.toString().padStart(3, "0")}`;
  pokemonDetailsTopInfos.appendChild(pokemonInfosNumber);

  // pokemon-details__top__infos__name
  const pokemonInfosName = document.createElement("div") as HTMLDivElement;
  pokemonInfosName.classList.add("pokemon-details__top__infos__name");
  pokemonInfosName.textContent = capitalizeWord(pokemon.name);
  pokemonDetailsTopInfos.appendChild(pokemonInfosName);

  // pokemon-details__top__infos__types
  const pokemonInfosTypes = document.createElement("div") as HTMLDivElement;
  pokemonInfosTypes.classList.add("pokemon-details__top__infos__types");

  pokemon.types.forEach((type) => {
    const img = document.createElement("img") as HTMLImageElement;
    img.src = `src/assets/images/pokemon-types/${type.type.name}.svg`;
    img.alt = `type ${type.type.name}`;
    pokemonInfosTypes.appendChild(img);
  });
  pokemonDetailsTopInfos.appendChild(pokemonInfosTypes);
  pokemonDetailsTop.appendChild(pokemonDetailsTopInfos);
  pokemonDetails.appendChild(pokemonDetailsTop);

  // pokemon details bottom
  const detailsBottom = document.createElement("div") as HTMLDivElement;
  detailsBottom.classList.add("pokemon-details__bottom");

  // about title
  const aboutTitle = document.createElement("p") as HTMLParagraphElement;
  aboutTitle.classList.add("title");
  aboutTitle.textContent = "Sobre";
  detailsBottom.appendChild(aboutTitle);

  // details bottom infos
  const detailsBottomInfos = document.createElement("div") as HTMLDivElement;
  detailsBottomInfos.classList.add("pokemon-details__bottom__infos");
  // height
  const pokemonHeight = document.createElement("span") as HTMLSpanElement;
  pokemonHeight.classList.add("key");
  pokemonHeight.textContent = "Altura";
  detailsBottomInfos.appendChild(pokemonHeight);
  // height value
  const pokemonHeightValue = document.createElement("span") as HTMLDivElement;
  pokemonHeightValue.classList.add("value");
  pokemonHeightValue.textContent = `${pokemon.height * 10} centímetros`;
  detailsBottomInfos.appendChild(pokemonHeightValue);
  // weigth
  const pokemonWeight = document.createElement("span") as HTMLSpanElement;
  pokemonWeight.classList.add("key");
  pokemonWeight.textContent = "Peso";
  detailsBottomInfos.appendChild(pokemonWeight);
  // weigth value
  const pokemonWeightValue = document.createElement("span") as HTMLDivElement;
  pokemonWeightValue.classList.add("value");
  pokemonWeightValue.textContent = `${(pokemon.weight * 0.1).toFixed(
    2
  )} quilos`;
  detailsBottomInfos.appendChild(pokemonWeightValue);
  // abilities
  const pokemonAbilities = document.createElement("span") as HTMLSpanElement;
  pokemonAbilities.classList.add("key");
  pokemonAbilities.textContent = "Habilidades";
  detailsBottomInfos.appendChild(pokemonAbilities);
  // abilities values
  const pokemonAbilitiesValues = document.createElement(
    "div"
  ) as HTMLDivElement;
  pokemonAbilitiesValues.classList.add(
    "pokemon-details__bottom__infos__abilities"
  );
  pokemon.abilities.forEach((ability) => {
    const value = document.createElement("span") as HTMLSpanElement;
    value.classList.add("value");
    if (ability.is_hidden) {
      value.classList.add("hidden-ability");
      value.textContent = ability.ability.name + " (escondida)";
    } else {
      value.textContent = ability.ability.name;
    }
    pokemonAbilitiesValues.appendChild(value);
  });
  detailsBottomInfos.appendChild(pokemonAbilitiesValues);
  detailsBottom.appendChild(detailsBottomInfos);

  // statistics
  const pokemonStatistics = document.createElement("p") as HTMLParagraphElement;
  pokemonStatistics.classList.add("title");
  pokemonStatistics.textContent = "Estatísticas";
  detailsBottom.appendChild(pokemonStatistics);

  // bottom stats
  const detailsBottomStats = document.createElement("div") as HTMLDivElement;
  detailsBottomStats.classList.add("pokemon-details__bottom__stats");

  pokemon.stats.forEach((statistic) => {
    const statName = document.createElement("span") as HTMLSpanElement;
    statName.classList.add("key");
    statName.textContent = `${translateStatistic(statistic.stat.name)} (${
      statistic.base_stat
    })`;
    detailsBottomStats.appendChild(statName);
    const statValue = document.createElement("progress") as HTMLProgressElement;
    statValue.value = statistic.base_stat;
    statValue.max = 100;
    detailsBottomStats.appendChild(statValue);
  });

  detailsBottom.appendChild(detailsBottomStats);
  pokemonDetails.appendChild(detailsBottom);
  pokemonDialog.appendChild(pokemonDetails);

  return pokemonDialog;
}

function capitalizeWord(word: string): string {
  return `${word[0].toUpperCase()}${word.substring(1)}`;
}

function translateStatistic(stat: string): string {
  let translatedStatistic = "";
  switch (stat) {
    case "hp": {
      translatedStatistic = "HP";
      break;
    }
    case "attack": {
      translatedStatistic = "Ataque";
      break;
    }
    case "defense": {
      translatedStatistic = "Defesa";
      break;
    }
    case "special-attack": {
      translatedStatistic = "Ataque Especial";
      break;
    }
    case "special-defense": {
      translatedStatistic = "Defesa Especial";
      break;
    }
    case "speed": {
      translatedStatistic = "Velocidade";
      break;
    }
    default:
      throw new Error("invalid stat");
  }

  return translatedStatistic;
}

function removePokemonDialog(pokemonDialog: HTMLDivElement) {
  application.style.overflow = "scroll";
  application.removeChild(pokemonDialog);
}

function clearPokemonList() {
  while (pokemonListContainer.children.length > 0) {
    pokemonListContainer.removeChild(pokemonListContainer.children[0]);
  }
}
