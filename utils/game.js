import Vue from 'vue'
import store from '../store/index'
import { setWindowTitle } from './dom'

function hasProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

let modifyData = {}
let buffMode = false

export function getModifyData(fn) {
  modifyData = {}
  buffMode = true
  try {
    fn()
  } finally {
    buffMode = false
  }
  return modifyData
}

const $data = new Proxy(
  {},
  {
    get(_obj, prop) {
      const { data } = store.state.game
      if (!hasProperty(data, prop)) {
        store.commit('setErrorMsg', {
          text: `ERROR: "$data.${prop}" is not init`,
        })
      }
      return data[prop]
    },
    set(_obj, prop, value) {
      if (buffMode) {
        modifyData[prop] = value
      } else {
        Vue.set(store.state.game.data, prop, value)
      }
      return true
    },
  }
)

function parsePayload(payload) {
  let { src, ...rest } = payload
  if (typeof payload === 'string') {
    src = payload
  }
  return { src, ...rest }
}

let resetFn = null

export function setResetFn(fn) {
  resetFn = fn
}

const game = {
  setWindowTitle,
  setMessage(message) {
    store.commit('game/setMessage', { message })
  },
  writeMessage(message) {
    store.commit('game/writeMessage', { message })
  },
  clearMessage() {
    store.commit('game/clearMessage')
  },
  setOptions(options) {
    store.commit('game/setOptions', { options })
  },
  addOption(option) {
    store.commit('game/addOption', { option })
  },
  clearOptions() {
    store.commit('game/clearOptions')
  },
  gotoScene(sceneName) {
    if (store.getters['game/hasScene'](sceneName)) {
      store.commit('game/setCurSceneName', { sceneName })
      handleOnEnter(store.getters['game/curScene'])
    } else {
      store.commit('setErrorMsg', {
        text: `ERROR: scene "${sceneName}" not exist`,
      })
    }
  },
  reloadScene() {
    handleOnEnter(store.getters['game/curScene'])
  },
  async playSound(payload) {
    store.dispatch('sound/play', parsePayload(payload))
  },
  stopSound(src) {
    store.dispatch('sound/stop', { src })
  },
  stopAllSounds() {
    store.dispatch('sound/stopAll')
  },
  async playBgm(payload) {
    store.dispatch('sound/playBgm', parsePayload(payload))
  },
  stopBgm() {
    store.dispatch('sound/stopBgm')
  },
  initData(data) {
    store.commit('game/initData', { data })
  },
  setData(prop, value) {
    Vue.set(store.state.game.data, prop, value)
  },
  setTextColor(color) {
    store.commit('game/setTextColor', { color })
  },
  setBgColor(color) {
    store.commit('game/setBgColor', { color })
  },
  async setImage(payload) {
    store.dispatch('image/setImage', parsePayload(payload))
  },
  clearImage() {
    store.commit('image/clearImage')
  },
  get hasSave() {
    return !!store.state.savedGame
  },
  saveGame() {
    store.dispatch('saveGame')
  },
  startAutoSave() {
    store.commit('setAutoSave', { enable: true })
  },
  stopAutoSave() {
    store.commit('setAutoSave', { enable: false })
  },
  async clearSave() {
    if (store.state.autoSave) {
      // NOTE: need to wait, or `autoSave` will tirgger after function cause `clearSave` useless
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    store.dispatch('clearSave')
  },
  loadSave() {
    if (game.hasSave) {
      store.dispatch('loadGame')
      handleOnEnter(store.getters['game/curScene'])
    }
  },
  resetGame() {
    store.dispatch('resetGame')
    resetFn && resetFn()
  },
}
Object.freeze(game)

function emptyFn() {}

const $game = new Proxy(
  {},
  {
    get(_obj, prop) {
      if (!hasProperty(game, prop)) {
        store.commit('setErrorMsg', {
          text: `ERROR: Unknown method "$game.${prop}"`,
        })
      }
      return buffMode && typeof game[prop] === 'function' ? emptyFn : game[prop]
    },
  }
)

export { $data, $game }

export function doAction(fn) {
  try {
    fn()
  } catch (e) {
    store.commit('setErrorMsg', { text: `ERROR: ${e.message}` })
    return false
  }
  return true
}

export function handleOnEnter({ name, onEnter }) {
  if (!onEnter) {
    store.commit('setErrorMsg', {
      text: `ERROR: Scene "${name}" has no "onEnter" function`,
    })
    return
  }
  store.commit('game/clearMessage')
  store.commit('game/clearOptions')
  store.commit('image/clearImage')
  return doAction(onEnter)
}
