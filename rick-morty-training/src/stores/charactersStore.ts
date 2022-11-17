import { ref, watch } from "vue";
import { defineStore } from "pinia";
import getData from "@/composables/getData";
import getLocalStorage from "@/utils/getLocalStorage";
import updateLocalStorage from "@/utils/updateLocalStorage";
import type Character from "@/types/Character";

export const useCharactersStore = defineStore("counter", () => {
  const searchCategories = ref([
    "Name",
    "Identifier",
    "Episode",
    "SomeLongGermanWord",
  ]);
  const searchValue = ref("");
  const searchCategory = ref(searchCategories.value[0]);
  const searchPage = ref(1);
  const charactersNum = ref(1);
  const characters = ref<Character[]>([]);
  const favoriteIds = ref<number[]>([]);
  const isOnlyFavorites = ref(false);
  const isPaginationActive = ref(true);
  const setSearchValue = (value: string) => {
    searchValue.value = value;
  };
  const setSearchCategory = (category: string) => {
    searchCategory.value = category;
  };
  const setOnlyFavorites = (favorites: boolean) => {
    isOnlyFavorites.value = favorites;
  };
  const setSearchPage = (page: number) => {
    searchPage.value = page;
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
  const isIdInFavorites = (id: number) => {
    return favoriteIds.value.some((favoriteId) => favoriteId === id);
  };
  const updateFavoriteIds = () => {
    const storage = getLocalStorage("favorite-ids");
    if (storage) {
      favoriteIds.value = JSON.parse(storage);
    }
  };
  const setCharacters = (data: Character[]) => {
    characters.value = data;
    data.forEach(async (result: Character, index: number) => {
      const lastEpisodeURL = result.episode[result.episode.length - 1];
      const lastEpisode = await getData(lastEpisodeURL);
      characters.value[index].lastEpisode = lastEpisode.episode;
    });
  };
  const updateCharactersByName = async (endpoint: string) => {
    endpoint = `${endpoint}?page=${searchPage.value}&name=${searchValue.value}`;
    let data = await getData(endpoint);
    if (data) {
      setCharacters(data.results);
      updateCharactersNum(endpoint);
      isPaginationActive.value = true;
    } else {
      setCharacters([]);
    }
  };
  const updateCharactersByIdentifier = async (endpoint: string) => {
    if (Number(searchValue.value)) {
      endpoint = `${endpoint}/${searchValue.value}`;
      let data = await getData(endpoint);
      if (data) {
        setCharacters([data]);
        isPaginationActive.value = false;
      } else {
        setCharacters([]);
      }
    }
  };
  const updateCharactersByEpisode = async (endpoint: string) => {
    if (searchValue.value) {
      let episodeEndpoint = `https://rickandmortyapi.com/api/episode/?episode=${searchValue.value}`;
      let episodeData = (await getData(episodeEndpoint)).results;
      if (episodeData) {
        let charactersIds: Set<string> = new Set();
        episodeData.forEach((episode: { characters: string[] }) => {
          episode.characters.forEach((character) => {
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
        if (data) {
          setCharacters(data);
          isPaginationActive.value = false;
        }
      } else {
        setCharacters([]);
      }
    }
  };
  const updateCharactersByFavorites = async (endpoint: string) => {
    if (favoriteIds.value.length) {
      endpoint = `${endpoint}/${JSON.stringify(favoriteIds.value)}`;
      let data = await getData(endpoint);
      if (data) {
        if (searchValue.value) {
          data = data.filter((item: Character) => {
            return item.name
              .toLowerCase()
              .includes(searchValue.value.toLowerCase());
          });
        }
        setCharacters(data);
        isPaginationActive.value = false;
      } else {
        setCharacters([]);
      }
    } else {
      setCharacters([]);
    }
  };
  const updateCharacters = async () => {
    let endpoint = "https://rickandmortyapi.com/api/character";
    if (isOnlyFavorites.value) {
      updateCharactersByFavorites(endpoint);
    } else {
      let categoryName = searchCategory.value.toLowerCase();
      if (categoryName === "episode") {
        updateCharactersByEpisode(endpoint);
      } else if (categoryName === "name") {
        updateCharactersByName(endpoint);
      } else if (categoryName === "identifier") {
        updateCharactersByIdentifier(endpoint);
      }
    }
  };
  const updateCharactersNum = async (
    endpoint: string = "https://rickandmortyapi.com/api/character"
  ) => {
    let data = await getData(endpoint);
    if (data) {
      charactersNum.value = data.info.count;
    }
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
    isOnlyFavorites,
    isPaginationActive,
    setSearchValue,
    setSearchCategory,
    setOnlyFavorites,
    setSearchPage,
    addToFavorites,
    deleteFromFavorites,
    isIdInFavorites,
    updateFavoriteIds,
    updateCharacters,
    updateCharactersNum,
  };
});
