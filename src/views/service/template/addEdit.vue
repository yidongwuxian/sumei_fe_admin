<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="名称:" prop="name" required>
                <el-input v-model="ruleForm.name" placeholder="单行输入" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="备注:" prop="remark" required>
                <el-input v-model="ruleForm.remark" placeholder="单行输入" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="适用类型:" prop="platform" required>
                <el-select v-model="ruleForm.platform" placeholder="PC" clearable>
                      <el-option v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="简介:">
                  <el-input type="textarea" :rows="6" placeholder="多行输入" v-model="ruleForm.description" maxlength="500" show-word-limit class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="内容代码:" prop="content" required>
                   <el-input
                    type="textarea"
                    :rows="20"
                    class="form-control zh_box" 
                    placeholder=""
                    v-model="ruleForm.content"
                    id="htmlBox">
                  </el-input>
              </el-form-item>
              <el-form-item label="图片上传:" required>
                    <span v-model="ruleForm.url_json"></span>
                    <el-upload
                        ref="uploadfx"
                        class="avatar-uploader"
                        multiple
                        :limit="1000"
                        :action=actions
                        :data="{'module':'template','type':'image', 'keep_file_name': 1}"
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
  import $ from 'jquery';
  import { getToken } from '@/utils/auth';
  import {siteNameList} from '@/api/public';
  import {addTempList, editTempView, editTempList} from '@/api/service';
  import { Message } from 'element-ui';
  import Router from '@/router/index';
  export default {
    name:'addEdit',
    components:{
    },
    data() {
      return {
        picArr: [],
        tempPicArr: [],
        tempPicObj: {},
        tempPicObjBak: {},
        explainImgList: [],
        sid: "",
        setlabel: "",
        siteidOptions: [],
        cityidProps:  {
          value: 'id',
          label: 'name',
          children: 'cities'
        },
        cityidOptions: [],
        mCityData: [],
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
        actions:'',
        dialogImageUrl: '',
        dialogVisible: false,
        ruleForm: {
          platform: 1,
          name: '',
          remark: '',
          description: '',
          url_json: [],
          content: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称',    trigger: 'blur' },
            { required: true, message: '请输入名称',    trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请输入备注', trigger: 'blur' },
            { required: true, message: '请输入备注', trigger: 'change' }
          ],
          platform: [
            { required: true, message: '请选择适用类型', trigger: 'change' }
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
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑服务模板";
        this.getEditPage();
      }else{
        this.setlabel = "新增服务模板";
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
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'服务模板' })
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
      //批量替换 end
      //start
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
      //end
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取编辑页数据
      getEditPage(){
        this.explainImgList = [];
        $('#htmlBox').val('');
        let m_arr_obj = {};
        editTempView(this.sid,{}).then(res => {
          this.ruleForm.id             = res.id;
          this.ruleForm.name           = res.name;
          this.ruleForm.remark         = res.remark;
          this.ruleForm.platform       = res.platform;
          this.ruleForm.description    = res.detail[0].description;
          this.ruleForm.content        = res.detail[0].content;
          this.ruleForm.url_json       = res.detail[0].url_json;

          $('#htmlBox').val(res.detail[0].content);

          let url_pics  = this.ruleForm.url_json;
          for(let i=0; i<url_pics.length; i++){
              this.explainImgList.push({url: url_pics[i]  })
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              //编辑接口
              if(this.sid){
                this.$axios.put(process.env.API_BASEURL+'templates/'+this.sid,  this.ruleForm, {
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
                    Router.push({ name:'服务模板' })
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
              }else{
                //新增接口
                this.$axios.post(process.env.API_BASEURL+'templates',  this.ruleForm, {
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
                    Router.push({ name:'服务模板' })
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
.zh_box{
  margin: 0px 69.4px 0px 0px; 
  width: 1086px; 
  height: 460px;
}
.el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete{
  display:none !important;
}
</style>


