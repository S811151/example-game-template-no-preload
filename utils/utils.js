export function promisify(tar, eventName) {
  return new Promise(resolve => tar.addEventListener(eventName, resolve, { once: true }))
}

export function clamp(num, min = 0, max = 1) {
  return (num < min) ? min : (num > max) ? max : num
}
