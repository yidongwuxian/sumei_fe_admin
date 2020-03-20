<<<<<<< HEAD
import request from '@/utils/request.js';

//----------------------------------------------------------友链管理-----------------------------------------------------
//友链列表
export function linkList(params) {
  return request({
    url:'/frendlink',
    method:'get', 
    params:params
  })
}
//新增友链
export function addLinkList(params) {
  return request({
    url:'/frendlink',
    method:'post',
    params:params
  })
}
//友链详情(编辑友链的数据展示)
export function editLinkView(id,params) {
  return request({
    url:'/frendlink/'+id,
    method:'get',
    params:params
  })
}
//编辑友链
export function editLinkList(id,params) {
  return request({
    url:'/frendlink/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个友链
export function delLinkList(id,params) {
  return request({
    url:'/frendlink/'+id,
    method:'delete',
    params:params
  })
}
=======
import request from '@/utils/request.js';

//----------------------------------------------------------友链管理-----------------------------------------------------
//友链列表
export function linkList(params) {
  return request({
    url:'/frendlink',
    method:'get', 
    params:params
  })
}
//新增友链
export function addLinkList(params) {
  return request({
    url:'/frendlink',
    method:'post',
    params:params
  })
}
//友链详情(编辑友链的数据展示)
export function editLinkView(id,params) {
  return request({
    url:'/frendlink/'+id,
    method:'get',
    params:params
  })
}
//编辑友链
export function editLinkList(id,params) {
  return request({
    url:'/frendlink/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个友链
export function delLinkList(id,params) {
  return request({
    url:'/frendlink/'+id,
    method:'delete',
    params:params
  })
}
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
