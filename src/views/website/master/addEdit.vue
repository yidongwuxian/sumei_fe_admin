<<<<<<< HEAD
<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="分站名称:" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="名称拼音:" prop="name_spell" required>
                <el-input v-model="ruleForm.name_spell" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="二级域名:" prop="second_domain" required>
                <el-input v-model="ruleForm.second_domain" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="所属城市:" prop="city_id" required>
                <el-cascader
                    v-model="ruleForm.city_id"
                    :options="cityidOptions"
                    :props = "cityidProps"
                    @change="handleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="关键词:">
                <el-input v-model="ruleForm.keywords" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="描述:">
                <el-input v-model="ruleForm.description" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="是否显示:" required>
                  <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="是否关闭:" required>
                  <el-radio-group v-model="ruleForm.is_closed">
                    <el-radio :label="0">开启</el-radio>
                    <el-radio :label="1">关闭</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="内容方式:" required>
                  <el-radio-group v-model="ruleForm.content_type">
                    <el-radio :label="0">独立维护</el-radio>
                    <el-radio :label="1">调取主站</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="客服电话:" prop="company_phone">
                <el-input type="text" v-model="ruleForm.company_phone" placeholder="客服电话" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="短信接收号码:" prop="company_mobile">
                <el-input v-model="ruleForm.company_mobile" placeholder="接收通知短信号码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="公司地址:">
                <el-input v-model="ruleForm.company_address" placeholder="公司地址" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="二维码:" required>
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
                  <p class="mt1em">建议尺寸：500px*500px(格式：jpg，png，gif，大小：小于等于5MB)</p>
              </el-form-item>
              <el-form-item label="客服代码:" prop="customer_code" required>
                  <el-input type="textarea" :rows="6" v-model="ruleForm.customer_code" placeholder="客服代码" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="百度PC统计代码:">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.statistic_code" placeholder="百度PC统计代码" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="百度H5统计代码:">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.mobile_statistic_code" placeholder="百度H5统计代码" class="input-width5"></el-input>
              </el-form-item>
              <!--<el-form-item label="CNZZ代码:" prop="cnzz" required>
                  <el-input type="textarea" :rows="6" v-model="ruleForm.cnzz" placeholder="CNZZ代码" class="input-width5"></el-input>
              </el-form-item>-->
              <el-form-item label="公司名称:" prop="company_name" required>
                <el-input v-model="ruleForm.company_name" placeholder="公司名称" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="ICP备案信息:" prop="company_icp" required>
                <el-input v-model="ruleForm.company_icp" placeholder="公司名称" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {provincesList} from '@/api/public';
  import { getToken } from '@/utils/auth';
  import {addMasList, editMasView, editMasList} from '@/api/master';

  export default {
    name:'addEdit',
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
        actions:'',
        ruleForm: {
          name: '',                                 //站点名称
          name_spell: '',                          //站点名称拼音
          second_domain: '',                      //二级域名
          city_id: '',                           //所属城市
          keywords: '',                         //关键词
          description: '',                     //描述
          status: 1,                         //是否显示
          is_closed: 0,                     //是否关闭
          content_type: 0,                 //内容方式
          company_phone: '',               //客服电话
          company_mobile: '',             //接收短信手机号码
          company_address: '',           //公司地址
          qrcode: '',                   //二维码
          customer_code: '',           //客服代码
          company_name: '',           //公司名称
          company_icp: '',           //公司icp备案号
          statistic_code: '',         //百度PC统计代码
          mobile_statistic_code: '', //百度H5统计代码
          //cnzz: ''                 //CNZZ代码
        },
        rules: {
          //门店名称
          name: [
            { required: true, message: '请输入站点名称', trigger: 'blur' },
            { required: true, message: '请输入站点名称', trigger: 'change' }
          ],
          name_spell: [
            { required: true, message: '请输入站点名称拼音', trigger: 'blur' },
            { required: true, message: '请输入站点名称拼音', trigger: 'change' }
          ],
          second_domain: [
            { required: true, message: '请输入二级域名', trigger: 'blur' },
            { required: true, message: '请输入二级域名', trigger: 'change' }
          ],
          city_id: [
            { required: true, message: '请选择城市名称', trigger: 'change' }
          ],
          customer_code: [
            { required: true, message: '请输入客服代码', trigger: 'blur' },
            { required: true, message: '请输入客服代码', trigger: 'change' }
          ],
          // statistic_code: [
          //   { required: true, message: '请输入百度统计代码', trigger: 'blur' },
          //   { required: true, message: '请输入百度统计代码', trigger: 'change' }
          // ],
          // cnzz: [
          //   { required: true, message: '请输入CNZZ代码', trigger: 'blur' },
          //   { required: true, message: '请输入CNZZ代码', trigger: 'change' }
          // ],
          company_name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { required: true, message: '请输入公司名称', trigger: 'change' }
          ],
          company_icp: [
            { required: true, message: '请输入ICP备案信息', trigger: 'blur' },
            { required: true, message: '请输入ICP备案信息', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getCityId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid > -1){
        this.setlabel = "编辑分站管理";
        this.getEditPage();
      }else{
        this.setlabel = "新增分站管理";
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
        this.$router.push({ name:'分总站管理' })
      },
      //获取省市级数据
      getCityId(){
        provincesList({}).then(res => {
          this.cityidOptions = res;
        });
      },
      handleChange(value) {
        if(value){
          this.ruleForm.city_id = value[1];
        }
      },
      //start
      handleAvatarSuccess(res, file) {
        if (res.pic_url && res.server_domain) {
          this.ruleForm.qrcode = res.server_domain + res.pic_url;
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
      //获取编辑页数据
      getEditPage(){
        editMasView(this.sid,{}).then(res => {
          this.ruleForm.name            = res.name;
          this.ruleForm.name_spell      = res.name_spell;
          this.ruleForm.second_domain   = res.second_domain;
          this.ruleForm.status          = res.status;
          this.ruleForm.content_type    = res.content_type;
          this.ruleForm.city_id         = res.city_id;
          this.ruleForm.company_address = res.company_address;
          this.ruleForm.company_phone   = res.company_phone;
          this.ruleForm.company_mobile  = res.company_mobile;
          this.ruleForm.company_name    = res.company_name;
          this.ruleForm.company_icp     = res.company_icp;
          this.ruleForm.qrcode          = res.qrcode;
          this.tempCover                = res.qrcode+"!ps2";
          this.ruleForm.customer_code   = res.customer_code;
          this.ruleForm.keywords        = res.keywords;
          this.ruleForm.description     = res.description;
          this.ruleForm.statistic_code  = res.statistic_code;
          this.ruleForm.mobile_statistic_code = res.mobile_statistic_code;
          //this.ruleForm.cnzz            = res.cnzz;
          this.ruleForm.is_closed       = res.is_closed;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid > -1){
              editMasList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'分总站管理' })
              });
            }else{
              //新增接口
              addMasList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'分总站管理' })
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
              <el-form-item label="分站名称:" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="名称拼音:" prop="name_spell" required>
                <el-input v-model="ruleForm.name_spell" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="二级域名:" prop="second_domain" required>
                <el-input v-model="ruleForm.second_domain" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="所属城市:" prop="city_id" required>
                <el-cascader
                    v-model="ruleForm.city_id"
                    :options="cityidOptions"
                    :props = "cityidProps"
                    @change="handleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="关键词:">
                <el-input v-model="ruleForm.keywords" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="描述:">
                <el-input v-model="ruleForm.description" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="是否显示:" required>
                  <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="是否关闭:" required>
                  <el-radio-group v-model="ruleForm.is_closed">
                    <el-radio :label="0">开启</el-radio>
                    <el-radio :label="1">关闭</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="内容方式:" required>
                  <el-radio-group v-model="ruleForm.content_type">
                    <el-radio :label="0">独立维护</el-radio>
                    <el-radio :label="1">调取主站</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="客服电话:" prop="company_phone">
                <el-input type="text" v-model="ruleForm.company_phone" placeholder="客服电话" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="短信接收号码:" prop="company_mobile">
                <el-input v-model="ruleForm.company_mobile" placeholder="接收通知短信号码" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="公司地址:">
                <el-input v-model="ruleForm.company_address" placeholder="公司地址" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="二维码:" required>
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
                  <p class="mt1em">建议尺寸：500px*500px(格式：jpg，png，gif，大小：小于等于5MB)</p>
              </el-form-item>
              <el-form-item label="客服代码:" prop="customer_code" required>
                  <el-input type="textarea" :rows="6" v-model="ruleForm.customer_code" placeholder="客服代码" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="百度PC统计代码:">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.statistic_code" placeholder="百度PC统计代码" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="百度H5统计代码:">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.mobile_statistic_code" placeholder="百度H5统计代码" class="input-width5"></el-input>
              </el-form-item>
              <!--<el-form-item label="CNZZ代码:" prop="cnzz" required>
                  <el-input type="textarea" :rows="6" v-model="ruleForm.cnzz" placeholder="CNZZ代码" class="input-width5"></el-input>
              </el-form-item>-->
              <el-form-item label="公司名称:" prop="company_name" required>
                <el-input v-model="ruleForm.company_name" placeholder="公司名称" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="ICP备案信息:" prop="company_icp" required>
                <el-input v-model="ruleForm.company_icp" placeholder="公司名称" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {provincesList} from '@/api/public';
  import { getToken } from '@/utils/auth';
  import {addMasList, editMasView, editMasList} from '@/api/master';

  export default {
    name:'addEdit',
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
        actions:'',
        ruleForm: {
          name: '',                                 //站点名称
          name_spell: '',                          //站点名称拼音
          second_domain: '',                      //二级域名
          city_id: '',                           //所属城市
          keywords: '',                         //关键词
          description: '',                     //描述
          status: 1,                         //是否显示
          is_closed: 0,                     //是否关闭
          content_type: 0,                 //内容方式
          company_phone: '',               //客服电话
          company_mobile: '',             //接收短信手机号码
          company_address: '',           //公司地址
          qrcode: '',                   //二维码
          customer_code: '',           //客服代码
          company_name: '',           //公司名称
          company_icp: '',           //公司icp备案号
          statistic_code: '',         //百度PC统计代码
          mobile_statistic_code: '', //百度H5统计代码
          //cnzz: ''                 //CNZZ代码
        },
        rules: {
          //门店名称
          name: [
            { required: true, message: '请输入站点名称', trigger: 'blur' },
            { required: true, message: '请输入站点名称', trigger: 'change' }
          ],
          name_spell: [
            { required: true, message: '请输入站点名称拼音', trigger: 'blur' },
            { required: true, message: '请输入站点名称拼音', trigger: 'change' }
          ],
          second_domain: [
            { required: true, message: '请输入二级域名', trigger: 'blur' },
            { required: true, message: '请输入二级域名', trigger: 'change' }
          ],
          city_id: [
            { required: true, message: '请选择城市名称', trigger: 'change' }
          ],
          customer_code: [
            { required: true, message: '请输入客服代码', trigger: 'blur' },
            { required: true, message: '请输入客服代码', trigger: 'change' }
          ],
          // statistic_code: [
          //   { required: true, message: '请输入百度统计代码', trigger: 'blur' },
          //   { required: true, message: '请输入百度统计代码', trigger: 'change' }
          // ],
          // cnzz: [
          //   { required: true, message: '请输入CNZZ代码', trigger: 'blur' },
          //   { required: true, message: '请输入CNZZ代码', trigger: 'change' }
          // ],
          company_name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { required: true, message: '请输入公司名称', trigger: 'change' }
          ],
          company_icp: [
            { required: true, message: '请输入ICP备案信息', trigger: 'blur' },
            { required: true, message: '请输入ICP备案信息', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getCityId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid > -1){
        this.setlabel = "编辑分站管理";
        this.getEditPage();
      }else{
        this.setlabel = "新增分站管理";
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
        this.$router.push({ name:'分总站管理' })
      },
      //获取省市级数据
      getCityId(){
        provincesList({}).then(res => {
          this.cityidOptions = res;
        });
      },
      handleChange(value) {
        if(value){
          this.ruleForm.city_id = value[1];
        }
      },
      //start
      handleAvatarSuccess(res, file) {
        if (res.pic_url && res.server_domain) {
          this.ruleForm.qrcode = res.server_domain + res.pic_url;
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
      //获取编辑页数据
      getEditPage(){
        editMasView(this.sid,{}).then(res => {
          this.ruleForm.name            = res.name;
          this.ruleForm.name_spell      = res.name_spell;
          this.ruleForm.second_domain   = res.second_domain;
          this.ruleForm.status          = res.status;
          this.ruleForm.content_type    = res.content_type;
          this.ruleForm.city_id         = res.city_id;
          this.ruleForm.company_address = res.company_address;
          this.ruleForm.company_phone   = res.company_phone;
          this.ruleForm.company_mobile  = res.company_mobile;
          this.ruleForm.company_name    = res.company_name;
          this.ruleForm.company_icp     = res.company_icp;
          this.ruleForm.qrcode          = res.qrcode;
          this.tempCover                = res.qrcode+"!ps2";
          this.ruleForm.customer_code   = res.customer_code;
          this.ruleForm.keywords        = res.keywords;
          this.ruleForm.description     = res.description;
          this.ruleForm.statistic_code  = res.statistic_code;
          this.ruleForm.mobile_statistic_code = res.mobile_statistic_code;
          //this.ruleForm.cnzz            = res.cnzz;
          this.ruleForm.is_closed       = res.is_closed;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid > -1){
              editMasList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'分总站管理' })
              });
            }else{
              //新增接口
              addMasList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'分总站管理' })
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
