import Vue from 'vue'
import '../scss/scene.scss'

export default Vue.component('button-counter', {
  name: 'Scene',
  props: {
    message: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default() {
        return []
      },
    },
    image: {
      type: String,
      default: null,
    },
    imagePercent: {
      type: Number,
      default: 0.3,
    },
    imageLoc: {
      type: String,
      default: 'right',
    },
    imageAlign: {
      type: String,
      default: 'left',
    },
  },
  computed: {
    flexDirection() {
      switch (this.imageLoc) {
        case 'top':
          return 'column-reverse'
        case 'bottom':
          return 'column'
        case 'left':
          return 'row-reverse'
        default:
          return null
      }
    },
    imageStyle() {
      const objectPosition = this.imageAlign
      const cssPercent = `${this.imagePercent * 100}%`
      if (['top', 'bottom'].includes(this.imageLoc)) {
        return { height: cssPercent, objectPosition }
      } else {
        return { width: cssPercent, objectPosition }
      }
    },
  },
  template: `
    <div class="sceneRoot">
      <div
        class="content"
        :style="{ flexDirection }"
      >
        <div
          class="message"
          v-text="message"
        />
        <img
          v-if="image"
          class="image"
          :src="image"
          :style="imageStyle"
        >
      </div>
      <div class="optionWrapper">
        <div
          v-for="({ text, onClick }, key) of options"
          :key="key"
          class="option"
          @click="$emit('option', { text, onClick })"
          v-text="text"
        />
      </div>
    </div>
    `,
})
