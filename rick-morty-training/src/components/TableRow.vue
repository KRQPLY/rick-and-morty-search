<template>
  <div class="row">
    <div class="row__container container-horizontal padding-horizontal py-2">
      <div class="row__item image">
        <img
          :src="`${character.image}`"
          :alt="character.name"
          :class="{ greys: character.status.toLowerCase() === 'dead' }"
        />
        <RibbonIcon
          v-if="character.status.toLowerCase() === 'dead'"
          class="ribbon"
        />
      </div>
      <div class="row__item id">{{ character.id }}</div>
      <div class="row__item name">{{ character.name }}</div>
      <div class="row__item gender">
        <GenderIcon :gender="character.gender" class="icon" />
        {{ character.gender }}
      </div>
      <div class="row__item species">{{ character.species }}</div>
      <div class="row__item last-episode">
        {{ character.lastEpisode }}
      </div>
      <div class="row__item favorites">
        <button
          class="star"
          :class="{ favorite: character.isFavorite }"
          @click="toggleFavorite(character.id)"
        >
          <StarIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarIcon from "./icons/StarIcon.vue";
import GenderIcon from "./icons/GenderIcon.vue";
import RibbonIcon from "@/components/icons/RibbonIcon.vue";
import type Character from "@/types/Character";

interface CharacterProp extends Character {
  isFavorite: boolean;
}

defineProps<{
  character: CharacterProp;
}>();

const emits = defineEmits(["toggleFavorite"]);

const toggleFavorite = (id: number) => {
  emits("toggleFavorite", id);
};
</script>

<style scoped lang="scss">
@import "@/styles/table-row";
</style>
