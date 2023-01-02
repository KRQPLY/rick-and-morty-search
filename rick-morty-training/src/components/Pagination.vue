<template>
  <div class="container-horizontal padding-horizontal py-4">
    <vue-awesome-paginate :total-items="charactersNum" :items-per-page="20" v-model="searchPage" :on-click="handlePageChange">
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
import { storeToRefs } from "pinia";

const charactersStore = useCharactersStore();

const { charactersNum, searchPage } = storeToRefs(charactersStore);

const handlePageChange = () => {
  charactersStore.updateQuery();
  charactersStore.updateCharacters();
};
</script>

<style lang="scss">
@import "@/styles/_pagination.scss";
</style>
