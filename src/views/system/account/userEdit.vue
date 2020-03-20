<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <el-form-item label="用户名" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="real_name">
                <el-input v-model="ruleForm.real_name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="密码" required>
                <el-input show-password v-model="ruleForm.password" placeholder="············" class="input-width"></el-input>
                <p class="mt1em red_color">注: 密码必须为6-32位数字、字母等组合!(不区分大小写)</p>
              </el-form-item>
              <el-form-item label="确认密码"  required>
                <el-input show-password v-model="ruleForm.password_confirmation" placeholder="············" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="所属分站:" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable>
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="手机号:">
                <el-input type="number" v-model.number="ruleForm.phone" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="email:">
                <el-input v-model="ruleForm.email" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="ruleForm.description" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="用户组选择:" prop="role_id" required>
                <el-select v-model="ruleForm.role_id" placeholder="" clearable>
                  <el-option v-for="item in usersOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                  <el-checkbox v-model="ruleForm.status">是否冻结</el-checkbox>
              </el-form-item>  
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList, provincesList} from '@/api/public';
  import {addAccList, editAccView, editAccList, rolesList} from '@/api/system';

  export default {
    name:'addEdit',
    data() {
      return {
        sid: "",
        setlabel: "",
        siteidOptions: [],
        usersOptions: [],
        ruleForm: {
          name: '',
          password: '',
          password_confirmation: '',
          real_name: '',
          site_id: '',
          role_id: '',
          phone: '',
          email: '',
          description: '',
          status: false
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { required: true, message: '请输入用户名', trigger: 'change' }
          ],
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          role_id: [
            { required: true, message: '请选择用户组', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //获取站点ID
      this.getSiteId();
      //获取用户组ID
      this.getRoleId();
      //编辑
      if(this.$route.params.id != undefined || this.$route.params.id != ''){
        this.sid = this.$route.params.id;
      }
      if(this.sid){
        this.setlabel = "编辑用户管理";
        this.getEditPage();
      }else{
        this.setlabel = "新增用户管理";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$store.commit('SET_Account_Tab_Name','first');
        this.$router.push({ name:'账户管理' })
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取用户组ID
      getRoleId(){
        rolesList({}).then(res => {
          this.usersOptions = res.data;
        });
      },
      //获取编辑页数据
      getEditPage(){
        editAccView(this.sid,{}).then(res => {
          this.ruleForm.name                         = res.name;
          this.ruleForm.password                     = res.password;
          this.ruleForm.password_confirmation        = res.password_confirmation;
          this.ruleForm.real_name                    = res.real_name;
          this.ruleForm.site_id                      = res.site_id;
          this.ruleForm.role_id                      = res.role_id;
          this.ruleForm.phone                        = res.phone;
          this.ruleForm.email                        = res.email;
          this.ruleForm.description                  = res.description;
          this.ruleForm.status                       = res.status == 0 ? true : false;    //勾选为0，不勾选为1
        });
      },
      submitForm(formName) {
        this.ruleForm.status =  this.ruleForm.status == true ? 0 : 1; 
          if(this.ruleForm.password != this.ruleForm.password_confirmation){
            this.$message({
              type: 'error',
              message: '两次输入密码不一致!'
            });
            return false;
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //编辑接口
              if(this.sid){
                editAccList(this.sid,this.ruleForm).then(res => {
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });
                  this.$store.commit('SET_Account_Tab_Name','first');
                  this.$router.push({ name:'账户管理' })
                  //sessionStorage.tabName = 'first';
                });
              }else{
                //新增接口
                addAccList(this.ruleForm).then(res => {
                  this.$message({
                    type: 'success',
                    message: '新建成功!'
                  });
                  this.$store.commit('SET_Account_Tab_Name','first');
                  this.$router.push({ name:'账户管理' })
                  //sessionStorage.tabName = 'first';
                })
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
.red_color{
  color:red;
}
</style>


