<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>工地管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索楼盘">
              <el-input v-model="listPageFilter.id" class="input-width"  clearable placeholder="ID" @change="changeSid"></el-input>  
              <el-input v-model="listPageFilter.name" class="input-width" clearable placeholder="名称"  @change="changeSname"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width" @change="handleChange">
              <el-option v-for="item in siteidOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="listPageFilter.building_id" placeholder="楼盘名称" clearable  @change="changeBuildingId">
                <el-option v-for="item in buildOptions"
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
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter('listPageFilter')">
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
              <el-table-column label="工地名称" width="150" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="城市" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="工地地址">
                <template slot-scope="scope" v-if="scope.row.building">{{scope.row.building.address}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" sortable="custom" width="80" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="浏览量" prop="view_num" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.view_num}}</template>
              </el-table-column>
              <el-table-column label="施工状态" width="80" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.last_step == null">未开始</span>
                  <span v-if="scope.row.last_step">
                    <span v-if="scope.row.last_step.type">{{scope.row.last_step.type | formatType}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="工队" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.construction_team">{{scope.row.construction_team.name}}</template>
              </el-table-column>
              <el-table-column label="修改时间" prop="updated_at" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="添加时间" prop="created_at" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="80" align="center">
                 <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
              </el-table-column>
              <el-table-column label="状态" width="80" align="center">
                <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
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
  import {siteNameList,provincesList,getSiteBuilding} from '@/api/public';
  import {siteList,delSiteList} from '@/api/building';
  const defaultListFilter = {
    id:      "",               //ID
    name: "",                 //名称
    status: "",               //状态
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
        list:[],
        buildOptions: [],
        cityidOptions: [],
        total:0,
        initParams:[],
        isFlag: false,
        stepStr: null
      }
    },
    created(){
      this.getSiteId();
      //获取省市级数据
      this.getCityId();
      //初始化数据
       this.getData();    
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      },
      formatType(num){
        switch(num) {
          case 0:
            num = '未开始';
            break;
          case 1:
            num = '开工大吉';
            break;
          case 2:
            num = '前期施工';
            break;
          case 3:
            num = '中期施工';
            break; 
          case 4:
            num = '尾期施工';
            break;
          case 5:
            num = '竣工';
            break;             
          default:
            break;        
        }
        return num; 
      },
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeBuildingId(val){
        this.listPageFilter.building_id = val;
      },
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改工地', params:{} })
      },
      //跳转到编辑页
      editorList(id,parent_id){
        this.$router.push({ name:'添加/修改工地', params:{id:id,parent_id:parent_id} })
        this.$store.commit('SET_Site_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Site_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.siteFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.name        = listFilter.name;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.status      = listFilter.status;
          this.listPageFilter.building_id = listFilter.building_id;
          this.getBuilding();
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
          this.getBuilding();
        }
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取省市级数据
      getCityId(){
        provincesList({}).then(res => {
          this.cityidOptions = res;
        });
      },
      //获取楼盘
      getBuilding(){
        if(this.listPageFilter.site_id){
          getSiteBuilding(this.listPageFilter.site_id,{}).then(res => {
            this.buildOptions = res;
          });
        }
      },
      //获取列表
      getList(params){  
        siteList(params).then(res => {
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
          delSiteList(id,{}).then(res => {
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
        <span>工地管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索楼盘">
              <el-input v-model="listPageFilter.id" class="input-width"  clearable placeholder="ID" @change="changeSid"></el-input>  
              <el-input v-model="listPageFilter.name" class="input-width" clearable placeholder="名称"  @change="changeSname"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width" @change="handleChange">
              <el-option v-for="item in siteidOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="listPageFilter.building_id" placeholder="楼盘名称" clearable  @change="changeBuildingId">
                <el-option v-for="item in buildOptions"
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
          <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter('listPageFilter')">
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
              <el-table-column label="工地名称" width="150" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="城市" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="工地地址">
                <template slot-scope="scope" v-if="scope.row.building">{{scope.row.building.address}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" sortable="custom" width="80" align="center">
                <template slot-scope="scope">{{scope.row.sort}}</template>
              </el-table-column>
              <el-table-column label="总站排序" prop="sort_master" sortable="custom" width="120" align="center">
                <template slot-scope="scope">{{scope.row.sort_master}}</template>
              </el-table-column>
              <el-table-column label="浏览量" prop="view_num" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.view_num}}</template>
              </el-table-column>
              <el-table-column label="施工状态" width="80" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.last_step == null">未开始</span>
                  <span v-if="scope.row.last_step">
                    <span v-if="scope.row.last_step.type">{{scope.row.last_step.type | formatType}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="工队" width="100" align="center">
                <template slot-scope="scope" v-if="scope.row.construction_team">{{scope.row.construction_team.name}}</template>
              </el-table-column>
              <el-table-column label="修改时间" prop="updated_at" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.updated_at}}</template>
              </el-table-column>
              <el-table-column label="修改人" width="80" align="center">
                <template slot-scope="scope" v-if="scope.row.last_editor">{{scope.row.last_editor.name}}</template>
              </el-table-column>
              <el-table-column label="添加时间" prop="created_at" sortable="custom" width="180" align="center">
                <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="添加人" width="80" align="center">
                 <template slot-scope="scope" v-if="scope.row.user">{{scope.row.user.name}}</template>
              </el-table-column>
              <el-table-column label="状态" width="80" align="center">
                <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
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
  import {siteNameList,provincesList,getSiteBuilding} from '@/api/public';
  import {siteList,delSiteList} from '@/api/building';
  const defaultListFilter = {
    id:      "",               //ID
    name: "",                 //名称
    status: "",               //状态
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
        list:[],
        buildOptions: [],
        cityidOptions: [],
        total:0,
        initParams:[],
        isFlag: false,
        stepStr: null
      }
    },
    created(){
      this.getSiteId();
      //获取省市级数据
      this.getCityId();
      //初始化数据
       this.getData();    
    },
    filters:{
      formatStatus(num){
        return num = num == 1 ? '显示' : '隐藏';
      },
      formatType(num){
        switch(num) {
          case 0:
            num = '未开始';
            break;
          case 1:
            num = '开工大吉';
            break;
          case 2:
            num = '前期施工';
            break;
          case 3:
            num = '中期施工';
            break; 
          case 4:
            num = '尾期施工';
            break;
          case 5:
            num = '竣工';
            break;             
          default:
            break;        
        }
        return num; 
      },
    },
    methods:{
      changeSid(val){
        this.listPageFilter.id = val;
      },
      changeSname(val){
        this.listPageFilter.name = val;
      },
      changeBuildingId(val){
        this.listPageFilter.building_id = val;
      },
      changeStatus(val){
        this.listPageFilter.status = val;
      },
      //跳转到新增页
      addList(){
        this.$router.push({ name:'添加/修改工地', params:{} })
      },
      //跳转到编辑页
      editorList(id,parent_id){
        this.$router.push({ name:'添加/修改工地', params:{id:id,parent_id:parent_id} })
        this.$store.commit('SET_Site_Filter', this.listPageFilter);
      }, 
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Site_Filter', this.listPageFilter);
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
        let listFilter = this.$store.getters.siteFilter;
        let shape      = this.$store.getters.shape;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.id          = listFilter.id;
          this.listPageFilter.name        = listFilter.name;
          this.listPageFilter.site_id     = listFilter.site_id;
          this.listPageFilter.status      = listFilter.status;
          this.listPageFilter.building_id = listFilter.building_id;
          this.getBuilding();
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
          this.getBuilding();
        }
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取省市级数据
      getCityId(){
        provincesList({}).then(res => {
          this.cityidOptions = res;
        });
      },
      //获取楼盘
      getBuilding(){
        if(this.listPageFilter.site_id){
          getSiteBuilding(this.listPageFilter.site_id,{}).then(res => {
            this.buildOptions = res;
          });
        }
      },
      //获取列表
      getList(params){  
        siteList(params).then(res => {
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
          delSiteList(id,{}).then(res => {
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
