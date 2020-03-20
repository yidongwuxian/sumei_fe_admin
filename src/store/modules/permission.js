import { constantRouterMap } from '@/router'
import store from '@/store'
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param 
 * @param routesMap
 */
function initMenu(routesMap){
  let vTempArr = [];
  let vRoles  = routesMap;
  let vRoutes = constantRouterMap; 

 
  let tempRoute = vRoutes;

  const temp = {}
  vRoles.forEach(v => {
    if (!v.id) return
    temp[v.id] = v
    if (!v.all_children || !v.all_children.length) return
    v.all_children.forEach(va => temp[va.id] = va)
  })

  for (let i = 0, l = tempRoute.length; i < l; i++) {
    const v = tempRoute[i]
    if (!v) break

    if (temp[v.id]) {
      const tmp = v.children
      if (!tmp || !tmp.length) continue

      let childHit = false
      for (let j = 0, len = tmp.length; j < len; j++) {
        const va = tmp[j]
        if (!va) break
        if (!temp[va.id]) {
          tmp.splice(j, 1)
        } else { 
          childHit = true
        }
      }

      if (!childHit) {
        tempRoute.splice(i, 1)
        i -= 1
      }
    } else {
      tempRoute.splice(i, 1)
      i -= 1
    }
  }

  vTempArr = tempRoute
   
  //如果左侧菜单为空数组
  if(vRoles.length == 0){
    vTempArr = this.$router.options.routes;
  }
  return vTempArr;
}



const SET_ROUTERS = 'SET_ROUTERS'

const permission = {
  state: {
    addRouters: '',
    routers: constantRouterMap
  },
  mutations: {
    [SET_ROUTERS](state, routers) {
      state.addRouters = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, apiRouters) {
      return new Promise((resolve, reject) => {
        let accessedRouters = initMenu(apiRouters)
        commit(SET_ROUTERS, accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
