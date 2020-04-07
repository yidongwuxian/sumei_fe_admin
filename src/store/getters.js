const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  accountTabName: state => state.page.accountTabName,
  addRouters: state => state.permission.addRouters,
  shape: state => state.page.shape,
  actlistFilter: state => state.page.actlistFilter,
  shoplistFilter:state => state.page.shoplistFilter,
  caselistFilter:state => state.page.caselistFilter,
  libraryFilter:state => state.page.libraryFilter,
  tagFilter:state => state.page.tagFilter,
  buildFilter:state => state.page.buildFilter,
  siteFilter:state => state.page.siteFilter,
  groupFilter:state => state.page.groupFilter,
  artFilter:state => state.page.artFilter,
  courseFilter:state => state.page.courseFilter,
  columnFilter:state => state.page.columnFilter,
  specialFilter:state => state.page.specialFilter,
  substationFilter:state => state.page.substationFilter,
  templateFilter:state => state.page.templateFilter,
  clueFilter:state => state.page.clueFilter,
  handList1Filter: state => state.page.handList1Filter,
  handList2Filter: state => state.page.handList2Filter,
  handList3Filter: state => state.page.handList3Filter,
  masterFilter: state => state.page.masterFilter,
  customerFilter: state => state.page.customerFilter,
  userFilter:state => state.page.userFilter,
  usersFilter:state => state.page.usersFilter, 
  seoFilter:state => state.page.seoFilter,
}
export default getters 
