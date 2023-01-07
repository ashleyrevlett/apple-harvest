export function useUtils() {
  function randomNumberInRange(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  return { randomNumberInRange }
}

export function scaleNumToRange(num: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  // return price
  const oldRange = oldMax - oldMin
  const newRange = newMax - newMin
  const n = (((num - oldMin) * newRange) / oldRange) + newMin
  return n
}