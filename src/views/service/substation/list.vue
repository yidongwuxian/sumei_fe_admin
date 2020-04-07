<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>分站模板管理</span>
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
              <el-input v-model="listPageFilter.template_name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="输入模板名称关键字" @change="changeTempName"></el-input>
              <el-input v-model="listPageFilter.id" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
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
              <el-table-column label="所属站点" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="模板名称" width="300">
                <template slot-scope="scope" v-if="scope.row.templates"><a href="javascript:;" @click="jumpLink(scope.row.preview_url)">{{scope.row.templates.name}}</a></template>
              </el-table-column>
              <el-table-column label="备注" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.templates">{{scope.row.templates.remark}}</template>
              </el-table-column>
              <el-table-column label="适用类型" width="80" align="center">
                <template slot-scope="scope">{{scope.row.platform | formatPlatForm }}</template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" sortable="custom" width="80" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="修改时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" align="center">
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
  import {siteTList,delSiteTList,getTempList} from '@/api/service';
  const defaultListFilter = {
    id: "",                   //主键ID
    site_id: "",             //站点ID
    template_name: "",      //模板名
    sortby: "",            //排序
    order: "",            //排列顺序
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
        tempSearchArr: [],
        initParams: {},
        dateRange: "",
        listLoading: false
      }
    },
    created(){
      this.getSiteId();
      this.getTempId();
      this.getData();  
    },
    filters:{
      formatPlatForm(num){
        return num = num == 1 ? 'PC' : 'H5';
      }
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeTempName(val){
        this.listPageFilter.template_name = val;
      },
      //获取模板ID
      getTempId(){
        getTempList({name: this.listPageFilter.templates_id}).then(res => {
          this.tempSearchArr = res;
        });
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改分站模板', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改分站模板', params:{id:id} })
        this.$store.commit('SET_Substation_Filter', this.listPageFilter);
      },
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Substation_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.substationFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id            = listFilter.id;
          this.listPageFilter.site_id       = listFilter.site_id;
          this.listPageFilter.template_name = listFilter.template_name;
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
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取列表
      getList(params){  
        siteTList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //跳转到外链
      jumpLink(url){
        const protocolStr = document.location.protocol;
        let newUrl = protocolStr + url
        window.open(newUrl);
      },
      //删除其中一行
      delList(id){ 
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSiteTList(id,{}).then(res => {
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


