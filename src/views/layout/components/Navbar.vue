<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <tabs-view></tabs-view>
    <a class="helplnk" href="https://admin2019.sumeihome.com/help/help.pdf" target="_blank">帮助手册</a>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span v-if="userName">欢迎, 用户{{userName}} </span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link> 
        <el-dropdown-item divided>
          <span @click="editPwd" style="display:block;">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>
 
<script>
import { mapGetters } from 'vuex'
import TabsView from './tabs-view'
import Hamburger from '@/components/Hamburger'
import Router from '@/router/index'
import { getUserName } from '@/utils/auth' 
export default {
  data() {
    return {
      userName:''
    }
  },
  components: {
    TabsView,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created(){
    this.userName = getUserName()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    //修改密码
    editPwd(){
      this.$router.push({ name:'修改密码' })
    },
    //退出
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({path: '/login'})
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .helplnk{
    position: absolute;
    right: 250px;
    top:14px;
    z-index:10;
    color:#606266;
    font-size:14px;
  }
  .avatar-container {
    height: 30px;
    display: inline-block;
    position: absolute;
    right: 35px;
    top:10px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 0;
        font-size: 12px;
      }
    }
  }
}
</style>

