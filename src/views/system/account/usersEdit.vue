<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <el-form-item label="用户组名称" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="description">
                <el-input v-model="ruleForm.description" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
              <el-divider></el-divider>
              <el-form-item label="权限操作" v-if="sFlag == true">
                 <el-button type="primary" @click="editRole">编辑</el-button>
              </el-form-item>
              <el-form-item label="成员操作" v-if="sFlag == true">
                  <el-button type="primary" @click="editMember">编辑</el-button> 
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList, provincesList} from '@/api/public';
  import {addRolesList, editRolesView, editRolesList} from '@/api/system';

  export default {
    name:'addEdit',
    data() {
      return {
        sid: "",
        stype: "",
        eid: "",
        setlabel: "",
        sFlag: false,
        ruleForm: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户组姓名', trigger: 'blur' }
          ],
        }
        //end
      }
    },     
    created(){
      this.sid   = this.$route.params.id;
      this.stype = this.$route.params.type;
      if(this.sid){
        this.setlabel = "编辑用户组管理";
        this.getEditPage();
      }else{
        this.setlabel = "新增用户组管理";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$store.commit('SET_Account_Tab_Name','second');
        this.$router.push({ name:'账户管理' })
      },
      //编辑权限
      editRole(){
        if(this.eid){
            this.$router.push({ name:'权限管理', params:{id:this.eid} })
        }  
      },
      //编辑成员
      editMember(){
        if(this.eid){
            this.$router.push({ name:'角色管理', params:{id:this.eid} })
        }
      },
      //获取编辑页数据
      getEditPage(){
        editRolesView(this.sid,{}).then(res => {
          this.ruleForm.name        = res.name;
          this.ruleForm.description = res.description;
          this.eid                  = res.id;
          if(this.eid){
            this.sFlag = true;
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editRolesList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.eid = res.id;
                this.$store.commit('SET_Account_Tab_Name','second');
                this.$router.push({ name:'账户管理' })
              });
            }else{
              //新增接口
              addRolesList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.eid = res.id;
                if(this.stype == '编辑'){
                  this.sFlag = false;
                }else{
                  this.sFlag = true;
                }
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
</style>