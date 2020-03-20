import request from '@/utils/request.js';

//----------------------------------------------------------栏目管理-----------------------------------------------------
//栏目列表
export function columnList(params) {
  return request({
    url:'/storiestypes',
    method:'get',
    params:params
  })
}
//新增栏目
export function addColumnList(params) {
  return request({
    url:'/storiestypes',
    method:'post',
    params:params
  })
}
//栏目详情(编辑栏目的数据展示)
export function editColumnView(id,params) {
  return request({
    url:'/storiestypes/'+id,
    method:'get',
    params:params
  })
}
//编辑栏目
export function editColumnList(id,params) {
  return request({
    url:'/storiestypes/'+id,
    method:'put',
    params:params
  })
}
//栏目管理根据类型获取列表接口
export function typesList(params) {
  return request({
    url:'/typeslist',
    method:'post',
    params:params
  })
}
//----------------------------------------------------------线上课程管理-----------------------------------------------------
//线上课程列表
export function onlineCourseList(params) {
  return request({
    url:'/stories',
    method:'get',
    params:params
  })
}
//新增线上课程
export function addOnlineCourseList(params) {
  return request({
    url:'/stories',
    method:'post',
    params:params
  })
}
//线上课程详情(编辑线上课程的数据展示)
export function editOnlineCourseView(id,params) {
  return request({
    url:'/stories/'+id,
    method:'get',
    params:params
  })
}
//编辑线上课程
export function editOnlineCourseList(id,params) {
  return request({
    url:'/stories/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个线上课程
export function delOnlineCourseList(id,params) {
  return request({
    url:'/stories/'+id,
    method:'delete',
    params:params
  })
}
//----------------------------------------------------------线下课程管理-----------------------------------------------------
//线下课程列表
export function unlineCourseList(params) {
  return request({
    url:'/courses',
    method:'get',
    params:params
  })
}
//新增线下课程
export function addUnlineCourseList(params) {
  return request({
    url:'/courses',
    method:'post',
    params:params
  })
}
//线下课程详情(编辑线下课程的数据展示)
export function editUnlineCourseView(id,params) {
  return request({
    url:'/courses/'+id,
    method:'get',
    params:params
  })
}
//编辑线下课程
export function editUnlineCourseList(id,params) {
  return request({
    url:'/courses/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个线下课程
export function delUnlineCourseList(id,params) {
  return request({
    url:'/courses/'+id,
    method:'delete',
    params:params
  })
}