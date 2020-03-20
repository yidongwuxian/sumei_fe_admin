<<<<<<< HEAD
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/') {
      next('/login')
      NProgress.done()
    }
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { 
          // 拉取用户信息
          store.dispatch('GenerateRoutes', store.getters.roles ).then(() => {
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)  
            next({
              ...to,
              replace: true
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (to.path != '/login') {
      next('/login')
      NProgress.done()
    }
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})


router.afterEach(() => {
  NProgress.done() // 结束Progress
})
=======
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/') {
      next('/login')
      NProgress.done()
    }
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { 
          // 拉取用户信息
          store.dispatch('GenerateRoutes', store.getters.roles ).then(() => {
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)  
            next({
              ...to,
              replace: true
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (to.path != '/login') {
      next('/login')
      NProgress.done()
    }
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})


router.afterEach(() => {
  NProgress.done() // 结束Progress
})
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
