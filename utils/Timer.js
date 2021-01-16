export default class Timer {
  constructor(callback, delay, loop = true) {
    this.callback = callback
    this.delay = delay
    this.remaining = delay
    this.timerId = null
    this.loop = loop
  }

  static async wait(delay) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  start() {
    this.stop()
    this.resume()
  }

  stop() {
    this.pause()
    this.remaining = this.delay
  }

  pause() {
    if (!this.timerId) {
      return
    }
    clearTimeout(this.timerId)
    this.timerId = null
    this.remaining -= Date.now() - this.startTime // record remaining time
  }

  resume() {
    if (this.timerId) {
      return
    }
    this.startTime = Date.now()
    this.timerId = setTimeout(() => {
      this.callback()
      if (this.loop) {
        this.start()
      }
    }, this.remaining)
  }
}
