<<<<<<< HEAD
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <el-form-item :label="setlabel"></el-form-item>
              <el-form-item label="账号" prop="username">
                <el-input v-model="username" placeholder="展示账号，但不能编辑" :disabled="true" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="原密码" prop="password" required>
                <el-input show-password v-model="ruleForm.password" placeholder="输入原密码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="new_password" required>
                <el-input show-password v-model="ruleForm.new_password" placeholder="输入新密码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="重置新密码:" prop="new_password_confirmation" required>
                <el-input show-password v-model="ruleForm.new_password_confirmation" placeholder="输入确认密码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList, provincesList} from '@/api/public';
  import {getUserName, setToken} from '@/utils/auth'
  import {validatePassword} from '@/utils/validate';
  import {addAccList, editAccView, editAccList} from '@/api/system';

  export default {
    name:'addEdit',
    data() {
      const validatePass = (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error('密码必须为6-32位数字、字母等组合!(不区分大小写)'))
        } else {
          callback()
        }
      };
      return {
        sid: "",
        setlabel: "",
        username: getUserName(),
        ruleForm: {
          password: '',
          new_password: '',
          new_password_confirmation: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          new_password: [
            { required: true, trigger: 'blur',  validator: validatePass }
          ],
          new_password_confirmation: [
            { required: true, trigger: 'blur',  validator: validatePass }
          ]
        }
        //end
      }
    },
    created(){
      
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.listLoading = true;
            this.$store.dispatch('ResetPwd', this.ruleForm).then(() => {
              this.$message({
                type: 'success',
                message: '密码已修改。'
              });
              this.$router.push({path: '/'})
            }).catch(() => {
              this.listLoading = false;
              this.netError = true;
            })
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


=======
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <el-form-item :label="setlabel"></el-form-item>
              <el-form-item label="账号" prop="username">
                <el-input v-model="username" placeholder="展示账号，但不能编辑" :disabled="true" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="原密码" prop="password" required>
                <el-input show-password v-model="ruleForm.password" placeholder="输入原密码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="new_password" required>
                <el-input show-password v-model="ruleForm.new_password" placeholder="输入新密码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="重置新密码:" prop="new_password_confirmation" required>
                <el-input show-password v-model="ruleForm.new_password_confirmation" placeholder="输入确认密码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList, provincesList} from '@/api/public';
  import {getUserName, setToken} from '@/utils/auth'
  import {validatePassword} from '@/utils/validate';
  import {addAccList, editAccView, editAccList} from '@/api/system';

  export default {
    name:'addEdit',
    data() {
      const validatePass = (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error('密码必须为6-32位数字、字母等组合!(不区分大小写)'))
        } else {
          callback()
        }
      };
      return {
        sid: "",
        setlabel: "",
        username: getUserName(),
        ruleForm: {
          password: '',
          new_password: '',
          new_password_confirmation: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          new_password: [
            { required: true, trigger: 'blur',  validator: validatePass }
          ],
          new_password_confirmation: [
            { required: true, trigger: 'blur',  validator: validatePass }
          ]
        }
        //end
      }
    },
    created(){
      
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.listLoading = true;
            this.$store.dispatch('ResetPwd', this.ruleForm).then(() => {
              this.$message({
                type: 'success',
                message: '密码已修改。'
              });
              this.$router.push({path: '/'})
            }).catch(() => {
              this.listLoading = false;
              this.netError = true;
            })
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


>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
