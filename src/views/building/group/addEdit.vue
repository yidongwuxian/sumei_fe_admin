<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="所属分站" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable class="input-width">
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工长名称" prop="name" required> 
                  <el-input v-model="ruleForm.name" placeholder="单行输入" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="级别" prop="star" required>
                <el-input type="number" v-model.number="ruleForm.star" placeholder="1星" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="从业年限" prop="years" required>
                  <el-input type="number" v-model.number="ruleForm.years" placeholder="" class="input-width"></el-input>
                  <span class="ml10">年</span>
              </el-form-item>
              <el-form-item label="籍贯" prop="city_id" required>
                <el-cascader
                    v-model="ruleForm.city_id"
                    :options="cityidOptions"
                    :props = "cityidProps"
                    @change="handleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="团队人数" prop="people_num" required>
                  <el-input type="number" v-model.number="ruleForm.people_num" placeholder="" class="input-width"></el-input>
                  <span class="ml10">人</span>
              </el-form-item>
              <el-form-item label="是否展示:" required>
                  <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">展示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="排序">
                <el-input v-model="ruleForm.sort" placeholder="" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="简介">
                  <el-input type="textarea" v-model="ruleForm.description" placeholder="输入简介" class="tx_area"></el-input>
              </el-form-item>
              <el-form-item label="工长照片" required>
                  <el-upload
                    class="avatar-uploader"
                    :action=actions
                    :data="{'module':'other','type':'image'}"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="tempCover" :src="tempCover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <p>图片尺寸：建议宽度1200px，图片格式：jpg，png，gif，大小：5M以内</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {uniqueArr} from '@/utils/index';
  import { getToken } from '@/utils/auth';
  import {siteNameList, provincesList,getHouseTypes} from '@/api/public';
  import {caseList} from '@/api/case';
  import {addGroupList,editGroupView,editGroupList} from '@/api/building';

  export default {
    name:'addEdit',
    data() {
      return {
        tempCover: '',
        sid: "",
        $parent_id: "",
        setlabel: "",
        siteidOptions: [],
        sleeveOptions: [],
        houseTypeOptions: [],
        buildOptions: [],
        subjectOptions: [],
        constructionOptions: [],
        cityidProps:  {
          value: 'id',
          label: 'name',
          children: 'cities'
        },
        cityidOptions: [],
        mCityData: [],
        actions:'',
        city_id: '',
        ruleForm: {
          name: '',
          site_id: '',
          city_id: '',
          people_num: '',
          years: '',
          description: '',
          cover: '',
          star: '',
          status: 1
        },
        sendId:null,
        rules: {
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入工地名称', trigger: 'blur' },
            { required: true, message: '请输入工地名称', trigger: 'change' }
          ],
          star: [
            { required: true, message: '请输入级别', trigger: 'blur' },
            { required: true, message: '请输入级别', trigger: 'change' }
          ],
          years: [
            { required: true, message: '请输入从业年限', trigger: 'blur' },
            { required: true, message: '请输入从业年限', trigger: 'change' }
          ],
          city_id: [
            { required: true, message: '请选择籍贯', trigger: 'change' }
          ],
          people_num: [
            { required: true, message: '请输入团队人数', trigger: 'blur' },
            { required: true, message: '请输入团队人数', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      //获取省市级数据
      this.getCityId();
      //编辑
      this.sid        = this.$route.params.id;
      this.$parent_id = this.$route.params.parent_id;
      if(this.sid){
        this.setlabel = "编辑工地";
        this.getEditPage();
      }else{
        this.setlabel = "新增工地";
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
        this.$router.push({ name:'工队管理' })
      },
      //start
      handleAvatarSuccess(res, file) {
        if (res.pic_url && res.server_domain) {
          this.ruleForm.cover = res.server_domain + res.pic_url;
          let picPath = res.server_domain + res.pic_url +"!ps2";
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
      handleChange(value) {
        if(value){
          this.ruleForm.city_id = value[1];
        }
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
      //获取编辑页数据
      getEditPage(){
        editGroupView(this.sid,{}).then(res => {
          this.ruleForm.name          = res.name;
          this.ruleForm.site_id       = res.site_id;
          this.ruleForm.sort          = res.sort;
          this.ruleForm.description   = res.description;
          this.ruleForm.status        = res.status;
          this.ruleForm.people_num    = res.people_num;
          this.ruleForm.years         = res.years;
          this.ruleForm.star          = res.star;
          this.ruleForm.building_id   = res.building_id;
          this.ruleForm.city_id       = res.city_id;
          this.tempCover              = res.cover+"!ps2";
          this.ruleForm.cover         = res.cover;
          this.ruleForm.star          = res.star;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.cover === ''){
              this.$message.error('请上传工长照片！');
              return;
            }
            //编辑接口
            if(this.sid){
              editGroupList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'工队管理' })
              });
            }else{
              //新增接口
              addGroupList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'工队管理' })
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


