// Стили оформления EasyUI
import '@/assets/basalta/easyui.css';
import '@/assets/icon.css';
import '@/assets/vue.css';

import Vue from 'vue'
// import Vue from 'vue/dist/vue.js'
import App from './App.vue'

// Функционал EasyUI
import EasyUI from 'vx-easyui';
// Пакет русификации
import locale from '@/assets/easyui-lang-ru'

// Подключаем импортированные компоненты
Vue.use(EasyUI, {
  locale: locale // ??
});

// Хранилище данных приложения
import store from '@/store/index.js';

Vue.config.productionTip = false;

Vue.config.devtools = true;

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
