<<<<<<< HEAD
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="ID:" prop="id" v-if="this.setlabel == '编辑栏目' ">
                <el-input v-model="ruleForm.id" :disabled="true" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="模块名称:" prop="story_type" required>
                <el-select v-model="ruleForm.story_type" placeholder="" clearable class="input-width">
                    <el-option v-for="item in storyOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称:" prop="story_type_name" required>
                <el-input v-model="ruleForm.story_type_name" placeholder="输入栏目名称" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {addColumnList, editColumnView, editColumnList} from '@/api/substance';

  export default {
    name:'addEdit',
    components:{
    },
    data() {
      return {
        sid: "",
        setlabel: "",
        storyOptions: [
          {
             value: 1,
             label: '装修前'
          },
          {
             value: 2,
             label: '装修中'
          },
          {
             value: 3,
             label: '装修后'
          }
        ],
        ruleForm: {
          id: '',
          story_type_name: '',
          story_type: 1
        },
        rules: {
          story_type: [
            { required: true, message: '请输入模块名称', trigger: 'blur' },
            { required: true, message: '请输入模块名称', trigger: 'change' }
          ],
          story_type_name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { required: true, message: '请输入名称', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增

      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑栏目";
        this.getEditPage();
      }else{
        this.setlabel = "新增栏目";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'栏目管理' })
      },
      //获取编辑页数据
      getEditPage(){
        editColumnView(this.sid,{}).then(res => {
          this.ruleForm.id                   = res.id;
          this.ruleForm.story_type_name      = res.story_type_name;
          this.ruleForm.story_type           = res.story_type;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editColumnList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'栏目管理' })
              });
            }else{
              delete this.ruleForm.id;
              //新增接口
              addColumnList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'栏目管理' })
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


=======
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="ID:" prop="id" v-if="this.setlabel == '编辑栏目' ">
                <el-input v-model="ruleForm.id" :disabled="true" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="模块名称:" prop="story_type" required>
                <el-select v-model="ruleForm.story_type" placeholder="" clearable class="input-width">
                    <el-option v-for="item in storyOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称:" prop="story_type_name" required>
                <el-input v-model="ruleForm.story_type_name" placeholder="输入栏目名称" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {addColumnList, editColumnView, editColumnList} from '@/api/substance';

  export default {
    name:'addEdit',
    components:{
    },
    data() {
      return {
        sid: "",
        setlabel: "",
        storyOptions: [
          {
             value: 1,
             label: '装修前'
          },
          {
             value: 2,
             label: '装修中'
          },
          {
             value: 3,
             label: '装修后'
          }
        ],
        ruleForm: {
          id: '',
          story_type_name: '',
          story_type: 1
        },
        rules: {
          story_type: [
            { required: true, message: '请输入模块名称', trigger: 'blur' },
            { required: true, message: '请输入模块名称', trigger: 'change' }
          ],
          story_type_name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { required: true, message: '请输入名称', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增

      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑栏目";
        this.getEditPage();
      }else{
        this.setlabel = "新增栏目";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'栏目管理' })
      },
      //获取编辑页数据
      getEditPage(){
        editColumnView(this.sid,{}).then(res => {
          this.ruleForm.id                   = res.id;
          this.ruleForm.story_type_name      = res.story_type_name;
          this.ruleForm.story_type           = res.story_type;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editColumnList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'栏目管理' })
              });
            }else{
              delete this.ruleForm.id;
              //新增接口
              addColumnList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'栏目管理' })
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


>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
