<template> 
  <div class="app-container">
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form label-width="120px">
              <el-form-item :label="setlabel"></el-form-item> 
              <div class="box_body" v-if=" this.pageType == '编辑' && infoList.length > 0 ">
                  <div class="photoList" v-for="(sitem,index) in infoList" :key="index">
                      <div class="clearfix">
                          <div class="mt20">{{sitem.type | formatTypeName}}</div>
                              <el-row>
                                    <el-col>
                                      <div class="item" v-for="(item,_index) in sitem.photos" :key="_index">
                                          <el-upload
                                              class="avatar-uploader"
                                              style="margin: 10px auto; width: 200px;"
                                              :action=actions
                                              :data="{'module':'other','type':'image'}"
                                              :headers="headers"
                                              :show-file-list="false"
                                              :before-upload="beforeAvatarUpload"
                                              :on-success="(res,file)=>{return editPicSuccess(res,file,index,_index)}">
                                              <img v-if="item.pic_url" :src="item.pic_url + '!ps2'" class="avatar" />
                                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                          </el-upload>
                                          <p class="mb20 tx">图片尺寸：建议宽度1200px</p>
                                          <el-input type="text" v-model="item.description" placeholder="描述"></el-input>
                                      </div>
                                      <el-button class="addBtn" icon="el-icon-plus" @click="addList(sitem)">添加</el-button>
                                    </el-col>
                              </el-row>
                      </div>
                  </div>  
              </div>
              <div class="box_body" v-if=" this.pageType == '新增' || infoList.length == 0 ">
                <div class="photoList" v-for="(vitem,vindex) in typeList" :key="vindex">
                    <div class="clearfix">
                        <div class="mt20">{{vitem.type | formatTypeName}}</div>
                        <el-row>
                            <el-col>
                              <div class="item" v-for="(qitem,qindex) in vitem.photos" :key="qindex">
                                  <el-upload
                                    class="avatar-uploader"
                                    style="margin: 10px auto; width: 200px;"
                                    :action=actions
                                    :data="{'module':'other','type':'image'}"
                                    :headers="headers"
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :on-success="(res,file)=>{return addPicSuccess(res,file,vindex,qindex)}">
                                    <img v-if="qitem.pic_url" :src="qitem.pic_url + '!ps2'" class="avatar" />
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <p class="mb20 tx">图片尺寸：建议宽度1200px</p>
                                <el-input type="text" v-model="qitem.description" placeholder="描述"></el-input>
                              </div>
                              <el-button class="addBtn" icon="el-icon-plus" @click="addList(vitem)">添加</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
              </div>
              <el-button-group class="mt20">
                <el-button type="primary"  @click="submitForm">保存</el-button>
              </el-button-group>         
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {sitePicList,doSiteList} from '@/api/building';
  import { getToken } from '@/utils/auth';
  export default {
    name:'info',
    components:{
    },
    data() {
      return {
        vId: "",
        sid: "",
        setlabel: "",
        infoList: [],
        actions:'',
        typeList:[
            {
                "type": 1,
                "photos": []
            },
            {
                "type": 2,
                "photos": []
            },
            {
                "type": 3,
                "photos": []
            },
            {
                "type": 4,
                "photos": []
            },
            {
                "type": 5,
                "photos": []
            }    
        ]
        //end
      }
    },
    created(){
      //编辑
      this.vId = this.$route.params.vId;
      this.pageType = this.$route.params.pageType;
      
      if(this.vId){
          this.getEditPage(this.vId);
      }

      if(this.pageType == "编辑"){
        this.setlabel = "编辑图片信息";
      }else{
        this.setlabel = "新增图片信息";
      }
      //图片上传地址
      this.actions = process.env.API_BASEURL + "photos"
    },
    filters:{
      formatTypeName(str){
        switch(str) {
          case 0:
              str = '未开始';
              break;
          case 1:
              str = '开工大吉';
              break;
          case 2:
              str = '前期施工';
              break;
          case 3:
              str = '中期施工';
              break;
          case 4:
              str = '尾期施工';
              break;
          case 5:
              str = '竣工';
              break;      
          default:
              break;        
        }
        return str; 
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
      //start
      //新增上传图片  
      addPicSuccess(res, file, index, _index) {
        if (res.pic_url && res.server_domain) {
           let pic_des = res.server_domain + res.pic_url;
           this.typeList[index].photos[_index].pic_url = pic_des;
           this.$message.success('上传成功')
        }else{
            this.$message.error('上传图片失败！');
        }
      },
      //编辑上传图片
      editPicSuccess(res, file, index, _index) {
        if (res.pic_url && res.server_domain) {
           let pic_des = res.server_domain + res.pic_url;
           this.infoList[index].photos[_index].pic_url = pic_des;
           this.$message.success('上传成功')
        }else{
            this.$message.error('上传图片失败！');
        }
      },
      //上传图片限制
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
      //获取编辑页数据
      getEditPage(id){
        sitePicList(id,{}).then(res => {
          res.sort(function(a,b){
            return a.type - b.type
          });
          this.infoList = res; 
        });
      },
      submitFn(params){
        doSiteList(this.vId, {
          data: params
        }).then(res => {    
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.$router.push({ name:'工地管理' })
        });
      },
      submitForm() {
        let params;    
        if(this.pageType == '新增'){
            params = this.typeList;
        }else{
            params = this.infoList.length > 0 ? this.infoList : this.typeList;
        }
        this.submitFn(params);
      },
      addList(item){
        let param = {
          pic_url: '',
          description: ''
        }
        let fe = Object.assign({},param)
        item.photos.push(fe);
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
@import '../../../styles/upload.scss';
  .box-body {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 3px;
      border-bottom-left-radius: 3px;
      padding: 10px;
      &:before, &:after{
        content: " ";
        display: table;
      }
  }
  .photoList{
    .item {
        float: left;
        width: 200px;
        height:auto !important;
        box-sizing: content-box;
        background: #f8f8f8;
        padding: 5px 10px 10px;
        border: solid 1px #ddd;
        margin: 0 30px 30px 0;
        color: #666;
    }
  }  
  .addBtn{
    width:120px;
    height:120px;
  }
</style>


