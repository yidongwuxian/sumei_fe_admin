<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>案例管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="案例状态" style="clear:both;width:100%;">
            <el-select v-model="listPageFilter.status" placeholder="案例状态" clearable class="input-width"  @change="changeStatus">
              <el-option
                v-for="item in caseStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="案例搜索">
              <el-input v-model="listPageFilter.id" class="input-width mb10" @keyup.enter.native="searchFilter" clearable placeholder="ID"  @change="changeSid"></el-input>
              <el-input v-model="listPageFilter.name" class="input-width mb10" @keyup.enter.native="searchFilter" clearable placeholder="名称" @change="changeSname"></el-input>  
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.price_id" placeholder="所属套系" clearable class="input-width"  @change="changeSleeve">
                <el-option v-for="item in sleeveOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label=" " >
              <el-select v-model="listPageFilter.tag_id" placeholder="所属标签" clearable class="input-width" @change="changeTag">
                <el-option v-for="item in tagData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.house_area_id" placeholder="所属面积" clearable class="input-width" @change="changeHouseArea">
                <el-option v-for="item in houseAreaOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.house_type_id" placeholder="户型" clearable class="input-width" @change="changeHouseType">
                <el-option v-for="item in houseTypeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
                  <span>搜索</span>
              </button>
          </el-form-item>
          
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
              <el-table-column label="ID" prop="id" sortable="custom" width="70" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="案例名称" width="600">
                <template slot-scope="scope">
                <span v-if="scope.row.parent">
                    <a href="javascript:;" @click="jumpLink(scope.row.preview_url)">
                        <span>{{scope.row.parent.name}}/</span>
                        <span v-if="scope.row.parent.house_type">{{scope.row.parent.house_type.name}}</span> /
                        <span v-if="scope.row.parent.tags.length > 0">
                          {{scope.row.parent.tags | formatTagName}} /
                        </span>
                        <span v-if="scope.row.parent.price">{{scope.row.parent.price.name}}</span>
                        <span>【{{scope.row.parent.subject_photos_count}}图】</span> 
                    </a>
                </span>
                <span v-if="!scope.row.parent">
                    <a href="javascript:;" @click="jumpLink(scope.row.preview_url)">
                        <span v-if="scope.row.name">{{scope.row.name}}/</span>
                        <span v-if="scope.row.house_type">{{scope.row.house_type.name}}</span> /
                        <span v-if="scope.row.tags.length > 0">
                          {{scope.row.tags | formatTagName}} /
                        </span>
                        <span v-if="scope.row.price">{{scope.row.price.name}}</span> 
                        <span>【{{scope.row.subject_photos_count}}图】</span>
                    </a>
                </span>  
                <el-tag type="danger" effect="dark" style="margin-left:10px;" v-if="scope.row.parent_id != 0">转载</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="所属站点" width="150" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" sortable="custom" width="80" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom"  width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="浏览量" prop="view_num" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.view_num}}</template>
              </el-table-column>
              <el-table-column label="添加时间" prop="created_at" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="100" align="center">
                 <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
              </el-table-column>
              <el-table-column label="最后修改时间" prop="updated_at" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="最后修改人" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="案例状态" width="100" align="center">
                <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    icon="el-icon-edit"
                    type="primary"
                    @click="editorList(scope.row.id,scope.row.parent_id)"></el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="delList(scope.row.id)"></el-button>
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
  import {tagsList} from '@/api/tags';
  import {siteNameList,getSleeve,getAreas,getHouseTypes} from '@/api/public';
  import {caseList,delCaseList} from '@/api/case';
  const defaultListFilter = {
    id:      "",              //ID
    name: "",                //案例名称
    status: 1,             //案例状态
    site_id: "",           //站点ID
    price_id:"",          //套系id
    house_type_id:"",     //户型id
    tag_id: "",           //面积id
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
        sleeveOptions: [],
        houseAreaOptions: [],
        houseTypeOptions: [],
        caseStatus: [{
          value: 1,
          label: '已发布'
        }, {
          value: 0,
          label: '未发布'
        }],
        list:[],
        total:0,
        initParams:[],
        tagData: [],
        tag_name: ''
      }
    },
    created(){
      //获取标签
      this.getTags();
      this.getSiteId();
      //所属套系
      this.getSleeves();
      //所属面积
      this.getHouseAreas();
      //所属户型
      this.getHouseTypes();
      //初始数据
      this.getData();    
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      },
      formatTagName(num){
        let m_str = '';
        if(num && num.length >= 2){
          m_str = num[0].name + '-' + num[1].name;
        }
        if(num.length > 0 && num.length < 2){
          m_str = num[0].name; 
        }
        return num = m_str;
      }
    },
    methods:{
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeSleeve(val){
        this.listPageFilter.price_id = val;
      },
      changeTag(val){
        this.listPageFilter.tag_id = val;
      },
      changeHouseArea(val){
        this.listPageFilter.house_area_id = val;
      },
      changeHouseType(val){
        this.listPageFilter.house_type_id = val;
      },
      //跳转到外链
      jumpLink(url){
        const protocolStr = document.location.protocol;
        let newUrl = protocolStr + url
        window.open(newUrl);
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改案例', params:{} })
      },
      //跳转到编辑页
      editorList(id,parent_id){
        this.$router.push({ name:'添加/修改案例', params:{id:id,parent_id:parent_id} })
        this.$store.commit('SET_Case_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Case_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.caselistFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id            = listFilter.id;
          this.listPageFilter.name          = listFilter.name;
          this.listPageFilter.status        = listFilter.status;
          this.listPageFilter.site_id       = listFilter.site_id;
          this.listPageFilter.price_id      = listFilter.price_id;
          this.listPageFilter.tag_id        = listFilter.tag_id;
          this.listPageFilter.house_area_id = listFilter.house_area_id;
          this.listPageFilter.house_type_id = listFilter.house_type_id;
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
      //获取所属套系
      getSleeves(){
        getSleeve({}).then(res => {
          this.sleeveOptions = res;
        });
      },
      //获取标签
      getTags(){  
        tagsList({per_page: 10000}).then(res => {
          this.tagData = res.data; 
        });
      },
      //获取所属面积
      getHouseAreas(){
        getAreas({}).then(res => {
          this.houseAreaOptions = res;
        });
      },
      //获取户型类别
      getHouseTypes(){
        getHouseTypes({}).then(res => {
          this.houseTypeOptions = res;
        });
      },
      //获取列表
      getList(params){  
        caseList(params).then(res => {
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
          delCaseList(id,{}).then(res => {
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


