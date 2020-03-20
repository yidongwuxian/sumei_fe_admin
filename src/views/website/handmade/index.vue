<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div>
        <span>手工模块数据管理</span>
      </div>
      <div class="mt15">
        <el-select v-model="site_type" placeholder="" clearable class="input-width" @change="changeType">
            <el-option v-for="item in handOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
            </el-option>
        </el-select>
        <ul v-if="list.length > 0">
            <li v-for="(item,index) in list" :key="index">
              <el-divider content-position="left">{{item.name}}</el-divider>
              <span v-for="(sitem,_index) in item.children" :key="_index" class="ml10">
                  <el-button type="primary" round @click="jumpPage(sitem.id,sitem.name,sitem.cover_size)">
                    {{sitem.name}}
                  </el-button>
              </span>
            </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {removeEmptyObject,toSortVal} from '@/utils/index';
  import {siteNameList} from '@/api/public';
  import {handModeList} from '@/api/handmade';
  export default {
    name:'list',
    data() {
      return {
        site_type: '',
        handOptions: [
          {
             value: 'PC',
             label: 'PC'
          },
          {
             value: 'H5',
             label: 'H5'
          }
        ],
        initParams: {},
        list:[]
      }
    },
    created(){
      if(!this.$route.params.site_type){
          this.site_type = 'PC'
      }else{
          this.site_type = this.$route.params.site_type
      }  
      this.getList();
    },
    methods:{
      changeType(val){
        this.site_type = val;
        handModeList({site_type:this.site_type}).then(res => {
          this.list = res; 
        });
      },
      //获取列表
      getList(){  
        handModeList({site_type:this.site_type}).then(res => {
          this.list = res; 
        });
      },
      jumpPage(_id,_name,_size){
        let params = {
          type: this.site_type,
          size: _size
        }
        sessionStorage.setItem('moduleData', JSON.stringify(params) );
        switch(_name) {
          case 'banner':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: 'banner管理', shape:'入口'} })
              break;
          case '美家案例':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '速美案例', shape:'入口'} })
              break;
          case '推荐案例':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '推荐案例', shape:'入口'} })
              break;
          case '速美服务':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '速美服务', shape:'入口'} })
              break;
          case '精选案例':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '精选案例', shape:'入口'} })
              break;    
          case '热装楼盘':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '热装楼盘', shape:'入口'} })
              break; 
          case '自定义区':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '自定义区', shape:'入口'} })
              break;      
          case '底部模块':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '底部模块', shape:'入口'} })
              break; 
          case '品牌背书':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '品牌背书', shape:'入口'} })
              break; 
          case '看后再选':
              this.$router.push({ name:'手工模块管理1',     params:{id: _id, name: '看后再选', shape:'入口'} })
              break;          
          case '线下体验店':
              this.$router.push({ name:'手工模块管理2',     params:{id: _id, name: '线下体验店', shape:'入口'} })
              break;          
          case '广告位':
              this.$router.push({ name:'手工模块管理2',     params:{id: _id, name: '广告位', shape:'入口'} })
              break;  
          case '功能':
              this.$router.push({ name:'手工模块管理2',     params:{id: _id, name: '功能模块', shape:'入口'} })
              break;
          case '标题':
              this.$router.push({ name:'手工模块管理3',     params:{id: _id, name: '弹出框标题', shape:'入口'} })
              break; 
          case '左侧快捷':
              this.$router.push({ name:'手工模块管理3',     params:{id: _id, name: '左侧快捷链接', shape:'入口'} })
              break;               
          default:
              break;        
        }
      } 
    }
  }
</script>
<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/index.scss';
</style>


