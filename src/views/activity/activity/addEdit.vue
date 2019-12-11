<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="所属站点" prop="site_id">
                <el-select v-model="ruleForm.site_id" placeholder="选择站点" clearable>
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店名称" prop="name">
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="所属省份/城市" prop="city_id" required>
                <el-cascader
                    v-model="ruleForm.city_id"
                    :options="cityidOptions"
                    :props = "cityidProps"
                    @change="handleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="营业时间" required>
                <el-col :span="4">
                  <el-form-item prop="date1">
                    <el-time-select
                      placeholder="起始时间"
                      @change="changeDate1"
                      v-model="ruleForm.date1"
                      format="HH:mm:ss"
                      :picker-options="{
                        start: '01:00',
                        step: '01:00',
                        end: '23:00'
                      }">
                    </el-time-select>
                  </el-form-item>
                </el-col>
                <el-col class="line l_time" :span="1">-- 至 --</el-col>
                <el-col :span="4">
                  <el-form-item prop="date2">
                    <el-time-select
                      placeholder="结束时间"
                      @change="changeDate2"
                      v-model="ruleForm.date2"
                      format="HH:mm:ss"
                      :picker-options="{
                        start: '01:00',
                        step: '01:00',
                        end: '23:00'
                      }">
                    </el-time-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="门店地址" prop="address" required>
                <el-input v-model="ruleForm.address" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="门店电话" prop="phone">
                <el-input type="text" v-model="ruleForm.phone" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="展示位置排序" prop="sort">
                <el-input type="number" v-model.number="ruleForm.sort" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="店面是否隐藏:">
                  <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="分站显示电话:" prop="show_phone">
                  <el-radio-group v-model="ruleForm.show_phone">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="封面图:" required>
                  <el-upload
                    class="avatar-uploader"
                    :action=actions
                    :data="{'module':'store','type':'image'}"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="tempCover" :src="tempCover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <p>图片建议尺寸：882*470px，图片格式：jpg，png，gif，大小：5M以内</p>
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
  import {addFetchList, editFetchView, editFetchList} from '@/api/activity';

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
        shopHide: 1,
        actions:'',
        ruleForm: {
          name: '',
          site_id: '',
          city_id: '',
          date1: '03:00',
          date2: '06:00',
          address: '',
          phone: '',
          show_phone: 1,
          sort: "",
          status:1, //门店是否显示
          business_time: '',
          cover: '', 
          lat: '',
          lng: ''
        },
        rules: {
          //门店名称
          name: [
            { required: true, message: '请输入门店名称', trigger: 'blur' },
            { required: true, message: '请输入门店名称', trigger: 'change' }
          ],
          site_id: [
            { required: true, message: '请选择站点名称', trigger: 'blur' },
            { required: true, message: '请选择站点名称', trigger: 'change' }
          ],
          city_id: [
            { required: true, message: '请选择城市名称', trigger: 'blur' },
            { required: true, message: '请选择城市名称', trigger: 'change' }
          ],
          date1: [
            { type: 'string', required: true, message: '请选择起始时间', trigger: 'change' }
          ],
          date2: [
            { type: 'string', required: true, message: '请选择结束时间', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入门店地址', trigger: 'blur' },
            { required: true, message: '请输入门店地址', trigger: 'change' }
          ],
          phone: [
            { required: true,  message: '请输入门店电话', trigger: 'blur' },
            { required: true,  message: '请输入门店电话', trigger: 'change' }
          ],
          sort: [
            { required: true, message: '请输入排序值', trigger: 'blur' },
            { required: true, message: '请输入排序值', trigger: 'change' }
          ],
          show_phone: [
            { required: true, message: '请选择分站显示电话', trigger: 'blur' },
            { required: true, message: '请选择分站显示电话', trigger: 'change' }
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
        this.setlabel = "编辑门店";
        this.getEditPage();
      }else{
        this.setlabel = "新增门店";
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
        this.$router.push({ name:'门店管理' })
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
      //获取地图坐标
      mapconfirm(e){
        let isE = JSON.stringify(e);
        if(isE){
          if(JSON.stringify(e.lat)){
            this.latlng = JSON.stringify(e.lat)
          }
          if(JSON.stringify(e.lng)){
            this.latlng = JSON.stringify(e.lng);
          }
          if(JSON.stringify(e.lat) && JSON.stringify(e.lng)){
            this.latlng = JSON.stringify(e.lat) + "," + JSON.stringify(e.lng);
          }
          this.ruleForm.lat = JSON.stringify(e.lat);
          this.ruleForm.lng = JSON.stringify(e.lng);
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
      changeDate1(val){
        if(this.ruleForm.date2 < val){
          this.$message({
            type: 'error',
            message: '请重新选择营业时间!'
          });
          return;
        }
      },
      changeDate2(val){
        if(this.ruleForm.date1 > val){
          this.$message({
            type: 'error',
            message: '请重新选择营业时间!'
          });
          return;
        }
      },
      //获取编辑页数据
      getEditPage(){
        editFetchView(this.sid,{}).then(res => {
          this.ruleForm.name       = res.name;
          this.ruleForm.site_id    = res.site_id;
          this.ruleForm.city_id    = res.city_id;
          this.ruleForm.date1      = res.business_time.split('-')[0];
          this.ruleForm.date2      = res.business_time.split('-')[1];
          this.ruleForm.address    = res.address;
          this.ruleForm.phone      = res.phone;
          this.ruleForm.sort       = res.sort;
          this.ruleForm.show_phone = res.show_phone;
          this.ruleForm.cover      = res.cover; 
          this.tempCover           = res.cover+"!ps2";
          this.ruleForm.lat        = res.lat;
          this.ruleForm.lng        = res.lng;
          this.show_phone          = res.city;
          this.ruleForm.status     = res.status;
          this.latlng = res.lat + "," + res.lng;
        });
      },
      handleChange(value) {
        if(value){
          this.ruleForm.city_id = value[1];
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //start
            if(this.ruleForm.date2 < this.ruleForm.date1){
              this.$message({
                type: 'error',
                message: '请重新选择营业时间!'
              });
              return;
            }
            this.ruleForm.business_time = this.ruleForm.date1 + "-" + this.ruleForm.date2;
            delete this.ruleForm.date1;
            delete this.ruleForm.date2;
            console.log('mkdata:'+JSON.stringify(this.ruleForm) );
            if(this.ruleForm.lat == "" || this.ruleForm.lng == ""){
              this.$message({
                type: 'error',
                message: '请选择地图地址!'
              });
              return;
            } 
            //end
            //编辑接口
            if(this.sid){
              editFetchList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'门店管理' })
              });
            }else{
              //新增接口
              addFetchList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'门店管理' })
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
.l_time{
  margin:12px 20px 0 0;
}
</style>


