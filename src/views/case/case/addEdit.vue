<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
              <!--title-page start-->
              <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
              <el-divider></el-divider>
              <!--title-page end-->
              <el-form-item label="案例名称" prop="name" required> 
                  <el-input v-model="ruleForm.name" placeholder="输入名称" class="input-width5" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="关键词:" prop="keywords" required>
                <el-input v-model="ruleForm.keywords" placeholder="单行输入" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="案例面积" prop="house_area" required>
                  <el-input type="number" v-model.number="ruleForm.house_area" placeholder="输入面积" class="input-width" :disabled="isDisabled"></el-input>
                  <span class="ml10">㎡</span>
              </el-form-item>
              <el-form-item label="选择面积区间" prop="house_area_id" required>
                  <el-select v-model="ruleForm.house_area_id" placeholder="请选择面积" clearable class="input-width" :disabled="isDisabled">
                    <el-option v-for="item in houseAreaOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="所属套系" prop="price_id" required>
                  <el-select v-model="ruleForm.price_id" placeholder="请选择所属套系" clearable class="input-width" :disabled="isDisabled">
                    <el-option v-for="item in sleeveOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="案例排序" prop="sort" required>
                  <el-input type="number" v-model.number="ruleForm.sort" placeholder="请输入排序值" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="选择户型" prop="house_type_id" required>
                  <el-select v-model="ruleForm.house_type_id" placeholder="请选择户型" clearable class="input-width" :disabled="isDisabled">
                    <el-option v-for="item in houseTypeOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="选择标签" required>
                <Stags v-model="ruleForm.tag_ids" :setStagName="setStagName" :tagData="tagData" v-on:getTagsId="getTagsId" :isDisabled="isDisabled"></Stags>
              </el-form-item>
              <el-form-item label="是否展示:" required>
                  <el-radio-group v-model="ruleForm.status" :disabled="isDisabled">
                    <el-radio :label="1">展示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="总站排序:" prop="sort_master" required>
                <el-input type="number" v-model.number="ruleForm.sort_master" placeholder="总站排序"></el-input>
              </el-form-item>
              <el-form-item label="所属站点" prop="site_id" required>
                <el-select v-model="ruleForm.site_id" placeholder="选择站点" clearable class="input-width" :disabled="isDisabled" @change="handleChange">
                  <el-option v-for="item in siteidOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属楼盘" required>
                <el-select v-model="ruleForm.building_id" placeholder="楼盘名称" clearable :disabled="isDisabled">
                    <el-option v-for="item in buildOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="案例说明" prop="description" required>
                  <el-input type="textarea" :row="6" v-model="ruleForm.description" placeholder="案例说明" class="tx_area" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="" v-if="setStagName == '编辑' ">
                <el-button type="success" @click="jumpPic">上传图片</el-button>
              </el-form-item>
              <el-form-item label="图片数量：" v-if="subject_photos_count">
                <div class="mt15">{{subject_photos_count}}张</div>
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
  import Stags from '@/components/Tags/index';
  import {siteNameList, provincesList,getSleeve,getAreas,getHouseTypes,getSiteBuilding} from '@/api/public';
  import {tagsList} from '@/api/tags';
  import {addCaseList, editCaseView, editCaseList} from '@/api/case';

  export default {
    name:'addEdit',
    components:{
      Stags
    },
    data() {
      return {
        sid: "",
        $parent_id: "",
        setlabel: "",
        setStagName: "",
        tagData: [],
        siteidOptions: [],
        sleeveOptions: [],
        houseAreaOptions: [],
        houseTypeOptions: [],
        buildOptions: [],
        cityidOptions: [],
        mCityData: [],
        ruleForm: {
          name: '',
          keywords: '',
          description: '',
          house_area: '',
          house_area_id: '',
          price_id: '',
          house_type_id: '',
          site_id: '',
          status: 1,
          sort: '',
          building_id: '',
          tag_ids:[],
          sort_master: ''
        },
        sendId:null,
        isDisabled:false,
        sTempArr: [],
        sResultArr: [],
        subject_photos_count: '',
        rules: {
          name: [
            { required: true, message: '请输入案例名称', trigger: 'blur' },
            { required: true, message: '请输入案例名称', trigger: 'change' }
          ],
          keywords: [
            { required: true, message: '请输入关键词', trigger: 'blur' },
            { required: true, message: '请输入关键词', trigger: 'change' }
          ],
          house_area: [
            { required: true, message: '请输入案例面积', trigger: 'blur' }
          ],
          house_area_id: [
            { required: true, message: '请选择面积区间', trigger: 'change' }
          ],
          price_id: [
            { required: true, message: '请选择所属套系', trigger: 'change' }
          ],
          sort:  [
            { required: true, message: '请输入案例排序', trigger: 'blur' }
          ],
          sort_master:  [
            { required: true, message: '请输入总站排序', trigger: 'blur' },
            { required: true, message: '请输入总站排序', trigger: 'change' }
          ],
          house_type_id:  [
            { required: true, message: '请选择户型', trigger: 'change' }
          ],
          site_id:  [
            { required: true, message: '请选择所属分站', trigger: 'change' }
          ],
          description: [
            { required: true, message: '请输入案例说明', trigger: 'blur' },
            { required: true, message: '请输入案例说明', trigger: 'change' }
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
      //所属套系
      this.getSleeves();
      //所属面积
      this.getHouseAreas();
      //所属户型
      this.getHouseTypes();
      
      //编辑
      this.sid        = this.$route.params.id;
      this.$parent_id = this.$route.params.parent_id;
      if(this.sid){
        this.setlabel = "编辑案例";
        this.setStagName = "编辑";
        this.getEditPage();
        //如果转载ID不为0,只能修改sort字段
        if(this.$parent_id == 0){
          this.isDisabled = false;
        }else{
          this.isDisabled = true;
        }
      }else{
        this.setlabel = "新增案例";
        this.setStagName = "新增";
        //获取标签
        this.getTags();
      }
    },
    methods:{
      jumpPic(){
        if(this.sid){
          this.$router.push({ name:'案例信息', params:{vId:this.sid, pageType: "编辑", isDisabled: this.isDisabled } })
        }
      },
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'案例管理' })
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
      //获取所属套系
      getSleeves(){
        getSleeve({}).then(res => {
          this.sleeveOptions = res;
        });
      },
      //获取所属面积
      getHouseAreas(){
        getAreas({}).then(res => {
          this.houseAreaOptions = res;
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
        editCaseView(this.sid,{}).then(res => {
          //没转载
          if(this.$parent_id == 0){
            this.ruleForm.name          = res.name;
            this.ruleForm.keywords      = res.keywords;
            this.ruleForm.site_id       = res.site_id;
            this.ruleForm.house_area    = res.house_area;
            this.ruleForm.house_area_id = res.house_area_id;
            this.ruleForm.price_id      = res.price_id;
            this.ruleForm.house_type_id = res.house_type_id;
            this.ruleForm.description   = res.description;
            this.ruleForm.status        = res.status;
            this.ruleForm.building_id   = res.building_id;
          }else{
            //转载
            if(res.parent){
              this.ruleForm.name          = res.parent.name;
              this.ruleForm.keywords      = res.parent.keywords;
              this.ruleForm.site_id       = res.site_id;
              this.ruleForm.house_area    = res.parent.house_area;
              this.ruleForm.house_area_id = res.parent.house_area_id;
              this.ruleForm.price_id      = res.parent.price_id;
              this.ruleForm.house_type_id = res.parent.house_type_id;
              this.ruleForm.description   = res.parent.description;
              this.ruleForm.status        = res.parent.status;
              this.ruleForm.building_id   = res.building_id;
            }else{
              this.ruleForm.name          = res.name;
              this.ruleForm.keywords      = res.keywords;
              this.ruleForm.site_id       = res.site_id;
              this.ruleForm.house_area    = res.house_area;
              this.ruleForm.house_area_id = res.house_area_id;
              this.ruleForm.price_id      = res.price_id;
              this.ruleForm.house_type_id = res.house_type_id;
              this.ruleForm.description   = res.description;
              this.ruleForm.status        = res.status;
              this.ruleForm.building_id   = res.building_id;
            }
            this.getBuilding('change');
          }
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
          this.ruleForm.sort          = res.sort;
          this.ruleForm.sort_master   = res.sort_master;
          if(res.subject_photos_count){
            this.subject_photos_count   = res.subject_photos_count;
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
            if(this.ruleForm.tag_ids.length == 0 && this.isDisabled == false){
              this.$message.error('请选择标签！');
              return;
            }
            if(this.ruleForm.building_id == ''){
              this.$message.error('请选择所属楼盘！');
              return;
            }
            //编辑接口
            if(this.sid){
              //转载
              if(this.isDisabled == true){
                editCaseList(this.sid,{ sort: this.ruleForm.sort }).then(res => {   
                  this.$router.push({ name:'案例管理' })
                });
              }else{
                editCaseList(this.sid,this.ruleForm).then(res => {   
                  this.$router.push({ name:'案例管理' })
                });
              }
            }else{
              //新增接口
              addCaseList(this.ruleForm).then(res => {  
                this.$confirm('新建成功,现在可以上传图片了, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push({ name:'案例信息', params:{vId: res.id, pageType: "新增" } })
                }).catch(() => {
                  this.$router.push({ name:'案例管理'});
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
</style>


