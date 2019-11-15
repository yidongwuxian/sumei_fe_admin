<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
          <div>
              <span>成员操作</span>
              <el-divider></el-divider>
          </div>
          <el-transfer v-model="totalarea" :data="transArr"  :titles="['未分配用户', '已有成员']"></el-transfer>
          <el-row class="v_member_btn tx">
                <el-button type="primary"  @click="transferBtn">提交</el-button>  
          </el-row>  
      </el-card>
  </div>
</template>
<script>
  import {accList,addRole} from '@/api/system';
  export default {
    name:'memberOperation',
    data() { 
      return {
        sid: "",
        totalarea: [],
        transArr: [],
        tempArr: [],
        tempArr2: []
      }
    },
    created(){
      this.sid = this.$route.params.id;
      if(this.sid){
        this.getList();
      }
    },
    methods:{
      changeTransfer(val){
           this.totalarea = val;
       },
       transferBtn(){
          addRole(this.sid,{user_ids: this.totalarea}).then(res => {
              this.$message({
                  type: 'success',
                  message: '操作成功!'
              });
              this.$router.push({ name:'账户管理-用户组管理', params:{id:this.sid} })
          });
       },
      //获取数据
      getList(){
        this.initArr1();
      },
      initArr1(){
        accList({ role_id: 0, per_page: 10000}).then(res => {
            const arr1 = res.data;
            this.initArr2(arr1);
        });
      },
      initArr2(oldArr){
        let arr2 = [];  
        accList({ role_id: this.sid, per_page: 10000}).then(res => {
            arr2 = res.data;
            //如果oldArr有值的情况  
            if(arr2 && arr2.length > 0){
                this.tempArr = arr2.concat(oldArr);
                let tempArrs = [];
                this.tempArr.forEach((item,index) => {
                    tempArrs.push({
                        key:   item.id,
                        label: item.name
                    });
                })  

                this.transArr = tempArrs;
                let tempArrs2 = [];
                arr2.forEach((item,index) => {
                    tempArrs2.push(item.id);
                })  
                this.totalarea = tempArrs2;
            }else{
                //如果oldArr为空的情况
                this.tempArr = arr2.concat(oldArr);
                let tempArrs = [];
                this.tempArr.forEach((item,index) => {
                    tempArrs.push({
                        key:   item.id,
                        label: item.name
                    });
                })  
                this.transArr = tempArrs;
            }
        });
      }
    }
  }
</script>
<style lang="scss" scope>
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
.v_member_btn{
    margin:15px auto;
}
</style>


