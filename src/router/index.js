import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', id:0, component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', id:0, component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    id:118,
    children: [{
      path: 'home',
      name: '首页',
      id:118,
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },

  //门店/活动管理
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/list',
    name: 'activity',
    id:1,
    meta: {title: '门店/活动管理', icon: 'product'},
    children: [
      {
        path: 'list',
        name: '门店管理',
        id: 14,
        component: () => import('@/views/activity/activity/list'),
        meta: {title: '门店管理', icon: 'product-attr'}
      },
      {
        path: 'shop',
        name: '活动管理',
        id: 19,
        component: () => import('@/views/activity/shop/list'),
        meta: {title: '活动管理', icon: 'product-attr'}
      },
      {
        path: 'addEdit',
        name: '添加/修改门店',
        component: () => import('@/views/activity/activity/addEdit'),
        meta: {title: '添加/修改门店'},
        hidden:true
      },
      {
        path: 'shopManager',
        name: '添加/修改活动',
        component: () => import('@/views/activity/shop/addEdit'),
        meta: {title: '添加/修改活动'},
        hidden:true
      }
    ]
  },
  //案例管理
  { 
    path: '/case',
    component: Layout,
    redirect: '/case/list',
    name: '案例管理',
    id:2,
    meta: {title: '案例管理', icon: 'order'},
    children: [
      {
        path: 'list',
        name: '案例管理',
        id:24,
        component: () => import('@/views/case/case/list'),
        meta: {title: '案例管理', icon: 'product-attr'}
      },
      {
        path: 'library',
        name: '案例库管理',
        id:30,
        component: () => import('@/views/case/library/list'),
        meta: {title: '案例库管理', icon: 'product-attr'}
      },
      {
        path: 'addEdit',
        name: '添加/修改案例',
        component: () => import('@/views/case/case/addEdit'),
        meta: {title: '添加/修改案例'},
        hidden:true
      },
      {
        path: 'info',
        name: '案例信息',
        component: () => import('@/views/case/case/info'),
        meta: {title: '案例信息'},
        hidden:true
      }
    ]
  },
  //标签管理
  {
    path: '/tags',
    component: Layout,
    redirect: '/tags/tags',
    name: '标签',
    id:3,
    meta: {title: '标签'},
    children: [
      {
        path: 'tags',
        name: '标签管理',
        id:35,
        component: () => import('@/views/tags/tags/list'),
        meta: {title: '标签管理', icon: 'marker'}
      },
      {
        path: 'addEdit',
        name: '添加/修改标签',
        component: () => import('@/views/tags/tags/addEdit'),
        meta: {title: '添加/修改标签'},
        hidden:true
      }
    ]
  },
  //楼盘管理
  {
    path: '/building',
    component: Layout,
    redirect: '/building/building',
    name: '楼盘管理',
    id:4,
    meta: {title: '楼盘管理', icon: 'product-brand'},
    children: [
      {
        path: 'building',
        name: '楼盘管理',
        id: 40,
        component: () => import('@/views/building/building/list'),
        meta: {title: '楼盘管理', icon: 'product-attr'}
      },
      {
        path: 'site',
        name: '工地管理',
        id: 46,
        component: () => import('@/views/building/site/list'),
        meta: {title: '工地管理', icon: 'product-attr'}
      },
      {
        path: 'group',
        name: '工队管理',
        id: 51,
        component: () => import('@/views/building/group/list'),
        meta: {title: '工队管理', icon: 'product-attr'}
      },
      {
        path: 'addEdit',
        name: '添加/修改楼盘',
        component: () => import('@/views/building/building/addEdit'),
        meta: {title: '添加/修改楼盘'},
        hidden:true
      },
      {
        path: 'siteManager',
        name: '添加/修改工地',
        component: () => import('@/views/building/site/addEdit'),
        meta: {title: '添加/修改工地'},
        hidden:true
      },
      {
        path: 'siteInfo',
        name: '工地信息',
        component: () => import('@/views/building/site/info'),
        meta: {title: '工地信息'},
        hidden:true
      },
      {
        path: 'groupManager',
        name: '添加/修改工队',
        component: () => import('@/views/building/group/addEdit'),
        meta: {title: '添加/修改工队'},
        hidden:true
      }
    ]
  },
  //内容管理
  {
    path: '/substance',
    component: Layout,
    redirect: '/substance/article',
    name: '内容管理',
    id: 5,
    meta: {title: '内容管理', icon: 'product-comment'},
    children: [
      {
        path: 'article', 
        name: '线上课程管理',
        id: 58,
        component: () => import('@/views/substance/article/list'),
        meta: {title: '线上课程管理', icon: 'product-attr'}
      },
      {
        path: 'course',
        name: '线下课程管理',
        id: 64,
        component: () => import('@/views/substance/course/list'),
        meta: {title: '线下课程管理', icon: 'product-attr'}
      },
      {
        path: 'column',
        name: '栏目管理',
        id: 69,
        component: () => import('@/views/substance/column/list'),
        meta: {title: '栏目管理', icon: 'product-attr'}
      },
      {
        path: 'articleManager',
        name: '添加/修改线上课程',
        component: () => import('@/views/substance/article/addEdit'),
        meta: {title: '添加/修改线上课程'},
        hidden:true
      },
      {
        path: 'courseManager',
        name: '添加/修改线下课程',
        component: () => import('@/views/substance/course/addEdit'),
        meta: {title: '添加/修改线下课程'},
        hidden:true
      },
      
      {
        path: 'columnManager',
        name: '添加/修改栏目',
        component: () => import('@/views/substance/column/addEdit'),
        meta: {title: '添加/修改栏目'},
        hidden:true
      }
    ]
  },
  //专题管理
  {
    path: '/special',
    component: Layout,
    redirect: '/special/special',
    id: 6,
    meta: {title: '专题管理'},
    children: [
      {
        path: 'special',
        name: '专题管理列表',
        id: 74,
        component: () => import('@/views/special/special/list'),
        meta: {title: '专题管理', icon: 'form'}
      },
      {
        path: 'specialManager',
        name: '添加/修改专题',
        component: () => import('@/views/special/special/addEdit'),
        meta: {title: '添加/修改专题'},
        hidden:true
      }
    ]
  },
  //速美服务管理
  {
    path: '/service',
    component: Layout,
    redirect: '/service/substation',
    name: '速美服务管理',
    id: 7,
    meta: {title: '速美服务管理', icon: 'example'},
    children: [
      {
        path: 'substation',
        name: '分站模板管理',
        id: 80,
        component: () => import('@/views/service/substation/list'),
        meta: {title: '分站模板管理', icon: 'product-attr'}
      },
      {
        path: 'template',
        name: '服务模板',
        id: 85,
        component: () => import('@/views/service/template/list'),
        meta: {title: '服务模板', icon: 'product-attr'}
      },
      {
        path: 'subManager',
        name: '添加/修改分站模板',
        component: () => import('@/views/service/substation/addEdit'),
        meta: {title: '添加/修改分站模板'},
        hidden:true
      },
      {
        path: 'tempManager',
        name: '添加/修改服务模板',
        component: () => import('@/views/service/template/addEdit'),
        meta: {title: '添加/修改服务模板'},
        hidden:true
      }
    ]
  },
  //线索管理
  {
    path: '/clue',
    component: Layout,
    redirect: '/clue/clue',
    name: '线索管理',
    id: 8,
    meta: {title: '线索管理', icon: 'order'},
    children: [
      {
        path: 'clue',
        name: '线索管理',
        id: 91,
        component: () => import('@/views/clue/clue/list'),
        meta: {title: '线索管理', icon: 'product-list'}
      }
    ]
  },
  //网站管理
  {
    path: '/website',
    component: Layout,
    redirect: '/website/master',
    name: '网站管理',
    id: 9,
    meta: {title: '网站管理', icon: 'order-setting'},
    children: [
      {
        path: 'handmade',
        name: '手工块管理',
        id: 108,
        component: () => import('@/views/website/handmade/index'),
        meta: {title: '手工块管理', icon: 'product-attr'}
      },
      {
        path: 'master',
        name: '分总站管理',
        id: 97,
        component: () => import('@/views/website/master/list'),
        meta: {title: '分总站管理', icon: 'product-attr'}
      },
      {
        path: 'customer',
        name: '客服代码管理',
        id: 103,
        component: () => import('@/views/website/customer/list'),
        meta: {title: '客服代码管理', icon: 'product-attr'}
      },
      {
        path: 'handList1',
        name: '手工模块管理1',
        component: () => import('@/views/website/handmade/list1'),
        meta: {title: '手工模块管理1', icon: 'product-attr'},
        hidden:true
      },
      {
        path: 'handList2',
        name: '手工模块管理2',
        component: () => import('@/views/website/handmade/list2'),
        meta: {title: '手工模块管理2', icon: 'product-attr'},
        hidden:true
      },
      {
        path: 'handList3',
        name: '手工模块管理3',
        component: () => import('@/views/website/handmade/list3'),
        meta: {title: '手工模块管理3', icon: 'product-attr'},
        hidden:true
      },
      {
        path: 'handManager',
        name: '添加/修改手工模块',
        component: () => import('@/views/website/handmade/addEdit'),
        meta: {title: '添加/修改手工模块', icon: 'product-attr'},
        hidden:true
      },
      {
        path: 'handManager2',
        name: '添加/修改模块',
        component: () => import('@/views/website/handmade/addEdit2'),
        meta: {title: '添加/修改模块'},
        hidden:true
      },
      {
        path: 'handEdit',
        name: '修改手工模块',
        component: () => import('@/views/website/handmade/edit'),
        meta: {title: '修改手工模块'},
        hidden:true
      },
      
      {
        path: 'masterManager',
        name: '添加/修改分站',
        component: () => import('@/views/website/master/addEdit'),
        meta: {title: '添加/修改分站', icon: 'product-attr'},
        hidden:true
      },
      
      {
        path: 'customerManager',
        name: '添加/修改客服代码',
        component: () => import('@/views/website/customer/addEdit'),
        meta: {title: '添加/修改客服代码', icon: 'product-attr'},
        hidden:true
      }
    ]
  },
  //系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/list',
    name: '系统管理',
    id: 10,
    meta: {title: '系统管理', icon: 'user'},
    children: [
      {
        path: 'list',
        name: '账户管理',
        id: 113,
        component: () => import('@/views/system/account/list'),
        meta: {title: '账户管理', icon: 'product-attr'}
      },
      {
        path: 'rolesOperation',
        name: '权限管理',
        id: 127,
        component: () => import('@/views/system/account/editRole'),
        meta: {title: '权限管理'},
        hidden:true
      },
      {
        path: 'memberOperation',
        name: '角色管理',
        id: 119,
        component: () => import('@/views/system/account/editMember'),
        meta: {title: '角色管理'},
        hidden:true
      },
      {
        path: 'userEdit',
        name: '账户管理-用户管理',
        component: () => import('@/views/system/account/userEdit'),
        meta: {title: '账户管理-用户管理'},
        hidden:true
      },
      {
        path: 'usersEdit',
        name: '账户管理-用户组管理',
        component: () => import('@/views/system/account/usersEdit'),
        meta: {title: '账户管理-用户组管理'},
        hidden:true
      },
      {
        path: 'editpwd',
        name: '修改密码',
        component: () => import('@/views/system/account/editpwd'),
        meta: {title: '修改密码'},
        hidden:true
      }
    ]
  },
  //数据统计
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/statistics',
    name: '数据统计',
    id: 11,
    meta: {title: '数据统计'},
    children: [
      {
        path: 'statistics',
        name: '数据统计',
        id: 132,
        component: () => import('@/views/statistics/statistics/index'),
        meta: {title: '数据统计', icon: 'total-week'}
      }
    ]
  },
  //SEO管理
  {
    path: '/seo',
    component: Layout,
    redirect: '/seo/link',
    name: 'seo管理',
    id: 12,
    meta: {title: 'seo管理'},
    children: [
      {
        path: 'link',
        name: '友链管理',
        id: 133,
        component: () => import('@/views/seo/link/list'),
        meta: {title: '友链管理', icon: 'order'}
      },
      {
        path: 'linkManager',
        name: '添加/修改友链',
        component: () => import('@/views/seo/link/addEdit'),
        meta: {title: '添加/修改友链', icon: 'product-list'},
        hidden:true
      },
    ]
  },
  //测试模块管理
  {
    path: '/olet',
    component: Layout,
    redirect: '/olet/label',
    name: '测试标签组',
    id: 13,
    meta: {title: '测试标签组', icon: 'order'},
    children: [
      {
        path: 'label',
        name: '测试标签组管理',
        id: 138,
        component: () => import('@/views/olet/label/index'),
        meta: {title: '测试标签组管理', icon: 'product-list'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

