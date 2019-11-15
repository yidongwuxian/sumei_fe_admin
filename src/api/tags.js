import request from '@/utils/request.js';

//----------------------------------------------------------标签管理-----------------------------------------------------
//标签列表
export function tagsList(params) {
  return request({
    url:'/tags',
    method:'get',
    params:params
  })
}
//新增标签
export function addTagsList(params) {
  return request({
    url:'/tags',
    method:'post',
    params:params
  })
}
//标签详情(编辑标签的数据展示)
export function editTagsView(id,params) {
  return request({
    url:'/tags/'+id,
    method:'get',
    params:params
  })
}
//编辑标签
export function editTagsList(id,params) {
  return request({
    url:'/tags/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个标签
export function delTagsList(id,params) {
    return request({
      url:'/tags/'+id,
      method:'delete',
      params:params
    })
}