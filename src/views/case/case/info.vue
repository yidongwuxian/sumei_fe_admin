<template> 
  <div class="app-container" >
      <el-card shadow="hover" class="el-col el-col-24">
        <el-form label-width="120px">
              <el-form-item :label="setlabel"></el-form-item>
              <el-button-group class="mb20">
                  <el-button type="primary" class="h40" :disabled="isDisabled"><input type="checkbox" v-model="checkedAll" @click="checkAll(checkedAll)" :disabled="isDisabled" />全选</el-button>
                  <el-button type="primary"  @click="addItem" :disabled="isDisabled">添加</el-button>
                  <el-button type="primary"  @click="delItem" :disabled="isDisabled">删除</el-button>
                  <el-button type="primary"  @click="submitForm" :disabled="isDisabled">保存</el-button>
                </el-button-group> 
              <div class="box_body" v-if="pList.length > 0">
                  <div class="photoList">
                        <div class="item" v-for="(sitem,index) in pList" :key="index">
                            <div class="mt20">
                                <div class="ck_left"><input type="checkbox" class="checkItem" @click="checkMe(sitem,index)" v-model="sitem.isCheck" :value="sitem.id" :disabled="isDisabled" /></div>
                                <div class="ck_right">
                                    <el-checkbox v-model="sitem.is_cover"  @change="checkCover(sitem)" :true-label="1" :false-label="0" :disabled="isDisabled">设为封面</el-checkbox>
                                </div> 
                            </div>
                            <el-upload
                              :disabled="isDisabled"
                              class="avatar-uploader"
                              :action=actions
                              :data="{'module':'subject','type':'image'}"
                              :headers="headers"
                              :show-file-list = "false"
                              :before-upload="beforeAvatarUpload"
                              :on-success="(res,file)=>{return handleAvatarSuccess(res,file,index)}">
                              <img v-if="sitem.pic_url" :src="sitem.pic_url + '!ps2'"  class="avatar"  />
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <p class="mb20">图片尺寸：建议宽度1200px</p>
                            <el-input type="textarea" v-model="sitem.description" placeholder="图片描述" maxlength="90" :rows="6" :disabled="isDisabled"></el-input>
                            <div class="input-group">
                                <el-select v-model="sitem.space_id" placeholder="空间类型" clearable :disabled="isDisabled">
                                    <el-option v-for="item in spaceOptions"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                  </div>
              </div>         
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {getSpaces} from '@/api/public';
  import { getToken } from '@/utils/auth';
  import {doCasePic, casePicList, delCasePic} from '@/api/case';
  import { Message } from 'element-ui';
  import Router from '@/router/index';
  export default {
    name:'addEdit',
    data() {
      return {
        checkedAll:false,
        tempCover: '',
　　　  checkModel:[],  
        vId: "",
        sid: "",
        setlabel: "",
        spaceOptions: [],
        pic_url:"",
        actions:'',
        pList: [],
        checkCoverBox: [],
        oldCheckArr: [],
        uploadImageType: null,
        checkCoverNum: 0,
        sIdNo: 0,
        sIdName: '',
        sNum:0,
        isDisabled: false
      }
    },
    created(){
      //新增
      this.getSpacesId();
      //编辑
      this.vId = this.$route.params.vId;
      this.pageType = this.$route.params.pageType;
      this.isDisabled = this.$route.params.isDisabled;

      if(this.pageType == "编辑"){
        this.setlabel = "编辑图片信息";
        if(this.vId){
            this.getEditPage(this.vId);
        }
      }else{
        this.setlabel = "新增图片信息";
      }
      //图片上传地址
      this.actions = process.env.API_BASEURL + "photos"
    },
    pList:{
      handler(val) {
        var i = 0;
        this.pList.forEach(sitem => {
            if(sitem.isCheck === true) 
                i++;            
        })
        if (i===this.pList.length) {
            this.checkedAll = true
        } else {
            this.checkedAll = false
        }	
      },
      deep:true
    },
    computed: {
      headers(){
        return{
          'Authorization': getToken()
        }
      }
    },
    methods:{
      //删除  
      delItem () {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(this.oldCheckArr.length> 0){
                delCasePic({ids: this.oldCheckArr }).then(res => {
                    this.oldCheckArr = [] 
                    this.getEditPage(this.vId);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            }else{
                for(var k =0; k<this.pList.length; k++){
                  for(var m =0; m<this.checkModel.length; m++){            
                      if(this.pList[k].sIdName == this.checkModel[m]){
                          this.pList.splice(k,1);
                      }
                  }
                }  
                this.checkModel = [];
                this.checkedAll = false;
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      checkMe(item,index){
        item.isCheck = !item.isCheck;
        if(!item.id){
           this.checkModel.push(item.sIdName);
        }else{ 
           this.oldCheckArr.push(item.id);
        } 
      },
      checkCover(item){
          if(this.checkCoverNum < 2) {
            if(item.is_cover == 1){
              this.checkCoverNum++;
              if(this.checkCoverNum >= 2){
                this.checkCoverNum = 2;
              }
            }else{
              this.checkCoverNum--;
              if(this.checkCoverNum < 0){
                this.checkCoverNum = 0;
              }
            }
            if(this.checkCoverNum > 1){
              this.$message({
                  type: 'error',
                  message: '只能选择一个设为封面!'
              });
              return;    
            }
          }else{
            this.checkCoverNum--;
            if(this.checkCoverNum < 0){
              this.checkCoverNum = 0;
            }
          }  
      },
      //全选/多选
      checkAll(val){
		      this.pList.forEach(sitem => {
            if (val === false) {
              sitem.isCheck = true
            } else {
              sitem.isCheck = false
            }

            if(!sitem.id){
              this.checkModel.push(sitem.sIdName);
            }else{ 
              this.oldCheckArr.push(sitem.id);
            } 
          })
    　 },
      //获取空间类型
      getSpacesId(){
        getSpaces({}).then(res => {
          this.spaceOptions = res;
        });
      },
      //start
      handleAvatarSuccess(res, file, index) {
        if (res.pic_url && res.server_domain) {
           let pic_des = res.server_domain + res.pic_url;
           this.pList[index].pic_url = pic_des;
           this.$message.success('上传成功')
        }else{
            this.$message.error('上传图片失败！');
        }
      },
      beforeAvatarUpload(file) {
            const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png') || (file.type === 'image/gif');
            const isLt5M = file.size / 1024 / 1024 < 5;

            if (!isRightType) {
                this.$message.error('上传头像图片只能是 JPG或PNG或GIF 格式!');
            }
            if (!isLt5M) {
                this.$message.error('上传头像图片大小不能超过 5MB!');
            }
            return isRightType && isLt5M;
      },
      //end
      //获取编辑页数据
      getEditPage(id){
        casePicList(id,{}).then(res => {
          let tempObj = {};
          let tempArr = [];
          for(let i=0; i<res.length; i++){
            tempObj = Object.assign(res[i], {'isCheck': false} ); 
            tempArr.push(tempObj);
            if(res[i].is_cover == 1){
                this.checkCoverNum = 1;
            }
          }
          this.pList = tempArr;
        });
      },
      submitForm() {
        for(let k in this.pList){
          if(this.pList[k].pic_url === ''){
            this.$message.error('请上传图片！');
            return;
          }
          if(this.pList[k].space_id === ''){
            this.$message.error('请选择空间类型！');
            return;
          }
        }
        //start     
        this.$axios.put(process.env.API_BASEURL+'subjects/'+this.vId+'/photos', {data: this.pList}, {
          headers:{
            'Authorization': getToken(), 
            'Content-Type': 'application/json;charset=UTF-8'
          }
        })
        .then(function (response) {
          if(response){
            Message({
              message: '操作成功!',
              type: 'success',
              duration: 1 * 1000
            })
            Router.push({ name:'案例管理' })
          }
        })
        .catch(function (error) {
          Message({
            message: error.response.data,
            type: 'error',
            duration: 1 * 1000
          })
        });  
        //end
      },
      addItem(){
        this.sIdNo++;
        this.sIdName = 'cIndex' + this.sIdNo;
        let param = {
          id: '',
          pic_url: '',
          description: '',
          space_id: '',
          is_cover: 0,
          isCheck: false,
          sIdName: this.sIdName
        }
        let fe = Object.assign({},param)
        this.pList.push(fe);
      }
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/upload.scss';
@import '../../../styles/upload.scss';
  .mt20{
    margin:10px auto 20px;
    overflow:hidden;
  }
  .ck_left{
    display:inline-block;
    float:left;
  }
  .ck_right{
    float:right;
  }
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
        width: 230px;
        box-sizing: content-box;
        background: #f8f8f8;
        padding: 5px 10px 10px;
        border: solid 1px #ddd;
        margin: 0 10px 30px 0;
        text-align:center;
        
        color: #666;
        .avatar-uploader .el-upload{
          background-color:white;
          .avatar-uploader-icon{
            width:230px;
            height:230px;
            line-height:230px;
          }
        }
    }
    img {
        width: 230px;
        height: 230px;
    }
    .input-group{
      .el-select{
        width:230px;
        margin:20px 0 15px;
      }
    }
    .placeHolder {
        border-style: dashed;
        background: #fff;
    }
    .error {
        border-color: #f66;
        box-shadow: 0 0 5px #f66;
    }
    .tag {
        background: #fff;
        color: #999;
    }
  } 
  .btn{
      display: inline-block;
      float: left;
      width: 11px;
      height: 11px;
      background: #fff;
      border-radius: 45px;
      margin-left: 10px;
      cursor: pointer;
      border: 1px solid #ccc;
  }
  .isActive{
      background: blue;
  }
  .h40{
    height:40px;
  }
</style>


