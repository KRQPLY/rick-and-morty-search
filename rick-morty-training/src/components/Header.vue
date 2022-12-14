<template>
  <header class="header py-4">
    <div class="container container-horizontal padding-horizontal">
      <RouterLink @click="goToMainPage" :to="{ name: 'home' }"><RickAndMortyLogo class="header__logo" /></RouterLink>
      <div class="search-bar">
        <div class="list">
          <div class="list__label px-5 py-4">Search by</div>
          <div class="list__select" :class="{ disabled: isOnlyFavorites }">
            <button class="list__current-option px-5 py-4" @click="toggleList">
              {{ searchCategory }}
              <div class="arrow-down"></div>
            </button>
            <div class="list__container" v-if="isListVisible">
              <button
                class="list__item px-5 py-4"
                v-for="(category, index) in searchCategories"
                @click="changeCategory(category)"
                :key="`list-item-${index}`"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>
        <div class="search-field">
          <input
            type="text"
            placeholder="..."
            class="search-field__input px-5 py-4"
            v-model="searchValue"
            v-on:keyup.enter="searchCharacters"
          />
          <button class="search-field__button" @click="searchCharacters">
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchIcon from "@/components/icons/SearchIcon.vue";
import RickAndMortyLogo from "@/components/icons/RickAndMortyLogo.vue";
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useCharactersStore } from "@/stores/charactersStore";
import { storeToRefs } from "pinia";

const charactersStore = useCharactersStore();

const isListVisible = ref(false);
const { isOnlyFavorites, searchCategory, searchCategories, searchValue } = storeToRefs(charactersStore);

const toggleList = () => {
  if (!isOnlyFavorites.value) {
    isListVisible.value = !isListVisible.value;
  }
};

const changeCategory = (category: string) => {
  toggleList();
  charactersStore.setSearchCategory(category);
  charactersStore.setSearchValue("");
};

const searchCharacters = () => {
  charactersStore.setSearchPage(1);
  charactersStore.updateQuery();
  charactersStore.updateCharacters();
};

const goToMainPage = () => {
  charactersStore.setOnlyFavorites(false);
  charactersStore.setSearchCategory("Name");
  charactersStore.setSearchValue("");
  charactersStore.setSearchPage(1);
  charactersStore.updateQuery();
  charactersStore.updateCharacters();
};

watch(isOnlyFavorites, () => {
  if (isOnlyFavorites.value) {
    isListVisible.value = false;
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/_header.scss";
</style>
