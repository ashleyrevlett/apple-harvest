<script setup lang="ts">
import { ref, Ref } from 'vue'
import Apple from '../components/Apple.vue'
import { useWindowSize } from '@vueuse/core'
import { useUtils } from '../composables/useUtils'

const { randomNumberInRange } = useUtils()
const { width, height } = useWindowSize()

const minR = Math.floor(width.value / 80)
const maxR = Math.floor(width.value / 20)
const cellWidth = (maxR * 2)
const maxCol = width.value / cellWidth / 2
const maxRow = (height.value - maxR) / cellWidth / 2

interface AppleType {
  id: string,
  r: number,
  x: number,
  y: number,
  speed: number,
}

const apples : Ref<AppleType[]> = ref([])
for (let row = 1; row <= maxRow; row++) {
  for (let col = 1; col <= maxCol; col++) {
    const a = createApple(col, row, 0)
    apples.value.push(a)
  }
}

function createApple(col: number, row: number, generation: number) {
  const r = randomNumberInRange(minR, maxR)
  const speed = randomNumberInRange(1000, 10000)
  let minX = maxR
  let maxX = maxR
  let minY = maxR
  let maxY = maxR
  if (col > 1) {
    const prevColAppleID = `${(col - 1)}-${row}`
    const a = apples.value.find((a) => a.id.startsWith(prevColAppleID))
    if (a) {
      minX = a.x + (maxR * 2)
      maxX = col * 2 * maxR * 2
    }
  }
  if (row > 1) {
    const prevRowAppleID = `${col}-${(row - 1)}`
    const a = apples.value.find((a) => a.id.startsWith(prevRowAppleID))
    if (a) {
      minY = a.y + (maxR * 2)
      maxY = row * 2 * maxR * 2
    }
  }

  const x = randomNumberInRange(minX, maxX)
  const y = randomNumberInRange(minY, maxY)
  const a = {
    id: `${col}-${row}-${generation}`,
    x: x,
    y: y,
    r: r,
    speed: speed
  }
  return a
}

function pickApple(id: string) {
  // remove and replace picked apple
  const idx = apples.value.findIndex((a) => a.id == id)
  console.log(id, idx)
  if (idx > -1) {
    const oldID = apples.value[idx].id
    const coords = oldID.split('-')
    const newApple = createApple(parseInt(coords[0]), parseInt(coords[1]), parseInt(coords[2])+1)
    console.log("nwe:", newApple)
    apples.value = apples.value.filter((a) => a.id != oldID)
    apples.value.splice(idx, 0, newApple)
  }
}

</script>

<template>
  <section>
    <Apple
      v-for="a in apples"
      @pick="pickApple"
      :id="a.id"
      :x="a.x"
      :y="a.y"
      :r="a.r"
      :speed="a.speed"
      :maxR="maxR"
      :key="a.id" />
  </section>
</template>


<style scoped>
section {
  background: #3A9F21;
  width: 100vw;
  height: 100vh;
}
</style>
