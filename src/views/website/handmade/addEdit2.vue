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
              <el-form-item label="关键词:">
                <el-input v-model="ruleForm.keywords" placeholder="输入关键词,用‘,’隔开"></el-input>
              </el-form-item>
              <el-form-item label="url:" prop="url" required>
                <el-input v-model="ruleForm.url" placeholder="输入URL地址" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="图片:" prop="cover" required>
                  <el-upload
                    class="avatar-uploader"
                    :action=actions
                    :data="{'module':'manualmodule','type':'image'}"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="tempCover" :src="tempCover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <p v-if="picDesSize">注: {{picDesSize}}</p>
              </el-form-item>
              <el-form-item label="描述:">
                  <el-input type="textarea" :rows="6" placeholder="多行输入" v-model="ruleForm.description"></el-input>
              </el-form-item>
              <el-form-item label="排序:" prop="sort" required>
                <el-input  type="number" v-model.number="ruleForm.sort" placeholder="请输入排序值" class="input-width"></el-input>
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
  import { getToken } from '@/utils/auth';
  import {addhandModeDataList, edithandModeDataView, edithandModeDataList} from '@/api/handmade';
  export default {
    name:'addEdit',
    data() {
      return {
        id: '',
        sid: '',
        stype: '',
        sname: '',
        setlabel: '',
        siteidOptions: [],
        mCityData: [],
        tempCover: '',
        actions:'',
        picDesSize: '',
        ruleForm: {
          site_id: '',
          title: '',
          keywords: '',
          url: '',
          cover: '',
          description: '',
          sort: ''
        },
        rules: {
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          cover: [
            { required: true, message: '请上传图片' }
          ],
          url: [
            { required: true, message: '请输入URL地址', trigger: 'blur' },
            { required: true, message: '请输入URL地址', trigger: 'change' }
          ],
          sort: [
            { required: true, message: '请输入排序', trigger: 'blur' },
            { required: true, message: '请输入排序', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      //编辑
      this.id = this.$route.params.id;
      this.sid   = this.$route.params.sid;
      this.stype = this.$route.params.type;
      if(this.stype == "编辑"){
        this.setlabel = this.stype;
        this.getEditPage();
      }else{
        this.setlabel = this.stype;
      }
      this.sname = this.$route.params.name;
      
      //图片上传地址
      this.actions = process.env.API_BASEURL + "photos"
      //图片备注
      let picDesSize = JSON.parse(sessionStorage.getItem('moduleData'));
      
      if(picDesSize.size){
        this.picDesSize = picDesSize.size;
      }
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
        this.$router.push({ name:'手工模块管理2' })
      },
      //start
      handleAvatarSuccess(res, file) {
        if (res.pic_url && res.server_domain) {
          this.ruleForm.cover = res.server_domain + res.pic_url;
          let picPath = res.server_domain + res.pic_url;
          this.tempCover = picPath;
				}else{
					this.$message.error('上传图片失败！');
				}
      },
      beforeAvatarUpload(file) {
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
        edithandModeDataView(this.id,{}).then(res => {
          this.ruleForm.site_id        = res.site_id;
          this.ruleForm.title          = res.title;
          this.ruleForm.keywords       = res.keywords;
          this.ruleForm.url            = res.url;
          this.tempCover               = res.cover;
          this.ruleForm.cover          = res.cover;
          this.ruleForm.description    = res.description;
          this.ruleForm.sort           = res.sort;
        });
      },
      submitForm(formName) {
        this.ruleForm.keywords = this.ruleForm.keywords.split(",").join(",");
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.stype == "编辑"){
              edithandModeDataList(this.id,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'手工模块管理2', params:{name: this.sname, id: this.sid } }) 
              });
            }else{
              //新增接口
              addhandModeDataList(this.id,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'手工模块管理2', params:{name: this.sname, id: this.sid} })
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
</style>


