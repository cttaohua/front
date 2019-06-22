import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

// 样式引入
import 'ant-design-vue/dist/antd.css'
import 'highlight.js/styles/atom-one-light.css' //样式文件

Vue.use(Antd)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
