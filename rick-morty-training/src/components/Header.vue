<template>
  <header class="header py-4">
    <div class="container container-horizontal padding-horizontal">
      <RouterLink :to="{ name: 'home' }"
        ><RickAndMortyLogo class="header__logo"
      /></RouterLink>
      <div class="search-bar">
        <div class="list">
          <div class="list--label px-5 py-4">Search by</div>
          <div class="list--select">
            <div class="list--current-option px-5 py-4" @click="toggleList">
              {{ category }}
              <div class="arrow-down"></div>
            </div>
            <div class="list--container" v-if="listVisible">
              <div
                class="list--item px-5 py-4"
                v-for="item in listItems"
                @click="
                  () => {
                    changeCategory(item);
                    toggleList();
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
            v-model="value"
          />
          <Search class="search-field--button" @click="changeValue(value)" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Search from "@/components/icons/Search.vue";
import RickAndMortyLogo from "@/components/icons/RickAndMortyLogo.vue";
import { ref } from "vue";
import { RouterLink } from "vue-router";

defineProps<{
  listItems: string[];
  category: string;
  value: string;
}>();

const emits = defineEmits(["update:category", "update:value"]);

const listVisible = ref(false);

const toggleList = () => {
  listVisible.value = !listVisible.value;
};

const changeCategory = (category: string) => {
  emits("update:category", category);
};

const changeValue = (value: string) => {
  emits("update:value", value);
};
</script>

<style scoped lang="scss">
@import "@/styles/_header.scss";
</style>
