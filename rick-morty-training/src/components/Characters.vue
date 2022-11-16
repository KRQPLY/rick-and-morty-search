<template>
  <div class="container">
    <div class="section-buttons container-horizontal padding-horizontal py-4">
      <div
        class="section-buttons--button"
        :class="{ active: !charactersStore.onlyFavorites }"
        @click="
          () => {
            charactersStore.setSearchValue('');
            charactersStore.setOnlyFavorites(false);
            charactersStore.updateCharacters();
          }
        "
      >
        All Characters
      </div>
      <div
        class="section-buttons--button"
        :class="{ active: charactersStore.onlyFavorites }"
        @click="
          () => {
            charactersStore.setSearchValue('');
            charactersStore.setOnlyFavorites(true);
            charactersStore.updateCharacters();
            charactersStore.setSearchCategory('Name');
          }
        "
      >
        Favorites
      </div>
    </div>
    <Table :table-items="charactersStore.characters" />
  </div>
</template>

<script setup lang="ts">
import Table from "@/components/Table.vue";
import { useCharactersStore } from "@/stores/charactersStore";

const charactersStore = useCharactersStore();

charactersStore.updateCharacters();
</script>

<style scoped lang="scss">
@import "@/styles/_characters.scss";
</style>
