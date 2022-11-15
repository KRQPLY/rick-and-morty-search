<template>
  <div class="container">
    <div class="section-buttons container-horizontal padding-horizontal py-4">
      <div
        class="section-buttons--button"
        :class="{ active: allCharacters }"
        @click="toggleAllCharacters"
      >
        All Characters
      </div>
      <div
        class="section-buttons--button"
        :class="{ active: !allCharacters }"
        @click="toggleAllCharacters"
      >
        Favorites
      </div>
    </div>
    <div class="table--head">
      <div class="table--row container-horizontal padding-horizontal py-4">
        <div class="table--item">Photo</div>
        <div class="table--item">Character ID</div>
        <div class="table--item">Name</div>
        <div class="table--item">Gender</div>
        <div class="table--item">Species</div>
        <div class="table--item">Last Episode</div>
        <div class="table--item">Add To Favorites</div>
      </div>
    </div>
    <div class="table">
      <div
        class="table--row container-horizontal padding-horizontal py-4"
        v-for="character in charactersData"
      >
        <div class="table--item">{{ character.image }}</div>
        <div class="table--item">{{ character.id }}</div>
        <div class="table--item">{{ character.name }}</div>
        <div class="table--item">{{ character.gender }}</div>
        <div class="table--item">{{ character.species }}</div>
        <div class="table--item">
          {{ character.lastEpisode }}
        </div>
        <div class="table--item">Add to Favorites</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import getData from "@/composables/getData";

const props = defineProps({
  category: { type: String, required: true },
  value: { type: String, required: true },
  page: { type: Number },
});

const value = toRef(props, "value");
const category = toRef(props, "category");
const page = toRef(props, "page");
const allCharacters = ref(true);
const charactersData = ref<
  {
    image: string;
    id: number;
    name: string;
    gender: string;
    species: string;
    episode: string[];
    lastEpisode: string;
  }[]
>([]);
const favorites = ref([1, 2]);

const updateCharactersData = (data: []) => {
  charactersData.value = data;
  data.forEach(async (result: { episode: string }, index: number) => {
    const lastEpisodeURL = result.episode[result.episode.length - 1];
    const lastEpisode = await getData(lastEpisodeURL);
    charactersData.value[index].lastEpisode = lastEpisode.episode;
  });
};

const getCharacters = async () => {
  let endpoint = "https://rickandmortyapi.com/api/character";
  if (allCharacters.value) {
    let categoryName = category.value.toLowerCase();
    if (categoryName === "episode") {
      if (value.value) {
        endpoint = `https://rickandmortyapi.com/api/episode/?${categoryName}=${value.value}`;
        let data = (await getData(endpoint)).results;
        console.log(data);
        return;
      }
    } else if (categoryName === "name") {
      endpoint = `${endpoint}?page=${page.value}&${categoryName}=${value.value}`;
    } else if (categoryName === "identifier") {
      if (Number(value.value)) endpoint = `${endpoint}/${value.value}`;
    }
    let data = await getData(endpoint);
    if (!Array.isArray(data.results)) {
      data.results = [data];
    }
    updateCharactersData(data.results);
  } else {
    endpoint = `${endpoint}/${favorites.value}`;
    let data = await getData(endpoint);
    if (!Array.isArray(data)) {
      data = [data];
    }
    updateCharactersData(data);
  }
};

getCharacters();

const toggleAllCharacters = () => {
  allCharacters.value = !allCharacters.value;
};

watch(value, getCharacters);
watch(category, getCharacters);
watch(allCharacters, getCharacters);
</script>

<style scoped lang="scss">
@import "@/styles/_characters.scss";
</style>
