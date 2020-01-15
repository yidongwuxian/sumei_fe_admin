<template>
    <div>
      <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
        <el-form-item label="搜索条件：">
            <!--门店、楼盘、工地、工队-->
            <div v-if="typeStore === true">
               <el-select v-model="listPageFilter.module" placeholder="搜索类别" clearable class="input-width" @change="changeModule">
                  <el-option v-for="item in typeOptions"
                            :key="item.name"
                            :label="item.label"
                            :value="item.name">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.status" placeholder="是否显示" clearable class="input-width" @change="switchStatus">
                  <el-option v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> 
                <el-select v-model="listPageFilter.time_type" placeholder="时间类型" clearable class="input-width" @change="changeTimeType">
                    <el-option v-for="item in columnDateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
                <!--<Sselect :searchResult="searchResult"></Sselect>-->

                <el-date-picker
                  v-model="dateRange"
                  @change="changeDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <!--案例-->
            <div v-if="typeSubject === true">
                <el-select v-model="listPageFilter.module" placeholder="搜索类别" clearable class="input-width" @change="changeModule">
                  <el-option v-for="item in typeOptions"
                            :key="item.name"
                            :label="item.label"
                            :value="item.name">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.status" placeholder="是否显示" clearable class="input-width" @change="switchStatus">
                  <el-option v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> 
                <el-select v-model="listPageFilter.price_id" placeholder="所属套系" clearable class="input-width"  @change="changeSleeve">
                  <el-option v-for="item in sleeveOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.tag_id" placeholder="所属标签" clearable class="input-width" @change="changeTag">
                  <el-option v-for="item in tagData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.time_type" placeholder="时间类型" clearable class="input-width" @change="changeTimeType">
                    <el-option v-for="item in columnDateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                  v-model="dateRange"
                  @change="changeDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <!--线上课程-->
            <div v-if="typeStory === true">
                <el-select v-model="listPageFilter.module" placeholder="搜索类别" clearable class="input-width" @change="changeModule">
                  <el-option v-for="item in typeOptions"
                            :key="item.name"
                            :label="item.label"
                            :value="item.name">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.is_publish" placeholder="是否发布" clearable class="input-width" @change="switchPublish">
                  <el-option v-for="item in publishOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> 
                <el-select v-model="listPageFilter.story_type" placeholder="所属栏目" clearable  class="input-width" @change="changeColumn">
                  <el-option v-for="item in columnOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.column_id" value-key="id" placeholder="" clearable class="input-width"  @change="changeColumnId">
                  <el-option v-for="item in typeIdOptions"
                      :key="item.id"
                      :label="item.story_type_name"
                      :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.time_type" placeholder="时间类型" clearable class="input-width" @change="changeTimeType">
                    <el-option v-for="item in columnDateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                  v-model="dateRange"
                  @change="changeDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <!--活动、线下课程、友链-->
            <div v-if="typeActivity === true">
                <el-select v-model="listPageFilter.module" placeholder="搜索类别" clearable class="input-width" @change="changeModule">
                  <el-option v-for="item in typeOptions"
                            :key="item.name"
                            :label="item.label"
                            :value="item.name">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.time_type" placeholder="时间类型" clearable class="input-width" @change="changeTimeType">
                    <el-option v-for="item in columnDateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                  v-model="dateRange"
                  @change="changeDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
             <!--专题-->
            <div v-if="typeSpecial === true">
                <el-select v-model="listPageFilter.module" placeholder="搜索类别" clearable class="input-width" @change="changeModule">
                  <el-option v-for="item in typeOptions"
                            :key="item.name"
                            :label="item.label"
                            :value="item.name">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.is_publish" placeholder="是否发布" clearable class="input-width" @change="switchPublish">
                  <el-option v-for="item in publishOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="listPageFilter.platform" placeholder="平台类型" clearable class="input-width" @change="changePlatform">
                    <el-option v-for="item in handOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="listPageFilter.time_type" placeholder="时间类型" clearable class="input-width" @change="changeTimeType">
                    <el-option v-for="item in columnDateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                  v-model="dateRange"
                  @change="changeDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </el-form-item>
        <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
            <span>搜索</span>
        </button>
        <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="exportExcel">
            <span>导出Excel</span>
        </button>
      </el-form>
    </div>
</template>
<script>
   import {tagsList} from '@/api/tags';
   import {getSleeve} from '@/api/public';
   import {typesList} from '@/api/substance';
   import {removeEmptyObject,isVirtualVal} from '@/utils/index';
   export default {
       name: 'statisFilter',
       data(){
          return {
            dateRange: "",
            sleeveOptions: [],
            tagData: [],
            columnOptions: [],
            typeIdOptions: [],
            typeOptions:[
              {
                  "name": 'store',
                  "label": '门店'
              },
              {
                  "name": 'subject',
                  "label": '案例'
              },
              {
                  "name": 'building',
                  "label": '楼盘'
              },
              {
                  "name": 'construction',
                  "label": '工地'
              },
              {
                  "name": 'constructionTeam',
                  "label": '工队'
              },
              {
                  "name": 'story',
                  "label": '线上课程'
              },
              {
                  "name": 'course',
                  "label": '线下课程'
              },
              {
                  "name": 'special',
                  "label": '专题'
              },
              {
                  "name": 'activity',
                  "label": '活动'
              },
              {
                  "name": 'friendLink',
                  "label": '友链'
              }
            ],
            handOptions: [
              {
                value: 1,
                label: 'PC'
              },
              {
                value: 2,
                label: 'H5'
              }
            ],
            publishOptions: [
              {
                value: 1,
                label: '已发布'
              },
              {
                value: 0,
                label: '未发布'
              }
            ],
            statusOptions: [
              {
                value: 1,
                label: '显示'
              },
              {
                value: 0,
                label: '隐藏'
              }
            ],
            columnOptions: [{
              value: 1,
              label: '装修前'
            }, {
              value: 2,
              label: '装修中'
            }, {
              value: 3,
              label: '装修后'
            }],
            columnDateOptions:[
              {
                  "value": 'created_at',
                  "label": '添加时间'
              },
              {
                  "value": 'updated_at',
                  "label": '修改时间'
              }
            ],
            listPageFilter:{},
            typeStore: true,
            typeSubject: false,
            typeStory: false,
            typeActivity: false,
            typeSpecial: false,       
          }
       },
       created() {
          this.listPageFilter.module = this.typeOptions[0].name; 
       },
       watch: {
          'listPageFilter.story_type': function (newValue, oldValue) {
              this.listPageFilter.column_id = null
          }
       },
       methods: {
          //搜索类别
          changeModule(val){
              if(val === 'store' || val === 'building' || val === 'construction' || val === 'constructionTeam' ){
                  this.typeStore = true;
                  this.typeSubject = false;
                  this.typeStory = false;
                  this.typeActivity = false;
                  this.typeSpecial = false;  
                  this.listPageFilter = {
                    'status': '',
                    'time_type': '',
                    'start_time': '',
                    'end_time': ''
                  };
                  this.dateRange = '';
                  this.listPageFilter.module = val;
              }
              if(val === 'subject'){
                  //所属套系
                  this.getSleeves();
                  //获取标签
                  this.getTags();
                  this.typeStore = false;
                  this.typeSubject = true;
                  this.typeStory = false;
                  this.typeActivity = false;
                  this.typeSpecial = false;  
                  this.listPageFilter = {
                    'status': '',
                    'price_id': '',
                    'tag_id': '',
                    'time_type': '',
                    'start_time': '',
                    'end_time': ''
                  };
                  this.dateRange = '';
                  this.listPageFilter.module = val;
              } 
              if(val === 'story'){
                  this.typeStore = false;
                  this.typeSubject = false;
                  this.typeStory = true;
                  this.typeActivity = false;
                  this.typeSpecial = false;  
                  this.listPageFilter = {
                    'is_publish': '',
                    'story_type': '',
                    'column_id': '',
                    'time_type': '',
                    'start_time': '',
                    'end_time': ''
                  };
                  this.dateRange = '';
                  this.listPageFilter.module = val;
              }
              if(val === 'activity' || val === 'course' || val === 'friendLink'){
                  this.typeStore = false;
                  this.typeSubject = false;
                  this.typeStory = false;
                  this.typeActivity = true;
                  this.typeSpecial = false;  
                  this.listPageFilter = {
                    'time_type': '',
                    'start_time': '',
                    'end_time': ''
                  };
                  this.dateRange = '';
                  this.listPageFilter.module = val;
              }
              if(val === 'special'){
                  this.typeStore = false;
                  this.typeSubject = false;
                  this.typeStory = false;
                  this.typeActivity = false;
                  this.typeSpecial = true;  
                  this.listPageFilter = {
                    'is_publish': '',
                    'platform': '',
                    'time_type': '',
                    'start_time': '',
                    'end_time': ''
                  };
                  this.dateRange = '';
                  this.listPageFilter.module = val;
              }
              this.listPageFilter = Object.assign({}, removeEmptyObject(this.listPageFilter));
              this.$emit('searchResult', this.listPageFilter);
          },
          //获取所属套系
          getSleeves(){
            getSleeve({}).then(res => {
              this.sleeveOptions = res;
            });
          },
          //获取标签
          getTags(){  
            tagsList({per_page: 10000}).then(res => {
              this.tagData = res.data; 
            });
          },
          //获取栏目
          changeColumn(val){
            if(val){
              this.getTypesId();  
            }
          },
          changeColumnId(val){
            this.$forceUpdate();
            this.listPageFilter.column_id = val;
          },
          //获取文章模块
          getTypesId(){
            typesList({story_type: this.listPageFilter.story_type}).then(res => {
                this.typeIdOptions = res;
            });
          },
          //平台类型
          changePlatform(val){
            this.listPageFilter.platform = val;
          },
          //是否显示
          switchStatus(val){
            this.listPageFilter.status = val;
          },
          //是否发布
          switchPublish(val){
            this.listPageFilter.is_publish = val;
          },  
          //时间类别
          changeTimeType(val){
            this.listPageFilter.time_type = val;
          },
          //开始时间/结束时间
          changeDateRange(val){
            if(val != null){
              this.listPageFilter.start_time = "";
              this.listPageFilter.end_time   = "";
              this.listPageFilter.start_time = val[0];
              this.listPageFilter.end_time   = val[1];
            }else{
              this.listPageFilter.start_time = "";
              this.listPageFilter.end_time   = "";
            }
            
          },
          //所属套系
          changeSleeve(val){
            this.listPageFilter.price_id = val;
          },
          //所属标签
          changeTag(val){
            this.listPageFilter.tag_id = val;
          },
          searchFilter(){
            if(this.listPageFilter.story_type && this.typeStory === false){
              delete this.listPageFilter.story_type;
            }
            if( isVirtualVal(this.listPageFilter.start_time) && isVirtualVal(this.listPageFilter.end_time) && this.listPageFilter.time_type === undefined ){
                this.$message({
                  type: 'info',
                  message: '请选择时间类型！'
                });   
                return false;
            }
            this.listPageFilter = Object.assign({}, removeEmptyObject(this.listPageFilter));
            this.$emit('searchResult', this.listPageFilter);
          },
          //导出Excel
          exportExcel(){
            if(this.listPageFilter.story_type && this.typeStory === false){
              delete this.listPageFilter.story_type;
            }
            if( isVirtualVal(this.listPageFilter.start_time) && isVirtualVal(this.listPageFilter.end_time) && this.listPageFilter.time_type === undefined ){
                this.$message({
                  type: 'info',
                  message: '请选择时间类型！'
                });   
                return false;
            }
            this.listPageFilter = Object.assign({}, removeEmptyObject(this.listPageFilter));
            this.$emit('exportExcFn', this.listPageFilter)
          }
       },
   }
</script>
<style lang="scss" scoped>
</style>