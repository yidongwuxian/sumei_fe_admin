<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>标签管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" placeholder="标签名称" clearable @change="changeSname"></el-input>
              <el-select v-model="listPageFilter.type" placeholder="所属类型" clearable @change="changeStype">
                    <el-option v-for="item in tagOptions"
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
              <el-table-column label="ID" prop="id" sortable="custom" width="200" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="标签名称" width="200" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="所属类型" width="200" align="center">
                <template slot-scope="scope">{{scope.row.type | formatTypeName }}</template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" sortable="custom" width="200" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
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
  import {tagsList,delTagsList} from '@/api/tags';
  const defaultListFilter = {
    name: "",                //标签名称
    type: "",                //类型
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
        tagOptions: [
          {
             value: 1,
             label: '风格'
          },
          {
             value: 0,
             label: '其他'
          }
        ],
      }
    },
    created(){
      this.getData();    
    },
    filters:{
      formatTypeName(num){
        return num = num == 1 ? '风格' : '其他';
      }
    },
    methods:{
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeStype(val){
        this.listPageFilter.type = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改标签', params:{} })
      },
      //跳转到编辑页
      editorList(id){
        this.$router.push({ name:'添加/修改标签', params:{id:id} })
        this.$store.commit('SET_Tag_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Tag_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.tagFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.name    = listFilter.name;
          this.listPageFilter.type    = listFilter.type;
        }
        this.initParams = Object.assign({}, removeEmptyObject(this.listPageFilter), removeEmptyObject(this.listPageQuery) );
        this.getList(this.initParams);
      },
      //end
      handleSearchList() {
        this.listPageQuery.page = 1;
        this.getList(this.listPageQuery);
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
        tagsList(params).then(res => {
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
          delTagsList(id,{}).then(res => {
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