import Vue from 'vue'
import Vuex from 'vuex'
import game from './modules/game'
import image from './modules/image'
import sound from './modules/sound'

const GAME_SAVE_KEY = 'optiorGameSave'

Vue.use(Vuex)

function parseSave() {
  try {
    const rawStr = localStorage.getItem(GAME_SAVE_KEY)
    if (!rawStr) {
      return null
    }
    return JSON.parse(rawStr)
  } catch {
    return null
  }
}

const store = new Vuex.Store({
  state: {
    errorMsg: '',
    autoSave: false,
    savedGame: parseSave(),
  },
  modules: {
    game,
    sound,
    image,
  },
  mutations: {
    setErrorMsg(state, { text }) {
      state.errorMsg = text
    },
    clearErrorMsg(state) {
      state.errorMsg = ''
    },
    setAutoSave(state, { enable }) {
      state.autoSave = enable
    },
    setSavedGame(state, { savedGame }) {
      state.savedGame = savedGame
    },
  },
  actions: {
    async getResPath({ commit }, { src, type, skipError = false }) {
      try {
        // return (await import(`../assets/${type}/${src}`)).default
      } catch {
        if (!skipError) {
          commit('setErrorMsg', {
            text: `ERROR: Can not find "assets/${type}/${src}"`,
          })
        }
        return null
      }
    },
    clearSave({ commit }) {
      commit('setSavedGame', { savedGame: null })
      try {
        localStorage.removeItem(GAME_SAVE_KEY)
      } catch {
        /* cannot access localStorage */
      }
    },
    saveGame({ commit, state: { autoSave, game, sound } }) {
      let bgm = null
      if (sound.bgm) {
        const bgmSound = sound.pool.get(sound.bgm)
        bgm = {
          src: sound.bgm,
          volume: bgmSound.volume(),
          loop: bgmSound.loop(),
        }
      }
      // NOTE: don't save option, message or images since they will reset when enter scene
      const savedGame = {
        sceneName: game.curSceneName,
        bgm,
        data: game.data,
        autoSave,
        textColor: game.textColor,
        bgColor: game.bgColor,
      }
      commit('setSavedGame', { savedGame })
      try {
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(savedGame))
      } catch {
        /* cannot access localStorage */
      }
    },
    loadGame({
      commit,
      dispatch,
      getters,
      state: {
        game,
        savedGame: { sceneName, bgm, data, autoSave, textColor, bgColor },
      },
    }) {
      if (bgm) {
        dispatch('sound/playBgm', bgm)
      } else {
        dispatch('sound/stopBgm')
      }
      commit('game/setTextColor', { color: textColor })
      commit('game/setBgColor', { color: bgColor })

      commit('game/initData', {
        data: {
          ...game.data, // prevent new props that not exist in old save file
          ...data,
        },
      })
      commit('setAutoSave', { enable: autoSave })
      if (getters['game/hasScene'](sceneName)) {
        commit('game/setCurSceneName', { sceneName })
      } else {
        store.commit('setErrorMsg', {
          text: `ERROR: scene "${sceneName}" not exist`,
        })
      }
    },
    resetGame({ commit, dispatch }) {
      dispatch('sound/stopBgm')
      dispatch('sound/stopAll')
      commit('game/clearMessage')
      commit('game/clearOptions')
      commit('image/clearImage')
      commit('game/setTextColor', { color: 'black' })
      commit('game/setBgColor', { color: 'white' })
      commit('game/initData', { data: {} })
      commit('game/setCurSceneName', { sceneName: null })
    },
  },
})
export default store

store.watch(
  ({ game, sound }) => [game.curSceneName, game.data, sound.bgm],
  () => {
    if (store.state.autoSave) {
      store.dispatch('saveGame')
    }
  },
  { deep: true }
)
