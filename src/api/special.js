import request from '@/utils/request.js';

//----------------------------------------------------------专题管理-----------------------------------------------------
//专题列表
export function specialList(params) {
  return request({
    url:'/special',
    method:'get',
    params:params
  })
}
//新增专题
export function addSpecList(params) {
  return request({
    url:'/special',
    method:'post',
    params:params
  })
}
//专题详情(编辑专题的数据展示)
export function editSpecView(id,params) {
  return request({
    url:'/special/'+id,
    method:'get',
    params:params
  })
}
//编辑专题
export function editSpecList(id,params) {
  return request({
    url:'/special/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个专题
export function delSpecList(id,params) {
  return request({
    url:'/special/'+id,
    method:'delete',
    params:params
  })
}
//专题管理发布状态修改
export function setSpecPublish(params) {
  return request({
    url:'/specialpublish',
    method:'post',
    params:params
  })
}

//专题页模板
export function getSpecialInfo(params){
  return request({
    url:'/specialinfo',
    method:'post',
    params:params
  })
}