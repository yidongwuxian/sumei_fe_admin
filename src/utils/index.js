<<<<<<< HEAD
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function removeEmptyObject(object){
  for (var i in object) {
  var value = object[i];
  if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length == 0) {
            delete object[i];
            continue;
        }
      }
      removeEmptyObject(value);
      //按需添加
      if (isEmpty(value)) {
        delete object[i];
      }
  } else {
      if (value === '' || value === null || value === undefined) {
          delete object[i];
      } else {
        }
      }
  }
  return object;
}
//是否为空
function isEmpty(object) {
  for (var name in object) {
    return false;
  }
  return true;
}

export function toSortVal(str){
  let val = "";
  if(str === "descending"){
    val = "desc";
  }else{
    val = "asc";
  }
  return val;
}

//去重数组
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

//去重数组
export function removeAwayPic(str) {
  let tempStr = '';
  let StrA    = str.replace(/\[|]/g,'');
  let StrB    =  StrA.replace("\"","").replace("\"","");
  tempStr     = StrB + "!ps2";
  
  return  tempStr;
}

//是否有效值
export function isVirtualVal(value){
  if (value != '' && value != null && value != undefined) {
    value = true;
  }else{
    value = false;
  }
  return value;
}

//转义导出Excel文件名称
export function transferExcelName(str){
  let val = '';
  switch(str) {
    case 'store':
       val = '门店';
       break;
    case 'subject':
       val = '案例';
       break;
    case 'building':
        val = '楼盘';
        break;  
    case 'construction':
      val = '工地';
      break;
    case 'constructionTeam':
      val = '工队';
      break;
    case 'story':
        val = '线上课程';
        break;     
    case 'course':
      val = '线下课程';
      break;
    case 'special':
      val = '专题';
      break;
    case 'activity':
        val = '活动';
        break;
    case 'friendLink':
        val = '友链';
        break;
    default:
       break;
  } 
  return val;
=======
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function removeEmptyObject(object){
  for (var i in object) {
  var value = object[i];
  if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length == 0) {
            delete object[i];
            continue;
        }
      }
      removeEmptyObject(value);
      //按需添加
      if (isEmpty(value)) {
        delete object[i];
      }
  } else {
      if (value === '' || value === null || value === undefined) {
          delete object[i];
      } else {
        }
      }
  }
  return object;
}
//是否为空
function isEmpty(object) {
  for (var name in object) {
    return false;
  }
  return true;
}

export function toSortVal(str){
  let val = "";
  if(str === "descending"){
    val = "desc";
  }else{
    val = "asc";
  }
  return val;
}

//去重数组
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

//去重数组
export function removeAwayPic(str) {
  let tempStr = '';
  let StrA    = str.replace(/\[|]/g,'');
  let StrB    =  StrA.replace("\"","").replace("\"","");
  tempStr     = StrB + "!ps2";
  
  return  tempStr;
}

//是否有效值
export function isVirtualVal(value){
  if (value != '' && value != null && value != undefined) {
    value = true;
  }else{
    value = false;
  }
  return value;
}

//转义导出Excel文件名称
export function transferExcelName(str){
  let val = '';
  switch(str) {
    case 'store':
       val = '门店';
       break;
    case 'subject':
       val = '案例';
       break;
    case 'building':
        val = '楼盘';
        break;  
    case 'construction':
      val = '工地';
      break;
    case 'constructionTeam':
      val = '工队';
      break;
    case 'story':
        val = '线上课程';
        break;     
    case 'course':
      val = '线下课程';
      break;
    case 'special':
      val = '专题';
      break;
    case 'activity':
        val = '活动';
        break;
    case 'friendLink':
        val = '友链';
        break;
    default:
       break;
  } 
  return val;
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
}