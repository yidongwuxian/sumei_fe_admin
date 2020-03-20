<<<<<<< HEAD
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>线索管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.channel" placeholder="来源类型" clearable class="input-width">
                <el-option v-for="item in columnOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>   
           <el-form-item label=" " class="auto100">    
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="客户姓名"></el-input>
              <el-select v-model="listPageFilter.url_type" placeholder="链接类型" clearable>
                <el-option v-for="item in linksOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="listPageFilter.url" class="input-width" placeholder="URL"></el-input>
          </el-form-item>
          <el-form-item label="报名时间:">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder=""
                end-placeholder=""
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="状态:">
                <el-select v-model="listPageFilter.status" placeholder="" clearable>
                    <el-option v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
          </el-form-item>
          <el-button style="margin-left: 20px;" size="small" type="primary" @click="searchFilter">搜索</el-button>
        </el-form>
      </div>
      <div class="table-container">
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="联系人" width="300" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="电话" width="180" align="center">
                <template slot-scope="scope">{{scope.row.phone}}</template>
              </el-table-column>
              <el-table-column label="预约类型" width="118" align="center">
                <template slot-scope="scope">{{scope.row.type | formatTypeStatus}}</template>
              </el-table-column>
              <el-table-column label="来源类型" width="120" align="center">
                <template slot-scope="scope">{{scope.row.channel | formatSourceStatus}}</template>
              </el-table-column>
              <el-table-column label="IP地址" width="150">
                <template slot-scope="scope">{{scope.row.ip}}</template>
              </el-table-column>
              <el-table-column label="详情" width="120" align="center">
              <template slot-scope="scope">
                   <el-dropdown placement="bottom">
                        <span class="el-dropdown-link">
                          查看<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item style="height:200px;overflow-x:hidden;overflow-y:scroll;">
                               <div class="mk_tt" v-if="scope.row.city_name || scope.row.estate_name || scope.row.area || scope.row.pay_times || scope.row.family || scope.row.land_url || scope.row.sign_url || scope.row.from_url">详情</div>
                               <div v-if="scope.row.from_url">城市:{{scope.row.city_name}}</div>
                               <div v-if="scope.row.estate_name">所属小区:{{scope.row.estate_name}}</div>
                               <div v-if="scope.row.area">房屋面积:{{scope.row.area}}</div>
                               <div v-if="scope.row.pay_times">期数:{{scope.row.pay_times}}</div>
                               <div v-if="scope.row.family">家庭成员人数:{{scope.row.family}}</div>
                               <div v-if="scope.row.land_url">着陆页URL:{{scope.row.land_url}}</div>
                               <div v-if="scope.row.sign_url">报名页URL:{{scope.row.sign_url}}</div>
                               <div v-if="scope.row.from_url">来源URL:{{scope.row.from_url}}</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column label="报名时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="状态" width="150" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status_one && scope.row.status_two == 0">{{scope.row.status_one | formatStatus1}}</span>
                    <span v-if="scope.row.status_two && scope.row.status_two != 0">{{scope.row.status_two | formatStatus2}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="isStatus == 1"
                    @click="showSumbitStatus(scope.row.id)"
                    >分配</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="isStatus == 1"
                    @click="changeStatus(scope.row.id,2)"
                    >无效</el-button>
                    <el-button
                    size="mini"
                    v-if="isStatus == 3"
                    @click="changeStatus1(scope.row.id,scope.$index)"
                    >选择状态</el-button>
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
    <!--弹出框 start-->
      <el-dialog title="线索分配" :visible.sync="statusVisible">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-form-item label="线索所属站点">
            <el-input v-model="clue_site_name"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="选择分站" prop="site_id" required>
            <el-select v-model="ruleForm.site_id" placeholder="选择站点" clearable>
              <el-option v-for="item in siteid1Options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">      
          <el-button type="primary" @click="sumbitStatus('ruleForm')">确 定</el-button>
          <el-button @click="cancelStatus">取 消</el-button>
        </div>
      </el-dialog>
    <!--弹出框 end-->
    <!--弹出框 start-->
      <el-dialog title="分配" :visible.sync="statusVisible1">
        <el-form :model="ruleForm1" ref="ruleForm1">
          <el-form-item label="选择分配" prop="stat_sel" required>
            <el-select v-model="ruleForm1.stat_sel" value-key="name" placeholder="选择状态" clearable v-if="isStatus == 3">
                <el-option v-for="item in statOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">      
          <el-button type="primary" @click="sumbitStatus1('ruleForm1')">确 定</el-button>
          <el-button @click="cancelStatus1">取 消</el-button>
        </div>
      </el-dialog>
    <!--弹出框 end-->
  </div>
</template>
<script>
  import {removeEmptyObject,toSortVal} from '@/utils/index';
  import {siteNameList} from '@/api/public';
  import {clueList,cluestatuschange} from '@/api/clue';
  const defaultListFilter = {
    site_id: "",                   //站点ID
    name:    "",                  //客户姓名
    channel: "",                 //来源类型id
    url_type: "",               //搜索地址类型
    url: "",                   //模糊搜索地址参数
    start_date: "",           //开始日期
    end_date: "",            //结束日期
    status: 1,              //状态
    sortby: "",            //排序
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
        siteid1Options: [],
        typeIdOptions: [],
        list:[],
        total:0,
        initParams: {},
        dateRange: "",
        column_box: "",
        columnOptions: [{
          value: 1,
          label: '官网PC'
        }, {
          value: 2,
          label: '官网H5'
        }, {
          value: 3,
          label: 'app'
        },{
          value: 4,
          label: '人工导入'
        }, {
          value: 5,
          label: '微信小程序'
        }, {
          value: 6,
          label: '百度装馨家'
        }, {
          value: 7,
          label: '其他'
        }],
        linksOptions: [{
          value: 1,
          label: '来源地址'
        }, {
          value: 2,
          label: '着陆地址'
        }, {
          value: 3,
          label: '报名地址'
        }],
        statusOptions:[{
          value: 1,
          label: '待审核'
        }, {
          value: 2,
          label: '无效'
        }, {
          value: 3,
          label: '有效'
        }, {
          value: 4,
          label: '删除'
        }, {
          value: 5,
          label: '见面'
        }, {
          value: 6,
          label: '签单'
        }, {
          value: 7,
          label: '撞单'
        }],
        statOptions:[{
          id: 1,
          name: '待审核'
        }, {
          id: 2,
          name: '无效'
        }, {
          id: 3,
          name: '有效'
        }, {
          id: 4,
          name: '删除'
        }, {
          id: 5,
          name: '见面'
        }, {
          id: 6,
          name: '签单'
        }, {
          id: 7,
          name: '撞单'
        }],
        statOptions1:[{
          id: 1,
          name: '待审核'
        }, {
          id: 2,
          name: '无效'
        }, {
          id: 3,
          name: '有效'
        }, {
          id: 4,
          name: '删除'
        }],
        statOptions2:[ {
          id: 1,
          name: '有效'
        }, {
          id: 2,
          name: '见面'
        }, {
          id: 3,
          name: '签单'
        }, {
          id: 4,
          name: '撞单'
        }],
        
        tempTx1: '',
        tempTx2: '',
        statusVisible: false,
        statusVisible1: false,
        clue_site_name: '总站',
        isStatus: 1,
        ruleForm: {
          id:'',
          site_id: '',
          status: ''
        },
        ruleForm1: {
          stat_sel: '',
        },
        rules: {
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          stat_sel: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        }
      }
    },
    created(){
      this.getSiteId();
      this.getData();  
    },
    filters:{
      formatTypeStatus(str){
        switch(str) {
          case 1:
              str = '免费报价';
              break;
          case 2:
              str = '活动优惠';
              break;
          case 3:
              str = '预约服务';
              break;
          case 4:
              str = '免费设计';
              break;
          case 5:
              str = '风格测试';
              break; 
          case 6:
              str = '普通报名';
              break; 
          case 7:
              str = '预约专车';
              break;           
          default:
              str = '其他';
              break;        
        }
        return str; 
      },
      formatSourceStatus(str){
        switch(str) {
          case 1:
              str = '官网PC';
              break;
          case 2:
              str = '官网H5';
              break;
          case 3:
              str = 'app';
              break;
          case 4:
              str = '人工导入';
              break;
          case 5:
              str = '微信小程序';
              break;
          case 6:
              str = '百度装馨家';
              break;
          case 7:
              str = '其他';
              break;                 
          default:
              break;        
        }
        return str; 
      },
      formatStatus1(str){
        switch(str) {
          case 1:
              str = '待审核';
              break;
          case 2:
              str = '无效';
              break;
          case 3:
              str = '有效';
              break;  
          case 4:
              str = '删除';
              break;         
          default:
              break;        
        }
        return str; 
      },
      formatStatus2(str){
        switch(str) {
          case 1:
              str = '有效';
              break;
          case 2:
              str = '见面';
              break;
          case 3:
              str = '签单';
              break;
          case 4:
              str = '撞单';
              break;         
          default:
              break;        
        }
        return str; 
      }
    },
    methods:{
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Clue_Filter', this.listPageFilter);
        //dateRange
        this.listPageFilter.start_date = this.dateRange[0];
        this.listPageFilter.end_date   = this.dateRange[1];

        if(this.listPageFilter.status ==1){
            this.isStatus = 1;
        }
        if(this.listPageFilter.status ==2){
            this.isStatus = 2;
        }
        if(this.listPageFilter.status ==3){
            this.isStatus = 3;
        }
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(removeEmptyObject(this.listPageFilter));
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
        let listFilter = this.$store.getters.clueFilter;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id           = listFilter.site_id;
          this.listPageFilter.name              = listFilter.name;
          this.listPageFilter.channel           = listFilter.channel;
          this.listPageFilter.url_type          = listFilter.url_type;
          this.listPageFilter.url               = listFilter.url;
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
          this.listPageFilter.status            = listFilter.status;
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
          this.siteid1Options = res;
        });
      },
      //获取列表
      getList(params){  
        clueList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //分配状态(显示)
      showSumbitStatus(id){
        this.ruleForm.id = id;
        if(this.listPageFilter.status ==1){
            this.ruleForm.status = 3;
        }
        this.statusVisible = true;  
      },
      //分配状态
      sumbitStatus(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {  
            this.$confirm('是否要进行修改操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              cluestatuschange(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改状态成功!'
                });
                this.statusVisible = false;
                this.getData();    
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });          
            });  
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
      //分配状态(取消)
      cancelStatus(){
        this.statusVisible = false;
      },
      changeStatus(id,status){ 
        this.$confirm('是否要进行修改操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cluestatuschange({id:id,status:status}).then(res => {
            this.$message({
              type: 'success',
              message: '修改状态成功!'
            });
            this.getData();    
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });  
      },
      //分配状态
      sumbitStatus1(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否要进行修改操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              cluestatuschange({id:this.ruleForm.id,status:this.ruleForm1.stat_sel}).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改状态成功!'
                });
                this.statusVisible1 = false;  
                this.getData();    
              });  
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });          
            });    
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
      //分配状态(取消)
      cancelStatus1(){
        this.statusVisible1 = false;
      },
      changeStatus1(id,_index){ 
        this.ruleForm.id = id;
        this.statusVisible1 = true;
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
.mk_tt{
  text-align:center;
  padding-bottom:10px;
  border-bottom: 1px solid #ccc;
}
.el-dropdown-menu{
  max-width:35%;
  word-wrap: break-word;
}
</style>


=======
<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>线索管理</span>
      </div>
      <div class="mt15">
        <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
          <el-form-item label="搜索条件：">
              <el-select v-model="listPageFilter.site_id" placeholder="所属站点" clearable class="input-width">
                <el-option v-for="item in siteidOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="listPageFilter.channel" placeholder="来源类型" clearable class="input-width">
                <el-option v-for="item in columnOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>   
           <el-form-item label=" " class="auto100">    
              <el-input v-model="listPageFilter.name" class="input-width" @keyup.enter.native="searchFilter" clearable placeholder="客户姓名"></el-input>
              <el-select v-model="listPageFilter.url_type" placeholder="链接类型" clearable>
                <el-option v-for="item in linksOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="listPageFilter.url" class="input-width" placeholder="URL"></el-input>
          </el-form-item>
          <el-form-item label="报名时间:">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder=""
                end-placeholder=""
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="状态:">
                <el-select v-model="listPageFilter.status" placeholder="" clearable>
                    <el-option v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
          </el-form-item>
          <el-button style="margin-left: 20px;" size="small" type="primary" @click="searchFilter">搜索</el-button>
        </el-form>
      </div>
      <div class="table-container">
            <el-table ref="returnApplyTable"
                      :data="list"
                      style="width: 100%;"
                      @sort-change="handleSortChange"
                       border
                      :default-sort = "{prop: 'id', order: 'descending'}">
              <el-table-column label="ID" prop="id" sortable="custom" width="100" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="所属站点" width="180" align="center">
                <template slot-scope="scope" v-if="scope.row.site">{{scope.row.site.name}}</template>
              </el-table-column>
              <el-table-column label="联系人" width="300" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column label="电话" width="180" align="center">
                <template slot-scope="scope">{{scope.row.phone}}</template>
              </el-table-column>
              <el-table-column label="预约类型" width="118" align="center">
                <template slot-scope="scope">{{scope.row.type | formatTypeStatus}}</template>
              </el-table-column>
              <el-table-column label="来源类型" width="120" align="center">
                <template slot-scope="scope">{{scope.row.channel | formatSourceStatus}}</template>
              </el-table-column>
              <el-table-column label="IP地址" width="150">
                <template slot-scope="scope">{{scope.row.ip}}</template>
              </el-table-column>
              <el-table-column label="详情" width="120" align="center">
              <template slot-scope="scope">
                   <el-dropdown placement="bottom">
                        <span class="el-dropdown-link">
                          查看<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item style="height:200px;overflow-x:hidden;overflow-y:scroll;">
                               <div class="mk_tt" v-if="scope.row.city_name || scope.row.estate_name || scope.row.area || scope.row.pay_times || scope.row.family || scope.row.land_url || scope.row.sign_url || scope.row.from_url">详情</div>
                               <div v-if="scope.row.from_url">城市:{{scope.row.city_name}}</div>
                               <div v-if="scope.row.estate_name">所属小区:{{scope.row.estate_name}}</div>
                               <div v-if="scope.row.area">房屋面积:{{scope.row.area}}</div>
                               <div v-if="scope.row.pay_times">期数:{{scope.row.pay_times}}</div>
                               <div v-if="scope.row.family">家庭成员人数:{{scope.row.family}}</div>
                               <div v-if="scope.row.land_url">着陆页URL:{{scope.row.land_url}}</div>
                               <div v-if="scope.row.sign_url">报名页URL:{{scope.row.sign_url}}</div>
                               <div v-if="scope.row.from_url">来源URL:{{scope.row.from_url}}</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column label="报名时间" width="180" align="center">
                 <template slot-scope="scope">{{scope.row.created_at}}</template>
              </el-table-column>
              <el-table-column label="状态" width="150" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status_one && scope.row.status_two == 0">{{scope.row.status_one | formatStatus1}}</span>
                    <span v-if="scope.row.status_two && scope.row.status_two != 0">{{scope.row.status_two | formatStatus2}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="isStatus == 1"
                    @click="showSumbitStatus(scope.row.id)"
                    >分配</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="isStatus == 1"
                    @click="changeStatus(scope.row.id,2)"
                    >无效</el-button>
                    <el-button
                    size="mini"
                    v-if="isStatus == 3"
                    @click="changeStatus1(scope.row.id,scope.$index)"
                    >选择状态</el-button>
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
    <!--弹出框 start-->
      <el-dialog title="线索分配" :visible.sync="statusVisible">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-form-item label="线索所属站点">
            <el-input v-model="clue_site_name"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="选择分站" prop="site_id" required>
            <el-select v-model="ruleForm.site_id" placeholder="选择站点" clearable>
              <el-option v-for="item in siteid1Options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">      
          <el-button type="primary" @click="sumbitStatus('ruleForm')">确 定</el-button>
          <el-button @click="cancelStatus">取 消</el-button>
        </div>
      </el-dialog>
    <!--弹出框 end-->
    <!--弹出框 start-->
      <el-dialog title="分配" :visible.sync="statusVisible1">
        <el-form :model="ruleForm1" ref="ruleForm1">
          <el-form-item label="选择分配" prop="stat_sel" required>
            <el-select v-model="ruleForm1.stat_sel" value-key="name" placeholder="选择状态" clearable v-if="isStatus == 3">
                <el-option v-for="item in statOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">      
          <el-button type="primary" @click="sumbitStatus1('ruleForm1')">确 定</el-button>
          <el-button @click="cancelStatus1">取 消</el-button>
        </div>
      </el-dialog>
    <!--弹出框 end-->
  </div>
</template>
<script>
  import {removeEmptyObject,toSortVal} from '@/utils/index';
  import {siteNameList} from '@/api/public';
  import {clueList,cluestatuschange} from '@/api/clue';
  const defaultListFilter = {
    site_id: "",                   //站点ID
    name:    "",                  //客户姓名
    channel: "",                 //来源类型id
    url_type: "",               //搜索地址类型
    url: "",                   //模糊搜索地址参数
    start_date: "",           //开始日期
    end_date: "",            //结束日期
    status: 1,              //状态
    sortby: "",            //排序
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
        siteid1Options: [],
        typeIdOptions: [],
        list:[],
        total:0,
        initParams: {},
        dateRange: "",
        column_box: "",
        columnOptions: [{
          value: 1,
          label: '官网PC'
        }, {
          value: 2,
          label: '官网H5'
        }, {
          value: 3,
          label: 'app'
        },{
          value: 4,
          label: '人工导入'
        }, {
          value: 5,
          label: '微信小程序'
        }, {
          value: 6,
          label: '百度装馨家'
        }, {
          value: 7,
          label: '其他'
        }],
        linksOptions: [{
          value: 1,
          label: '来源地址'
        }, {
          value: 2,
          label: '着陆地址'
        }, {
          value: 3,
          label: '报名地址'
        }],
        statusOptions:[{
          value: 1,
          label: '待审核'
        }, {
          value: 2,
          label: '无效'
        }, {
          value: 3,
          label: '有效'
        }, {
          value: 4,
          label: '删除'
        }, {
          value: 5,
          label: '见面'
        }, {
          value: 6,
          label: '签单'
        }, {
          value: 7,
          label: '撞单'
        }],
        statOptions:[{
          id: 1,
          name: '待审核'
        }, {
          id: 2,
          name: '无效'
        }, {
          id: 3,
          name: '有效'
        }, {
          id: 4,
          name: '删除'
        }, {
          id: 5,
          name: '见面'
        }, {
          id: 6,
          name: '签单'
        }, {
          id: 7,
          name: '撞单'
        }],
        statOptions1:[{
          id: 1,
          name: '待审核'
        }, {
          id: 2,
          name: '无效'
        }, {
          id: 3,
          name: '有效'
        }, {
          id: 4,
          name: '删除'
        }],
        statOptions2:[ {
          id: 1,
          name: '有效'
        }, {
          id: 2,
          name: '见面'
        }, {
          id: 3,
          name: '签单'
        }, {
          id: 4,
          name: '撞单'
        }],
        
        tempTx1: '',
        tempTx2: '',
        statusVisible: false,
        statusVisible1: false,
        clue_site_name: '总站',
        isStatus: 1,
        ruleForm: {
          id:'',
          site_id: '',
          status: ''
        },
        ruleForm1: {
          stat_sel: '',
        },
        rules: {
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          stat_sel: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        }
      }
    },
    created(){
      this.getSiteId();
      this.getData();  
    },
    filters:{
      formatTypeStatus(str){
        switch(str) {
          case 1:
              str = '免费报价';
              break;
          case 2:
              str = '活动优惠';
              break;
          case 3:
              str = '预约服务';
              break;
          case 4:
              str = '免费设计';
              break;
          case 5:
              str = '风格测试';
              break; 
          case 6:
              str = '普通报名';
              break; 
          case 7:
              str = '预约专车';
              break;           
          default:
              str = '其他';
              break;        
        }
        return str; 
      },
      formatSourceStatus(str){
        switch(str) {
          case 1:
              str = '官网PC';
              break;
          case 2:
              str = '官网H5';
              break;
          case 3:
              str = 'app';
              break;
          case 4:
              str = '人工导入';
              break;
          case 5:
              str = '微信小程序';
              break;
          case 6:
              str = '百度装馨家';
              break;
          case 7:
              str = '其他';
              break;                 
          default:
              break;        
        }
        return str; 
      },
      formatStatus1(str){
        switch(str) {
          case 1:
              str = '待审核';
              break;
          case 2:
              str = '无效';
              break;
          case 3:
              str = '有效';
              break;  
          case 4:
              str = '删除';
              break;         
          default:
              break;        
        }
        return str; 
      },
      formatStatus2(str){
        switch(str) {
          case 1:
              str = '有效';
              break;
          case 2:
              str = '见面';
              break;
          case 3:
              str = '签单';
              break;
          case 4:
              str = '撞单';
              break;         
          default:
              break;        
        }
        return str; 
      }
    },
    methods:{
      //搜索查询
      searchFilter(){
        this.$store.commit('SET_Clue_Filter', this.listPageFilter);
        //dateRange
        this.listPageFilter.start_date = this.dateRange[0];
        this.listPageFilter.end_date   = this.dateRange[1];

        if(this.listPageFilter.status ==1){
            this.isStatus = 1;
        }
        if(this.listPageFilter.status ==2){
            this.isStatus = 2;
        }
        if(this.listPageFilter.status ==3){
            this.isStatus = 3;
        }
        //如果当前页数<总页数
        if(25 <= this.total){
           this.getList(removeEmptyObject(this.listPageFilter));
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
        let listFilter = this.$store.getters.clueFilter;
        if(listFilter){
          this.initParams = listFilter;
          this.listPageFilter.site_id           = listFilter.site_id;
          this.listPageFilter.name              = listFilter.name;
          this.listPageFilter.channel           = listFilter.channel;
          this.listPageFilter.url_type          = listFilter.url_type;
          this.listPageFilter.url               = listFilter.url;
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
          this.listPageFilter.status            = listFilter.status;
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
          this.siteid1Options = res;
        });
      },
      //获取列表
      getList(params){  
        clueList(params).then(res => {
          this.list = res.data; 
          this.total = res.total;
        });
      },
      //分配状态(显示)
      showSumbitStatus(id){
        this.ruleForm.id = id;
        if(this.listPageFilter.status ==1){
            this.ruleForm.status = 3;
        }
        this.statusVisible = true;  
      },
      //分配状态
      sumbitStatus(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {  
            this.$confirm('是否要进行修改操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              cluestatuschange(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改状态成功!'
                });
                this.statusVisible = false;
                this.getData();    
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });          
            });  
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
      //分配状态(取消)
      cancelStatus(){
        this.statusVisible = false;
      },
      changeStatus(id,status){ 
        this.$confirm('是否要进行修改操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cluestatuschange({id:id,status:status}).then(res => {
            this.$message({
              type: 'success',
              message: '修改状态成功!'
            });
            this.getData();    
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });  
      },
      //分配状态
      sumbitStatus1(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否要进行修改操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              cluestatuschange({id:this.ruleForm.id,status:this.ruleForm1.stat_sel}).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改状态成功!'
                });
                this.statusVisible1 = false;  
                this.getData();    
              });  
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });          
            });    
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
      //分配状态(取消)
      cancelStatus1(){
        this.statusVisible1 = false;
      },
      changeStatus1(id,_index){ 
        this.ruleForm.id = id;
        this.statusVisible1 = true;
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
.mk_tt{
  text-align:center;
  padding-bottom:10px;
  border-bottom: 1px solid #ccc;
}
.el-dropdown-menu{
  max-width:35%;
  word-wrap: break-word;
}
</style>


>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
