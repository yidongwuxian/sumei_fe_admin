<template> 
  <div class="app-container">
    <el-card class="el-col el-col-24" shadow="hover">
      <div>
        <span>账户管理</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="mt15">
        <!--用户管理-->
        <el-tab-pane label="用户管理" name="first">
          <div class="mt15">
              <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
                <el-form-item label="搜索条件：">
                    <el-input v-model="listPageFilter.name" class="input-width" placeholder="账号" @keyup.enter.native="searchFilter" clearable @change="changeSname"></el-input>
                    <el-input v-model="listPageFilter.id" class="input-width" placeholder="ID" @keyup.enter.native="searchFilter" clearable @change="changeSid"></el-input>
                    <el-input v-model="listPageFilter.real_name" class="input-width" placeholder="用户名" @keyup.enter.native="searchFilter" clearable @change="changeRealName"></el-input>
                </el-form-item>
                <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
                    <span>搜索</span>
                </button>
              </el-form>
            </div>
            <div class="table-container">
                  <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
                  <el-table ref="userTable"
                            :data="list"
                            style="width: 100%;"
                            @sort-change="handleSortChange"
                             border
                            :default-sort = "{prop: 'id', order: 'descending'}">
                    <el-table-column label="用户ID" prop="id" sortable="custom" width="180" align="center">
                      <template slot-scope="scope">{{scope.row.id}}</template>
                    </el-table-column>
                    <el-table-column label="账号" width="180" align="center">
                      <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                            <span v-if="scope.row.status">{{scope.row.status | formatStatus}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="用户名" width="180" align="center">
                      <template slot-scope="scope">{{scope.row.real_name}}</template>
                    </el-table-column>
                    <el-table-column label="所属分站" align="center">
                      <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
                    </el-table-column>
                    <el-table-column fixed="right" width="150" label="操作">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          @click="editorList(scope.row.id)">编辑</el-button>
                        <el-button
                          size="mini"
                          type="danger"
                          @click="delList(scope.row.id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--page start-->
                  <div class="pagination-container">
                    <el-pagination
                      background
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="listPageQuery.page"
                      :page-sizes="[25, 50, 100, 150]"
                      :page-size="25"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                    </el-pagination>
                  </div>
                  <!--page end-->
            </div>
        </el-tab-pane>
        <!--用户组管理-->
        <el-tab-pane label="用户组管理" name="second">
            <div class="mt15">
              <el-form :inline="true" :model="listPageFilter1" size="small" label-width="100px">
                <el-form-item label="搜索条件：">
                    <el-input v-model="listPageFilter1.id" class="input-width" placeholder="ID" @keyup.enter.native="searchFilter1" clearable @change="changeSid1"></el-input>
                    <el-input v-model="listPageFilter1.name" class="input-width" placeholder="名称" @keyup.enter.native="searchFilter1" clearable @change="changeSname1"></el-input>
                </el-form-item>
                <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter1">
                    <span>搜索</span>
                </button>
              </el-form>
            </div>
            <div class="table-container">
                  <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList1">添加</el-button>
                  <el-table ref="usersTable"
                            :data="list1"
                            style="width: 100%;"
                            @sort-change="handleSortChange1"
                            border
                            :default-sort = "{prop: 'id', order: 'descending'}">
                    <el-table-column label="ID" prop="id" sortable="custom" width="300" align="center">
                      <template slot-scope="scope">{{scope.row.id}}</template>
                    </el-table-column>
                    <el-table-column label="用户组名称" width="300" align="center">
                      <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column label="备注" width="300" align="center">
                      <template slot-scope="scope">{{scope.row.description}}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          @click="editorList1(scope.row.id)">编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--page start-->
                  <div class="pagination-container">
                    <el-pagination
                      background
                      @size-change="handleSizeChange1"
                      @current-change="handleCurrentChange1"
                      :current-page.sync="listPageQuery1.page"
                      :page-sizes="[25, 50, 100, 150]"
                      :page-size="25"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total1">
                    </el-pagination>
                  </div>
                  <!--page end-->
            </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  import {removeEmptyObject,toSortVal} from '@/utils/index';
  import {accList,delAccList,rolesList} from '@/api/system';
  const defaultListFilter = {
    name: "",              //用户名
    real_name: "",        //real_name
    id: "",              //id
    sortby: "",         //排序
    order: ""          //排列顺序
  };
  const defaultlistPageQuery = {
    per_page: 25,
    page: 1                      //第几页   
  };
  const defaultListFilter1 = {
    name: "",               //用户名
    id: "",                //id
    sortby: "",           //排序
    order: ""            //排列顺序
  };
  const defaultlistPageQuery1 = {
    per_page: 25,
    page: 1                      //第几页   
  };
  export default {
    name:'list',
    data() {
      return {
        listPageQuery:Object.assign({},defaultlistPageQuery),
        listPageFilter:Object.assign({},defaultListFilter),
        listPageQuery1:Object.assign({},defaultlistPageQuery1),
        listPageFilter1:Object.assign({},defaultListFilter1),
        list:[],
        total:0,
        list1:[],
        total1:0,
        initParams: {},
        initParams1: {},
        activeName: '',
        accountTabName: ''
      }
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '' : '(锁定)';
      }
    },
    mounted(){
     this.accountTabName = this.$store.getters.accountTabName;
     this.accountTabName ? this.activeName = this.accountTabName :this.activeName ='first';   

     if(this.activeName == "first"){
       this.getData();   
     }
     if(this.activeName == "second"){
       this.getData1();   
     }
    },
    created(){
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeSid1(val){
        this.listPageFilter1.id = val;
      },
      changeSname1(val){
        this.listPageFilter1.name = val;
      },    
      changeRealName(val){
        this.listPageFilter.real_name = val;
      },
      handleClick(tab) {
        //用户管理
        if(tab.index == 0){
          if(this.list && this.list.length > 0){
            return;
          }else{
            this.getData();   
          }
        }
        //用户组管理
        if(tab.index == 1){
          if(this.list1 && this.list1.length > 0){
            return;
          }else{
            this.getData1();    
          }
        }
      },
      //跳转到用户新增页
      addList(){
        this.$store.commit('SET_Account_Tab_Name','first');
        this.$router.push({ name:'账户管理-用户管理', params:{} })
        this.$store.commit('SET_User_Filter', this.listPageFilter);
      },
      //跳转到用户编辑页
      editorList(id){
        this.$store.commit('SET_Account_Tab_Name','first');
        this.$router.push({ name:'账户管理-用户管理', params:{id:id} })
        this.$store.commit('SET_User_Filter', this.listPageFilter);
      }, 
      //跳转到用户组新增页
      addList1(){
        this.$store.commit('SET_Account_Tab_Name','second');
        this.$router.push({ name:'账户管理-用户组管理', params:{} })
        this.$store.commit('SET_Users_Filter', this.listPageFilter1);
      },
      //跳转到用户组编辑页
      editorList1(id){
        this.$store.commit('SET_Account_Tab_Name','second');
        this.$router.push({ name:'账户管理-用户组管理', params:{id:id, type: '编辑'} })
        this.$store.commit('SET_Users_Filter', this.listPageFilter1);
      }, 
      //搜索查询(用户组)
      searchFilter(){
        this.$store.commit('SET_User_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getData(); 
        }else{
           this.getList(this.listPageFilter);
        }
      },
      //搜索查询(用户组)
      searchFilter1(){
        this.$store.commit('SET_Users_Filter', this.listPageFilter1);
        //如果当前页数<总页数
        if(25 < this.total1){
           this.getData1();
        }else{
           this.getList1(this.listPageFilter1);
        }
      },
      //监听排序字段
      handleSortChange(val){
        if(val.prop && val.order){
          this.listPageFilter.sortby = val.prop;
          this.listPageFilter.order = toSortVal(val.order);
          this.getData();    
        }
      },
       //监听排序字段
      handleSortChange1(val){
        if(val.prop && val.order){
          this.listPageFilter1.sortby = val.prop;
          this.listPageFilter1.order = toSortVal(val.order);
          this.getData1();    
        }
      },
      //获取数据
      getData(){
        let listFilter = this.$store.getters.userFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.name        = listFilter.name;
          this.listPageFilter.real_name   = listFilter.real_name;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //获取数据
      getData1(){
        let listFilter1 = this.$store.getters.usersFilter;
        let shape       = this.$store.getters.shape;
        if(listFilter1){  
          this.initParams1 = listFilter1;
          this.listPageFilter1.id     = listFilter1.id;
          this.listPageFilter1.name   = listFilter1.name;
        }else{
          this.initParams1 = Object.assign({}, removeEmptyObject(this.listPageFilter1), removeEmptyObject(this.listPageQuery1) );
        }
        this.getList1(this.initParams1);
      },
      handleSizeChange(val) {
        this.listPageQuery.per_page = val;
        this.getData();    
      },
      handleCurrentChange(val){
        this.listPageQuery.page = val;
        this.getData();    
      },
      //获取列表
      getList(params){ 
        accList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      handleSizeChange1(val) {
        this.listPageQuery1.per_page = val;
        this.getData1();    
      },
      handleCurrentChange1(val){
        this.listPageQuery1.page = val;
        this.getData1();    
      },
      //获取列表
      getList1(params){  
        rolesList(params).then(res => {
          this.list1 = res.data; 
          this.total1 = res.total;
        });
      },
      //删除其中一行
      delList(id){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAccList(id,{}).then(res => {
              this.getData();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
</style>