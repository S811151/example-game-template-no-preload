import { Howl } from 'howler'

function waitLoad(sound) {
  let resolveFn
  const promise = new Promise((resolve) => {
    resolveFn = resolve
  })
  function onceLoad() {
    sound.off('load')
    sound.off('loaderror')
    resolveFn()
  }
  sound.once('load', onceLoad)
  sound.once('loaderror', onceLoad)
  if (sound.state() === 'loaded') {
    // fix sound already loaded when hot reload
    resolveFn()
  }
  return promise
}

export default {
  namespaced: true,
  state: {
    pool: new Map(),
    bgm: null,
    willPlay: new Set(),
    willStop: new Set(),
  },
  mutations: {
    addPool(state, { src, sound }) {
      state.pool.set(src, sound)
    },
    setBgm(state, { bgm }) {
      state.bgm = bgm
    },
    clearBgm(state) {
      state.bgm = null
    },
  },
  actions: {
    async preload({ commit, dispatch, state: { pool } }, { src, skipError }) {
      const soundPath = await dispatch('getResPath', {
        src, type: 'sounds', skipError,
      }, { root: true })
      if (soundPath) {
        let preSound = pool.get(src)
        if (preSound && preSound._src !== soundPath) {
          preSound.stop()
          preSound = null
        }
        if (!preSound) {
          const sound = new Howl({ html5: true, src: soundPath }) // force use html5 audio to avoid pitch change when change rate
          commit('addPool', { src, sound })
          return waitLoad(sound)
        }
      }
    },
    async play({ dispatch, state: { pool, willPlay, willStop } }, {
      src, volume = 1, speed = 1, loop = false, reset = true,
    }) {
      if (!pool.get(src)) {
        await dispatch('preload', { src })
      }
      const sound = pool.get(src)
      if (!sound) {
        return false
      }

      sound.loop(loop)
      sound.volume(volume)
      sound.rate(speed) // in html5 audio, change rate will also chage pitch

      if (willStop.has(src)) {
        willStop.delete(src)
      }

      if (willPlay.has(src)) {
        return true
      }

      // NOTE: because of the bug of howler, `seek` will cause `stop` don't work
      if (reset) {
        sound.stop() // stop sound before seek
        sound.seek(0)
      }
      if (!sound.playing()) {
        willPlay.add(src)
        sound.play()
        sound.once('play', () => {
          willPlay.delete(src)
          if (willStop.has(src)) {
            sound.stop()
          }
        })
      }
      return true
    },
    stop({ state: { pool, willPlay, willStop } }, { src }) {
      if (willPlay.has(src)) {
        willStop.add(src)
        return
      }
      const sound = pool.get(src)
      sound && sound.stop()
    },
    stopAll({ state: { bgm, pool } }) {
      for (const [src, sound] of pool.entries()) {
        if (src !== bgm) {
          sound.stop()
        }
      }
    },
    async playBgm({ state: { bgm }, dispatch, commit }, {
      src, loop = true, reset = false, ...rest
    }) {
      if (src !== bgm) {
        dispatch('stop', { src: bgm })
      }
      commit('setBgm', { bgm: src })
      if (!await dispatch('play', { src, loop, reset, ...rest })) {
        commit('clearBgm')
      }
    },
    stopBgm({ state: { bgm }, dispatch, commit }) {
      dispatch('stop', { src: bgm })
      commit('clearBgm')
    },
  },
}
