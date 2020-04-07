<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>分总站管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="名称" @change="changeSname"></el-input>
              <el-input v-model="listPageFilter.id" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="ID" @change="changeSid"></el-input>
              <el-select v-model="listPageFilter.status" placeholder="是否展示" clearable class="input-width" @change="changeStatus">
                  <el-option v-for="item in isShowOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="listPageFilter.is_closed" placeholder="是否关闭" clearable class="input-width" @change="changeIsClosed">
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
              <el-table-column label="ID" prop="id" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="分站名称" width="180" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="名称拼音" width="180" align="center">
                <template slot-scope="scope">{{scope.row.name_spell}}</template>
              </el-table-column>
              <el-table-column label="二级域名" width="199" align="center">
                <template slot-scope="scope">{{scope.row.second_domain}}</template>
              </el-table-column>
              <el-table-column label="是否显示" width="180" align="center">
                <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
              </el-table-column>
              <el-table-column label="是否关闭" width="180" align="center">
                <template slot-scope="scope">{{scope.row.is_closed | formatIsClose}}</template>
              </el-table-column>
              <el-table-column label="内容方式" width="200" align="center">
                 <template slot-scope="scope">{{scope.row.content_type | formatConType }}</template>
              </el-table-column>
              <el-table-column label="省份城市" width="300" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.city && scope.row.city.province">{{scope.row.city.province.name}}</span>
                    <span v-if="scope.row.city && scope.row.city.province && scope.row.city.province.id">-</span>
                    <span v-if="scope.row.city && scope.row.city">{{scope.row.city.name}}</span>
                </template>
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
  import {masList,delMasList} from '@/api/master';
  const defaultListFilter = {
    id: "",                     //站点主键id
    name: "",                  //分站名称
    status: "",               //是否展示
    is_closed: "",           //是否关闭
    sortby: "",             //排序
    order: ""              //排列顺序
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
        list:[],
        total:0,
        initParams: {},
        isShowOptions: [
          {
             value: 1,
             label: '是'
          },
          {
             value: 0,
             label: '否'
          }
        ],
        forbOptions: [
          {
             value: 0,
             label: '开启'
          },
          {
             value: 1,
             label: '关闭'
          }
        ]
      }
    },
    created(){
      this.getData();    
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      },
      formatIsClose(num){
        return num = num == 0 ? '开启' : '关闭';
      },
      formatConType(num){
        return num = num == 0 ? '独立维护' : '调取主站';
      },
    },
    methods:{
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      changeIsClosed(val){
        this.listPageFilter.is_closed = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改分站', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改分站', params:{id:id} })
        this.$store.commit('SET_Master_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Master_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.masterFilter;
        this.dateRange = [];
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id        = listFilter.id;
          this.listPageFilter.name      = listFilter.name;
          this.listPageFilter.status    = listFilter.status;
          this.listPageFilter.is_closed = listFilter.is_closed;
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
      //获取列表
      getList(params){   
        masList(params).then(res => {
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
          delMasList(id,{}).then(res => {
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


