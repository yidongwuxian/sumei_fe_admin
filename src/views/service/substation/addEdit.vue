<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="站点:" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="所属站点" clearable required>
                  <el-option v-for="item in siteidOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="适用类型:" prop="platform" required>
                <el-select v-model="ruleForm.platform" placeholder="" clearable required>
                      <el-option v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="模板名称:" prop="templates_id" required>
                  <el-select v-model="ruleForm.templates_id" placeholder="请选择模板" clearable required>
                      <el-option v-for="item in templateOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序:" prop="sort">
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
  import {siteNameList, provincesList} from '@/api/public';
  import {addSiteTList, editSiteTView, editSiteTList, getTempList} from '@/api/service';

  export default {
    name:'addEdit',
    data() {
      return {
        sid: "",
        setlabel: "",
        siteidOptions: [],
        cityidProps:  {
          value: 'id',
          label: 'name',
          children: 'cities'
        },
        cityidOptions: [],
        typeOptions: [
          {
             value: 1,
             label: 'PC'
          },
          {
             value: 2,
             label: 'H5'
          }
        ],
        mCityData: [],
        templateOptions: [],
        ruleForm: {
          sort: '',
          site_id: '',
          platform: 1,
          templates_id: ''
        },
        rules: {
          site_id: [
            { required: true, message: '请选择站点',    trigger: 'change' }
          ],
          templates_id: [
            { required: true, message: '请选择模板名称', trigger: 'change' }
          ],
          platform: [
            { required: true, message: '请输入适用类型', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      this.getTempId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑分站模板";
        this.getEditPage();
      }else{
        this.setlabel = "新增分站模板";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'分站模板管理' })
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取模板ID
      getTempId(){
        getTempList({name: ''}).then(res => {
          this.templateOptions = res;
        });
      },
      //上传单个图片
      setPicPath(e){
        this.ruleForm.cover = e;
      },
      //获取编辑页数据
      getEditPage(){
        editSiteTView(this.sid,{}).then(res => {
          this.ruleForm.site_id         = res.site_id;
          this.ruleForm.platform        = res.platform;
          this.ruleForm.templates_id    = res.templates_id;
          this.ruleForm.sort            = res.sort;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editSiteTList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'分站模板管理' })
              });
            }else{
              //新增接口
              addSiteTList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'分站模板管理' })
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


