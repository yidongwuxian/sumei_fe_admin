<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="所属分站" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="请选择分站" clearable class="input-width" @change="handleChange">
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工地名称" prop="name" required> 
                  <el-input v-model="ruleForm.name" placeholder="单行输入" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="关键词:">
                <el-input v-model="ruleForm.keywords" placeholder="单行输入" class="input-width5"></el-input>
              </el-form-item>
              <el-form-item label="选择标签" required>
                <Stags v-model="ruleForm.tag_ids" :setStagName="setStagName" :tagData="tagData" v-on:getTagsId="getTagsId"></Stags>
              </el-form-item>
              <el-form-item label="户型" prop="house_type_id" required> 
                  <el-select v-model="ruleForm.house_type_id" placeholder="一居室" clearable class="input-width">
                    <el-option v-for="item in houseTypeOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="面积" prop="area" required>
                  <el-input type="number" v-model.number="ruleForm.area" placeholder="输入面积" class="input-width">
                    <template slot="append">㎡</template>
                  </el-input>
              </el-form-item>
              <el-form-item label="所属楼盘"  required>
                <el-select v-model="ruleForm.building_id" placeholder="楼盘名称" clearable>
                    <el-option v-for="item in buildOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否展示:" required>
                  <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">展示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="关联案例" required>
                <el-select v-model="ruleForm.subject_id" placeholder="生成结果选择" clearable>
                    <el-option v-for="item in subjectOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>    
                </el-select>
                <el-input v-model="obj1.id" placeholder="ID" class="input-width" clearable></el-input>
                <el-input v-model="obj1.name" placeholder="案例名称" class="input-width" clearable></el-input>
                <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="getCaseFilter">
                  <span>搜索</span>
                </button>
              </el-form-item>
              <el-form-item label="关联工队" required>
                <el-select v-model="ruleForm.construction_team_id" placeholder="生成结果选择" clearable>
                    <el-option v-for="item in constructionOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="obj2.id" placeholder="ID" class="input-width" clearable></el-input>
                <el-input v-model="obj2.name" placeholder="工队名称" class="input-width" clearable></el-input>
                <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="getGroupFilter">
                  <span>搜索</span>
                </button>
              </el-form-item>
              <el-form-item label="简介">
                  <el-input type="textarea" :rows="6" v-model="ruleForm.description" placeholder="输入简介" class="input-width6"></el-input>
              </el-form-item>
              <el-form-item label="总站排序:">
                <el-input type="number" v-model.number="ruleForm.sort_master" placeholder="总站排序" class="input-width"></el-input>
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
                  <p>图片尺寸：建议宽度1200px, 图片格式：jpg，png，gif，大小：5M以内</p>
              </el-form-item>
              <el-form-item label="图片数量：" v-if=" setlabel == '编辑工地' ">
                <div class="mt15">{{photo_count}}张</div>
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
  import Stags from '@/components/Tags/index';
  import {siteNameList, provincesList,getSleeve,getHouseTypes,getSiteBuilding} from '@/api/public';
  import {tagsList} from '@/api/tags';
  import {caseList} from '@/api/case';
  import {addSiteList,editSiteView,editSiteList,groupList} from '@/api/building';
  const defaultListFilter = {
    id:      "",              //ID
    name: "",                //案例名称
  };
  const defaultListFilter2 = {
    id:      "",              //ID
    name: "",                //案例名称
  };

  export default {
    name:'addEdit',
    components:{
      Stags
    },
    data() {
      return {
        obj1:Object.assign({},defaultListFilter),
        obj2:Object.assign({},defaultListFilter2),
        tempCover: '',
        sid: "",
        $parent_id: "",
        setlabel: "",
        setStagName: "",
        photo_count: '',
        tagData: [],
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
        ruleForm: {
          name: '',
          keywords: '',
          site_id: '',
          building_id: '',
          subject_id: '',
          construction_team_id: '',
          area: '',
          house_type_id: '',
          description: '',
          cover: '',
          status: 1,
          tag_ids:[],
          sort_master: 0
        },
        subject_id: '',
        subject_name: '',
        construction_id: '',
        construction_name: '',
        sTempArr: [],
        sResultArr: [],
        rules: {
          site_id: [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入工地名称', trigger: 'blur' },
            { required: true, message: '请输入工地名称', trigger: 'change' }
          ],
          house_type_id: [
            { required: true, message: '请选择户型', trigger: 'change' }
          ],
          area: [
            { required: true, message: '请输入面积', trigger: 'blur' },
            { required: true, message: '请输入面积', trigger: 'change' }
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
      //所属户型
      this.getHouseTypes();
      //获取案例
      this.getCase();
      //获取工队
      this.getGroup();
      //编辑
      this.sid        = this.$route.params.id;
      this.$parent_id = this.$route.params.parent_id;
      if(this.sid){
        this.setlabel = "编辑工地";
        this.setStagName = "编辑";
        this.getEditPage();
      }else{
        this.setlabel = "新增工地";
        this.setStagName = "新增";
        //获取标签
        this.getTags();  
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
        this.$router.push({ name:'工地管理' })
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
      //获取案例
      getCase(params){
        caseList(params).then(res => {
          this.subjectOptions = res.data; 
        });
      },
      getCaseFilter(){
        if(!this.obj1){
          this.getCase(); 
        }else{
          this.getCase({id:this.obj1.id,name:this.obj1.name});
        }
      },
      //获取工队
      getGroup(){  
        groupList({}).then(res => {
          this.constructionOptions = res.data; 
        });
      },
      filterGroup(params){ 
        this.ruleForm.construction_team_id = '';
        groupList(params).then(res => {
          this.constructionOptions = res.data; 
          this.ruleForm.construction_team_id = res.data[0].id;
        });
      },
      getGroupFilter(){
        if(!this.obj2){
          this.filterGroup(); 
        }else{
          this.filterGroup({id:this.obj2.id,name:this.obj2.name});
        }
      },
      //获取标签
      getTags(){  
        tagsList({per_page: 10000}).then(res => {
          this.tagData = res.data; 
        });
      },
      getTagsId(val){
        //编辑状态下  
        if(this.sid){
          if(this.sResultArr.length > 0){
              this.sTempArr = this.sResultArr;       
          }
        }
        //已选择
        if(val.is_selected == 0){
          for(let m in this.sResultArr){
            if(this.sResultArr[m] == val.id){
              this.sResultArr.splice(m,1);         
            }
          }
        }
        //未选择
        if(val.is_selected == 1){          
          for(let k in this.tagData){
            if(this.tagData[k].id == val.id){
                this.sResultArr.push(this.tagData[k].id);
                this.sResultArr = this.sTempArr.concat(this.sResultArr); 
                this.sResultArr = uniqueArr(this.sResultArr); 
            }
          }
        } 
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取户型类别
      getHouseTypes(){
        getHouseTypes({}).then(res => {
          this.houseTypeOptions = res;
        });
      },
      //获取省市级数据
      getCityId(){
        siteNameList({}).then(res => {
          this.cityidOptions = res;
        });
      },
      //获取楼盘
      getBuilding(param){
        if(this.ruleForm.site_id){
          getSiteBuilding(this.ruleForm.site_id,{}).then(res => {
            this.buildOptions = res;
            if(param == 'change'){
              this.ruleForm.building_id = res[0].id;
            }
          });
        }
      },
      //获取编辑页数据
      getEditPage(){
        editSiteView(this.sid,{}).then(res => {
          this.ruleForm.name          = res.name;
          this.ruleForm.keywords      = res.keywords;
          this.ruleForm.site_id       = res.site_id;
          this.ruleForm.area          = res.area;
          this.ruleForm.house_type_id = res.house_type_id;
          this.ruleForm.description   = res.description;
          this.ruleForm.status        = res.status;
          this.$nextTick(function () {
            this.tagData              = res.all_tags; 
            this.sResultArr     = [];
            for(let k in this.tagData){
              //已选择
              if(this.tagData[k].is_selected === 1){
                let param = {
                    id: this.tagData[k].id,
                    is_selected: this.tagData[k].is_selected
                }  
                this.sResultArr.push(this.tagData[k].id);
                this.sResultArr = uniqueArr(this.sResultArr);
              }
            } 
          });
           
          this.ruleForm.building_id   = res.building_id;
          this.ruleForm.sort_master   = res.sort_master;
          this.tempCover              = res.cover+"!ps2";
          this.ruleForm.cover         = res.cover;
          this.ruleForm.subject_id    = res.subject_id;
          this.ruleForm.construction_team_id = res.construction_team_id;
          if(res.photo_count > -1){
            this.photo_count   = res.photo_count;
          }
          this.getBuilding();
        });
      },
      handleChange(value) {
        if(value){
          this.getBuilding('change');
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.tag_ids = this.sResultArr;    

            if(this.ruleForm.tag_ids.length == 0){
              this.$message.error('请选择标签！');
              return;
            }

            if(this.ruleForm.building_id == ''){
              this.$message.error('请选择所属楼盘！');
              return;
            }

            if(this.ruleForm.subject_id == ''){
              this.$message.error('请选择关联案例');
              return;
            }
            if(this.ruleForm.construction_team_id == ''){
              this.$message.error('请选择关联工队');
              return;
            }

            //编辑接口
            if(this.sid){
              editSiteList(this.sid,this.ruleForm).then(res => {
                this.$confirm('编辑成功,现在可以上传图片了, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push({ name:'工地信息', params:{vId:this.sid, pageType: "编辑"} })
                }).catch(() => {
                });
              });
            }else{
              //新增接口
              addSiteList(this.ruleForm).then(res => {
                this.$confirm('新建成功,现在可以上传图片了, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push({ name:'工地信息', params:{vId:res.id, pageType: "新增"} })
                }).catch(() => {
                });
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


