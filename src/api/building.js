<<<<<<< HEAD
import request from '@/utils/request.js';

//----------------------------------------------------------楼盘管理-----------------------------------------------------
//楼盘列表
export function buildList(params) {
  return request({
    url:'/buildings',
    method:'get',
    params:params
  })
}
//新增楼盘
export function addBuildList(params) {
  return request({
    url:'/buildings',
    method:'post',
    params:params
  })
}
//楼盘详情(编辑楼盘的数据展示)
export function editBuildView(id,params) {
  return request({
    url:'/buildings/'+id,
    method:'get',
    params:params
  })
}
//编辑楼盘
export function editBuildList(id,params) {
  return request({
    url:'/buildings/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个楼盘
export function delBuildList(id,params) {
    return request({
      url:'/buildings/'+id,
      method:'delete',
      params:params
    })
}
//----------------------------------------------------------工地管理-----------------------------------------------------
//工地列表
export function siteList(params) {
  return request({
    url:'/constructions',
    method:'get',
    params:params
  })
}
//新增工地
export function addSiteList(params) {
  return request({
    url:'/constructions',
    method:'post',
    params:params
  })
}
//工地详情(编辑工地的数据展示)
export function editSiteView(id,params) {
  return request({
    url:'/constructions/'+id,
    method:'get',
    params:params
  })
}
//编辑工地
export function editSiteList(id,params) {
  return request({
    url:'/constructions/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个工地
export function delSiteList(id,params) {
    return request({
      url:'/constructions/'+id,
      method:'delete',
      params:params
    })
}
//工地阶段列表
export function sitePicList(constructionId,params) {
  return request({
    url:'/constructions/'+constructionId+'/steps',
    method:'get',
    params:params
  })
}
//创建/修改案例图片
export function doSiteList(constructionId,params) {
  return request({
    url:'/constructions/'+constructionId+'/steps',
    method:'post',
    params:params
  })
}

//----------------------------------------------------------工队管理-----------------------------------------------------
//工队列表
export function groupList(params) {
  return request({
    url:'/construction-teams',
    method:'get',
    params:params
  })
}
//新增工队
export function addGroupList(params) {
  return request({
    url:'/construction-teams',
    method:'post',
    params:params
  })
}
//工队详情(编辑工队的数据展示)
export function editGroupView(id,params) {
  return request({
    url:'/construction-teams/'+id,
    method:'get',
    params:params
  })
}
//编辑工队
export function editGroupList(id,params) {
  return request({
    url:'/construction-teams/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个工队
export function delGroupList(id,params) {
    return request({
      url:'/construction-teams/'+id,
      method:'delete',
      params:params
    })
=======
import request from '@/utils/request.js';

//----------------------------------------------------------楼盘管理-----------------------------------------------------
//楼盘列表
export function buildList(params) {
  return request({
    url:'/buildings',
    method:'get',
    params:params
  })
}
//新增楼盘
export function addBuildList(params) {
  return request({
    url:'/buildings',
    method:'post',
    params:params
  })
}
//楼盘详情(编辑楼盘的数据展示)
export function editBuildView(id,params) {
  return request({
    url:'/buildings/'+id,
    method:'get',
    params:params
  })
}
//编辑楼盘
export function editBuildList(id,params) {
  return request({
    url:'/buildings/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个楼盘
export function delBuildList(id,params) {
    return request({
      url:'/buildings/'+id,
      method:'delete',
      params:params
    })
}
//----------------------------------------------------------工地管理-----------------------------------------------------
//工地列表
export function siteList(params) {
  return request({
    url:'/constructions',
    method:'get',
    params:params
  })
}
//新增工地
export function addSiteList(params) {
  return request({
    url:'/constructions',
    method:'post',
    params:params
  })
}
//工地详情(编辑工地的数据展示)
export function editSiteView(id,params) {
  return request({
    url:'/constructions/'+id,
    method:'get',
    params:params
  })
}
//编辑工地
export function editSiteList(id,params) {
  return request({
    url:'/constructions/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个工地
export function delSiteList(id,params) {
    return request({
      url:'/constructions/'+id,
      method:'delete',
      params:params
    })
}
//工地阶段列表
export function sitePicList(constructionId,params) {
  return request({
    url:'/constructions/'+constructionId+'/steps',
    method:'get',
    params:params
  })
}
//创建/修改案例图片
export function doSiteList(constructionId,params) {
  return request({
    url:'/constructions/'+constructionId+'/steps',
    method:'post',
    params:params
  })
}

//----------------------------------------------------------工队管理-----------------------------------------------------
//工队列表
export function groupList(params) {
  return request({
    url:'/construction-teams',
    method:'get',
    params:params
  })
}
//新增工队
export function addGroupList(params) {
  return request({
    url:'/construction-teams',
    method:'post',
    params:params
  })
}
//工队详情(编辑工队的数据展示)
export function editGroupView(id,params) {
  return request({
    url:'/construction-teams/'+id,
    method:'get',
    params:params
  })
}
//编辑工队
export function editGroupList(id,params) {
  return request({
    url:'/construction-teams/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个工队
export function delGroupList(id,params) {
    return request({
      url:'/construction-teams/'+id,
      method:'delete',
      params:params
    })
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}