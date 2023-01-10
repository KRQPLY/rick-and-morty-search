import { ref } from "vue";
import { defineStore } from "pinia";
import useGetData from "@/composables/useGetData";
import getLocalStorage from "@/utils/getLocalStorage";
import updateLocalStorage from "@/utils/updateLocalStorage";
import { useRouter } from "vue-router";
import type Character from "@/types/Character";
import type Query from "@/types/Query";

export const useCharactersStore = defineStore("counter", () => {
  const { getEpisode, getIdsInEpisodes, getCharactersByName, getCharactersByIdentifiers } = useGetData();
  const router = useRouter();
  const searchCategories = ref(["Name", "Identifier", "Episode", "SomeLongGermanWord"]);
  const searchValue = ref(typeof router.currentRoute.value.query.value === "string" ? router.currentRoute.value.query.value : "");
  const searchCategory = ref(
    typeof router.currentRoute.value.query.category !== "string" ||
      !searchCategories.value.includes(router.currentRoute.value.query.category)
      ? searchCategories.value[0]
      : router.currentRoute.value.query.category
  );
  const searchPage = ref(Number(router.currentRoute.value.query.page) || 1);
  const charactersNum = ref(1);
  const characters = ref<Character[]>([]);
  const favoriteIds = ref<number[]>([]);
  const isOnlyFavorites = ref(
    typeof router.currentRoute.value.query.favorites === "string" &&
      router.currentRoute.value.query.favorites.toLowerCase() === "true"
      ? true
      : false
  );
  const isPaginationActive = ref(true);
  const isDataLoading = ref(true);

  const updateQuery = () => {
    let query: Query = {};
    if (searchCategory.value) {
      query.category = searchCategory.value;
    }
    if (searchPage.value && (searchCategory.value.toLowerCase() !== "identifier" || !searchValue.value)) {
      query.page = searchPage.value;
    }
    if (isOnlyFavorites.value) {
      query = { favorites: "true" };
    }
    if (searchValue.value) {
      query.value = searchValue.value;
    }
    router.push({ name: "home", query: { ...query } });
  };

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
    if (!results.length) {
      isPaginationActive.value = false;
    }
    isPaginationActive.value = true;
  };

  const updateCharactersByIdentifier = async () => {
    if (!searchValue.value) {
      updateCharactersByName();
      return;
    }
    const results = await getCharactersByIdentifiers([Number(searchValue.value)]);

    setCharacters(results);
    isPaginationActive.value = false;
  };

  const updateCharactersByEpisode = async () => {
    const resultsPerPage = 20;
    const idsInEpisodes = await getIdsInEpisodes(searchValue.value);
    const results = await getCharactersByIdentifiers([...idsInEpisodes]);
    const resultsOnOnePage = [...results].splice((searchPage.value - 1) * resultsPerPage, resultsPerPage);

    charactersNum.value = results.length;

    setCharacters(resultsOnOnePage);
    if (!results.length) {
      isPaginationActive.value = false;
    }
    isPaginationActive.value = true;
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
    updateQuery,
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
