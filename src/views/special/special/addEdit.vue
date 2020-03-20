<template> 
    <div class="app-container">
        <el-card shadow="hover" class="el-col el-col-24">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
                <!--title-page start-->
                <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
                <el-divider></el-divider>
                <!--title-page end-->
                <el-form-item label="站点:" prop="site_id" required>
                  <el-select v-model="ruleForm.site_id" placeholder="站点" clearable>
                    <el-option v-for="item in siteidOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="专题类型:" prop="platform" required>
                    <el-select v-model="ruleForm.platform" placeholder="" clearable>
                          <el-option v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专题名称:" prop="name" required>
                  <el-input v-model="ruleForm.name" placeholder="专题名称" class="input-width5"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接:">
                    <el-input v-model="ruleForm.url" placeholder="跳转链接" class="input-width5"></el-input>
                </el-form-item>
                <el-form-item label="排序:">
                  <el-input type="number" v-model.number="ruleForm.sort" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="版本控制" v-if="flagVersion  == true" required>
                  <el-select v-model="isVersion" placeholder="选择版本" clearable @change="changVersion" class="ver_select">
                    <el-option v-for="item in versionOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="专题简介:">
                    <el-input placeholder="专题简介" v-model="ruleForm.description" class="input-width5"></el-input>
                </el-form-item>
                <el-form-item label="模板管理:">
                     <el-button class="mb20" @click="showTemplate">预约模板</el-button>
                     <el-input type="textarea" v-if="isYuYue == true" v-model="yuYueCn" :autosize="{ minRows: 20, maxRows: 60 }" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="专题内容:" prop="content" required>
                   <el-input
                      type="textarea"
                      :rows="20"
                      class="form-control zh_box" 
                      placeholder=""
                      v-model="ruleForm.content"
                      id="htmlBox">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否发布:">
                    <el-checkbox v-model="publishStatus" @change="changeCheck" class="pu_status"></el-checkbox>
                </el-form-item>  
                <el-form-item label="上传图片:" required>
                    <span v-model="ruleForm.url_json"></span>
                    <el-upload
                        ref="uploadfx"
                        class="avatar-uploader"
                        multiple
                        :limit="1000"
                        :action=actions
                        :data="{'module':'special','type':'image', 'keep_file_name': 1}"
                        :headers="headers"
                        list-type="picture-card"
                        :file-list="explainImgList"
                        :before-upload="beforeAvatarUpload1"
                        :on-preview="avatarPrev"
                        :on-success="handleAvatarSuccess1">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-dialog title="自动替换图片URL?" :visible.sync="dialogVisible">
                      <el-input v-model="dialogImageUrl" placeholder=""></el-input>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelSingleReplace">取 消</el-button>
                        <el-button type="primary" @click="affirmSingleReplace(dialogImageUrl)">确 定</el-button>
                      </span>
                    </el-dialog>
                    <input type="hidden" class="form-control" disabled value="images/" id="form_url">
                    <input type="hidden" class="form-control" disabled id="to_url">
                    <el-button type="success" class="mt15" @click="batch">批量替换URL</el-button>
                    <p>格式：jpg，png，gif，大小：5M以内</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
  </template>
  <script>
    import $ from 'jquery'
    import {uniqueArr,parseTime} from '@/utils/index';
    import { getToken } from '@/utils/auth';
    import {siteNameList, provincesList} from '@/api/public';
    import {addSpecList, editSpecView, editSpecList, getSpecialInfo} from '@/api/special';
    import { Message } from 'element-ui';
    import Router from '@/router/index';
    export default {
      name:'addEdit',
      data() {
        return {
          picArr: [],
          tempPicArr: [],
          tempPicObj: {},
          tempPicObjBak: {},
          sid: "",
          setlabel: "",
          siteidOptions: [],
          isVersion: '',
          flagVersion: false,
          versionOptions: [],
          initDetailArr: [],
          cityidProps:  {
            value: 'id',
            label: 'name',
            children: 'cities'
          },
          cityidOptions: [],
          mCityData: [],
          explainImgList: [],
          uploadTime: '',
          actions:'',
          typeOptions: [
            {
               value: 1,
               label: 'PC官网专题'
            },
            {
               value: 2,
               label: 'H5官网专题'
            }
          ],
          dialogImageUrl: '',
          dialogVisible: false,
          publishStatus: false,
          ruleForm: {
            name: '',
            site_id: '',
            platform: 1,
            description: '',
            sort: 0,
            content: '',
            url: '',
            url_json: [],
            is_publish: 0
          },
          isYuYue: false,
          yuYueCn: [],
          rules: {
            site_id: [
              { required: true, message: '请选择所属站点', trigger: 'change' }
            ],
            platform: [
              { required: true, message: '请选择专题类型', trigger: 'change' }
            ],
            name: [
              { required: true, message: '请输入专题名称', trigger: 'blur' },
              { required: true, message: '请输入专题名称', trigger: 'change' }
            ],
            content: [
              { required: true, message: '请输入内容代码', trigger: 'change' },
              { required: true, message: '请输入内容代码', trigger: 'blur' }
            ],
          }
          //end
        }
      },
      created(){
        //新增
        this.getSiteId();
        this.getCityId();
        this.getTemplate();
        //编辑
        this.sid = this.$route.params.id;
        if(this.sid){
          this.setlabel = "编辑专题";
          this.getEditPage();
        }else{
          this.setlabel = "新增专题";
        }
        //图片上传地址
        this.actions = process.env.API_BASEURL + "photos"
      },
      computed: {
        headers(){
          return{
            'Authorization': getToken()
          }
        }
      },
      mounted() {
        
      },
      methods:{
        //返回上一页（列表页）
        jumpBack(){
          this.$router.push({ name:'专题管理列表' })
        },
        //批量替换 start
        batch(){         
          if(this.sid){
            this.picArr = this.tempPicArr.concat(this.explainImgList);
          }else{
            this.picArr = this.tempPicArr;
          }
          if(this.picArr.length == 0){
            this.$message.error('请先上传图片!');
            return;
          }else{
            this.$confirm('确定批量替换?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                for(let k in this.picArr){
                  this.findAndReplace(this.picArr[k].url);
                }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
          }
        },
        findAndReplace(url){
          let picSrc = url.split('/'),
              picSrcName=picSrc[picSrc.length-1],
              picSrcobj=$('#htmlBox'),
              $formurl=$('#form_url').val(),
              $tourl,
              picSrcHtml=picSrcobj.val(),
              picSrcReg=new RegExp($formurl+picSrcName,'gi');
              let temPic = picSrc[picSrc.length-2];
              $tourl= 'https://'+ picSrc.slice(2, picSrc.length-1).join('/') + '/';
              picSrcobj.val(picSrcHtml.replace(picSrcReg,$tourl+picSrcName));
              this.ruleForm.content = picSrcobj.val();
        },
        //单个替换取消
        cancelSingleReplace(){
          this.dialogVisible = false;
        },
        //单个替换
        affirmSingleReplace(pic_url){
          this.findAndReplace(pic_url);
          this.dialogVisible = false;
        },
        //批量替换 end
        //多图片上传 start
        avatarPrev(file) {
          if(file.response && file.response.pic_url !=""){
            this.dialogImageUrl = file.response.server_domain + file.response.pic_url;
          }else{
            this.dialogImageUrl = file.url;
          }
          this.dialogVisible = true;
        },
        handleAvatarSuccess1(res, file) {
          this.tempPicObjBak = {
            url: res.server_domain  + res.pic_url
          }
        
          this.tempPicArr.push(this.tempPicObjBak);
          this.ruleForm.url_json.push(
            res.server_domain  + res.pic_url
          );  
        },
        beforeAvatarUpload1(file) {
          const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png') || (file.type === 'image/gif');
          const isLt5M = file.size / 1024 / 1024 < 5;
  
          if (!isRightType) {
              this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
          }
          if (!isLt5M) {
              this.$message.error('上传头像图片大小不能超过 5MB!');
          }
          return isRightType && isLt5M;
        },
        //多图片上传 end
        //获取模板接口
        getTemplate(){
          getSpecialInfo({}).then(res => {
            this.yuYueCn = res;
          });
        },
        //获取模板内容
        showTemplate(){
          this.isYuYue = !this.isYuYue;
        },
        //获取站点ID
        getSiteId(){
          siteNameList({}).then(res => {
            this.siteidOptions = res;
          });
        },
        //获取省市级数据
        getCityId(){
          provincesList({}).then(res => {
            this.cityidOptions = res;
          });
        },
        //获取是否发布的值
        changeCheck(val){
          this.ruleForm.is_publish = this.publishStatus == true ? 1 : 0;
        },
        //获取编辑页数据
        getEditPage(){
          editSpecView(this.sid,{}).then(res => {
            this.ruleForm.name            = res.name;
            this.ruleForm.site_id         = res.site_id;
            this.ruleForm.platform        = res.platform;
            this.ruleForm.url             = res.url;
            this.publishStatus            = res.is_publish     == 1 ? true : false;
            this.ruleForm.is_publish      = this.publishStatus == true ? 1 : 0;
            this.ruleForm.sort            = res.sort;         
            this.initVersion(res.detail);
  
            this.initDetailArr = res.detail;
          });
        },
        //初始版本控制
        initVersion(datas){
            this.explainImgList = [];
            $('#htmlBox').val('');
            let m_arr_obj = {};
            for(var i in datas){
                m_arr_obj = {
                  id:   datas[i].id,
                  name: datas[i].created_at + "   " + datas[i].user.name
                };
                this.versionOptions.push(m_arr_obj);
            }
            this.flagVersion = true; 
            this.isVersion   =  this.versionOptions[0].id;
            this.ruleForm.description     = datas[0].description;
            this.ruleForm.content         = datas[0].content;
            $('#htmlBox').val(datas[0].content);
  
            let url_pics  = datas[0].url_json;
            for(let i=0; i<url_pics.length; i++){
                this.explainImgList.push({url: url_pics[i]})
            }
            this.ruleForm.url_json        = url_pics;
        },
        //切换版本控制
        changVersion(val){
            
            this.explainImgList = [];
            $('#htmlBox').val('');
            let temObj = {};
            for(var k in this.initDetailArr){
                if(this.initDetailArr[k].id == val){
                    temObj = this.initDetailArr[k];
                }
            }
  
            this.ruleForm.url_json        = temObj.url_json;
            this.ruleForm.description     = temObj.description;
            this.ruleForm.content         = temObj.content;
  
            $('#htmlBox').val(temObj.content);
            let url_pics  = this.ruleForm.url_json;
            for(let i=0; i<url_pics.length; i++){
                this.explainImgList.push({url: url_pics[i]})
            }
            this.ruleForm.url_json        = url_pics;
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //编辑接口
              if(this.sid){
                this.$axios.put(process.env.API_BASEURL+'special/'+this.sid,  this.ruleForm, {
                  headers:{
                    'Authorization': getToken(), 
                    'Content-Type': 'application/json;charset=UTF-8'
                  }
                })
                .then(function (response) {
                  if(response){
                    Message({
                      message: '编辑成功!',
                      type: 'success',
                      duration: 1 * 1000
                    })
                    Router.push({ name:'专题管理列表' })
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
              }else{
                this.$axios.post(process.env.API_BASEURL+'special',  this.ruleForm, {
                  headers:{
                    'Authorization': getToken(), 
                    'Content-Type': 'application/json;charset=UTF-8'
                  }
                })
                .then(function (response) {
                  if(response){
                    Message({
                      message: '新建成功!',
                      type: 'success',
                      duration: 1 * 1000
                    })
                    Router.push({ name:'专题管理列表' })
                  }
                })
                .catch(function (error) {
                  console.log(error);
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
  @import '../../../styles/upload.scss';
  .pu_status{
    margin-top:12px;
  }
  .zh_box{
    margin: 0px 69.4px 0px 0px; 
    width: 1086px; 
    height: 460px;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete{
    display:none !important;
  }
  
  .ver_select{
    width:300px;
  }
  </style>