import request from '@/utils/request.js';

//----------------------------------------------------------分站模板管理-----------------------------------------------------
//分站模板列表
export function siteTList(params) {
  return request({
    url:'/sitetemplates',
    method:'get',
    params:params
  })
}
//新增分站模板
export function addSiteTList(params) {
  return request({
    url:'/sitetemplates',
    method:'post',
    params:params
  })
}
//分站模板详情(编辑分站模板的数据展示)
export function editSiteTView(id,params) {
  return request({
    url:'/sitetemplates/'+id,
    method:'get',
    params:params
  })
}
//编辑分站模板
export function editSiteTList(id,params) {
  return request({
    url:'/sitetemplates/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个分站模板
export function delSiteTList(id,params) {
  return request({
    url:'/sitetemplates/'+id,
    method:'delete',
    params:params
  })
}
//----------------------------------------------------------服务模板管理-----------------------------------------------------
//服务模板列表
export function templateList(params) {
  return request({
    url:'/templates',
    method:'get',
    params:params
  })
}
//新增服务模板
export function addTempList(params) {
  return request({
    url:'/templates',
    method:'post',
    params:params
  })
}
//服务模板详情(编辑服务模板的数据展示)
export function editTempView(id,params) {
  return request({
    url:'/templates/'+id,
    method:'get',
    params:params
  })
}
//编辑服务模板
export function editTempList(id,params) {
  return request({
    url:'/templates/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个服务模板
export function delTempList(id,params) {
  return request({
    url:'/templates/'+id,
    method:'delete',
    params:params
  })
}
//获取筛选关键词
export function getTempList(params) {
  return request({
    url:'/templateslist',
    method:'post',
    params:params
  })
}
