<<<<<<< HEAD
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="楼盘名称:" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width" placeholder="请输入楼盘名称"></el-input>
              </el-form-item>
              <el-form-item label="关键词:">
                <el-input v-model="ruleForm.keywords" placeholder="单行输入" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="省份/城市:" prop="city_id" required>
                <el-cascader
                    v-model="ruleForm.city_id"
                    :options="cityidOptions"
                    :props = "cityidProps"
                    @change="handleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="所属分站:" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable>
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序:">
                <el-input type="number" v-model.number="mParam.sort" placeholder="排序" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="总站排序:">
                <el-input type="number" v-model.number="mParam.sort_master" placeholder="总站排序" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="是否显示:" required>
                  <el-radio-group v-model="mParam.status">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="简介">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.description" placeholder="输入简介" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="楼盘地址" prop="address" required>
                <el-input type="textarea" :rows="2" v-model="ruleForm.address" placeholder="楼盘地址不要超过10个字" class="input-width6" maxlength="10" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="封面图:" required>
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
              <el-form-item label="坐标:" required>
                  <el-input v-model="latlng" placeholder="坐标" :disabled="true"></el-input>
              </el-form-item>
              <MapComp v-on:mapconfirm="mapconfirm"></MapComp>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import  MapComp from '@/components/MapComp/map';
  import { getToken } from '@/utils/auth';
  import {siteNameList, provincesList} from '@/api/public';
  import {addBuildList, editBuildView, editBuildList} from '@/api/building';

  export default {
    name:'addEdit',
    components:{
      MapComp
    },
    data() {
      return {
        tempCover: '',
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
        latlng: '',
        actions:'',
        mParam:{
          name: '',
          site_id: '',
          city_id: '',
          address: '',
          sort: "",
          latitude:  '',
          longitude: '',
          cover: '',
          status: 1,
          keywords: '',
          description: '',
          sort_master: ''
        },
        ruleForm: {
          name: '',
          keywords: '',
          description: '',
          site_id: '',
          city_id: '',
          address: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入楼盘名称', trigger: 'blur' },
            { required: true, message: '请输入楼盘名称', trigger: 'change' }
          ],
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          city_id: [
            { required: true, message: '请选择城市名称', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入楼盘地址', trigger: 'blur' },
            { required: true, message: '请输入楼盘地址', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      this.getCityId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑楼盘";
        this.getEditPage();
      }else{
        this.setlabel = "新增楼盘";
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
        this.$router.push({ name:'楼盘管理' })
      },
      //start
      handleAvatarSuccess(res, file) {
        if (res.pic_url && res.server_domain) {
          this.mParam.cover = res.server_domain + res.pic_url;
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
					this.$message.error('封面图只能是 JPG或PNG 格式!');
				}
				if (!isLt5M) {
					this.$message.error('封面图大小不能超过 5MB!');
				}
				return isRightType && isLt5M;
			},
      //地图获取坐标
      mapconfirm(e){
        let isE = JSON.stringify(e);
        if(isE){
          this.latlng = JSON.stringify(e.lat) + "," + JSON.stringify(e.lng);
          this.mParam.latitude = JSON.stringify(e.lat);
          this.mParam.longitude = JSON.stringify(e.lng);
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
        editBuildView(this.sid,{}).then(res => {
          this.ruleForm.name       = res.name;
          this.ruleForm.keywords   = res.keywords;
          this.ruleForm.description= res.description;
          this.ruleForm.site_id    = res.site_id;
          this.mParam.city_id      = res.city_id;
          this.ruleForm.city_id    = this.mParam.city_id;
          this.ruleForm.address    = res.address;

          this.mParam.cover        = res.cover; 
          this.tempCover           = res.cover+"!ps2";
          this.mParam.latitude     = res.latitude;
          this.mParam.longitude    = res.longitude;
          this.latlng              = res.latitude +','+ res.longitude;
          this.mParam.sort         = res.sort;
          this.mParam.status       = res.status;
          this.mParam.sort_master  = res.sort_master;
        });
      },
      handleChange(value) {
        if(value){
          this.mParam.city_id = value[1];
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //start
            this.mParam.keywords      = this.ruleForm.keywords;
            this.mParam.name          = this.ruleForm.name;
            this.mParam.site_id       = this.ruleForm.site_id;
            this.mParam.address       = this.ruleForm.address;
            this.mParam.description   = this.ruleForm.description;
            //end
            //编辑接口
            if(this.sid){
              editBuildList(this.sid,this.mParam).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'楼盘管理' })
              });
            }else{
              //新增接口
              addBuildList(this.mParam).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'楼盘管理' })
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


=======
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="楼盘名称:" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width" placeholder="请输入楼盘名称"></el-input>
              </el-form-item>
              <el-form-item label="关键词:">
                <el-input v-model="ruleForm.keywords" placeholder="单行输入" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="省份/城市:" prop="city_id" required>
                <el-cascader
                    v-model="ruleForm.city_id"
                    :options="cityidOptions"
                    :props = "cityidProps"
                    @change="handleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="所属分站:" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable>
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序:">
                <el-input type="number" v-model.number="mParam.sort" placeholder="排序" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="总站排序:">
                <el-input type="number" v-model.number="mParam.sort_master" placeholder="总站排序" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="是否显示:" required>
                  <el-radio-group v-model="mParam.status">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="简介">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.description" placeholder="输入简介" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="楼盘地址" prop="address" required>
                <el-input type="textarea" :rows="2" v-model="ruleForm.address" placeholder="楼盘地址不要超过10个字" class="input-width6" maxlength="10" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="封面图:" required>
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
              <el-form-item label="坐标:" required>
                  <el-input v-model="latlng" placeholder="坐标" :disabled="true"></el-input>
              </el-form-item>
              <MapComp v-on:mapconfirm="mapconfirm"></MapComp>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import  MapComp from '@/components/MapComp/map';
  import { getToken } from '@/utils/auth';
  import {siteNameList, provincesList} from '@/api/public';
  import {addBuildList, editBuildView, editBuildList} from '@/api/building';

  export default {
    name:'addEdit',
    components:{
      MapComp
    },
    data() {
      return {
        tempCover: '',
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
        latlng: '',
        actions:'',
        mParam:{
          name: '',
          site_id: '',
          city_id: '',
          address: '',
          sort: "",
          latitude:  '',
          longitude: '',
          cover: '',
          status: 1,
          keywords: '',
          description: '',
          sort_master: ''
        },
        ruleForm: {
          name: '',
          keywords: '',
          description: '',
          site_id: '',
          city_id: '',
          address: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入楼盘名称', trigger: 'blur' },
            { required: true, message: '请输入楼盘名称', trigger: 'change' }
          ],
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          city_id: [
            { required: true, message: '请选择城市名称', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入楼盘地址', trigger: 'blur' },
            { required: true, message: '请输入楼盘地址', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      this.getCityId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑楼盘";
        this.getEditPage();
      }else{
        this.setlabel = "新增楼盘";
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
        this.$router.push({ name:'楼盘管理' })
      },
      //start
      handleAvatarSuccess(res, file) {
        if (res.pic_url && res.server_domain) {
          this.mParam.cover = res.server_domain + res.pic_url;
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
					this.$message.error('封面图只能是 JPG或PNG 格式!');
				}
				if (!isLt5M) {
					this.$message.error('封面图大小不能超过 5MB!');
				}
				return isRightType && isLt5M;
			},
      //地图获取坐标
      mapconfirm(e){
        let isE = JSON.stringify(e);
        if(isE){
          this.latlng = JSON.stringify(e.lat) + "," + JSON.stringify(e.lng);
          this.mParam.latitude = JSON.stringify(e.lat);
          this.mParam.longitude = JSON.stringify(e.lng);
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
        editBuildView(this.sid,{}).then(res => {
          this.ruleForm.name       = res.name;
          this.ruleForm.keywords   = res.keywords;
          this.ruleForm.description= res.description;
          this.ruleForm.site_id    = res.site_id;
          this.mParam.city_id      = res.city_id;
          this.ruleForm.city_id    = this.mParam.city_id;
          this.ruleForm.address    = res.address;

          this.mParam.cover        = res.cover; 
          this.tempCover           = res.cover+"!ps2";
          this.mParam.latitude     = res.latitude;
          this.mParam.longitude    = res.longitude;
          this.latlng              = res.latitude +','+ res.longitude;
          this.mParam.sort         = res.sort;
          this.mParam.status       = res.status;
          this.mParam.sort_master  = res.sort_master;
        });
      },
      handleChange(value) {
        if(value){
          this.mParam.city_id = value[1];
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //start
            this.mParam.keywords      = this.ruleForm.keywords;
            this.mParam.name          = this.ruleForm.name;
            this.mParam.site_id       = this.ruleForm.site_id;
            this.mParam.address       = this.ruleForm.address;
            this.mParam.description   = this.ruleForm.description;
            //end
            //编辑接口
            if(this.sid){
              editBuildList(this.sid,this.mParam).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'楼盘管理' })
              });
            }else{
              //新增接口
              addBuildList(this.mParam).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'楼盘管理' })
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


>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
