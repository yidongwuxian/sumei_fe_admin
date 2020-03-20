<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>内容列表</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
            <el-input v-model="listPageFilter.id" class="input-width"  @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
          </el-form-item>
          <el-form-item label=" " class="auto100">
              <el-select v-model="listPageFilter.story_type" placeholder="栏目" clearable  @change="changeColumn">
                <el-option v-for="item in columnOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.column_id" value-key="id" placeholder="" clearable  @change="changeColumnId">
                <el-option v-for="item in typeIdOptions"
                    :key="item.id"
                    :label="item.story_type_name"
                    :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="listPageFilter.title" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="标题" @change="changeTitle"></el-input> 
          </el-form-item>
          <el-form-item label="时间类别">
              <el-select v-model="listPageFilter.date_type" placeholder="" clearable class="input-width" @change="changeDateType">
                <el-option v-for="item in columnDateOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                @change="changeRange"
                range-separator="至"
                start-placeholder=""
                end-placeholder=""
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                >
              </el-date-picker>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
          <el-col :span="16">
              <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
              <el-select v-model="listPageFilter.is_publish" size="small" placeholder="是否发布" clearable @change="switchPublish">
                <el-option v-for="item in publishOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
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
              <el-table-column label="所属站点" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="所属标签" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.tags.length > 0">
                   <el-dropdown placement="bottom">
                        <span class="el-dropdown-link">
                          详情
                        </span>
                        <el-dropdown-menu slot="dropdown" >
                            <el-dropdown-item v-for="(item,index) in scope.row.tags" :key="index">
                               <div v-if="item.name">{{item.name}}</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column label="文章标题" width="300">
                <template slot-scope="scope"><a href="javascript:;" @click="jumpLink(scope.row.preview_url)">{{scope.row.title}}</a></template>
              </el-table-column>
              <el-table-column label="发布状态" width="80" align="center">
                <template slot-scope="scope">{{scope.row.is_publish | formatStatus}}</template>
              </el-table-column>
              <el-table-column label="排序" width="80" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="浏览量" width="80" align="center">
                <template slot-scope="scope">{{scope.row.view_num}}</template>
              </el-table-column>
              <el-table-column label="UV浏览量" width="100" align="center">
                <template slot-scope="scope">{{scope.row.user_view_num}}</template>
              </el-table-column>
              <el-table-column label="IP浏览量" width="100" align="center">
                <template slot-scope="scope">{{scope.row.ip_view_num}}</template>
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
  import {onlineCourseList,delOnlineCourseList, typesList} from '@/api/substance';
  const defaultListFilter = {
    site_id: "",                   //站点ID
    id: "",                       //内容ID
    title: "",                   //文章标题
    story_type: "",             //文章模块类型
    column_id: "",             //栏目id
    date_type: "",            //时间类别
    start_date: "",          //开始日期
    end_date: "",           //结束日期
    sortby: "",            //排序
    order: "",            //排列顺序
    is_publish: "",      //发布状态
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
        typeIdOptions: [],
        list:[],
        total:0,
        ids:[],
        initParams: {},
        dateRange: "",
        columnOptions: [{
          value: 1,
          label: '装修前'
        }, {
          value: 2,
          label: '装修中'
        }, {
          value: 3,
          label: '装修后'
        }],
        columnDateOptions: [{
          value: 'create',
          label: '添加时间'
        }, {
          value: 'update',
          label: '修改时间'
        }],
        publishOptions:[{
          value: 1,
          label: '发布'
        }, {
          value: 0,
          label: '未发布'
        }],
        isFlag: false
      }
    },
    created(){
      this.getSiteId();
      this.getData();    
    },
    watch: {
      'listPageFilter.story_type': function (newValue, oldValue) {
          this.listPageFilter.column_id = null
      }
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '已发布' : '未发布';
      }
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeTitle(val){
        this.listPageFilter.title = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeDateType(val){
        this.listPageFilter.date_type = val;
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
        this.$router.push({ name:'添加/修改线上课程', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改线上课程', params:{id:id} })
        this.$store.commit('SET_Art_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        //dateRange
        if(this.dateRange){
          this.listPageFilter.start_date = this.dateRange[0];
          this.listPageFilter.end_date   = this.dateRange[1];
        }
        this.$store.commit('SET_Art_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.artFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.title       = listFilter.title;
          this.listPageFilter.story_type  = listFilter.story_type;
          this.listPageFilter.column_id   = listFilter.column_id;
          this.listPageFilter.date_type   = listFilter.date_type;
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
          this.getTypesId(); 
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
      //获取文章模块的请求参数
      changeColumn(val){
          if(val){
            this.getTypesId();  
          }
      },
      changeColumnId(val){
        this.$forceUpdate();
        this.listPageFilter.column_id = val;
      },
      //获取文章模块
      getTypesId(){
        typesList({story_type: this.listPageFilter.story_type}).then(res => {
            this.typeIdOptions = res;
        });
      },
      
      //获取列表
      getList(params){  
        onlineCourseList(params).then(res => {
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
          delOnlineCourseList(id,{}).then(res => {
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
        <span>内容列表</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
            <el-input v-model="listPageFilter.id" class="input-width"  @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
          </el-form-item>
          <el-form-item label=" " class="auto100">
              <el-select v-model="listPageFilter.story_type" placeholder="栏目" clearable  @change="changeColumn">
                <el-option v-for="item in columnOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.column_id" value-key="id" placeholder="" clearable  @change="changeColumnId">
                <el-option v-for="item in typeIdOptions"
                    :key="item.id"
                    :label="item.story_type_name"
                    :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="listPageFilter.title" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="标题" @change="changeTitle"></el-input> 
          </el-form-item>
          <el-form-item label="时间类别">
              <el-select v-model="listPageFilter.date_type" placeholder="" clearable class="input-width" @change="changeDateType">
                <el-option v-for="item in columnDateOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                @change="changeRange"
                range-separator="至"
                start-placeholder=""
                end-placeholder=""
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                >
              </el-date-picker>
          </el-form-item>
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
              <span>搜索</span>
          </button>
          <el-col :span="16">
              <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
              <el-select v-model="listPageFilter.is_publish" size="small" placeholder="是否发布" clearable @change="switchPublish">
                <el-option v-for="item in publishOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
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
              <el-table-column label="所属站点" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="所属标签" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.tags.length > 0">
                   <el-dropdown placement="bottom">
                        <span class="el-dropdown-link">
                          详情
                        </span>
                        <el-dropdown-menu slot="dropdown" >
                            <el-dropdown-item v-for="(item,index) in scope.row.tags" :key="index">
                               <div v-if="item.name">{{item.name}}</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column label="文章标题" width="300">
                <template slot-scope="scope"><a href="javascript:;" @click="jumpLink(scope.row.preview_url)">{{scope.row.title}}</a></template>
              </el-table-column>
              <el-table-column label="发布状态" width="80" align="center">
                <template slot-scope="scope">{{scope.row.is_publish | formatStatus}}</template>
              </el-table-column>
              <el-table-column label="排序" width="80" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="浏览量" width="80" align="center">
                <template slot-scope="scope">{{scope.row.view_num}}</template>
              </el-table-column>
              <el-table-column label="UV浏览量" width="100" align="center">
                <template slot-scope="scope">{{scope.row.user_view_num}}</template>
              </el-table-column>
              <el-table-column label="IP浏览量" width="100" align="center">
                <template slot-scope="scope">{{scope.row.ip_view_num}}</template>
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
  import {onlineCourseList,delOnlineCourseList, typesList} from '@/api/substance';
  const defaultListFilter = {
    site_id: "",                   //站点ID
    id: "",                       //内容ID
    title: "",                   //文章标题
    story_type: "",             //文章模块类型
    column_id: "",             //栏目id
    date_type: "",            //时间类别
    start_date: "",          //开始日期
    end_date: "",           //结束日期
    sortby: "",            //排序
    order: "",            //排列顺序
    is_publish: "",      //发布状态
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
        typeIdOptions: [],
        list:[],
        total:0,
        ids:[],
        initParams: {},
        dateRange: "",
        columnOptions: [{
          value: 1,
          label: '装修前'
        }, {
          value: 2,
          label: '装修中'
        }, {
          value: 3,
          label: '装修后'
        }],
        columnDateOptions: [{
          value: 'create',
          label: '添加时间'
        }, {
          value: 'update',
          label: '修改时间'
        }],
        publishOptions:[{
          value: 1,
          label: '发布'
        }, {
          value: 0,
          label: '未发布'
        }],
        isFlag: false
      }
    },
    created(){
      this.getSiteId();
      this.getData();    
    },
    watch: {
      'listPageFilter.story_type': function (newValue, oldValue) {
          this.listPageFilter.column_id = null
      }
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '已发布' : '未发布';
      }
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeTitle(val){
        this.listPageFilter.title = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeDateType(val){
        this.listPageFilter.date_type = val;
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
        this.$router.push({ name:'添加/修改线上课程', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改线上课程', params:{id:id} })
        this.$store.commit('SET_Art_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        //dateRange
        if(this.dateRange){
          this.listPageFilter.start_date = this.dateRange[0];
          this.listPageFilter.end_date   = this.dateRange[1];
        }
        this.$store.commit('SET_Art_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.artFilter;
        this.dateRange = [];
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.title       = listFilter.title;
          this.listPageFilter.story_type  = listFilter.story_type;
          this.listPageFilter.column_id   = listFilter.column_id;
          this.listPageFilter.date_type   = listFilter.date_type;
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
          this.getTypesId(); 
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
      //获取文章模块的请求参数
      changeColumn(val){
          if(val){
            this.getTypesId();  
          }
      },
      changeColumnId(val){
        this.$forceUpdate();
        this.listPageFilter.column_id = val;
      },
      //获取文章模块
      getTypesId(){
        typesList({story_type: this.listPageFilter.story_type}).then(res => {
            this.typeIdOptions = res;
        });
      },
      
      //获取列表
      getList(params){  
        onlineCourseList(params).then(res => {
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
          delOnlineCourseList(id,{}).then(res => {
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
