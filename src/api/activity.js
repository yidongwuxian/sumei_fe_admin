<<<<<<< HEAD
import request from '@/utils/request.js';

//----------------------------------------------------------门店管理-----------------------------------------------------
//门店列表
export function fetchList(params) {
  return request({
    url:'/stores',
    method:'get',
    params:params
  })
}
//新增门店
export function addFetchList(params) {
  return request({
    url:'/stores',
    method:'post',
    params:params
  })
}
//门店详情(编辑门店的数据展示)
export function editFetchView(id,params) {
  return request({
    url:'/stores/'+id,
    method:'get',
    params:params
  })
}
//编辑门店
export function editFetchList(id,params) {
  return request({
    url:'/stores/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个门店
export function delFetchList(id,params) {
  return request({
    url:'/stores/'+id,
    method:'delete',
    params:params
  })
}
//----------------------------------------------------------活动管理-----------------------------------------------------
//活动列表
export function actList(params) {
  return request({
    url:'/activities',
    method:'get',
    params:params
  })
}
//新增活动
export function addActList(params) {
  return request({
    url:'/activities',
    method:'post',
    params:params
  })
}
//活动详情(编辑活动的数据展示)
export function editActView(id,params) {
  return request({
    url:'/activities/'+id,
    method:'get',
    params:params
  })
}
//编辑活动
export function editActList(id,params) {
  return request({
    url:'/activities/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个活动
export function delActList(id,params) {
  return request({
    url:'/activities/'+id,
    method:'delete',
    params:params
  })
=======
import request from '@/utils/request.js';

//----------------------------------------------------------门店管理-----------------------------------------------------
//门店列表
export function fetchList(params) {
  return request({
    url:'/stores',
    method:'get',
    params:params
  })
}
//新增门店
export function addFetchList(params) {
  return request({
    url:'/stores',
    method:'post',
    params:params
  })
}
//门店详情(编辑门店的数据展示)
export function editFetchView(id,params) {
  return request({
    url:'/stores/'+id,
    method:'get',
    params:params
  })
}
//编辑门店
export function editFetchList(id,params) {
  return request({
    url:'/stores/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个门店
export function delFetchList(id,params) {
  return request({
    url:'/stores/'+id,
    method:'delete',
    params:params
  })
}
//----------------------------------------------------------活动管理-----------------------------------------------------
//活动列表
export function actList(params) {
  return request({
    url:'/activities',
    method:'get',
    params:params
  })
}
//新增活动
export function addActList(params) {
  return request({
    url:'/activities',
    method:'post',
    params:params
  })
}
//活动详情(编辑活动的数据展示)
export function editActView(id,params) {
  return request({
    url:'/activities/'+id,
    method:'get',
    params:params
  })
}
//编辑活动
export function editActList(id,params) {
  return request({
    url:'/activities/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个活动
export function delActList(id,params) {
  return request({
    url:'/activities/'+id,
    method:'delete',
    params:params
  })
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}