import { ref, watch } from "vue";
import { defineStore } from "pinia";
import getData from "@/composables/getData";
import getLocalStorage from "@/composables/getLocalStorage";
import updateLocalStorage from "@/composables/updateLocalStorage";

interface Character {
  image: string;
  status: string;
  id: number;
  name: string;
  gender: string;
  species: string;
  episode: string[];
  lastEpisode: string;
}

export const useCharactersStore = defineStore("counter", () => {
  const searchCategories = [
    "Name",
    "Identifier",
    "Episode",
    "SomeLongGermanWord",
  ];
  const searchValue = ref("");
  const searchCategory = ref(searchCategories[0]);
  const searchPage = ref(1);
  const charactersNum = ref(1);
  const characters = ref<Character[]>([]);
  const favoriteIds = ref<number[]>(getLocalStorage("favorite-ids"));
  const onlyFavorites = ref(false);
  const setSearchValue = (value: string) => {
    searchValue.value = value;
  };
  const setSearchCategory = (category: string) => {
    searchCategory.value = category;
  };
  const setOnlyFavorites = (favorites: boolean) => {
    onlyFavorites.value = favorites;
  };
  const addToFavorites = (id: number) => {
    favoriteIds.value.push(id);
    updateLocalStorage("favorite-ids", favoriteIds.value);
  };
  const deleteFromFavorites = (id: number) => {
    const index = favoriteIds.value.indexOf(id);
    favoriteIds.value.splice(index, 1);
    updateLocalStorage("favorite-ids", favoriteIds.value);
  };
  const idInFavorites = (id: number) => {
    return favoriteIds.value.some((favoriteId) => favoriteId === id);
  };
  const setCharacters = (data: Character[]) => {
    characters.value = data;
    data.forEach(async (result: Character, index: number) => {
      const lastEpisodeURL = result.episode[result.episode.length - 1];
      const lastEpisode = await getData(lastEpisodeURL);
      characters.value[index].lastEpisode = lastEpisode.episode;
    });
  };
  const updateCharacters = async () => {
    let endpoint = "https://rickandmortyapi.com/api/character";
    if (!onlyFavorites.value) {
      let categoryName = searchCategory.value.toLowerCase();
      if (categoryName === "episode") {
        if (searchValue.value) {
          let episodeEndpoint = `https://rickandmortyapi.com/api/episode/?${categoryName}=${searchValue.value}`;
          let episodeData = (await getData(episodeEndpoint)).results;
          let charactersIds: Set<string> = new Set();
          episodeData.forEach((item: { characters: string[] }) => {
            item.characters.forEach((character) => {
              charactersIds.add(
                character.replace(
                  "https://rickandmortyapi.com/api/character/",
                  ""
                )
              );
            });
          });
          endpoint = `${endpoint}/${[...charactersIds]}`;
          let data = await getData(endpoint);
          setCharacters(data);
          return;
        }
      } else if (categoryName === "name") {
        endpoint = `${endpoint}?page=${searchPage.value}&${categoryName}=${searchValue.value}`;
        updateCharactersNum(endpoint);
      } else if (categoryName === "identifier") {
        if (Number(searchValue.value))
          endpoint = `${endpoint}/${searchValue.value}`;
      }
      let data = await getData(endpoint);
      if (!Array.isArray(data.results)) {
        data.results = [data];
      }
      setCharacters(data.results);
    } else {
      let data: Character[] = [];
      if (favoriteIds.value.length > 0) {
        endpoint = `${endpoint}/${favoriteIds.value}`;
        data = await getData(endpoint);
        if (!Array.isArray(data)) {
          data = [data];
        }
        if (searchValue.value) {
          data = data.filter((item) => {
            return item.name
              .toLowerCase()
              .includes(searchValue.value.toLowerCase());
          });
        }
      }
      setCharacters(data);
    }
  };
  const updateCharactersNum = async (
    endpoint: string = "https://rickandmortyapi.com/api/character"
  ) => {
    let data = await getData(endpoint);
    charactersNum.value = data.info.count;
  };
  watch(searchPage, () => {
    updateCharacters();
  });

  return {
    searchCategories,
    searchValue,
    searchCategory,
    searchPage,
    charactersNum,
    characters,
    favoriteIds,
    onlyFavorites,
    setSearchValue,
    setSearchCategory,
    setOnlyFavorites,
    addToFavorites,
    deleteFromFavorites,
    idInFavorites,
    setCharacters,
    updateCharacters,
    updateCharactersNum,
  };
});
