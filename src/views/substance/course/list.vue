<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>线下课程列表</span>
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
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="活动名称" @change="changeSname"></el-input>
          </el-form-item>
          <el-form-item label="课程时间：">
              <el-date-picker
                v-model="dateRange"
                @change="changeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
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
              <el-table-column label="线下课程名称">
                <template slot-scope="scope"><a href="javascript:;" @click="jumpLink(scope.row.preview_url)">{{scope.row.name}}</a></template>
              </el-table-column>
              <el-table-column label="课程时间" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.start_time}}</span>
                </template>
              </el-table-column>
              <el-table-column label="排序" width="180" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="点击量" width="100" align="center">
                <template slot-scope="scope">{{scope.row.hits}}</template>
              </el-table-column>
              <el-table-column label="报名人数" width="180" align="center">
                <template slot-scope="scope">{{scope.row.sign_num}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="最后修改时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="最后修改人" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
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
  import {unlineCourseList,delUnlineCourseList} from '@/api/substance';
  const defaultListFilter = {
    site_id: "",             //站点ID
    name: "",                //门店名称
    start_time: "",
    end_time: "",
    sortby: "",           //排序
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
        dateRange: "",
        isFlag: false
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
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeRange(val){
        if(val){
          this.dateRange = val;
          this.listPageFilter.start_time = this.dateRange[0];
          this.listPageFilter.end_time = this.dateRange[1];
        }
        if(val == null){
          this.dateRange = [];
          this.listPageFilter.start_time = '';
          this.listPageFilter.end_time = '';
        }
      },
      //跳转到外链
      jumpLink(url){
        const protocolStr = document.location.protocol;
        let newUrl = protocolStr + url
        window.open(newUrl);
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改线下课程', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改线下课程', params:{id:id} })
        this.$store.commit('SET_Course_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        //dateRange
        if(this.dateRange){
          this.listPageFilter.start_time = this.dateRange[0];
          this.listPageFilter.end_time   = this.dateRange[1];
        }
        this.$store.commit('SET_Course_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.courseFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.name        = listFilter.name;
          if(listFilter.start_time){
            this.listPageFilter.start_time  = listFilter.start_time;
          }else{
            this.listPageFilter.start_time  = '';
          }
          if(listFilter.end_time){
            this.listPageFilter.end_time    = listFilter.end_time;
          }else{
            this.listPageFilter.end_time  = '';
          }
          this.dateRange.push(this.listPageFilter.start_time, this.listPageFilter.end_time);
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
        unlineCourseList(params).then(res => {
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
          delUnlineCourseList(id,{}).then(res => {
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


