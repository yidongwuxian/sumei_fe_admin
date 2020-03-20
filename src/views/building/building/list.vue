<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>楼盘管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="楼盘名称" @change="changeSname"></el-input>
              <el-cascader
                  placeholder="省-市"
                  v-model="city_ids"
                  :options="cityidOptions"
                  :props = "cityidProps"
                  clearable
                  @change="handleChange">
              </el-cascader>
              <el-select v-model="listPageFilter.site_id" placeholder="选择站点" clearable class="input-width" @change="changeSiteId">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.status" placeholder="是否显示" clearable class="input-width" @change="changeStatus">
                <el-option v-for="item in statusOptions"
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
            <el-button class="btn_m20" type="primary" size="small" icon="el-icon-plus" @click="addList">添加</el-button>
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                      border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID"  prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="楼盘名称" width="200" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="楼盘地址" width="200">
                <template slot-scope="scope">{{scope.row.address}}</template>
              </el-table-column>
              <el-table-column label="楼盘城市" align="center">
                <template slot-scope="scope" v-if="scope.row.city">{{scope.row.city.name}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="排序" width="100" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="修改时间" width="180" align="center">
                <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="添加时间" width="180" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="120" align="center">
                <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
              </el-table-column>
              <el-table-column label="状态" width="120" align="center">
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
                    @click="delList(scope.row.id, scope.row.subjects_count,scope.row.constructions_count)">删除</el-button>
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
  import {siteNameList, provincesList} from '@/api/public';
  import {buildList,delBuildList}      from '@/api/building';
  const defaultListFilter = {
    site_id: "",                 //站点ID
    name: "",                   //门店名称
    status: "",                //状态
    province_id: "",          //省地区id
    city_id: "",             //城市id
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
        initParams: {},
        city_ids: "",                     //省市级
        siteidOptions: [],
        cityidOptions: [],
        shopStatus: Object.assign({},shopStatus),
        list:[],
        total:0,
        cityidProps:  {
          value: 'id',
          label: 'name',
          children: 'cities'
        },
        subjects_count: '',
        statusOptions:[{
          id: 1,
          name: '是'
        }, {
          id: 0,
          name: '否'
        }]
      }
    },
    created(){
      this.getSiteId();
      this.getCityId();
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
        let listFilter = this.$store.getters.buildFilter;
        let shape      = this.$store.getters.shape;
        this.city_ids  = [];
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id = listFilter.site_id;
          this.listPageFilter.status  = listFilter.status;
          this.listPageFilter.name    = listFilter.name;
          this.listPageFilter.province_id = listFilter.province_id;
          this.listPageFilter.city_id     = listFilter.city_id;
          if(listFilter.province_id != null){
            this.city_ids.push(listFilter.province_id);
          }
          if(listFilter.city_id != null){
            this.city_ids.push(listFilter.city_id);
          }
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改楼盘', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改楼盘', params:{id:id} })
        this.$store.commit('SET_Build_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Build_Filter', this.listPageFilter);
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(this.listPageFilter);
        }else{
           this.getData();    
        }
      },
      //获取省市级数据
      getCityId(){
        provincesList({}).then(res => {
          this.cityidOptions = res;
        });
      },
      handleChange(value) {
        if(value){
          this.listPageFilter.province_id = value[0];
          this.listPageFilter.city_id     = value[1];
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
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取列表
      getList(params){  
        buildList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //删除其中一行
      delList(id,snum1,snum2){
        this.$confirm('案例/工地'+(snum1+snum2)+'个,如果删除案例/工地将会被一并删除,是否操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBuildList(id,{}).then(res => {
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


