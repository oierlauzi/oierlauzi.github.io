import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

import router from './router'
import store from './store'
import './plugins/bootstrap-vue'

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
