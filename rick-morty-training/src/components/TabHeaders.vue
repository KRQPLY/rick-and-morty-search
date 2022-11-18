<template>
  <div class="tab-headers">
    <div
      class="tab-headers__container container-horizontal padding-horizontal py-4"
    >
      <div
        class="tab-headers__header"
        :class="{ 'active': !isOnlyFavorites }"
        @click="showAllCharacters"
      >
        All Characters
      </div>
      <div
        class="tab-headers__header"
        :class="{ 'active': isOnlyFavorites }"
        @click="showFavoriteCharacters"
      >
        Favorites
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharactersStore } from "@/stores/charactersStore";
import { storeToRefs } from "pinia";

const charactersStore = useCharactersStore();

const { isOnlyFavorites } = storeToRefs(charactersStore);

const showAllCharacters = () => {
  charactersStore.setSearchValue("");
  charactersStore.setOnlyFavorites(false);
  charactersStore.updateCharacters();
};

const showFavoriteCharacters = () => {
  charactersStore.setSearchValue("");
  charactersStore.setOnlyFavorites(true);
  charactersStore.updateCharacters();
  charactersStore.setSearchCategory("Name");
};
</script>

<style scoped lang="scss">
@import "@/styles/_tab-headers.scss";
</style>
