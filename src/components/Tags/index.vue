<template>
<div class="nav">
    <div class="nav_list">
      <span v-for="(item,index) in tagData" :key="index" v-bind:data-id="item.id">
        <input type="button" :value="item.name" v-if="setStagName == '新增' " class="item" @click="changeVal($event,item,index)" /> 
        <input type="button" :value="item.name" v-if="setStagName == '编辑' && item.is_selected == 1" class="item isActive" @click="changeVal($event,item,index)" :disabled="isDisabled" />    
        <input type="button" :value="item.name" v-if="setStagName == '编辑' && item.is_selected == 0" class="item" @click="changeVal($event,item,index)" :disabled="isDisabled" />
      </span>
    </div>
</div>
</template>

<script>
export default {
  name: 'stags',
  props: {
    tagData: {
      type: Array
    },
    setStagName: {
      type: String
    },
    isDisabled: {
      type: Boolean
    }
  },
  data(){
    return {
    }
  }, 
  methods: {
    // selTxt  是否选中
    // is_pand 不需要做处理
    changeVal(e,item,index){
      let selTxt  = false;
      if (e.target.className.indexOf("isActive") == -1) {
          e.target.className = "item isActive";
          selTxt = 1;;
      } else {
          e.target.className = "item";   
          selTxt = 0;
      }
      let data = {
        id: item.id,
        is_selected: selTxt
      }
      this.$emit('getTagsId', data);
    }
  }
}
</script>

<style lang="scss">
.nav{
  .nav_list{
    margin:0;
    .item{
      margin:0 10px 10px 0;
      background-color: #ecf5ff;
      border-color: #d9ecff;
      display: inline-block;
      height: 32px;
      padding: 0 10px;
      line-height: 30px;
      font-size: 12px;
      color: #409EFF;
      border-width: 1px;
      border-style: solid;
      border-radius: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      white-space: nowrap;
      &:hover{
        cursor:pointer;
      }
    }
  }
}
.isActive{
    background: #00A8E6 !important;
    color:#fff !important;
}
</style>
