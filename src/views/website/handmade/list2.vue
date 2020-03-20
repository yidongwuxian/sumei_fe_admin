<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <!--title-page start-->
      <el-page-header @back="jumpBack" :content="sname"></el-page-header>
      <el-divider></el-divider>
      <!--title-page end-->
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="选择站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
        </el-form>
      </div>
      <div class="table-container">
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList" v-if="sname == '广告位' || sname == '功能模块' ">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="标题" width="180">
                <template slot-scope="scope">{{scope.row.title}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="描述">
                <template slot-scope="scope">{{scope.row.description}}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editorList(scope.row.id)">编辑</el-button>
                  <el-button
                    v-if="sname == '广告位'"
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
  import {handModeDataList,delhandModeDataList} from '@/api/handmade';
  const defaultListFilter = {
    site_id: "",            //站点ID
    sortby: "",            //排序
    order: ""             //排列顺序
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
        siteidOptions: [],
        list:[],
        total:0,
        id: '',
        sname: '',
        sFlag: 0,
        initParams: {}
      }
    },
    created(){
      if(this.$route.params.id){
        this.sname = this.$route.params.name;
        this.id = this.$route.params.id;
      }else{
        this.id = localStorage.id;
        this.sname = localStorage.sname;
      }

      this.getData();   
      this.getSiteId();
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      }
    },
    methods:{
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      //返回上一页（列表页）
      jumpBack(){
        let moduleType = JSON.parse(sessionStorage.getItem('moduleData'));
        if(moduleType.type){
            this.$router.push({ name:'手工块管理', params:{ site_type: moduleType.type }  })
        }
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改模块', params:{id:this.id, sid:this.id, name: this.sname, type:"新增"} }) 
        localStorage.id = this.id
        localStorage.sname = this.sname
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改模块', params:{id:id, sid:this.id, name: this.sname, type:"编辑"} })
        this.$store.commit('SET_handList2_Filter', this.listPageFilter);
        localStorage.id = this.id
        localStorage.sname = this.sname
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_handList2_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.id,this.listPageFilter);
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
        let listFilter = this.$store.getters.handList2Filter;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.id,this.initParams);
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
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取列表
      getList(id,params){  
        
        if(!id){
          return;
        }
        handModeDataList(id,params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //删除其中一行
      delList(id){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delhandModeDataList(id,{}).then(res => {
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
      <!--title-page start-->
      <el-page-header @back="jumpBack" :content="sname"></el-page-header>
      <el-divider></el-divider>
      <!--title-page end-->
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="选择站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
        </el-form>
      </div>
      <div class="table-container">
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList" v-if="sname == '广告位' || sname == '功能模块' ">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="标题" width="180">
                <template slot-scope="scope">{{scope.row.title}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="描述">
                <template slot-scope="scope">{{scope.row.description}}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editorList(scope.row.id)">编辑</el-button>
                  <el-button
                    v-if="sname == '广告位'"
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
  import {handModeDataList,delhandModeDataList} from '@/api/handmade';
  const defaultListFilter = {
    site_id: "",            //站点ID
    sortby: "",            //排序
    order: ""             //排列顺序
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
        siteidOptions: [],
        list:[],
        total:0,
        id: '',
        sname: '',
        sFlag: 0,
        initParams: {}
      }
    },
    created(){
      if(this.$route.params.id){
        this.sname = this.$route.params.name;
        this.id = this.$route.params.id;
      }else{
        this.id = localStorage.id;
        this.sname = localStorage.sname;
      }

      this.getData();   
      this.getSiteId();
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      }
    },
    methods:{
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      //返回上一页（列表页）
      jumpBack(){
        let moduleType = JSON.parse(sessionStorage.getItem('moduleData'));
        if(moduleType.type){
            this.$router.push({ name:'手工块管理', params:{ site_type: moduleType.type }  })
        }
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改模块', params:{id:this.id, sid:this.id, name: this.sname, type:"新增"} }) 
        localStorage.id = this.id
        localStorage.sname = this.sname
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改模块', params:{id:id, sid:this.id, name: this.sname, type:"编辑"} })
        this.$store.commit('SET_handList2_Filter', this.listPageFilter);
        localStorage.id = this.id
        localStorage.sname = this.sname
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_handList2_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.id,this.listPageFilter);
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
        let listFilter = this.$store.getters.handList2Filter;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.id,this.initParams);
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
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取列表
      getList(id,params){  
        
        if(!id){
          return;
        }
        handModeDataList(id,params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //删除其中一行
      delList(id){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delhandModeDataList(id,{}).then(res => {
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
