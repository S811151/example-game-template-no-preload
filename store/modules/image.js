export default {
  namespaced: true,
  state: {
    pool: new Map(),
    imagePath: null,
    imagePercent: 0.3,
    imageLoc: 'right',
    imageAlign: 'left',
  },
  mutations: {
    addPool(state, { src, imagePath }) {
      state.pool.set(src, imagePath)
    },
    setImage(state, { imagePath, percent = 0.5, loc = 'top', align = 'left' }) {
      state.imagePath = imagePath
      state.imagePercent = percent
      state.imageLoc = loc
      state.imageAlign = align
    },
    clearImage(state) {
      state.imagePath = null
    },
  },
  actions: {
    async preload({ dispatch, commit, state: { pool } }, { src, skipError }) {
      const imagePath = await dispatch('getResPath', {
        src, type: 'images', skipError,
      }, { root: true })

      if (imagePath && pool.get(src) !== imagePath) {
        let resolveFn
        const promise = new Promise(resolve => { resolveFn = resolve })
        const image = new Image()
        image.onload = resolveFn
        image.onerror = resolveFn
        image.src = imagePath
        await promise
        commit('addPool', { src, imagePath })
      }
    },
    async setImage({ dispatch, commit, state: { pool } }, { src, ...rest }) {
      if (!pool.has(src)) {
        await dispatch('preload', { src })
      }
      const imagePath = pool.get(src)
      if (!imagePath) {
        return
      }
      commit('setImage', { imagePath, ...rest })
    },
  },
}
