<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>分站客服代码管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.is_closed" placeholder="是否禁用" clearable class="input-width" @change="changeIsClosed">
                  <el-option v-for="item in forbOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                  </el-option>
              </el-select>
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
              <el-table-column label="ID" prop="id" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="220" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="分站ID" width="200" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.id}}</template>
              </el-table-column>
              <el-table-column label="平台" width="200" align="center">
                <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
              </el-table-column>
              <el-table-column label="服务商" width="200" align="center">
                <template slot-scope="scope">{{scope.row.vendor | formatProvider }}</template>
              </el-table-column>
              <el-table-column label="是否禁用" width="200" align="center">
                <template slot-scope="scope">{{scope.row.is_closed | formatIsClosed }}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="200" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="200" align="center">
                <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="200" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editorList(scope.row.id)">编辑</el-button>
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
  import {cusList,delCusList} from '@/api/customer';
  const defaultListFilter = {
    site_id: "",             //站点ID
    is_closed: '',              //是否禁用
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
        initParams: {},
        forbOptions: [
          {
             value: 1,
             label: '是'
          },
          {
             value: 0,
             label: '否'
          }
        ]
      }
    },
    created(){
      this.getSiteId();
      this.getData();    
    },
    filters:{
      formatPlatform(num){
        return num = num == 1 ? 'PC' : 'H5';
      },
      formatProvider(num){
        switch(num) {
          case 1:
              num = '乐语';
              break;
          case 2:
              num = '美洽';
              break;
          case 3:
              num = '百度商桥';
              break; 
          case 4:
              num = '商务通';
              break;             
          default:
              break;        
        }
        return num; 
      },
      formatIsClosed(num){
        return num = num == 1 ? '是' : '否';
      }
    },
    methods:{
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeIsClosed(val){
        this.listPageFilter.is_closed = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改客服代码', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改客服代码', params:{id:id} })
        this.$store.commit('SET_Customer_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Customer_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.customerFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.is_closed   = listFilter.is_closed;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
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
      getList(params){  
        cusList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
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
        <span>分站客服代码管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.is_closed" placeholder="是否禁用" clearable class="input-width" @change="changeIsClosed">
                  <el-option v-for="item in forbOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                  </el-option>
              </el-select>
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
              <el-table-column label="ID" prop="id" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="220" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="分站ID" width="200" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.id}}</template>
              </el-table-column>
              <el-table-column label="平台" width="200" align="center">
                <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
              </el-table-column>
              <el-table-column label="服务商" width="200" align="center">
                <template slot-scope="scope">{{scope.row.vendor | formatProvider }}</template>
              </el-table-column>
              <el-table-column label="是否禁用" width="200" align="center">
                <template slot-scope="scope">{{scope.row.is_closed | formatIsClosed }}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="200" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="200" align="center">
                <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="200" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editorList(scope.row.id)">编辑</el-button>
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
  import {cusList,delCusList} from '@/api/customer';
  const defaultListFilter = {
    site_id: "",             //站点ID
    is_closed: '',              //是否禁用
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
        initParams: {},
        forbOptions: [
          {
             value: 1,
             label: '是'
          },
          {
             value: 0,
             label: '否'
          }
        ]
      }
    },
    created(){
      this.getSiteId();
      this.getData();    
    },
    filters:{
      formatPlatform(num){
        return num = num == 1 ? 'PC' : 'H5';
      },
      formatProvider(num){
        switch(num) {
          case 1:
              num = '乐语';
              break;
          case 2:
              num = '美洽';
              break;
          case 3:
              num = '百度商桥';
              break; 
          case 4:
              num = '商务通';
              break;             
          default:
              break;        
        }
        return num; 
      },
      formatIsClosed(num){
        return num = num == 1 ? '是' : '否';
      }
    },
    methods:{
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeIsClosed(val){
        this.listPageFilter.is_closed = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改客服代码', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改客服代码', params:{id:id} })
        this.$store.commit('SET_Customer_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Customer_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.customerFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.is_closed   = listFilter.is_closed;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
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
      getList(params){  
        cusList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
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
