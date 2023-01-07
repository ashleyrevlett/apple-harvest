<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useUtils, scaleNumToRange } from '../composables/useUtils'

const { width, height } = useWindowSize()
const { randomNumberInRange } = useUtils()

const minR = 10
const maxR = 100
const r = ref(randomNumberInRange(minR, maxR))

const startingX = randomNumberInRange(r.value, width.value)
const startingY = randomNumberInRange(r.value, height.value)

const x = computed(() => startingX - (r.value / 2))
const y = computed(() => startingY - (r.value / 2))

const color = computed(() => {
  const scaledR = scaleNumToRange(r.value, 10, 100, 0, 1)
  const green = Math.min(2 - (2 * scaledR), 1) * 255;
  const red = Math.min(2 * scaledR, 1) * 255;
  return `rgb(${red}, ${green}, 0)`
})

let start : undefined | number
let previousTimeStamp : undefined | number
let done = false

function step(timestamp: number) {
  if (start === undefined) {
    start = timestamp;
    }
  const elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    r.value = Math.min(r.value + (0.0001 * elapsed), maxR)
    if (r.value >= maxR) done = true
  }

  if (r.value <= maxR) { // Stop the animation after 2 seconds
    previousTimeStamp = timestamp
    if (!done) {
      window.requestAnimationFrame(step)
    }
  }
}

window.requestAnimationFrame(step)

// const color = computed(() => {
//   // const scaledR = scaleNumToRange(r, 10, 100, 0, 130)
//   const hue =  scaleNumToRange(r, 10, 100, 0, 130)
//   const sat = scaleNumToRange(r, 10, 100, 50, 90)
//   return `hsl(${hue.toFixed()}, ${sat.toFixed()}%, 50%)`
// })

</script>

<template>
  <div class="apple"></div>
</template>


<style scoped>
.apple {
  width: v-bind(r + 'px');
  height: v-bind(r + 'px');
  border-radius: 50%;
  position: absolute;
  top: v-bind(y + 'px');
  left: v-bind(x + 'px');
  background: v-bind(color);
}

</style>
