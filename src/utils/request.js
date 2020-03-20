<<<<<<< HEAD
import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Router from '@/router/index';

let loading;        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
  setTimeout(() => {
    loading.close();
  }, 1000);
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
          endLoading()
    }
}


// 创建axios实例
const request = axios.create({
  baseURL: process.env.API_BASEURL, 
  timeout: 50000 // 请求超时时间
})

// request拦截器
request.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken();
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
   // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  showFullScreenLoading()
  return config;
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
  
})

// respone拦截器
request.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response;
    tryHideFullScreenLoading()
    if (res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      // 401:未登录;
      if (res.status === 401||res.status === 403) {
        MessageBox.confirm('未授权', '请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            Router.push({path: '/login'})
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    tryHideFullScreenLoading()
    
    if(!error.response.data){
      Message({
        message: '系统错误',
        type: 'error',
        duration: 3 * 1000
      })
    }else{
      // 401:未登录;
      if (error.response.status === 401||error.response.status === 403) {
        let errMsg = "'未授权', '请重新登录'";
        if(error.response.data){
          errMsg = error.response.data;
        }
        MessageBox.confirm(errMsg, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(getToken()){
            store.dispatch('FedLogOut').then(() => {
              Router.push({path: '/login'})
            })
          }else{
            Router.push({path: '/login'})
          }
        }).catch(() => {
          Message({
            message: '已取消',
            type: 'info',
            duration: 1 * 1000
          })
        });
      }else{
        Message({
          message: error.response.data,
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
    
    return Promise.reject(error)
  })

export default request
=======
//import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Router from '@/router/index';

let loading;        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
  setTimeout(() => {
    loading.close();
  }, 1000);
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
          endLoading()
    }
}


// 创建axios实例
const request = axios.create({
  baseURL: process.env.API_BASEURL, 
  timeout: 50000 // 请求超时时间
})

// request拦截器
request.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken();
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
   // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  showFullScreenLoading()
  return config;
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
  
})

// respone拦截器
request.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response;
    tryHideFullScreenLoading()
    if (res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      // 401:未登录;
      if (res.status === 401||res.status === 403) {
        MessageBox.confirm('未授权', '请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            Router.push({path: '/login'})
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    tryHideFullScreenLoading()
    
    if(!error.response.data){
      Message({
        message: '系统错误',
        type: 'error',
        duration: 3 * 1000
      })
    }else{
      // 401:未登录;
      if (error.response.status === 401||error.response.status === 403) {
        let errMsg = "'未授权', '请重新登录'";
        if(error.response.data){
          errMsg = error.response.data;
        }
        MessageBox.confirm(errMsg, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(getToken()){
            store.dispatch('FedLogOut').then(() => {
              Router.push({path: '/login'})
            })
          }else{
            Router.push({path: '/login'})
          }
        }).catch(() => {
          Message({
            message: '已取消',
            type: 'info',
            duration: 1 * 1000
          })
        });
      }else{
        Message({
          message: error.response.data,
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
    
    return Promise.reject(error)
  })

export default request
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
