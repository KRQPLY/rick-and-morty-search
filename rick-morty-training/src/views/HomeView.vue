<template>
  <Header
    :list-items="listItems"
    v-model:category="category"
    v-model:value="value"
  />
  <Characters
    v-model:category="category"
    v-model:value="value"
    v-model:page="page"
  />
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import Characters from "@/components/Characters.vue";
import { ref } from "vue";

const listItems = ["Name", "Identifier", "Episode", "SomeLongGermanWord"];

const category = ref(listItems[0]);
const value = ref("");
const page = 1;
</script>

<script scoped lang="scss"></script>
