<template>
  <div
    class="container-horizontal padding-horizontal py-4"
    v-if="
      !charactersStore.onlyFavorites &&
      charactersStore.searchCategory.toLowerCase() === 'name'
    "
  >
    <vue-awesome-paginate
      :total-items="charactersStore.charactersNum"
      :items-per-page="20"
      v-model="charactersStore.searchPage"
    >
      <template #prev-button>
        <div class="arrow-left"></div>
      </template>

      <template #next-button>
        <div class="arrow-right"></div>
      </template>
    </vue-awesome-paginate>
  </div>
</template>

<script setup lang="ts">
import { useCharactersStore } from "@/stores/charactersStore";

const charactersStore = useCharactersStore();

charactersStore.updateCharactersNum();
</script>

<style lang="scss">
@import "@/styles/_pagination.scss";
</style>
