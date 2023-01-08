<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

const props = defineProps({
  r: { // radius
    type: Number,
    required: true,
  },
})

const x = ref(props.r)
const y = ref(height.value - props.r)
const dir = ref('R')
const pigSpeed = .2

const emit = defineEmits<{
  (e: 'move', x: number, y: number): void,
}>()

// anim vars
let start : undefined | number
let previousTimeStamp : undefined | number
const maxX = width.value - props.r
const minX = props.r
function step(timestamp: number) {
  // first loop
  if (start === undefined) {
    start = timestamp
    previousTimeStamp = timestamp
  }

  // move pig
  if (previousTimeStamp && previousTimeStamp !== timestamp) {
    const elapsed = timestamp - previousTimeStamp

    if (dir.value == 'R') {
      x.value = x.value + (pigSpeed * elapsed)
    } else {
      x.value = x.value - (pigSpeed * elapsed)
    }

    if (x.value >= maxX) {
      dir.value = 'L'
    } else if (x.value <= minX) {
      dir.value = 'R'
    }

    // tell game we moved so it can check for collisions
    emit('move', x.value - props.r, y.value - props.r)
  }

  previousTimeStamp = timestamp
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)

</script>

<template>
  <div class="pig"></div>
</template>


<style scoped>
.pig {
  width: v-bind(r * 2 + 'px');
  height: v-bind(r * 2 + 'px');
  border-radius: 50%;
  position: absolute;
  top: v-bind(y - r + 'px');
  left: v-bind(x - r + 'px');
  background-color: pink;
  outline: 2px solid #3A9F21;
  z-index: 0;
}

</style>
