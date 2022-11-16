<template>
  <header class="header py-4">
    <div class="container container-horizontal padding-horizontal">
      <RouterLink :to="{ name: 'home' }"
        ><RickAndMortyLogo class="header__logo"
      /></RouterLink>
      <div class="search-bar">
        <div class="list">
          <div class="list--label px-5 py-4">Search by</div>
          <div
            class="list--select"
            :class="{ disabled: charactersStore.onlyFavorites }"
          >
            <div class="list--current-option px-5 py-4" @click="toggleList">
              {{ charactersStore.searchCategory }}
              <div
                class="arrow-down"
                v-if="!charactersStore.onlyFavorites"
              ></div>
            </div>
            <div class="list--container" v-if="listVisible">
              <div
                class="list--item px-5 py-4"
                v-for="item in charactersStore.searchCategories"
                @click="
                  () => {
                    toggleList();
                    charactersStore.setSearchCategory(item);
                    charactersStore.updateCharacters();
                  }
                "
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="search-field">
          <input
            type="text"
            placeholder="..."
            class="search-field--input px-5 py-4"
            v-model="charactersStore.searchValue"
          />
          <SearchIcon
            class="search-field--button"
            @click="
              () => {
                charactersStore.setSearchValue(charactersStore.searchValue);
                charactersStore.updateCharacters();
              }
            "
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchIcon from "@/components/icons/SearchIcon.vue";
import RickAndMortyLogo from "@/components/icons/RickAndMortyLogo.vue";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useCharactersStore } from "@/stores/charactersStore";

const charactersStore = useCharactersStore();

const listVisible = ref(false);

const toggleList = () => {
  if (!charactersStore.onlyFavorites) {
    listVisible.value = !listVisible.value;
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/_header.scss";
</style>
