<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>专题管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="请选择站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="专题来源:" class="auto100">
              <el-select v-model="listPageFilter.platform" placeholder="请选择来源" clearable  @change="changePlatform">
                    <el-option v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
              </el-select>
              <el-input v-model="listPageFilter.id" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="专题ID" @change="changeSid"></el-input>
          </el-form-item>
          <el-form-item label=" " class="auto100">
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="标题" @change="changeSname"></el-input>
              <el-input v-model="listPageFilter.user_name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="作者" @change="changeAuthor"></el-input>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                @change="changeRange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
              <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
                  <span>搜索</span>
              </button>
          </el-form-item>
          <el-col :span="16">
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
            <el-select class="ml10" size="small"  v-model="listPageFilter.is_publish" placeholder="是否发布" clearable @change="switchPublish">
                  <el-option v-for="item in publishOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
            </el-select> 
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-takeaway-box" @click="getPublish">{{isPublishTx}}</el-button> 
          </el-col>
          
        </el-form>
      </div>
      <div class="table-container">
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @selection-change="handleSelectionChange"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column type="selection" width="60" align="center"></el-table-column>
              <el-table-column label="ID" prop="id" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="专题标题">
                <template slot-scope="scope"><a href="javascript:;" @click="jumpLink(scope.row.preview_url)">{{scope.row.name}}</a></template>
              </el-table-column>
              <el-table-column label="作者" width="150" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="专题类型" width="100" align="center">
                <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
              </el-table-column>
              <el-table-column label="发布状态" width="100" align="center">
                <template slot-scope="scope">{{scope.row.is_publish | formatPublish}}</template>
              </el-table-column>
              <el-table-column label="排序" width="100" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="报名人数" width="160" align="center">
                <template slot-scope="scope">{{scope.row.sign_num}}</template>
              </el-table-column>
              <el-table-column label="浏览量" width="100" align="center">
                <template slot-scope="scope">{{scope.row.views_num}}</template>
              </el-table-column>
              <el-table-column label="站点" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="发布时间" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="修改时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.updated_at}}</template>
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
  import {specialList,delSpecList,setSpecPublish} from '@/api/special';
  const defaultListFilter = {
    id: "",                            //专题id
    name:"",                          //专题标题
    user_name: "",                   //作者名称
    site_id: "",                    //站点ID
    platform: "",                  //专题来源
    start_date: "",               //开始时间
    end_date: "",                //结束时间
    is_publish: 1,              //发布状态
    sortby: "",                //排序
    order: ""                 //排列顺序
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
        ids: [],
        total:0,
        initParams: {},
        isFlag:false,
        dateRange: "",
        typeOptions: [
          {
             value: 1,
             label: 'PC'
          },
          {
             value: 2,
             label: 'H5'
          }
        ],
        publishOptions: [
          {
             value: 1,
             label: '已发布'
          },
          {
             value: 0,
             label: '未发布'
          }
        ],
        isPublishTx: '取消发布',
        isPublishStatus: 0
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
      formatPublish(num){
        return num = num == 1 ? '是' : '否';
      }
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changePlatform(val){
        this.listPageFilter.platform = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeAuthor(val){
        this.listPageFilter.user_name = val;
      },
      changeRange(val){
        if(val){
          this.dateRange = val;
          this.listPageFilter.start_date = this.dateRange[0];
          this.listPageFilter.end_date = this.dateRange[1];
        }
        if(val == null){
          this.dateRange = [];
          this.listPageFilter.start_date = '';
          this.listPageFilter.end_date = '';
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
        this.$router.push({ name:'添加/修改专题', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改专题', params:{id:id} })
        this.$store.commit('SET_Special_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        //dateRange
        if(this.dateRange){
          this.listPageFilter.start_date = this.dateRange[0];
          this.listPageFilter.end_date   = this.dateRange[1];
        }
        this.$store.commit('SET_Special_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.specialFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.platform    = listFilter.platform;
          this.listPageFilter.name        = listFilter.name;
          this.listPageFilter.user_name   = listFilter.user_name;
          if(listFilter.start_date){
            this.listPageFilter.start_date  = listFilter.start_date;
          }else{
            this.listPageFilter.start_date  = '';
          }
          if(listFilter.end_date){
            this.listPageFilter.end_date    = listFilter.end_date;
          }else{
            this.listPageFilter.end_date  = '';
          }
          this.dateRange.push(this.listPageFilter.start_date, this.listPageFilter.end_date);
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
      //是否发布 start
      handleSelectionChange(val){
        this.ids = [];
        for(let i=0; i<val.length; i++){
          this.ids.push(val[i].id);
        }
        this.isFlag = val != '' ? true : false;
      },
      switchPublish(val){
        this.listPageFilter.is_publish = val;
        this.listPageQuery.per_page = 25;
        this.listPageQuery.page     = 1;
        this.getData();  

        if(val == 1){
          this.isPublishTx = '取消发布';
          this.isPublishStatus = 0;
        }
        if(val == 0){
          this.isPublishTx = '发布';
          this.isPublishStatus = 1;
        }      
      },
      //获取发布状态
      getPublish(){
        if(this.ids.length == 0 ){
          this.$message({
            type: 'info',
            message: '请先选择一条数据!'
          }); 
          return;
        }

        if(this.isPublishStatus < 0){
            return;
        }  

        let params = {
            ids: this.ids,
            is_publish: this.isPublishStatus
        }
      
        setSpecPublish(params).then(res => {
            this.getData();   
        });
      },
      //是否发布 end
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
        specialList(params).then(res => {
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
          delSpecList(id,{}).then(res => {
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


