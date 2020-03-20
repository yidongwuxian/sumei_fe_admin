<<<<<<< HEAD
import request from '@/utils/request.js';

//----------------------------------------------------------线索管理-----------------------------------------------------
//线索列表
export function clueList(params) {
  return request({
    url:'/clue',
    method:'get',
    params:params
  })
}
//线索状态更改

export function cluestatuschange(params) {
  return request({
    url:'/cluestatuschange',
    method:'post',
    params:params
  })
=======
import request from '@/utils/request.js';

//----------------------------------------------------------线索管理-----------------------------------------------------
//线索列表
export function clueList(params) {
  return request({
    url:'/clue',
    method:'get',
    params:params
  })
}
//线索状态更改

export function cluestatuschange(params) {
  return request({
    url:'/cluestatuschange',
    method:'post',
    params:params
  })
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}