const page = {
  state: { 
   accountTabName: '',   //账号管理tab切换名称
   shape: '',           //入口/出口
   actlistFilter: '',  //门店列表搜索条件
   shoplistFilter:'', //活动列表搜索条件
   caselistFilter: '',//案例列表搜索条件
   libraryFilter: '',//案例库列表搜索条件
   tagFilter: '',   //标签列表搜索条件
   buildFilter: '',//楼盘列表搜索条件
   siteFilter: '', //工地列表搜索条件
   groupFilter: '',//工队列表搜索条件
   artFilter: '',//线上课程列表搜索条件
   courseFilter: '',//线下课程列表搜索条件
   columnFilter: '',//栏目列表搜索条件
   specialFilter:'',//专题列表搜索条件
   substationFilter:'',//分站模板列表搜索条件
   templateFilter:'',//服务模板列表搜索条件
   clueFilter:'',//线索列表搜索条件
   handList1Filter:'',//手工块1列表搜索条件
   handList2Filter:'',//手工块2列表搜索条件
   handList3Filter:'',//手工块3列表搜索条件
   masterFilter:'',//分总站列表搜索条件
   userFilter:'',//用户管理列表搜索条件
   usersFilter:'',//用户组管理列表搜索条件
   seoFilter:'',//友情链接列表搜索条件
  },

  mutations: {
    SET_Account_Tab_Name: (state, tabName) => {
      state.accountTabName = tabName
    },
    SET_Act_Filter: (state, jsondata) => {
      state.actlistFilter = jsondata
    },
    SET_Shop_Filter: (state, jsondata) => {
      state.shoplistFilter = jsondata
    },
    SET_Case_Filter: (state, jsondata) => {
      state.caselistFilter = jsondata
    },
    SET_Library_Filter: (state, jsondata) => {
      state.libraryFilter = jsondata
    },
    SET_Tag_Filter: (state, jsondata) => {
      state.tagFilter = jsondata
    },
    SET_Build_Filter: (state, jsondata) => {
      state.buildFilter = jsondata
    },
    SET_Site_Filter: (state, jsondata) => {
      state.siteFilter = jsondata
    },
    SET_Group_Filter: (state, jsondata) => {
      state.groupFilter = jsondata
    },
    SET_Art_Filter: (state, jsondata) => {
      state.artFilter = jsondata
    },
    SET_Course_Filter: (state, jsondata) => {
      state.courseFilter = jsondata
    },
    SET_Column_Filter: (state, jsondata) => {
      state.columnFilter = jsondata
    },
    SET_Special_Filter: (state, jsondata) => {
      state.specialFilter = jsondata
    },
    SET_Substation_Filter: (state, jsondata) => {
      state.substationFilter = jsondata
    },
    SET_Template_Filter: (state, jsondata) => {
      state.templateFilter = jsondata
    },
    SET_Clue_Filter: (state, jsondata) => {
      state.clueFilter = jsondata
    },
    SET_handList1_Filter: (state, jsondata) => {
      state.handList1Filter = jsondata
    },
    SET_handList2_Filter: (state, jsondata) => {
      state.handList2Filter = jsondata
    },
    SET_handList3_Filter: (state, jsondata) => {
      state.handList3Filter = jsondata
    },
    SET_Master_Filter: (state, jsondata) => {
      state.masterFilter = jsondata
    },
    SET_Customer_Filter: (state, jsondata) => {
      state.customerFilter = jsondata
    },
    SET_User_Filter: (state, jsondata) => {
      state.userFilter = jsondata
    },
    SET_Users_Filter: (state, jsondata) => {
      state.usersFilter = jsondata
    },
    SET_Seo_Filter: (state, jsondata) => {
      state.seoFilter = jsondata
    },
    SET_SHAPE: (state, str) => {
      state.shape = str
    },
  }
}  

export default page
