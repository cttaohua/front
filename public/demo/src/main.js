import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

// 样式引入
import 'ant-design-vue/dist/antd.css'
import 'highlight.js/styles/atom-one-light.css' //样式文件

// 全局组件
import IconSymbol from './components/IconSymbol'
import CodeArea from './components/CodeArea'

Vue.use(Antd)

Vue.component('icon', IconSymbol)
Vue.component('codeArea', CodeArea)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
