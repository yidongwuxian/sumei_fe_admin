<<<<<<< HEAD
import request from '@/utils/request.js';

//----------------------------------------------------------用户管理-----------------------------------------------------
//用户列表
export function accList(params) {
  return request({
    url:'/users',
    method:'get',
    params:params
  })
}
//新增用户管理
export function addAccList(params) {
  return request({
    url:'/users',
    method:'post',
    params:params
  })
}
//用户管理详情(编辑用户管理的数据展示)
export function editAccView(id,params) {
  return request({
    url:'/users/'+id,
    method:'get',
    params:params
  })
}
//编辑用户管理
export function editAccList(id,params) {
  return request({
    url:'/users/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个用户管理
export function delAccList(id,params) {
  return request({
    url:'/users/'+id,
    method:'delete',
    params:params
  })
}

//----------------------------------------------------------用户组管理-----------------------------------------------------
//用户组列表
export function rolesList(params) {
  return request({
    url:'/roles',
    method:'get',
    params:params
  })
}
//新增用户组管理
export function addRolesList(params) {
  return request({
    url:'/roles',
    method:'post',
    params:params
  })
}
//用户组管理详情(编辑用户组管理的数据展示)
export function editRolesView(id,params) {
  return request({
    url:'/roles/'+id,
    method:'get',
    params:params
  })
}
//编辑用户组管理
export function editRolesList(id,params) {
  return request({
    url:'/roles/'+id,
    method:'put',
    params:params
  })
}

//添加成员
export function addRole(id,params) {
  return request({
    url:'/roles/'+id+'/users',
    method:'post',
    params:params
  })
}

//权限详情页
export function getModules(id,params) {
  return request({
    url:'/roles/'+id+'/modules',
    method:'get',
    params:params
  })
}
//角色添加权限
export function addModules(id,params) {
  return request({
    url:'/roles/'+id+'/modules',
    method:'post',
    params:params
  })
}
//----------------------------------------------------------权限管理-----------------------------------------------------
//权限列表
export function modulesList(params) {
  return request({
    url:'/modules',
    method:'get',
    params:params
  })
}
//新增权限
export function addModulesList(params) {
  return request({
    url:'/modules',
    method:'post',
    params:params
  })
}
//删除其中一个权限
export function delModulesList(id,params) {
  return request({
    url:'/modules/'+id,
    method:'delete',
    params:params
  })
}
//----------------------------------------------------------重置密码-----------------------------------------------------
//重置密码
export function resetPwd(params) {
  return request({
    url:'/reset-password',
    method:'post',
    params:params
  })
=======
import request from '@/utils/request.js';

//----------------------------------------------------------用户管理-----------------------------------------------------
//用户列表
export function accList(params) {
  return request({
    url:'/users',
    method:'get',
    params:params
  })
}
//新增用户管理
export function addAccList(params) {
  return request({
    url:'/users',
    method:'post',
    params:params
  })
}
//用户管理详情(编辑用户管理的数据展示)
export function editAccView(id,params) {
  return request({
    url:'/users/'+id,
    method:'get',
    params:params
  })
}
//编辑用户管理
export function editAccList(id,params) {
  return request({
    url:'/users/'+id,
    method:'put',
    params:params
  })
}
//删除其中一个用户管理
export function delAccList(id,params) {
  return request({
    url:'/users/'+id,
    method:'delete',
    params:params
  })
}

//----------------------------------------------------------用户组管理-----------------------------------------------------
//用户组列表
export function rolesList(params) {
  return request({
    url:'/roles',
    method:'get',
    params:params
  })
}
//新增用户组管理
export function addRolesList(params) {
  return request({
    url:'/roles',
    method:'post',
    params:params
  })
}
//用户组管理详情(编辑用户组管理的数据展示)
export function editRolesView(id,params) {
  return request({
    url:'/roles/'+id,
    method:'get',
    params:params
  })
}
//编辑用户组管理
export function editRolesList(id,params) {
  return request({
    url:'/roles/'+id,
    method:'put',
    params:params
  })
}

//添加成员
export function addRole(id,params) {
  return request({
    url:'/roles/'+id+'/users',
    method:'post',
    params:params
  })
}

//权限详情页
export function getModules(id,params) {
  return request({
    url:'/roles/'+id+'/modules',
    method:'get',
    params:params
  })
}
//角色添加权限
export function addModules(id,params) {
  return request({
    url:'/roles/'+id+'/modules',
    method:'post',
    params:params
  })
}
//----------------------------------------------------------权限管理-----------------------------------------------------
//权限列表
export function modulesList(params) {
  return request({
    url:'/modules',
    method:'get',
    params:params
  })
}
//新增权限
export function addModulesList(params) {
  return request({
    url:'/modules',
    method:'post',
    params:params
  })
}
//删除其中一个权限
export function delModulesList(id,params) {
  return request({
    url:'/modules/'+id,
    method:'delete',
    params:params
  })
}
//----------------------------------------------------------重置密码-----------------------------------------------------
//重置密码
export function resetPwd(params) {
  return request({
    url:'/reset-password',
    method:'post',
    params:params
  })
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}