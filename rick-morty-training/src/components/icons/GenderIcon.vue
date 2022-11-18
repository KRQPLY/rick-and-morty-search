<template>
  <img
    :src="`./src/assets/gender-${gender.toLowerCase()}-svg.svg`"
    :alt="gender"
    class="icon-color-cadet-blue"
  />
</template>

<script setup lang="ts">
defineProps<{ gender: "Male" | "Female" | "unknown" }>();
</script>

<style scoped lang="scss"></style>
