import Vue from 'vue'
import store from './store'
import app from './components/app'
import './scss/global.scss'

new Vue({
  components: { app },
  store: store,
  el: '#app',
  template: '<app />',
})

