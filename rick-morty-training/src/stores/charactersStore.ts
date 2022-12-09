import { ref, watch } from "vue";
import { defineStore } from "pinia";
import useGetData from "@/composables/useGetData";
import getLocalStorage from "@/utils/getLocalStorage";
import updateLocalStorage from "@/utils/updateLocalStorage";
import { useRouter } from "vue-router";
import type Character from "@/types/Character";

export const useCharactersStore = defineStore("counter", () => {
  const { getEpisode, getIdsInEpisodes, getCharactersByName, getCharactersByIdentifiers } = useGetData();
  const router = useRouter();
  const searchCategories = ref(["Name", "Identifier", "Episode", "SomeLongGermanWord"]);
  const searchValue = ref("");
  const searchCategory = ref(searchCategories.value[0]);
  const searchPage = ref(Number(router.currentRoute.value.query.page) || 1);
  const charactersNum = ref(1);
  const characters = ref<Character[]>([]);
  const favoriteIds = ref<number[]>([]);
  const isOnlyFavorites = ref(false);
  const isPaginationActive = ref(true);
  const isDataLoading = ref(true);

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
    for (const character of characters.value) {
      character.lastEpisode = await getEpisode(character.episode[character.episode.length - 1]);
    }
  };

  const updateCharactersByName = async () => {
    const { results, count } = await getCharactersByName(searchPage.value, searchValue.value);

    setCharacters(results);
    charactersNum.value = count;
    isPaginationActive.value = true;
    if (!results.length) {
      isPaginationActive.value = false;
    }
  };

  const updateCharactersByIdentifier = async () => {
    const results = await getCharactersByIdentifiers([Number(searchValue.value)]);

    setCharacters(results);
    isPaginationActive.value = false;
  };

  const updateCharactersByEpisode = async () => {
    const idsInEpisodes = await getIdsInEpisodes(searchValue.value);
    const results = await getCharactersByIdentifiers([...idsInEpisodes]);

    setCharacters(results);
    isPaginationActive.value = false;
  };

  const updateCharactersByFavorites = async () => {
    const results = await getCharactersByIdentifiers(favoriteIds.value);
    const filteredResults = results.filter((item) => {
      return item.name.toLowerCase().includes(searchValue.value.toLowerCase());
    });

    setCharacters(filteredResults);
    isPaginationActive.value = false;
  };

  const updateCharacters = async () => {
    const categoryName = searchCategory.value.toLowerCase();

    isDataLoading.value = true;
    characters.value = [];
    if (isOnlyFavorites.value) {
      await updateCharactersByFavorites();
    } else {
      if (categoryName === "episode") {
        await updateCharactersByEpisode();
      } else if (categoryName === "name") {
        await updateCharactersByName();
      } else if (categoryName === "identifier") {
        await updateCharactersByIdentifier();
      }
    }
    isDataLoading.value = false;
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
    isDataLoading,
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
