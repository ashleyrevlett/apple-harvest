<script setup lang="ts">
import { ref, Ref } from 'vue'
import Apple from '../components/Apple.vue'
import Pig from '../components/Pig.vue'
import { useWindowSize } from '@vueuse/core'
import { useUtils } from '../composables/useUtils'

const { randomNumberInRange } = useUtils()
const { width, height } = useWindowSize()

const minR = Math.floor(width.value / 100)
const maxR = Math.floor(width.value / 25)
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
  if (idx > -1) {
    const oldID = apples.value[idx].id
    const coords = oldID.split('-')
    const newApple = createApple(parseInt(coords[0]), parseInt(coords[1]), parseInt(coords[2])+1)
    apples.value = apples.value.filter((a) => a.id != oldID)
    apples.value.splice(idx, 0, newApple)
  }
}

function detectCircleCollision(x1: number, y1: number, r1: number, x2:number, y2:number, r2:number) {
  const dx = x1 - x2
  const dy = y1 - y2
  const distance = Math.sqrt(dx * dx + dy * dy)
  const colliding = distance < r1 + r2
  return colliding
}

const appleRefs = ref<HTMLElement[]>([])
const itemRefs : Ref<InstanceType<typeof Apple>[]> = ref([])
// const skipUnwrap = { itemRefs }

const pigR = ref(maxR * 2)
let times = 0
function movePig(x: number, y: number) {
  itemRefs.value.forEach((a) => {
    // const div = a.el
    // console.log(a, a.value, typeof a)
    // var rect = a.el.getBoundingClientRect()
    // console.log(rect.top, rect.right, rect.bottom, rect.left)
    if (detectCircleCollision(a.cX, a.cY, a.cR, x, y, pigR.value)) {
      console.log(a.cX, a.cY, a.cR, a)
      console.log("Collision", a)
      a.pick()
    }
  })
}

</script>

<template>
  <section>
    <Apple
      v-for="a in apples"
      ref="itemRefs"
      @pick="pickApple"
      :id="a.id"
      :x="a.x"
      :y="a.y"
      :r="a.r"
      :speed="a.speed"
      :maxR="maxR"
      :key="a.id"
    />
    <Pig :r="pigR" @move="movePig" />
  </section>
</template>


<style scoped>
section {
  background: #3A9F21;
  width: 100vw;
  height: 100vh;
}
</style>
