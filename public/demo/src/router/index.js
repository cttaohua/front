import Vue from 'vue'
import Router from 'vue-router'

// 按需加载 提高性能
const impeldown = r => require.ensure([], () => r(require('@/views/impeldown/index')))
const iconeffect = r => require.ensure([], () => r(require('@/views/iconeffect/index')))


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/impeldown'
    },
    {
      path: '/impeldown',
      name: 'impeldown',
      component: impeldown
    },
    {
      path: '/iconeffect',
      name: 'iconeffect',
      component: iconeffect
    }
  ]
})
