<template>
  <img
    src="@/assets/gender-male-svg.svg"
    :alt="gender"
    class="icon-color-cadet-blue"
    v-if="propsName === 'male'"
  />
  <img
    src="@/assets/gender-female-svg.svg"
    :alt="gender"
    class="icon-color-cadet-blue"
    v-else-if="propsName === 'female'"
  />
  <img
    src="@/assets/gender-unknown-svg.svg"
    :alt="gender"
    class="icon-color-cadet-blue"
    v-else
  />
</template>

<script setup lang="ts">
const props = defineProps<{ gender: "Male" | "Female" | "unknown" }>();

const propsName = props.gender.toLowerCase();
</script>

<style scoped lang="scss"></style>
