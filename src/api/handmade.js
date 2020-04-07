import request from '@/utils/request.js';

//----------------------------------------------------------手工模块模板-----------------------------------------------------
//手工模块列表
export function handModeList(params) {
  return request({
    url:'/manual-modules',
    method:'get',
    params:params
  })
}
//----------------------------------------------------------手工模块数据-----------------------------------------------------
//手工模块数据列表
export function handModeDataList(id,params) {
  return request({
    url:'/manual-modules/'+id+'/data',
    method:'get',
    params:params
  })
}
//新增手工模块数据
export function addhandModeDataList(id,params) {
  return request({
    url:'/manual-modules/'+id+'/data',
    method:'post',
    params:params
  })
}
//手工模块数据详情(编辑手工模块数据的数据展示)
export function edithandModeDataView(id,params) {
  return request({
    url:'/manual-module-data/'+id,
    method:'get',
    params:params
  })
}
//编辑手工模块数据
export function edithandModeDataList(id,params) {
  return request({
    url:'/manual-module-data/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个手工模块数据
export function delhandModeDataList(id,params) {
    return request({
      url:'/manual-module-data/'+id,
      method:'delete',
      params:params
    })
}