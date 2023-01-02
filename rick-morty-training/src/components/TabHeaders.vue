<template>
  <div class="tab-headers">
    <div class="tab-headers__container container-horizontal padding-horizontal py-4">
      <button class="tab-headers__header" :class="{ active: !isOnlyFavorites }" @click="showAllCharacters">All Characters</button>
      <button class="tab-headers__header" :class="{ active: isOnlyFavorites }" @click="showFavoriteCharacters">Favorites</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharactersStore } from "@/stores/charactersStore";
import { storeToRefs } from "pinia";

const charactersStore = useCharactersStore();

const { isOnlyFavorites } = storeToRefs(charactersStore);

charactersStore.updateFavoriteIds();

const showAllCharacters = () => {
  charactersStore.setSearchValue("");
  charactersStore.setOnlyFavorites(false);
  charactersStore.updateCharacters();
  charactersStore.updateQuery();
};

const showFavoriteCharacters = () => {
  charactersStore.setSearchValue("");
  charactersStore.setOnlyFavorites(true);
  charactersStore.updateCharacters();
  charactersStore.setSearchCategory("Name");
  charactersStore.updateQuery();
};
</script>

<style scoped lang="scss">
@import "@/styles/_tab-headers.scss";
</style>
