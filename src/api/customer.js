import request from '@/utils/request.js';

//----------------------------------------------------------客服代码功能-----------------------------------------------------
//客服列表
export function cusList(params) {
  return request({
    url:'/sitescode',
    method:'get',
    params:params
  })
}
//新增客服
export function addCusList(params) {
  return request({
    url:'/sitescode',
    method:'post',
    params:params
  })
}
//客服详情(编辑客服的数据展示)
export function editCusView(id,params) {
  return request({
    url:'/sitescode/'+id,
    method:'get',
    params:params
  })
}
//编辑客服
export function editCusList(id,params) {
  return request({
    url:'/sitescode/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个客服
export function delCusList(id,params) {
  return request({
    url:'/sitescode/'+id,
    method:'delete',
    params:params
  })
}
