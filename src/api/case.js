import request from '@/utils/request.js';

//----------------------------------------------------------案例管理-----------------------------------------------------
//案例列表
export function caseList(params) {
  return request({
    url:'/subjects',
    method:'get',
    params:params
  })
}
//案例库列表
export function librayList(params) {
  return request({
    url:'/subject-container',
    method:'get',
    params:params
  })
}

//新增案例
export function addCaseList(params) {
  return request({
    url:'/subjects',
    method:'post',
    params:params
  })
}
//案例详情(编辑案例的数据展示)
export function editCaseView(id,params) {
  return request({
    url:'/subjects/'+id,
    method:'get',
    params:params
  })
}
//编辑案例
export function editCaseList(id,params) {
  return request({
    url:'/subjects/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个案例
export function delCaseList(id,params) {
    return request({
      url:'/subjects/'+id,
      method:'delete',
      params:params
    })
}
//案例转载
export function caseReprint(id,params) {
  return request({
    url:'/subjects/'+id+'/reprint',
    method:'post',
    params:params
  })
}
//案例图片列表
export function casePicList(subjectId,params) {
  return request({
    url:'/subjects/'+subjectId+'/photos',
    method:'get',
    params:params
  })
}
//创建/修改案例图片
export function doCasePic(subjectId,params) {
  return request({
    url:'/subjects/'+subjectId+'/photos',
    method:'put',
    params:params
  })
}
//删除案例图片
export function delCasePic(params) {
  return request({
    url:'/subject-photos/',
    method:'delete',
    params:params
  })
}