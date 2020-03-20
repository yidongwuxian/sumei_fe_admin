<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>模板管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-input v-model="listPageFilter.id" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="名称" @change="changeSname"></el-input>
              <el-input v-model="listPageFilter.remark" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="备注" @change="changeRemark"></el-input>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
        </el-form>
      </div>
      <div class="table-container">
            <el-button class="btn_m20" type="primary" size="small"  icon="el-icon-plus" @click="addList">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="模板名称" width="354">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="备注" width="354">
                <template slot-scope="scope">{{scope.row.remark}}</template>
              </el-table-column>
              <el-table-column label="适用类型" width="150" align="center">
                <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
              </el-table-column>
              <el-table-column label="修改时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="180" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
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
    </el-card>
  </div>
</template>
<script>
  import {removeEmptyObject,toSortVal} from '@/utils/index';
  import {siteNameList} from '@/api/public';
  import {templateList,delTempList} from '@/api/service';
  const defaultListFilter = {
    id: "",                    //专题ID
    name: "",                 //专题标题
    remark: "",              //备注
    sortby: "",             //排序
    order: "",             //排列顺序
  };
  const defaultlistPageQuery = {
    per_page: 25,
    page: 1                      //第几页   
  };
  export default {
    name:'list',
    data() {
      return {
        listPageQuery:Object.assign({},defaultlistPageQuery),
        listPageFilter:Object.assign({},defaultListFilter),
        list:[],
        total:0,
        initParams: {}
      }
    },
    created(){
      this.getData();    
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      },
      formatPlatform(num){
        return num = num == 1 ? 'PC' : 'H5';
      }
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeRemark(val){
        this.listPageFilter.remark = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改服务模板', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改服务模板', params:{id:id} })
        this.$store.commit('SET_Template_Filter', this.listPageFilter);
      },
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Template_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.listPageFilter);
        }else{
          this.getData();    
        }
      },
      //start
      //监听排序字段
      handleSortChange(val){
        if(val.prop && val.order){
          this.listPageFilter.sortby = val.prop;
          this.listPageFilter.order = toSortVal(val.order);
          this.getData();    
        }
      },
      //获取数据
      getData(){
        let listFilter = this.$store.getters.templateFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id        = listFilter.id;
          this.listPageFilter.name      = listFilter.name;
          this.listPageFilter.remark    = listFilter.remark;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
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
        templateList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //删除其中一行
      delList(id){ 
        this.$confirm('删除后所选分站配置将一并删除，是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTempList(id,{}).then(res => {
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


=======
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>模板管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-input v-model="listPageFilter.id" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="名称" @change="changeSname"></el-input>
              <el-input v-model="listPageFilter.remark" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="备注" @change="changeRemark"></el-input>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
        </el-form>
      </div>
      <div class="table-container">
            <el-button class="btn_m20" type="primary" size="small"  icon="el-icon-plus" @click="addList">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="模板名称" width="354">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="备注" width="354">
                <template slot-scope="scope">{{scope.row.remark}}</template>
              </el-table-column>
              <el-table-column label="适用类型" width="150" align="center">
                <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
              </el-table-column>
              <el-table-column label="修改时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="180" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
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
    </el-card>
  </div>
</template>
<script>
  import {removeEmptyObject,toSortVal} from '@/utils/index';
  import {siteNameList} from '@/api/public';
  import {templateList,delTempList} from '@/api/service';
  const defaultListFilter = {
    id: "",                    //专题ID
    name: "",                 //专题标题
    remark: "",              //备注
    sortby: "",             //排序
    order: "",             //排列顺序
  };
  const defaultlistPageQuery = {
    per_page: 25,
    page: 1                      //第几页   
  };
  export default {
    name:'list',
    data() {
      return {
        listPageQuery:Object.assign({},defaultlistPageQuery),
        listPageFilter:Object.assign({},defaultListFilter),
        list:[],
        total:0,
        initParams: {}
      }
    },
    created(){
      this.getData();    
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      },
      formatPlatform(num){
        return num = num == 1 ? 'PC' : 'H5';
      }
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeRemark(val){
        this.listPageFilter.remark = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改服务模板', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改服务模板', params:{id:id} })
        this.$store.commit('SET_Template_Filter', this.listPageFilter);
      },
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Template_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.listPageFilter);
        }else{
          this.getData();    
        }
      },
      //start
      //监听排序字段
      handleSortChange(val){
        if(val.prop && val.order){
          this.listPageFilter.sortby = val.prop;
          this.listPageFilter.order = toSortVal(val.order);
          this.getData();    
        }
      },
      //获取数据
      getData(){
        let listFilter = this.$store.getters.templateFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id        = listFilter.id;
          this.listPageFilter.name      = listFilter.name;
          this.listPageFilter.remark    = listFilter.remark;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
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
        templateList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //删除其中一行
      delList(id){ 
        this.$confirm('删除后所选分站配置将一并删除，是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTempList(id,{}).then(res => {
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


>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
