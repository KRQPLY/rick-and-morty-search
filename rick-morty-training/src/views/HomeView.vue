<template>
  <Header />
  <TabHeaders />
  <Table />
  <Pagination v-if="!isOnlyFavorites && isPaginationActive" />
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import TabHeaders from "@/components/TabHeaders.vue";
import Table from "@/components/Table.vue";
import Pagination from "@/components/Pagination.vue";
import { useCharactersStore } from "@/stores/charactersStore";
import { storeToRefs } from "pinia";

const charactersStore = useCharactersStore();

const { isOnlyFavorites, isPaginationActive } = storeToRefs(charactersStore);
</script>

<script scoped lang="scss"></script>
