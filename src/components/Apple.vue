<script setup lang="ts">
import { computed, ref } from 'vue'
import { scaleNumToRange } from '../composables/useUtils'

const props = defineProps({
  x: { // center pos
    type: Number,
    required: true,
  },
  y: { // center pos
    type: Number,
    required: true,
  },
  r: { // radius
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  maxR: {
    type: Number,
    required: true,
  }
})

// current vals
const cR = ref(props.r)
const cX = computed(() => props.x - cR.value)
const cY = computed(() => props.y - cR.value)

const color = computed(() => {
  const scaledR = scaleNumToRange(cR.value, 10, props.maxR, 0, 1)
  const green = Math.min(2 - (2 * scaledR), 1) * 255;
  const red = Math.min(2 * scaledR, 1) * 255;
  return `rgb(${red}, ${green}, 0)`
})

let start : undefined | number
let previousTimeStamp : undefined | number
let done = false

function step(timestamp: number) {
  // first loop
  if (start === undefined) {
    start = timestamp
  }

  // calc time elapsed since last frame
  const elapsed = timestamp - start

  // increase radius until it is max size
  if (previousTimeStamp !== timestamp) {
    cR.value = Math.min(cR.value + ((1 / props.speed) * elapsed), props.maxR)
    if (cR.value >= props.maxR) done = true
  }

  // if not full size yet, do another anim step
  if (cR.value <= props.maxR) {
    previousTimeStamp = timestamp
    if (!done) {
      window.requestAnimationFrame(step)
    }
  }
}

window.requestAnimationFrame(step)

</script>

<template>
  <div class="apple"></div>
</template>


<style scoped>
.apple {
  width: v-bind(cR * 2 + 'px');
  height: v-bind(cR * 2 + 'px');
  border-radius: 50%;
  position: absolute;
  top: v-bind(cY + 'px');
  left: v-bind(cX + 'px');
  background: v-bind(color);
}

</style>
