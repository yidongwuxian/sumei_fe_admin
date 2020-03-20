<<<<<<< HEAD
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
              <el-form-item label="友情链接名称:" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="友情链接URL:" prop="url" required>
                <el-input v-model="ruleForm.url" class="input-width"></el-input>
                <p class="mt1em">例: http://www.sumeihome.com</p>
              </el-form-item>
              <el-form-item label="所属页面:" prop="belong_page" required>
                <el-select v-model="ruleForm.belong_page" placeholder="请选择" clearable>
                    <el-option v-for="item in pageOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序:">
                  <el-input type="number" v-model.number="ruleForm.sort" placeholder="10" class="input-width"></el-input>
                  <p class="mt1em">值越大越靠前</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList, provincesList} from '@/api/public';
  import {addLinkList, editLinkView, editLinkList} from '@/api/link';

  export default {
    name:'addEdit',
    data() {
      return {    
        sid: "",
        setlabel: "",
        siteidOptions: [],
        platOptions: [
          {
            id: 1,
            name: 'PC'
          },
          {
            id: 2,
            name: 'H5 '
          }
        ],
        typeidOptions: [
          {
            id: 1,
            name: '客服'
          },
          {
            id: 2,
            name: '统计'
          }
        ],
        serviceOptions:[
          {
            id: 1,
            name: '乐语'
          },
          {
            id: 2,
            name: '美洽'
          },
          {
            id: 3,
            name: '百度商桥'
          }
        ],
        pageOptions: [
          {
            id: 1,
            name: '首页'
          }
        ],
        mCityData: [],
        ruleForm: {
          name: '',
          site_id: '',
          url: '',
          belong_page: '',
          sort: ''
        },
        rules: {
          site_id: [
            { required: true, message: '请选择站点', trigger: 'change' }
          ],
          //友情链接名称
          name: [
            { required: true, message: '请输入友情链接名称', trigger: 'blur' },
             { required: true, message: '请输入友情链接名称', trigger: 'change' }
          ],
          //友情链接URL
          url: [
            { required: true, message: '请输入友情链接URL', trigger: 'blur' },
            { required: true, message: '请输入友情链接URL', trigger: 'change' }
          ],
          //所属页面
          belong_page: [
            { required: true, message: '请选择所属页面', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑友链";
        this.getEditPage();
      }else{
        this.setlabel = "新增友链";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'友链管理' })
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取编辑页数据
      getEditPage(){
        editLinkView(this.sid,{}).then(res => {
          this.ruleForm.name           = res.name;
          this.ruleForm.site_id        = res.site_id;
          this.ruleForm.url            = res.url;
          this.ruleForm.belong_page    = res.belong_page;
          this.ruleForm.sort           = res.sort;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editLinkList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'友链管理' })
              });
            }else{
              //新增接口
              addLinkList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'友链管理' })
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


=======
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
              <el-form-item label="友情链接名称:" prop="name" required>
                <el-input v-model="ruleForm.name" class="input-width"></el-input>
              </el-form-item>
              <el-form-item label="友情链接URL:" prop="url" required>
                <el-input v-model="ruleForm.url" class="input-width"></el-input>
                <p class="mt1em">例: http://www.sumeihome.com</p>
              </el-form-item>
              <el-form-item label="所属页面:" prop="belong_page" required>
                <el-select v-model="ruleForm.belong_page" placeholder="请选择" clearable>
                    <el-option v-for="item in pageOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序:">
                  <el-input type="number" v-model.number="ruleForm.sort" placeholder="10" class="input-width"></el-input>
                  <p class="mt1em">值越大越靠前</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>
<script>
  import {siteNameList, provincesList} from '@/api/public';
  import {addLinkList, editLinkView, editLinkList} from '@/api/link';

  export default {
    name:'addEdit',
    data() {
      return {    
        sid: "",
        setlabel: "",
        siteidOptions: [],
        platOptions: [
          {
            id: 1,
            name: 'PC'
          },
          {
            id: 2,
            name: 'H5 '
          }
        ],
        typeidOptions: [
          {
            id: 1,
            name: '客服'
          },
          {
            id: 2,
            name: '统计'
          }
        ],
        serviceOptions:[
          {
            id: 1,
            name: '乐语'
          },
          {
            id: 2,
            name: '美洽'
          },
          {
            id: 3,
            name: '百度商桥'
          }
        ],
        pageOptions: [
          {
            id: 1,
            name: '首页'
          }
        ],
        mCityData: [],
        ruleForm: {
          name: '',
          site_id: '',
          url: '',
          belong_page: '',
          sort: ''
        },
        rules: {
          site_id: [
            { required: true, message: '请选择站点', trigger: 'change' }
          ],
          //友情链接名称
          name: [
            { required: true, message: '请输入友情链接名称', trigger: 'blur' },
             { required: true, message: '请输入友情链接名称', trigger: 'change' }
          ],
          //友情链接URL
          url: [
            { required: true, message: '请输入友情链接URL', trigger: 'blur' },
            { required: true, message: '请输入友情链接URL', trigger: 'change' }
          ],
          //所属页面
          belong_page: [
            { required: true, message: '请选择所属页面', trigger: 'change' }
          ]
        }
        //end
      }
    },
    created(){
      //新增
      this.getSiteId();
      //编辑
      this.sid = this.$route.params.id;
      if(this.sid){
        this.setlabel = "编辑友链";
        this.getEditPage();
      }else{
        this.setlabel = "新增友链";
      }
    },
    methods:{
      //返回上一页（列表页）
      jumpBack(){
        this.$router.push({ name:'友链管理' })
      },
      //获取站点ID
      getSiteId(){
        siteNameList({}).then(res => {
          this.siteidOptions = res;
        });
      },
      //获取编辑页数据
      getEditPage(){
        editLinkView(this.sid,{}).then(res => {
          this.ruleForm.name           = res.name;
          this.ruleForm.site_id        = res.site_id;
          this.ruleForm.url            = res.url;
          this.ruleForm.belong_page    = res.belong_page;
          this.ruleForm.sort           = res.sort;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑接口
            if(this.sid){
              editLinkList(this.sid,this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.$router.push({ name:'友链管理' })
              });
            }else{
              //新增接口
              addLinkList(this.ruleForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '新建成功!'
                });
                this.$router.push({ name:'友链管理' })
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


>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
