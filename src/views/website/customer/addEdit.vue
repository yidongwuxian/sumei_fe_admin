<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="所属分站:" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable :disabled="isDisabled">
                  <el-option v-for="item in siteidOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="平台:" prop="platform" required>
                <el-select v-model="ruleForm.platform" placeholder="PC" clearable :disabled="isDisabled">
                    <el-option v-for="item in platOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option> 
                </el-select>
              </el-form-item>
              <el-form-item label="服务商:" prop="vendor" required>
                <el-select v-model="ruleForm.vendor" placeholder="选择站点" clearable @change="changeVerdor">
                    <el-option v-for="item in serviceOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否禁用:" required>
                  <el-radio-group v-model="ruleForm.is_closed">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="客服代码:" prop="obj_num" required>
                  <el-input type="textarea" :rows="6" :placeholder="placeholder" v-model="ruleForm.obj_num" class="input-width5"></el-input>
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
  import {addCusList, editCusView, editCusList} from '@/api/customer';

  export default {
    name:'addEdit',
    components:{
    },
    data() {
      return {
        sid: "",
        setlabel: "",
        siteidOptions: [],
        platOptions: [
          {
            id: 1,
            name: 'PC'
          },
          {
            id: 2,
            name: 'H5 '
          }
        ],
        serviceOptions:[
          {
            id: 1,
            name: '乐语'
          },
          {
            id: 2,
            name: '美洽'
          },
          {
            id: 3,
            name: '百度商桥'
          },
          {
            id: 4,
            name: '商务通'
          }
        ],
        mCityData: [],
        isDisabled:false,
        placeholder: '<\script\ type="text/javascript" src="http://lead.soperson.com/20000014/10036406.js"></\script\>',
        ruleForm: {
          site_id: '',
          platform: 1,
          vendor:1,
          obj_num: '',
          is_closed: 0,
        },
        rules: {
          site_id: [
            { required: true, message: '请选择站点', trigger: 'change' }
          ],
          platform: [
            { required: true, message: '请选择平台', trigger: 'change' }
          ],
          vendor: [
            { required: true, message: '请选择服务商', trigger: 'change' }
          ],
          obj_num: [
            { required: true, message: '请输入客服代码', trigger: 'blur' },
            { required: true, message: '请输入客服代码', trigger: 'change' }
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
      if(this.sid){
        this.setlabel = "编辑客服代码";
        this.getEditPage();
      }else{
        this.setlabel = "新增客服代码";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'客服代码管理' })
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res; 
        });
      },
      //上传单个图片
      setPicPath(e){
        this.ruleForm.cover = e;
      },
      //获取编辑页数据
      getEditPage(){
        editCusView(this.sid,{}).then(res => {
          this.ruleForm.site_id      = res.site_id;
          this.ruleForm.platform     = res.platform;
          this.ruleForm.vendor       = res.vendor;
          this.ruleForm.obj_num      = res.obj_num;
          this.ruleForm.is_closed    = res.is_closed;
          this.isDisabled = true;
        });
      },
      changeVerdor(val){
        if(val === 1){
          this.placeholder = '<\script\ type="text/javascript" src="http://lead.soperson.com/20000014/10036406.js"></\script\>';
        }
        if(val === 2){
          this.placeholder = '(function(m, ei, q, i, a, j, s){'+
            'm[i] = m[i] || function()'+
            '{'+ 
             '  (m[i].a = m[i].a || []).push(arguments)'+
            '};'+
                'j = ei.createElement(q),'+
                's = ei.getElementsByTagName(q)[0];'+
                'j.async = true;'+
                'j.charset = "UTF-8";'+
                'j.src = "https://static.meiqia.com/dist/meiqia.js?_=t";'+
                's.parentNode.insertBefore(j, s);'+
            '})(window, document, "script", "_MEIQIA");'+
            '_MEIQIA("entId", "10284556");'
        }
        if(val === 3){
          this.placeholder = `填写实例编号`;
        }
        if(val === 4){
          this.placeholder = `<\script\ type="text/javascript" src="https://pet.zoosnet.net/JS/LsJS.aspx?siteid=PET60190921&float=1&lng=cn"></\script\>`;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editCusList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'客服代码管理' })
              });
            }else{
              //新增接口
              addCusList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'客服代码管理' })
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


