<<<<<<< HEAD
<template>
  <div class="app-container">
    <el-card shadow="hover" class="el-col el-col-24">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
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
        <el-form-item label="文章模块:" required>
          <el-radio-group v-model="ruleForm.story_type" @change="changeColumn">
            <el-radio :label="1">装修前</el-radio>
            <el-radio :label="2">装修中</el-radio>
            <el-radio :label="3">装修后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键词:" prop="keywords" required>
          <el-input v-model="ruleForm.keywords" placeholder="单行输入"></el-input>
        </el-form-item>
        <el-form-item label="文章栏目:" prop="column_id" required>
          <el-select v-model="ruleForm.column_id" value-key="id" placeholder clearable>
            <el-option
              v-for="item in typeIdOptions"
              :key="item.id"
              :label="item.story_type_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" prop="title" required>
          <el-input v-model="ruleForm.title" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="标签:" prop="tag_ids" required>
          <el-checkbox-group v-model="ruleForm.tag_ids" size="small">
            <el-checkbox-button
              v-for="(item,index) in tagData"
              :key="index"
              :label="item.id"
            >{{item.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="作者:" prop="author" required>
          <el-input v-model="ruleForm.author" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="职称:" prop="position" required>
          <el-input v-model="ruleForm.position" placeholder="输入职称" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="内容简介:" prop="description" required>
          <el-input
            type="textarea"
            :rows="6"
            v-model="ruleForm.description"
            placeholder="内容简介"
            class="input-width6"
            maxlength="500"
            show-word-limit
          ></el-input>
          <p>内容简介500字以内</p>
        </el-form-item>
        <el-form-item label="文章正文:" prop="content" required>
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
        <el-form-item label="封面图:" prop="cover" required>
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
          <p>图片建议尺寸：300*300px，图片格式：jpg，png，gif，大小：5M以内</p>
        </el-form-item>
        <el-form-item label="是否发布:" required>
          <el-radio-group v-model="ruleForm.is_publish">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input
            type="number"
            v-model.number="ruleForm.sort"
            placeholder="排序"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="总站排序:">
          <el-input
            type="number"
            v-model.number="ruleForm.sort_master"
            placeholder="总站排序"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示在主站:" required>
          <el-radio-group v-model="ruleForm.is_show">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import Stags from "@/components/Tags/index";
import { uniqueArr } from "@/utils/index";
import { tagsList } from "@/api/tags";
import { getToken } from "@/utils/auth";
import { quillEditor } from "vue-quill-editor";
import * as Quill from "quill";
import { siteNameList } from "@/api/public";
import {
  addOnlineCourseList,
  editOnlineCourseView,
  editOnlineCourseList,
  typesList
} from "@/api/substance";
import { Message } from "element-ui";
import Router from "@/router/index";
export default {
  name: "addEdit",
  components: {
    Stags,
    quillEditor
  },
  data() {
    return {
      tagData: [],
      tempCover: "",
      addRange: [],
      sid: "",
      setlabel: "",
      siteidOptions: [],
      typeIdOptions: [],
      actions: "",
      sTempArr: [],
      sResultArr: [],
      ruleForm: {
        site_id: "",
        story_type: 1,
        column_id: "",
        keywords: "",
        title: "",
        tag_ids: [],
        author: "",
        is_publish: 0,
        is_show: 1,
        sort: "",
        cover: "",
        description: "",
        content: "",
        position: "",
        sort_master: ""
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
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
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
        column_id: [
          { required: true, message: "请选择文章栏目", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { required: true, message: "请输入标题", trigger: "change" }
        ],
        tag_ids: [{ required: true, message: "请选择标签", trigger: "change" }],
        author: [
          { required: true, message: "请输入作者", trigger: "blur" },
          { required: true, message: "请输入作者", trigger: "change" }
        ],
        position: [
          { required: true, message: "请输入职称", trigger: "blur" },
          { required: true, message: "请输入职称", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入内容简介", trigger: "blur" },
          { required: true, message: "请输入内容简介", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入文章正文", trigger: "blur" },
          { required: true, message: "请输入文章正文", trigger: "change" }
        ]
      }
      //end
    };
  },
  created() {
    //新增
    this.getSiteId();
    //获取栏目选项
    this.getTypesId();
    this.getTags();
    //编辑
    this.sid = this.$route.params.id;
    if (this.sid) {
      this.setlabel = "编辑线上课程";
      this.getEditPage();
    } else {
      this.setlabel = "新增线上课程";
      //获取标签
    }
    //图片上传地址
    this.actions = process.env.API_BASEURL + "photos";
  },
  filters: {
    formatStoryType(num) {
      switch (num) {
        case 1:
          num = "装修前";
          break;
        case 2:
          num = "装修中";
          break;
        case 3:
          num = "装修后";
          break;
        default:
          break;
      }
      return num;
    }
  },
  computed: {
    headers() {
      return {
        Authorization: getToken()
      };
    }
  },
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  },
  methods: {
    //返回上一页（列表页）
    jumpBack(){
      this.$router.push({ name:'线上课程管理' })
    },
    //start
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
    //end
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        // 选择并上传一张图片
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
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
    //获取标签
    getTags() {
      tagsList({ per_page: 10000 }).then(res => {
        this.tagData = res.data;
      });
    },
    //获取站点ID
    getSiteId() {
      siteNameList({}).then(res => {
        this.siteidOptions = res;
      });
    },
    //设置tag标签
    getTagsId(val) {
      //编辑状态下
      if (this.sid) {
        if (this.sResultArr.length > 0) {
          this.sTempArr = this.sResultArr;
        }
      }
      //已选择
      if (val.is_selected == 0) {
        for (let m in this.sResultArr) {
          if (this.sResultArr[m] == val.id) {
            this.sResultArr.splice(m, 1);
          }
        }
      }
      //未选择
      if (val.is_selected == 1) {
        for (let k in this.tagData) {
          if (this.tagData[k].id == val.id) {
            this.sResultArr.push(this.tagData[k].id);
            this.sResultArr = this.sTempArr.concat(this.sResultArr);
            this.sResultArr = uniqueArr(this.sResultArr);
          }
        }
      }
    },
    //获取文章模块的请求参数
    changeColumn(val) {
      if (val) {
        this.getTypesId();
      }
    },
    //获取文章模块
    getTypesId() {
      this.ruleForm.column_id = '';
      typesList({ story_type: this.ruleForm.story_type }).then(res => {
        this.ruleForm.column_id = res[0].id;
        this.typeIdOptions = res;
      });
    },
    //获取编辑页数据
    getEditPage() {
      editOnlineCourseView(this.sid, {}).then(res => {
        this.ruleForm.site_id = res.site_id;
        this.ruleForm.story_type = res.story_type;
        this.ruleForm.column_id = res.column_id;
        this.ruleForm.keywords = res.keywords;
        this.ruleForm.title = res.title;
        typesList({ story_type: this.ruleForm.story_type }).then(res => {
          this.typeIdOptions = res;
        });
        res.tags.forEach((v,i)=>{
          this.ruleForm.tag_ids.push(v.id)
        })
        this.ruleForm.author = res.author;
        this.ruleForm.position = res.position;
        this.ruleForm.is_publish = res.is_publish;
        this.ruleForm.is_show = res.is_show;
        this.ruleForm.sort = res.sort;
        this.tempCover = res.cover + "!ps2";
        this.ruleForm.cover = res.cover;
        this.ruleForm.description = res.story_detail.description;
        this.ruleForm.content = res.story_detail.content;
        this.ruleForm.sort_master = res.sort_master;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //编辑接口
          if (this.sid) {
            this.$axios
              .put(
                process.env.API_BASEURL + "stories/" + this.sid,
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
                  Router.push({ name: "线上课程管理" });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            //新增接口
            this.$axios
              .post(process.env.API_BASEURL + "stories", this.ruleForm, {
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
                  Router.push({ name: "线上课程管理" });
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


<style lang="scss">
.el-checkbox-button {
  margin: 5px;
}
.el-checkbox-button .el-checkbox-button__inner {
  border: 1px solid #d9ecff;
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
}
.el-checkbox-button:first-child .el-checkbox-button__inner {
  border-radius: 4px;
}
.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner {
  border-radius: 4px;
}
.el-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: #00a8e6 !important;
  border: 1px solid #00a8e6;
}
=======
<template>
  <div class="app-container">
    <el-card shadow="hover" class="el-col el-col-24">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
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
        <el-form-item label="文章模块:" required>
          <el-radio-group v-model="ruleForm.story_type" @change="changeColumn">
            <el-radio :label="1">装修前</el-radio>
            <el-radio :label="2">装修中</el-radio>
            <el-radio :label="3">装修后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键词:" prop="keywords" required>
          <el-input v-model="ruleForm.keywords" placeholder="单行输入"></el-input>
        </el-form-item>
        <el-form-item label="文章栏目:" prop="column_id" required>
          <el-select v-model="ruleForm.column_id" value-key="id" placeholder clearable>
            <el-option
              v-for="item in typeIdOptions"
              :key="item.id"
              :label="item.story_type_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" prop="title" required>
          <el-input v-model="ruleForm.title" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="标签:" prop="tag_ids" required>
          <el-checkbox-group v-model="ruleForm.tag_ids" size="small">
            <el-checkbox-button
              v-for="(item,index) in tagData"
              :key="index"
              :label="item.id"
            >{{item.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="作者:" prop="author" required>
          <el-input v-model="ruleForm.author" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="职称:" prop="position" required>
          <el-input v-model="ruleForm.position" placeholder="输入职称" class="input-width5"></el-input>
        </el-form-item>
        <el-form-item label="内容简介:" prop="description" required>
          <el-input
            type="textarea"
            :rows="6"
            v-model="ruleForm.description"
            placeholder="内容简介"
            class="input-width6"
            maxlength="500"
            show-word-limit
          ></el-input>
          <p>内容简介500字以内</p>
        </el-form-item>
        <el-form-item label="文章正文:" prop="content" required>
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
        <el-form-item label="封面图:" prop="cover" required>
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
          <p>图片建议尺寸：300*300px，图片格式：jpg，png，gif，大小：5M以内</p>
        </el-form-item>
        <el-form-item label="是否发布:" required>
          <el-radio-group v-model="ruleForm.is_publish">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input
            type="number"
            v-model.number="ruleForm.sort"
            placeholder="排序"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="总站排序:">
          <el-input
            type="number"
            v-model.number="ruleForm.sort_master"
            placeholder="总站排序"
            class="input-width"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示在主站:" required>
          <el-radio-group v-model="ruleForm.is_show">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import Stags from "@/components/Tags/index";
import { uniqueArr } from "@/utils/index";
import { tagsList } from "@/api/tags";
import { getToken } from "@/utils/auth";
// import { quillEditor } from "vue-quill-editor";
// import * as Quill from "quill";
import { siteNameList } from "@/api/public";
import {
  addOnlineCourseList,
  editOnlineCourseView,
  editOnlineCourseList,
  typesList
} from "@/api/substance";
import { Message } from "element-ui";
import Router from "@/router/index";
export default {
  name: "addEdit",
  components: {
    Stags
    //quillEditor
  },
  data() {
    return {
      tagData: [],
      tempCover: "",
      addRange: [],
      sid: "",
      setlabel: "",
      siteidOptions: [],
      typeIdOptions: [],
      actions: "",
      sTempArr: [],
      sResultArr: [],
      ruleForm: {
        site_id: "",
        story_type: 1,
        column_id: "",
        keywords: "",
        title: "",
        tag_ids: [],
        author: "",
        is_publish: 0,
        is_show: 1,
        sort: "",
        cover: "",
        description: "",
        content: "",
        position: "",
        sort_master: ""
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
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
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
        column_id: [
          { required: true, message: "请选择文章栏目", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { required: true, message: "请输入标题", trigger: "change" }
        ],
        tag_ids: [{ required: true, message: "请选择标签", trigger: "change" }],
        author: [
          { required: true, message: "请输入作者", trigger: "blur" },
          { required: true, message: "请输入作者", trigger: "change" }
        ],
        position: [
          { required: true, message: "请输入职称", trigger: "blur" },
          { required: true, message: "请输入职称", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入内容简介", trigger: "blur" },
          { required: true, message: "请输入内容简介", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入文章正文", trigger: "blur" },
          { required: true, message: "请输入文章正文", trigger: "change" }
        ]
      }
      //end
    };
  },
  created() {
    //新增
    this.getSiteId();
    //获取栏目选项
    this.getTypesId();
    this.getTags();
    //编辑
    this.sid = this.$route.params.id;
    if (this.sid) {
      this.setlabel = "编辑线上课程";
      this.getEditPage();
    } else {
      this.setlabel = "新增线上课程";
      //获取标签
    }
    //图片上传地址
    this.actions = process.env.API_BASEURL + "photos";
  },
  filters: {
    formatStoryType(num) {
      switch (num) {
        case 1:
          num = "装修前";
          break;
        case 2:
          num = "装修中";
          break;
        case 3:
          num = "装修后";
          break;
        default:
          break;
      }
      return num;
    }
  },
  computed: {
    headers() {
      return {
        Authorization: getToken()
      };
    }
  },
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  },
  methods: {
    //返回上一页（列表页）
    jumpBack(){
      this.$router.push({ name:'线上课程管理' })
    },
    //start
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
    //end
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        // 选择并上传一张图片
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
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
    //获取标签
    getTags() {
      tagsList({ per_page: 10000 }).then(res => {
        this.tagData = res.data;
      });
    },
    //获取站点ID
    getSiteId() {
      siteNameList({}).then(res => {
        this.siteidOptions = res;
      });
    },
    //设置tag标签
    getTagsId(val) {
      //编辑状态下
      if (this.sid) {
        if (this.sResultArr.length > 0) {
          this.sTempArr = this.sResultArr;
        }
      }
      //已选择
      if (val.is_selected == 0) {
        for (let m in this.sResultArr) {
          if (this.sResultArr[m] == val.id) {
            this.sResultArr.splice(m, 1);
          }
        }
      }
      //未选择
      if (val.is_selected == 1) {
        for (let k in this.tagData) {
          if (this.tagData[k].id == val.id) {
            this.sResultArr.push(this.tagData[k].id);
            this.sResultArr = this.sTempArr.concat(this.sResultArr);
            this.sResultArr = uniqueArr(this.sResultArr);
          }
        }
      }
    },
    //获取文章模块的请求参数
    changeColumn(val) {
      if (val) {
        this.getTypesId();
      }
    },
    //获取文章模块
    getTypesId() {
      this.ruleForm.column_id = '';
      typesList({ story_type: this.ruleForm.story_type }).then(res => {
        this.ruleForm.column_id = res[0].id;
        this.typeIdOptions = res;
      });
    },
    //获取编辑页数据
    getEditPage() {
      editOnlineCourseView(this.sid, {}).then(res => {
        this.ruleForm.site_id = res.site_id;
        this.ruleForm.story_type = res.story_type;
        this.ruleForm.column_id = res.column_id;
        this.ruleForm.keywords = res.keywords;
        this.ruleForm.title = res.title;
        typesList({ story_type: this.ruleForm.story_type }).then(res => {
          this.typeIdOptions = res;
        });
        res.tags.forEach((v,i)=>{
          this.ruleForm.tag_ids.push(v.id)
        })
        this.ruleForm.author = res.author;
        this.ruleForm.position = res.position;
        this.ruleForm.is_publish = res.is_publish;
        this.ruleForm.is_show = res.is_show;
        this.ruleForm.sort = res.sort;
        this.tempCover = res.cover + "!ps2";
        this.ruleForm.cover = res.cover;
        this.ruleForm.description = res.story_detail.description;
        this.ruleForm.content = res.story_detail.content;
        this.ruleForm.sort_master = res.sort_master;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //编辑接口
          if (this.sid) {
            this.$axios
              .put(
                process.env.API_BASEURL + "stories/" + this.sid,
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
                  Router.push({ name: "线上课程管理" });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            //新增接口
            this.$axios
              .post(process.env.API_BASEURL + "stories", this.ruleForm, {
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
                  Router.push({ name: "线上课程管理" });
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


<style lang="scss">
.el-checkbox-button {
  margin: 5px;
}
.el-checkbox-button .el-checkbox-button__inner {
  border: 1px solid #d9ecff;
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
}
.el-checkbox-button:first-child .el-checkbox-button__inner {
  border-radius: 4px;
}
.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner {
  border-radius: 4px;
}
.el-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: #00a8e6 !important;
  border: 1px solid #00a8e6;
}
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
</style>