<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="标签类型" prop="type" required>
                  <el-select v-model="ruleForm.type" placeholder="请选择类型" clearable>
                      <el-option v-for="item in tagOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="标签名称" prop="name" required>
                <el-input v-model="ruleForm.name" placeholder="请输入标签名称" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="sort" required>
                <el-input type="number" v-model.number="ruleForm.sort" placeholder="请输入排序" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {addTagsList, editTagsView, editTagsList} from '@/api/tags';

  export default {
    name:'addEdit',
    components:{
      
    },
    data() {
      return {
        sid: "",
        setlabel: "",
        ruleForm: {
          name: '',
          type: '',
          sort: ''
        },
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
        rules: {
          name: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            { required: true, message: '请输入标签名称', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择标签类型', trigger: 'change' }
          ],
          sort: [
            { required: true, message: '请输入排序值', trigger: 'blur' },
            { required: true, message: '请输入排序值', trigger: 'change' }
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
        this.setlabel = "编辑标签";
        this.getEditPage();
      }else{
        this.setlabel = "新增标签";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'标签管理' })
      },
      //获取编辑页数据
      getEditPage(){
        editTagsView(this.sid,{}).then(res => {
          this.ruleForm.name       = res.name;
          this.ruleForm.sort       = res.sort;
          this.ruleForm.type       = res.type;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editTagsList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'标签管理' })
              });
            }else{
              //新增接口
              addTagsList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'标签管理' })
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
</style>