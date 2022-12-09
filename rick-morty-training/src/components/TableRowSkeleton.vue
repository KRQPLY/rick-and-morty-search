<template>
  <div class="row">
    <div class="row__container container-horizontal padding-horizontal py-2">
      <div class="row__item">
        <Skeleton width="43px" height="68px" />
      </div>
      <div class="row__item">
        <Skeleton width="80%" />
      </div>
      <div class="row__item">
        <Skeleton width="80%" />
      </div>
      <div class="row__item">
        <Skeleton width="80%" />
      </div>
      <div class="row__item">
        <Skeleton width="80%" />
      </div>
      <div class="row__item">
        <Skeleton width="80%" />
      </div>
      <div class="row__item">
        <Skeleton height="40px" width="40px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "vue-loading-skeleton";
import "vue-loading-skeleton/dist/style.css";
</script>

<style scoped lang="scss">
@import "@/styles/table-row";
</style>
