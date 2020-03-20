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
}