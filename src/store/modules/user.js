import { login, logout, getInfo } from '@/api/login'
import { resetPwd } from '@/api/system'
import { getToken, setToken, removeToken, setUserName, removeUserName, setRoles,removeRoles } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    auth: false,
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      state.auth  = true;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.name.trim();
      const password = userInfo.password.trim();
      
      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          const tokenStr = response.token_type+" "+response.access_token;
          setToken(tokenStr);
          commit('SET_TOKEN', tokenStr)
          //username
          const nameStr = response.user_name;
          setUserName(nameStr)
          commit('SET_NAME', nameStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    //修改密码
    ResetPwd({ commit }, state) {
        return new Promise((resolve, reject) => {
            resetPwd(state).then(response => {
            const tokenStr = response.token_type+" "+response.access_token;
            setToken(tokenStr);
            commit('SET_TOKEN', tokenStr)
            //username
            const nameStr = response.user_name;
            setUserName(nameStr)
            commit('SET_NAME', nameStr)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
    },

    // 获取用户信息
     // 获取用户信息
     GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo({}).then(response => {
          setRoles(response);
          commit('SET_ROLES', response)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_NAME', '')
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ROUTERS', [])
          removeUserName()
          removeToken()
          removeRoles()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_NAME', '')
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ROUTERS', [])
          removeUserName()
          removeToken()
          removeRoles()
          resolve()
        }).catch(error => {
          reject(error)
        })
      }) 
    }
  }
}  

export default user
