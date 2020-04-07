<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>工队管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索工队/工长">
            <el-input v-model="listPageFilter.id" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
            <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="名称" @change="changeSname"></el-input>
            <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width" @change="changeSiteId">
              <el-option v-for="item in siteidOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="listPageFilter.status" placeholder="是否展示" clearable class="input-width" @change="changeStatus">
              <el-option v-for="item in spreadOptions"
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
              <el-table-column label="ID" prop="id" sortable="custom" width="70" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="工长名称">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="年限" width="80" align="center">
                <template slot-scope="scope">{{scope.row.years}}</template>
              </el-table-column>
              <el-table-column label="籍贯" width="106" align="center">
                <template slot-scope="scope"><span v-if="scope.row.city.province">{{scope.row.city.province.name}}</span><span v-if="scope.row.city.province && scope.row.city">-</span><span v-if="scope.row.city">{{scope.row.city.name}}</span></template>
              </el-table-column>
              <el-table-column label="评级" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.star">{{scope.row.star}}星</template>
              </el-table-column>
              <el-table-column label="团队人数" width="100" align="center">
                <template slot-scope="scope">{{scope.row.people_num}}</template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
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
              <el-table-column label="状态" width="100" align="center">
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
  import {siteNameList,getBuilding} from '@/api/public';
  import {groupList,delGroupList} from '@/api/building';
  const defaultListFilter = {
    id:      "",               //ID
    name: "",                 //名称
    status: 1,               //状态
    site_id: "",            //站点ID
    building_id: "",       //楼盘ID
    sortby: "",           //排序
    order: ""            //排列顺序
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
        spreadOptions:[{
          value: 1,
          label: '是'
        }, {
          value: 0,
          label: '否'
        }],
        caseStatus: [{
          value: 1,
          label: '已发布'
        }, {
          value: 0,
          label: '未发布'
        }],
        city_id: '',
        list:[],
        buildOptions: [],
        cityidProps:  {
          value: 'id',
          label: 'name',
          children: 'cities'
        },
        cityidOptions: [],
        total:0,
        initParams:[],
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
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeSiteId(val){
        this.listPageFilter.site_id = val;
      },
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改工队', params:{} })
      },
      //跳转到编辑页
      editorList(id,parent_id){
        this.$router.push({ name:'添加/修改工队', params:{id:id,parent_id:parent_id} })
        this.$store.commit('SET_Group_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Group_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.listPageFilter);
        }else{
          this.getData();    
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
      //获取数据
      getData(){
        let listFilter = this.$store.getters.groupFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.name        = listFilter.name;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.status      = listFilter.status;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      handleSizeChange(val) {
        this.listPageQuery.per_page = val;
        this.getData();  
      },
      handleCurrentChange(val){
        this.listPageQuery.page = val;
        this.getData();  
      },
      handleChange(value) {
        if(value){
          this.city_id = value[1];
        }
        this.getBuilding();
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
       //获取楼盘
      getBuilding(){
        if(this.city_id){
          getBuilding(this.city_id,{}).then(res => {
            this.buildOptions = res;
          });
        }
      },
      //获取列表
      getList(params){  
        groupList(params).then(res => {
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
          delGroupList(id,{}).then(res => {
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


