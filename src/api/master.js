import request from '@/utils/request.js';

//----------------------------------------------------------分总站管理-----------------------------------------------------
//分站列表
export function masList(params) {
  return request({
    url:'/sites',
    method:'get', 
    params:params
  })
}
//新增分站
export function addMasList(params) {
  return request({
    url:'/sites',
    method:'post',
    params:params
  })
}
//分站详情(编辑分站的数据展示)
export function editMasView(id,params) {
  return request({
    url:'/sites/'+id,
    method:'get',
    params:params
  })
}
//编辑分站
export function editMasList(id,params) {
  return request({
    url:'/sites/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个分站
export function delMasList(id,params) {
  return request({
    url:'/sites/'+id,
    method:'delete',
    params:params
  })
}
