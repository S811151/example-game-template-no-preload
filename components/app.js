import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import scene from './scene'
import { init, scenes } from '../gameData'
import {
  doAction,
  getModifyData,
  handleOnEnter,
  setResetFn,
} from '../utils/game'
import '../scss/app.scss'

export default Vue.component('app', {
  components: {
    scene,
  },
  computed: {
    ...mapState(['errorMsg']),
    ...mapState('game', [
      'curSceneName',
      'message',
      'options',
      'textColor',
      'bgColor',
    ]),
    ...mapState('image', [
      'imagePath',
      'imagePercent',
      'imageLoc',
      'imageAlign',
    ]),
    ...mapGetters('game', ['curScene']),
  },
  async mounted() {
    this.$store.commit('clearErrorMsg')
    setResetFn(init)
    const scenesNames = scenes.map(({ name }) => name)
    const duplicateName = scenesNames.find(
      (name, idx) => scenesNames.indexOf(name) !== idx
    )
    if (duplicateName) {
      this.$store.commit('setErrorMsg', {
        text: `ERROR: Scene "${duplicateName}" is duplicate`,
      })
    }

    this.$store.commit('game/setScenes', { scenes })
    if (this.curScene) {
      this.$store.commit('game/initData', {
        data: {
          ...getModifyData(init),
          ...this.$store.state.game.data,
        },
      })
      // handle curScene change by hot reload
      handleOnEnter(this.curScene)
    } else {
      // only init game if game has not been init
      init(this.game)
    }
  },
  methods: {
    onOption({ text, onClick }) {
      if (!onClick) {
        this.$store.commit('setErrorMsg', {
          text: `ERROR: Option "${text}" has no "onClick" function`,
        })
        return
      }
      doAction(onClick)
    },
  },
  template: `
  <div
    class="appRoot"
    :style="{ color: textColor, backgroundColor: bgColor }"
  >
    <div
      v-if="errorMsg"
      class="errorMsg"
      v-text="errorMsg"
    />
    <transition
      v-if="curScene"
      name="slide-fade"
      mode="out-in"
    >
      <scene
        :key="curScene.name + '_' + Date.now()"
        class="scene"
        :message="message"
        :options="options"
        :image="imagePath"
        :image-percent="imagePercent"
        :image-loc="imageLoc"
        :image-align="imageAlign"
        @option="onOption"
      />
    </transition>
    <div
      v-else
      class="loading"
    >
      Loading...
    </div>
  </div>
  `,
})
