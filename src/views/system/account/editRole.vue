<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>权限管理</span>
      </div>
      <div class="table-container">
              <el-table
                ref="multipleTable"
                :data="list"
                style="width: 100%;"
                border>    
              <el-table-column label="功能名称" width="500" align="center">
                  <template slot-scope="scope">
                     <div>
                       <input type="checkbox" @change="checkMe(checkNameArr)" v-model="checkNameArr" :value="scope.row.id" />
                       {{scope.row.name}}
                    </div>
                  </template>
              </el-table-column>
              <el-table-column label="权限内容">
                <template slot-scope="scope">
                  <el-checkbox-group v-model="checkedValArr" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="(item) in scope.row.all_children" :key="item.id" :label="item.id">
                          <span style="margin-right:10px">{{item.name}}</span>
                      </el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="v_member_btn tx">
                <el-button type="primary"  @click="submitBtn">提交</el-button>  
            </el-row>  
      </div>
    </el-card>
  </div>
</template>
<script> 
  import {getModules,addModules} from '@/api/system';
  export default {
    name:'list',
    data() {
      return {
        list:[],
        totalArr: [],
        checkedValName: true,
        checkedNameArr:[],
        checkedValArr: [],
        isIndeterminate: false,
        checkAll: false,
        checkNameArr: [],
        tempArr: []
      }
    },
    created(){
      this.sid = this.$route.params.id;
      
      if(this.sid){
        this.getList();
      }  
    },
    methods:{
      //获取列表
      getList(){  
        getModules(this.sid,{}).then(res => {
          this.list = res; 
          //遍历数据 start
          let resultArr = res;
          let resultTemp = [];
          let resultTemp1 = [];
          for(let i=0; i<resultArr.length; i++){
            if( resultArr[i].belongs_to_role == 1 ){
               resultTemp.push(resultArr[i].id);
            }
            let childArr = resultArr[i].all_children;
            for(let j=0; j<childArr.length; j++){
              if( childArr[j].belongs_to_role == 1 ){
                resultTemp1.push(childArr[j].id);
              }
            }
          }
          this.checkNameArr = resultTemp;
          this.checkedValArr = resultTemp1;
          //遍历数据 end
        });
      }, 
      checkMe(item){
        this.checkNameArr = item ? item : [];
      },
      handleCheckedCitiesChange(val){
        this.checkedValArr = val ? val : [];
      },
      submitBtn(){
        if(this.checkNameArr.length > 0 ){
          this.totalArr = [...this.checkNameArr, ...this.checkedValArr];
          this.sendModule(this.totalArr);
        }else{
          this.$message({ 
            type: 'error',
            message: '请选择相关功能名称！'
          })
        }
      },
      sendModule(arr){
        addModules(this.sid, {module_ids: arr }).then(res => {
          this.$message({
            type: 'success',
            message: '权限设置成功!'
          });
           this.$router.push({ name:'账户管理-用户组管理', params:{id:this.sid} })
        });
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
.v_member_btn{
    margin:15px auto;
}
</style>


