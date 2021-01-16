export default {
  namespaced: true,
  state: {
    title: '',
    message: '',
    options: [],
    curSceneName: null,
    scenes: [],
    data: {},
    textColor: 'black',
    bgColor: 'white',
  },
  getters: {
    curScene({ curSceneName, scenes }) {
      return scenes.find(({ name }) => name === curSceneName)
    },
    hasScene({ scenes }) {
      return sceneName => scenes.some(({ name }) => name === sceneName)
    },
  },
  mutations: {
    setTitle(state, { title }) {
      state.title = title
    },
    setTextColor(state, { color }) {
      state.textColor = color
    },
    setBgColor(state, { color }) {
      state.bgColor = color
    },
    initData(state, { data }) {
      state.data = data
    },
    setMessage(state, { message }) {
      state.message = '' // force trigger message update
      state.message = message
    },
    writeMessage(state, { message }) {
      state.message += message
    },
    clearMessage(state) {
      state.message = ''
    },
    setOptions(state, { options }) {
      state.options = options
    },
    addOption(state, { option }) {
      state.options.push(option)
    },
    clearOptions(state) {
      state.options = []
    },
    setScenes(state, { scenes }) {
      state.scenes = scenes
    },
    addScene(state, { scene }) {
      state.scenes.push(scene)
    },
    removeScene(state, { sceneName }) {
      const idx = state.scenes.findIndex(({ name }) => name === sceneName)
      if (idx !== -1) {
        state.scenes.splice(idx, 1)
      }
    },
    setCurSceneName(state, { sceneName }) {
      state.curSceneName = sceneName
    },
  },
}
