<template>
  <div class="table">
    <div class="table__container--dark padding-horizontal py-4">
      <div class="table__head container-horizontal">
        <div class="table__item">Photo</div>
        <div class="table__item">Character ID</div>
        <div class="table__item">Name</div>
        <div class="table__item">Gender</div>
        <div class="table__item">Species</div>
        <div class="table__item">Last Episode</div>
        <div class="table__item">Add To Favorites</div>
      </div>
    </div>
    <div class="table__container" v-if="characters.length">
      <TableRow
        v-for="(item, key) in characters"
        :key="key"
        :character="{
          isFavorite: charactersStore.isIdInFavorites(item.id),
          ...item,
        }"
        @toggle-favorite="toggleFavorite"
      />
    </div>
    <div
      v-else
      class="table__no-results container-horizontal padding-horizontal py-4"
    >
      No results
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharactersStore } from "@/stores/charactersStore";
import { storeToRefs } from "pinia";
import TableRow from "./TableRow.vue";

const charactersStore = useCharactersStore();

const { characters } = storeToRefs(charactersStore);

charactersStore.updateCharacters();
charactersStore.updateFavoriteIds();

const toggleFavorite = (id: number) => {
  if (charactersStore.isIdInFavorites(id))
    charactersStore.deleteFromFavorites(id);
  else charactersStore.addToFavorites(id);
  charactersStore.updateCharacters();
};
</script>

<style scoped lang="scss">
@import "@/styles/table";
</style>
