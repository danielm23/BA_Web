// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/de'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import mapboxgl from 'mapbox-gl';
//import Mapbox from 'mapbox-gl-vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.use(ElementUI, { locale })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  render: h => h(App)
});

