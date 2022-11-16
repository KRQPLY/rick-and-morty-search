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
    <div class="table__container" v-if="charactersStore.characters.length > 0">
      <div class="table__row--border" v-for="item in tableItems">
        <div class="table__row container-horizontal padding-horizontal py-2">
          <div class="table__item image">
            <img
              :src="getImageUrl(`${item.image}`)"
              alt="image"
              :class="{ greys: item.status.toLowerCase() === 'dead' }"
            />
            <RibbonIcon
              v-if="item.status.toLowerCase() === 'dead'"
              class="ribbon"
            />
          </div>
          <div class="table__item id">{{ item.id }}</div>
          <div class="table__item name">{{ item.name }}</div>
          <div class="table__item gender">
            <GenderIcon :gender="item.gender" class="icon" />
            {{ capitalizeFirstLetter(item.gender) }}
          </div>
          <div class="table__item species">{{ item.species }}</div>
          <div class="table__item last-episode">
            {{ item.lastEpisode }}
          </div>
          <div class="table__item favorites">
            <div
              class="star"
              :class="{ favorite: charactersStore.idInFavorites(item.id) }"
              @click="
                () => {
                  if (charactersStore.idInFavorites(item.id))
                    charactersStore.deleteFromFavorites(item.id);
                  else charactersStore.addToFavorites(item.id);
                  charactersStore.updateCharacters();
                }
              "
            >
              <StarIcon />
            </div>
          </div>
        </div>
      </div>
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
import StarIcon from "./icons/StarIcon.vue";
import { useCharactersStore } from "@/stores/charactersStore";
import getImageUrl from "@/composables/getImageUrl";
import GenderIcon from "./icons/GenderIcon.vue";
import capitalizeFirstLetter from "@/composables/capitalizeFirstLetter";
import RibbonIcon from "@/components/icons/RibbonIcon.vue";

const charactersStore = useCharactersStore();

defineProps<{
  tableItems: {
    image: string;
    status: string;
    id: number;
    name: string;
    gender: string;
    species: string;
    episode: string[];
    lastEpisode: string;
  }[];
}>();
</script>

<style scoped lang="scss">
@import "@/styles/table";
</style>
