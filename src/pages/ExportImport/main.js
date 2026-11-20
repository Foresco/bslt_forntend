// Стили оформления EasyUI
import '@/assets/basalta/easyui.css';
import '@/assets/icon.css';
import '@/assets/vue.css';

import Vue from 'vue'
import App from './App.vue'

// Функционал EasyUI
import EasyUI from 'vx-easyui';
// Пакет русификации
import locale from '@/assets/easyui-lang-ru'

// Подключаем импортированные компоненты
Vue.use(EasyUI, {
  locale: locale // ??
});

Vue.config.productionTip = false; // ??

Vue.config.devtools = true; // Возможность просмотра свойств VUE в браузере

// Хранилище данных приложения
import store from '@/store/index.js';

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
