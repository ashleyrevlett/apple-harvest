<script setup lang="ts">
// import { computed } from 'vue'
import Apple from '../components/Apple.vue'
import { useWindowSize } from '@vueuse/core'
import { useUtils, scaleNumToRange } from '../composables/useUtils'

const { randomNumberInRange } = useUtils()
const { width, height } = useWindowSize()

const minR = 10
const maxR = 60
const maxCol = width.value / (maxR * 2) / 2
const maxRow = height.value / (maxR * 2) / 2
const totalApple = Math.floor(maxCol * maxRow)

interface AppleType {
  id: string,
  r: number,
  x: number,
  y: number,
  speed: number,
}

let lastX = maxR
const apples : AppleType[] = []
for (let row = 1; row <= maxRow; row++) {
  for (let col = 1; col <= maxCol; col++) {
    const r = randomNumberInRange(minR, maxR)
    const speed = randomNumberInRange(800, 12000)
    let minX = maxR
    let maxX = maxR
    let minY = maxR
    let maxY = maxR
    if (col > 1) {
      const prevColAppleID = `${row}-${(col - 1)}`
      const a = apples.find((a) => a.id == prevColAppleID)
      if (a) {
        minX = a.x + (maxR * 2)
        maxX = col * 2 * maxR * 2
      }
    }
    if (row > 1) {
      const prevRowAppleID = `${(row - 1)}-${col}`
      const a = apples.find((a) => a.id == prevRowAppleID)
      if (a) {
        minY = a.y + (maxR * 2)
        maxY = row * 2 * maxR * 2
      }
    }

    const x = randomNumberInRange(minX, maxX)
    const y = randomNumberInRange(minY, maxY)
    const a = {
      id: `${row}-${col}`,
      x: x,
      y: y,
      r: r,
      speed: speed
    }
    apples.push(a)
  }
}

</script>

<template>
  <section>
    <Apple v-for="a in apples" :x="a.x" :y="a.y" :r="a.r" :speed="a.speed" :maxR="maxR" :key="a.id" />
  </section>
</template>


<style scoped>
section {
  background: #37A72D;
  width: 100vw;
  height: 100vh;
}
</style>
