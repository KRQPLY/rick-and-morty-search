<template>
  <img
    src="@/assets/gender-male-svg.svg"
    alt="Male"
    class="icon-color-cadet-blue"
    v-if="gender.toLowerCase() === 'male'"
  />
  <img
    src="@/assets/gender-female-svg.svg"
    alt="Female"
    class="icon-color-cadet-blue"
    v-else-if="gender.toLowerCase() === 'female'"
  />
  <img
    src="@/assets/gender-unknown-svg.svg"
    alt="unknown"
    class="icon-color-cadet-blue"
    v-else
  />
</template>

<script setup lang="ts">
defineProps<{ gender: string }>();
</script>

<style scoped lang="scss"></style>
