<script setup lang="ts">
// import { computed } from 'vue'
import Apple from '../components/Apple.vue'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

const maxCol = width.value / 200
const maxRow = height.value / 200
const totalApple = Math.floor(maxCol * maxRow)

</script>

<template>
  <section>
    <Apple v-for="idx in totalApple" :key="idx" />
  </section>
</template>


<style scoped>
section {
  background: green;
}
</style>
