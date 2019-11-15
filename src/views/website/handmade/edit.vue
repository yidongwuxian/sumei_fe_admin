<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="所属分站:" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable>
                  <el-option v-for="item in siteidOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称:">
                <el-input v-model="ruleForm.title" placeholder="输入标题" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="关键词:" v-if="sname == '弹出框标题'">
                <el-input v-model="ruleForm.keywords" placeholder="输入关键词,用‘,’隔开"></el-input>
              </el-form-item>
              <el-form-item label="URL:" prop="url" required v-if="sname == '左侧快捷链接'">
                <el-input v-model="ruleForm.url" placeholder="输入URL"  class="input-width5"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList} from '@/api/public';
  import {addhandModeDataList, edithandModeDataView, edithandModeDataList} from '@/api/handmade';

  export default {
    name:'addEdit',
    data() {
      return {
        sid: '',
        stype: '',
        zid: '',
        sname: '',
        setlabel: '',
        site_type: '',
        siteidOptions: [],
        mCityData: [],
        tempCover: '',
        ruleForm: {
          site_id: '',
          title: '',
          keywords: '',
          url: ''
        },
        rules: {
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          url: [
            { required: true, message: '请输入URL地址', trigger: 'blur' },
            { required: true, message: '请输入URL地址', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      //编辑
      this.sid = this.$route.params.id;
      this.zid = this.$route.params.zid;  
      this.stype = this.$route.params.type;
      if(this.stype == "编辑"){
        this.setlabel = this.stype;
        this.getEditPage();
      }else{
        this.setlabel = this.stype;
      }
      
      if(!localStorage.sname){
        this.sname = this.$route.params.name;
        localStorage.sname = this.sname;
      }else{
        this.sname = localStorage.sname;
      }

    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'手工模块管理3' })
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取编辑页数据
      getEditPage(){
        edithandModeDataView(this.sid,{}).then(res => {
          this.ruleForm.site_id        = res.site_id;
          this.ruleForm.title          = res.title;
          if(this.sname == '弹出框标题'){
            this.ruleForm.keywords       = res.keywords;
          }
          if(this.sname == '左侧快捷链接'){
            this.ruleForm.url            = res.url;
          }
        });
      },
      submitForm(formName) {
        this.ruleForm.keywords = this.ruleForm.keywords.split(",").join(",");
      
        if(this.sname != '弹出框标题'){
          delete this.ruleForm.keywords;
        }
        if(this.sname != '左侧快捷链接'){
          delete this.ruleForm.url;
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.stype == "编辑"){
              edithandModeDataList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'手工模块管理3', params:{name: this.sname, id: this.zid } })
                localStorage.id = this.zid
                localStorage.sname =  this.sname
              });
            }else{
              //新增接口
              addhandModeDataList(this.zid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'手工模块管理3', params:{name: this.sname, id: this.zid } })
                localStorage.id = this.zid
                localStorage.sname =  this.sname
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


