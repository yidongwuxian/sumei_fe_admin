<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>门店管理</span>
      </div>
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
              <el-select v-model="listPageFilter.status" placeholder="门店状态" clearable class="input-width" @change="changeStatus">
                <el-option
                  v-for="item in shopStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable  placeholder="门店名称" @change="changeSname"></el-input>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
        </el-form>
      </div>
      <div class="table-container">
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                      border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="门店名称">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="门店地址">
                <template slot-scope="scope">{{scope.row.address}}</template>
              </el-table-column>
              <el-table-column label="所属城市" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.city">{{scope.row.city.name}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="排序" width="100" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="电话" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.phone}}</template>
              </el-table-column>
              <el-table-column label="门店状态" width="80" align="center">
                <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
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
  import {fetchList,delFetchList} from '@/api/activity';
  const defaultListFilter = {
    site_id: "",               //站点ID
    status: "",               //门店状态
    name: "",                //门店名称
    sortby: "",             //排序
    order: ""              //排列顺序
  };
  const defaultlistPageQuery = {
    per_page: 25,
    page: 1                      //第几页   
  };
  const shopStatus = [{
    value: '1',
    label: '显示'
  }, {
    value: '0',
    label: '隐藏'
  }];
  export default {
    name:'list',
    data() {
      return {
        listPageQuery:Object.assign({},defaultlistPageQuery),
        listPageFilter:Object.assign({},defaultListFilter),
        siteidOptions: [],
        shopStatus: Object.assign({},shopStatus),
        list:[],
        total:0,
        multipleSelection:[],
        initParams: []
      }
    },
    created(){
      this.getSiteId();
      this.getData();    
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
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改门店', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改门店', params:{id:id} })
        this.$store.commit('SET_Act_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Act_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.listPageFilter);
        }else{
           this.getData();    
        }
      },
      handleSizeChange(val) {
        this.listPageQuery.per_page = val;
        this.getData();
      },
      handleCurrentChange(val){
        this.listPageQuery.page = val;
        this.getData();
      },
      //获取数据
      getData(){
        let listFilter = this.$store.getters.actlistFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id = listFilter.site_id;
          this.listPageFilter.status  = listFilter.status;
          this.listPageFilter.name    = listFilter.name;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //监听排序字段
      handleSortChange(val){
        if(val.prop && val.order){
          this.listPageFilter.sortby = val.prop;
          this.listPageFilter.order = toSortVal(val.order);
          this.getData();    
        }
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取列表
      getList(params){  
        fetchList(params).then(res => {
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
          delFetchList(id,{}).then(res => {
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
        <span>门店管理</span>
      </div>
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
              <el-select v-model="listPageFilter.status" placeholder="门店状态" clearable class="input-width" @change="changeStatus">
                <el-option
                  v-for="item in shopStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable  placeholder="门店名称" @change="changeSname"></el-input>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
        </el-form>
      </div>
      <div class="table-container">
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                      border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="门店名称">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="门店地址">
                <template slot-scope="scope">{{scope.row.address}}</template>
              </el-table-column>
              <el-table-column label="所属城市" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.city">{{scope.row.city.name}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="排序" width="100" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="电话" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.phone}}</template>
              </el-table-column>
              <el-table-column label="门店状态" width="80" align="center">
                <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
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
  import {fetchList,delFetchList} from '@/api/activity';
  const defaultListFilter = {
    site_id: "",               //站点ID
    status: "",               //门店状态
    name: "",                //门店名称
    sortby: "",             //排序
    order: ""              //排列顺序
  };
  const defaultlistPageQuery = {
    per_page: 25,
    page: 1                      //第几页   
  };
  const shopStatus = [{
    value: '1',
    label: '显示'
  }, {
    value: '0',
    label: '隐藏'
  }];
  export default {
    name:'list',
    data() {
      return {
        listPageQuery:Object.assign({},defaultlistPageQuery),
        listPageFilter:Object.assign({},defaultListFilter),
        siteidOptions: [],
        shopStatus: Object.assign({},shopStatus),
        list:[],
        total:0,
        multipleSelection:[],
        initParams: []
      }
    },
    created(){
      this.getSiteId();
      this.getData();    
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
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改门店', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改门店', params:{id:id} })
        this.$store.commit('SET_Act_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Act_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.listPageFilter);
        }else{
           this.getData();    
        }
      },
      handleSizeChange(val) {
        this.listPageQuery.per_page = val;
        this.getData();
      },
      handleCurrentChange(val){
        this.listPageQuery.page = val;
        this.getData();
      },
      //获取数据
      getData(){
        let listFilter = this.$store.getters.actlistFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id = listFilter.site_id;
          this.listPageFilter.status  = listFilter.status;
          this.listPageFilter.name    = listFilter.name;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //监听排序字段
      handleSortChange(val){
        if(val.prop && val.order){
          this.listPageFilter.sortby = val.prop;
          this.listPageFilter.order = toSortVal(val.order);
          this.getData();    
        }
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取列表
      getList(params){  
        fetchList(params).then(res => {
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
          delFetchList(id,{}).then(res => {
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
