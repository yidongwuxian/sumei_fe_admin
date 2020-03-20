import request from '@/utils/request'
//登入
export function login(name, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      name,
      password
    }
  })
}
//左侧菜单栏
export function getInfo(params) {
  return request({
    url:'/menus',
    method:'get',
    params:params
  })
}
//登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
