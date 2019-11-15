<template> 
  <div class="app-container">
     <el-form :inline="true" :model="listPageFilter" size="small" label-width="100px">
        <el-form-item label="搜索条件：">
            <el-select v-model="listPageFilter.typestatus" placeholder="选择分类" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="listPageFilter.timestatus" placeholder="时间类别" clearable class="input-width">
              <el-option
                v-for="item in timeStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <button type="button" class="el-button search-button el-button--primary el-button--small" style="margin-left: 20px;" @click="searchFilter">
            <span>搜索</span>
        </button>
      </el-form>
    <div id="myChart" class="my_chart"></div>
  </div>
</template>
<script>

  export default {
    name: "dataList",
    components:{

    },
    data() {
      return {
        dateRange: "",
        typeOptions:[
          {
              "id": 1,
              "name": '专题'
          },
        ],
        timeStatus:[
          {
              "value": 1,
              "label": '添加时间'
          },
          {
              "value": 2,
              "label": '修改时间'
          }
        ],
        listPageFilter:{
          typestatus: '',
          timestatus: '',
          start_time: '',
          end_time: ''
        }
      }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
      drawLine(){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          // 绘制图表
          myChart.setOption({
              tooltip: {},
              xAxis: {
                  data: ["总部","北京","上海","天津","沈阳","西安","石家庄","郑州","青岛","武汉","长沙","南京","南宁","成都","昆明","宁波","深圳","无锡","杭州","苏州","金华","兰州","东莞","佛山","重庆","大连","德州","唐山","秦皇岛"]
              },
              yAxis: {},
              series: [{
                  name: '销量',
                  type: 'bar',
                  data: [48, 97, 20, 40, 33, 80,26,6,38,86,20,70,20,56,35,39,38,46,72,17,5,3,34,17,56,2,12,14,12]
              }]
          });
      },
      searchFilter(){
        //dateRange
        this.listPageFilter.start_time = this.dateRange[0];
        this.listPageFilter.end_time   = this.dateRange[1];
      }
    }
  }
</script>
<style scoped>
.my_chart{
  width: 100%; 
  height: 800px;
}
</style>


