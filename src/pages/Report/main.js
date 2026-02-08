import '@/assets/basalta/easyui.css';
import '@/assets/icon.css';
import '@/assets/vue.css';

import Vue from 'vue'
import App from './App.vue'

import EasyUI from 'vx-easyui';
// Пакет русификации
import locale from '@/assets/easyui-lang-ru'

Vue.use(EasyUI, {
  locale: locale
});

// Хранилище данных приложения
import store from '@/store/index.js';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
