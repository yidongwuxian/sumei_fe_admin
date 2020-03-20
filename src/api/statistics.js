<<<<<<< HEAD
import request from '@/utils/request.js';

//----------------------------------------------------------数据统计-----------------------------------------------------
//数据统计列表
export function statiList(params) {
  return request({
    url:'/statistics',
    method:'get', 
    params:params
  })
=======
import request from '@/utils/request.js';

//----------------------------------------------------------数据统计-----------------------------------------------------
//数据统计列表
export function statiList(params) {
  return request({
    url:'/statistics',
    method:'get', 
    params:params
  })
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}