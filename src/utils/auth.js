<<<<<<< HEAD
const TokenKey = 'loginToken'
const UnameKey = 'user_Name'
const RolesKey = 'menuRoles'
const actKey   = 'actKey'
const caseKey  = 'caseKey'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

//username
export function getUserName() {
  return sessionStorage.getItem(UnameKey)
}

export function setUserName(name) {
  return sessionStorage.setItem(UnameKey, name)
}

export function removeUserName() {
  return sessionStorage.removeItem(UnameKey)
}

//roles
export function getRoles() {
  return sessionStorage.getItem(RolesKey)
}

export function setRoles(name) {
  return sessionStorage.setItem(RolesKey, name);
}

export function removeRoles() {
  return sessionStorage.removeItem(RolesKey)
=======
const TokenKey = 'loginToken'
const UnameKey = 'user_Name'
const RolesKey = 'menuRoles'
const actKey   = 'actKey'
const caseKey  = 'caseKey'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

//username
export function getUserName() {
  return sessionStorage.getItem(UnameKey)
}

export function setUserName(name) {
  return sessionStorage.setItem(UnameKey, name)
}

export function removeUserName() {
  return sessionStorage.removeItem(UnameKey)
}

//roles
export function getRoles() {
  return sessionStorage.getItem(RolesKey)
}

export function setRoles(name) {
  return sessionStorage.setItem(RolesKey, name);
}

export function removeRoles() {
  return sessionStorage.removeItem(RolesKey)
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}