/* eslint-disable */

// ./app/javascript/packs/vue_adapter.js

// import Vue
import Vue from 'vue/dist/vue.esm.js'

// import your components
import HelloVue from 'hello-vue'
import HelloVueInline from 'hello-vue-inline'

// register your components
Vue.component('hello-vue', HelloVue)
Vue.component('hello-vue-inline', HelloVueInline)

function VueConstructor () {
  let outlets = document.querySelectorAll('[data-vue-component-outlet]')
  outlets.forEach(function (outlet, index) {
    let id = outlet.getAttribute('data-vue-component-outlet')
    new Vue({
      el: '[data-vue-component-outlet=' + id + ']'
    })
  })
}

if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
  document.addEventListener('turbolinks:load', VueConstructor)
} else {
  document.addEventListener('DOMContentLoaded', VueConstructor)
}
