<<<<<<< HEAD
import request from '@/utils/request'
//获取站点ID
export function siteNameList(params) {
  return request({
    url:'/site-name-list',
    method:'post',
    params:params
  })
}
//获取省市级ID
export function provincesList(params) {
  return request({
    url:'/provinces',
    method:'get',
    params:params
  })
}
//上传图片
export function uploadPic(params) {
  return request({
    url:'/photos',
    method:'post',
    params:params
  })
}
//获取图片路径
export function getFilePath(params) {
  return request({
    url:'/photos/file-path',
    method:'get',
    params:params
  })
}
//所属套系
export function getSleeve(params) {
  return request({
    url:'/prices',
    method:'get',
    params:params
  })
}
//所属面积
export function getAreas(params) {
  return request({
    url:'/house-areas',
    method:'get',
    params:params
  })
}
//所属户型
export function getHouseTypes(params) {
  return request({
    url:'/house-types',
    method:'get',
    params:params
  })
}
//空间类型
export function getSpaces(params) {
  return request({
    url:'/subject-photos/spaces',
    method:'get',
    params:params
  })
}
//所属楼盘
export function getBuilding(cityId,params) {
  return request({
    url:'/cities/'+cityId+'/buildings',
    method:'get',
    params:params
  })
}

//所属站点楼盘
export function getSiteBuilding(siteId,params) {
  return request({
    url:'/sites/'+siteId+'/buildings',
    method:'get',
    params:params
  })
=======
import request from '@/utils/request'
//获取站点ID
export function siteNameList(params) {
  return request({
    url:'/site-name-list',
    method:'post',
    params:params
  })
}
//获取省市级ID
export function provincesList(params) {
  return request({
    url:'/provinces',
    method:'get',
    params:params
  })
}
//上传图片
export function uploadPic(params) {
  return request({
    url:'/photos',
    method:'post',
    params:params
  })
}
//获取图片路径
export function getFilePath(params) {
  return request({
    url:'/photos/file-path',
    method:'get',
    params:params
  })
}
//所属套系
export function getSleeve(params) {
  return request({
    url:'/prices',
    method:'get',
    params:params
  })
}
//所属面积
export function getAreas(params) {
  return request({
    url:'/house-areas',
    method:'get',
    params:params
  })
}
//所属户型
export function getHouseTypes(params) {
  return request({
    url:'/house-types',
    method:'get',
    params:params
  })
}
//空间类型
export function getSpaces(params) {
  return request({
    url:'/subject-photos/spaces',
    method:'get',
    params:params
  })
}
//所属楼盘
export function getBuilding(cityId,params) {
  return request({
    url:'/cities/'+cityId+'/buildings',
    method:'get',
    params:params
  })
}

//所属站点楼盘
export function getSiteBuilding(siteId,params) {
  return request({
    url:'/sites/'+siteId+'/buildings',
    method:'get',
    params:params
  })
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}