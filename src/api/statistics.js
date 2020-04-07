import request from '@/utils/request.js';

//----------------------------------------------------------数据统计-----------------------------------------------------
//数据统计列表
export function statiList(params) {
  return request({
    url:'/statistics',
    method:'get', 
    params:params
  })
}