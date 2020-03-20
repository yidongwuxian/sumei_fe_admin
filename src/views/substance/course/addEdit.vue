<template>
  <div class="app-container">
    <el-card shadow="hover" class="el-col el-col-24">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <!--title-page start-->
        <el-page-header @back="jumpBack" :content="setlabel"></el-page-header>
        <el-divider></el-divider>
        <!--title-page end-->
        <el-form-item label="站点:" prop="site_id" required>
          <el-select v-model="ruleForm.site_id" placeholder="选择站点" clearable>
            <el-option
              v-for="item in siteidOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词:" prop="keywords" required>
          <el-input v-model="ruleForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="课程名称:" prop="name" required>
          <el-input v-model="ruleForm.name" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="讲师:" prop="author" required>
          <el-input v-model="ruleForm.author" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="职称:" prop="position" required>
          <el-input v-model="ruleForm.position" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="课程时间:" required>
          <el-date-picker
            v-model="ruleForm.start_time"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="人数限制:" prop="size_limit">
          <el-input type="number" v-model.number="ruleForm.size_limit" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="地址:" prop="address" required>
          <el-input type="textarea" :rows="6" v-model="ruleForm.address" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone" required>
          <el-input type="text" v-model="ruleForm.phone" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="content" required>
          <div class="rich_box">
            <quill-editor
              class="quill-editor"
              ref="myQuillEditor"
              v-model="ruleForm.content"
              :options="editorOption"
            ></quill-editor>
            <!-- 文件上传input 将它隐藏--> 
            <el-upload
              style="display:none"
              ref="uniqueId"
              :action="actions"
              :data="{'module':'story','type':'image'}"
              :headers="headers"
              :show-file-list="false"
              :before-upload="newEditorbeforeupload"
              :on-success="newEditorSuccess"
            >
              <i class="el-icon-plus avatar-uploader-icon" id="imgInput"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input type="number" v-model.number="ruleForm.sort" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="总站排序:">
          <el-input
            type="number"
            v-model.number="ruleForm.sort_master"
            placeholder="总站排序"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="description" required>
          <el-input
            type="textarea"
            :rows="6"
            placeholder="说明"
            v-model="ruleForm.description"
            maxlength="500"
            show-word-limit
          ></el-input>
          <p>说明500字以内</p>
        </el-form-item>
        <el-form-item label="封面图:" required>
          <el-upload
            class="avatar-uploader"
            :action="actions"
            :data="{'module':'story','type':'image'}"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tempCover" :src="tempCover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>图片建议尺寸：565*300px，图片格式：jpg，png，gif，大小：5M以内</p>
        </el-form-item>
        <el-form-item label="坐标:" required>
          <el-input v-model="latlng" placeholder="坐标" :disabled="true"></el-input>
        </el-form-item>
        <MapComp v-on:mapconfirm="mapconfirm" :lngLat="lngLat"></MapComp>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import MapComp from "@/components/MapComp/map";
import { getToken } from "@/utils/auth";
import { siteNameList, provincesList } from "@/api/public";
import {
  addUnlineCourseList,
  editUnlineCourseView,
  editUnlineCourseList
} from "@/api/substance";
import { quillEditor } from "vue-quill-editor";
import * as Quill from "quill";
import { Message } from "element-ui";
import Router from "@/router/index";
export default {
  name: "addEdit",
  components: {
    MapComp,
    quillEditor
  },
  data() {
    return {
      tempCover: "",
      sid: "",
      setlabel: "",
      siteidOptions: [],
      cityidProps: {
        value: "id",
        label: "name",
        children: "cities"
      },
      latlng: "",
      lngLat: {},
      cityidOptions: [],
      mCityData: [],
      actions: "",
      ruleForm: {
        site_id: "",
        name: "",
        keywords: "",
        start_time: "",
        address: "",
        phone: "",
        size_limit: "",
        description: "",
        sort: "",
        cover: "",
        content: "",
        sort_master: "",
        author: "",
        position: "",
        lat: "",
        lng: ""
      },
      //(编辑器)
      editorOption: {
        placeholder: "",
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image"]
          ]
        }
      },
      rules: {
        site_id: [
          { required: true, message: "请选择所属分站", trigger: "change" }
        ],
        keywords: [
          { required: true, message: "请输入关键词", trigger: "blur" },
          { required: true, message: "请输入关键词", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { required: true, message: "请输入课程名称", trigger: "change" }
        ],
        author: [
          { required: true, message: "请输入讲师名称", trigger: "blur" },
          { required: true, message: "请输入讲师名称", trigger: "change" }
        ],
        position: [
          { required: true, message: "请输入职称", trigger: "blur" },
          { required: true, message: "请输入职称", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入地址", trigger: "blur" },
          { required: true, message: "请输入地址", trigger: "change" }
        ],
        phone: [
          { required: true, message: "请输入门店电话", trigger: "blur" },
          { required: true, message: "请输入门店电话", trigger: "change" }
        ],
        city_id: [{ required: true, message: "请选择籍贯", trigger: "change" }],
        description: [
          { required: true, message: "请输入简介", trigger: "blur" },
          { required: true, message: "请输入简介", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入说明", trigger: "blur" },
          { required: true, message: "请输入说明", trigger: "change" }
        ]
      }
      //end
    };
  },
  mounted() {
    // 页面初始化
    this.$nextTick(function() {
      //编辑
      this.sid = this.$route.params.id;
      if (this.sid) {
        this.setlabel = "编辑线下课程";
        this.getEditPage();
      } else {
        this.setlabel = "新增线下课程";
      }
    });
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  },
  created() {
    //新增
    this.getSiteId();
    this.getCityId();

    //图片上传地址
    this.actions = process.env.API_BASEURL + "photos";
  },
  computed: {
    headers() {
      return {
        Authorization: getToken()
      };
    }
  },
  methods: {
    //返回上一页（列表页）
    jumpBack(){
      this.$router.push({ name:'线下课程管理' })
    },
    //start
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        // 选择并上传一张图片
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.pic_url && res.server_domain) {
        this.ruleForm.cover = res.server_domain + res.pic_url;
        let picPath = res.server_domain + res.pic_url + "!ps2";
        this.tempCover = picPath;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isRightType && isLt5M;
    },
    newEditorbeforeupload(file) {
      const isRightType =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isRightType && isLt5M;
    },
    newEditorSuccess(res, file) {
      if (res.pic_url && res.server_domain) {
        let picPath = res.server_domain + res.pic_url + "!w900";
        this.addRange = this.$refs.myQuillEditor.quill.getSelection();
        this.$refs.myQuillEditor.quill.insertEmbed(
          this.addRange !== null ? this.addRange.index : 0,
          "image",
          picPath,
          Quill.sources.USER
        );
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    //end
    //获取地图坐标
    mapconfirm(e) {
      let isE = JSON.stringify(e);
      if (isE) {
        if (JSON.stringify(e.lat)) {
          this.latlng = JSON.stringify(e.lat);
        }
        if (JSON.stringify(e.lng)) {
          this.latlng = JSON.stringify(e.lng);
        }
        if (JSON.stringify(e.lat) && JSON.stringify(e.lng)) {
          this.latlng = JSON.stringify(e.lat) + "," + JSON.stringify(e.lng);
        }
        this.ruleForm.lat = JSON.stringify(e.lat);
        this.ruleForm.lng = JSON.stringify(e.lng);
      }
    },
    //获取站点ID
    getSiteId() {
      siteNameList({}).then(res => {
        this.siteidOptions = res;
      });
    },
    //获取省市级数据
    getCityId() {
      provincesList({}).then(res => {
        this.cityidOptions = res;
      });
    },
    //获取编辑页数据
    getEditPage() {
      editUnlineCourseView(this.sid, {}).then(res => {
        this.lngLat.lat = res.lat;
        this.lngLat.lng = res.lng;
        this.ruleForm.name = res.name;
        this.ruleForm.site_id = res.site_id;
        this.ruleForm.start_time = res.start_time;
        this.ruleForm.keywords = res.keywords;
        this.ruleForm.address = res.address;
        this.ruleForm.phone = res.phone;
        this.ruleForm.size_limit = res.size_limit;
        if(res.detail){
          this.ruleForm.description = res.detail.description;
          this.ruleForm.content = res.detail.content;
        }
        this.ruleForm.sort = res.sort;
        this.tempCover = res.cover + "!ps2";
        this.ruleForm.cover = res.cover;
        this.ruleForm.author = res.author;
        this.ruleForm.position = res.position;
        this.ruleForm.sort_master = res.sort_master;
        this.ruleForm.lat = res.lat;
        this.ruleForm.lng = res.lng;
        this.latlng = res.lat + "," + res.lng;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //编辑接口
          if (this.sid) {
            this.$axios
              .put(
                process.env.API_BASEURL + "courses/" + this.sid,
                this.ruleForm,
                {
                  headers: {
                    Authorization: getToken(),
                    "Content-Type": "application/json;charset=UTF-8"
                  }
                }
              )
              .then(function(response) {
                if (response) {
                  Message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1 * 1000
                  });
                  Router.push({ name: "线下课程管理" });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            //新增接口
            this.$axios
              .post(process.env.API_BASEURL + "courses", this.ruleForm, {
                headers: {
                  Authorization: getToken(),
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(function(response) {
                if (response) {
                  Message({
                    message: "新建成功!",
                    type: "success",
                    duration: 1 * 1000
                  });
                  Router.push({ name: "线下课程管理" });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../styles/mixin.scss";
@import "../../../styles/index.scss";
@import "../../../styles/upload.scss";
@import "../../../styles/editor.scss";
</style>


