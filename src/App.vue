<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
      }
    },
    created() {
      localStorage.getItem("page") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("page"))))
      window.addEventListener("beforeunload",()=>{
        localStorage.setItem("page",JSON.stringify(this.$store.state.page))
      })
    },
    mounted () {
      // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
      window.addEventListener('hashchange', () => {
        let currentPath = window.location.hash.slice(1)
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath)
        }
      }, false)
    }  
  }
</script>

<style>
</style>
