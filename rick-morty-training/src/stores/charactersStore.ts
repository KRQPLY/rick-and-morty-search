import { ref, watch } from "vue";
import { defineStore } from "pinia";
import getData from "@/composables/getData";
import getLocalStorage from "@/utils/getLocalStorage";
import updateLocalStorage from "@/utils/updateLocalStorage";
import { useRouter } from "vue-router";
import type Character from "@/types/Character";
import type Episode from "@/types/Episode";
import type Characters from "@/types/Characters";
import type Episodes from "@/types/Episodes";

export const useCharactersStore = defineStore("counter", () => {
  const router = useRouter();
  const searchCategories = ref([
    "Name",
    "Identifier",
    "Episode",
    "SomeLongGermanWord",
  ]);
  const searchValue = ref("");
  const searchCategory = ref(searchCategories.value[0]);
  const searchPage = ref(Number(router.currentRoute.value.query.page) || 1);
  const charactersNum = ref(1);
  const characters = ref<Character[]>([]);
  const savedCharacters = ref<{ [key: number]: Character[] }>([]);
  const savedEpisodes = ref<{ [key: string]: string }>({});
  const allCharactersNum = ref(1);
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
    router.push({ name: "home", query: { page: page } });
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
  const setCharacters = async (data: Character[]) => {
    characters.value = data;
    for (const [index, result] of data.entries()) {
      const lastEpisodeURL = result.episode[result.episode.length - 1];
      if (savedEpisodes.value[lastEpisodeURL]) {
        characters.value[index].lastEpisode =
          savedEpisodes.value[lastEpisodeURL];
      } else {
        const lastEpisode = (await getData(lastEpisodeURL)) as
          | Episode
          | undefined;
        if (lastEpisode) {
          characters.value[index].lastEpisode = lastEpisode.episode;
          savedEpisodes.value[lastEpisodeURL] = lastEpisode.episode;
        }
      }
    }
  };
  const updateCharactersByName = async (endpoint: string) => {
    if (!searchValue.value && savedCharacters.value[searchPage.value]) {
      setCharacters(savedCharacters.value[searchPage.value]);
      isPaginationActive.value = true;
      charactersNum.value = allCharactersNum.value;
    } else {
      endpoint = `${endpoint}?page=${searchPage.value}&name=${searchValue.value}`;
      let data = (await getData(endpoint)) as Characters | undefined;
      if (data) {
        setCharacters(data.results);
        charactersNum.value = data.info.count;
        isPaginationActive.value = true;
        if (!searchValue.value) {
          savedCharacters.value[searchPage.value] = data.results;
          allCharactersNum.value = data.info.count;
        }
      } else {
        setCharacters([]);
        isPaginationActive.value = false;
      }
    }
  };
  const updateCharactersByIdentifier = async (endpoint: string) => {
    const id = Number(searchValue.value);
    if (id) {
      const allSavedCharacters = Object.values(savedCharacters.value).flat();
      let character = allSavedCharacters.find((e) => e.id === id);
      if (character) {
        setCharacters([character]);
      } else {
        endpoint = `${endpoint}/${searchValue.value}`;
        let data = (await getData(endpoint)) as Character | undefined;
        if (data) {
          setCharacters([data]);
          savedCharacters.value[0]
            ? savedCharacters.value[0].push(data)
            : (savedCharacters.value[0] = [data]);
        } else {
          setCharacters([]);
        }
      }
      isPaginationActive.value = false;
    }
  };
  const updateCharactersByEpisode = async (endpoint: string) => {
    if (searchValue.value) {
      let episodeEndpoint = `https://rickandmortyapi.com/api/episode/?episode=${searchValue.value}`;
      let episodeData = (await getData(episodeEndpoint)) as
        | Episodes
        | undefined;
      if (episodeData) {
        let charactersIds: Set<string> = new Set();
        episodeData.results.forEach((episode: { characters: string[] }) => {
          episode.characters.forEach((character) => {
            charactersIds.add(
              character.replace(
                "https://rickandmortyapi.com/api/character/",
                ""
              )
            );
          });
        });
        endpoint = `${endpoint}/${JSON.stringify([...charactersIds])}`;
        let data = (await getData(endpoint)) as Character[] | undefined;
        if (data) {
          setCharacters(data);
        }
      } else {
        setCharacters([]);
      }
    }
    isPaginationActive.value = false;
  };
  const updateCharactersByFavorites = async (endpoint: string) => {
    if (favoriteIds.value.length) {
      let data: Character[] | undefined = [];
      let idsNotSaved: number[] = [];
      const allSavedCharacters = Object.values(savedCharacters.value).flat();
      favoriteIds.value.forEach(async (id) => {
        let character = allSavedCharacters.find((e) => e.id === id);
        if (character) {
          data?.push(character);
        } else {
          idsNotSaved.push(id);
        }
      });
      if (idsNotSaved.length) {
        endpoint = `${endpoint}/${JSON.stringify(idsNotSaved)}`;
        let dataToSave = (await getData(endpoint)) as Character[] | undefined;
        if (dataToSave) {
          data = data.concat(dataToSave);
          savedCharacters.value[0]
            ? savedCharacters.value[0].concat(dataToSave)
            : (savedCharacters.value[0] = dataToSave);
        }
      }
      if (data.length) {
        data = data.filter((item: Character) => {
          return item.name
            .toLowerCase()
            .includes(searchValue.value.toLowerCase());
        });
        data = data.sort((a, b) => a.id - b.id);
        setCharacters(data);
      } else {
        setCharacters([]);
      }
    } else {
      setCharacters([]);
    }
    isPaginationActive.value = false;
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
  watch(router.currentRoute, () => {
    searchPage.value = Number(router.currentRoute.value.query.page);
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
  };
});
