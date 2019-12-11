<template> 
  <div class="app-container">
    <StatisFilter v-on:searchResult="searchResult" v-on:exportExcFn="exportExcFn"></StatisFilter>
    <div ref="myChart" class="my_chart"></div>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth';
  import { transferExcelName } from '@/utils/index';
  import { statiList } from '@/api/statistics';
  import fileDownload from 'js-file-download'
  import StatisFilter from '@/components/StatisFilter/index';
  export default {
    name: "dataList",
    data() {
      return {
        isMap: false,
        dataArr: [],
        xAxisArr: [],
        seriesArr: [],
      }
    },
    components:{
      StatisFilter
    },
    methods: { 
      //绘制图
      drawMap(picName){
          let mChart = this.$refs.myChart;
          if(mChart){
            let myChart = this.$echarts.init(mChart);
            // 绘制图表
            let option = {
                tooltip: { trigger: 'axis' },
                toolbox: {
                    show: true,
                    x: 'middle', 
                    feature: {
                        //控制是否出现数据视图
                        dataView: {
                            show: true,
                            readOnly: true,
                            lang: ["", "关闭"]
                        },
                        magicType: {
                            show: true,
                            //控制是否出现切换折线图和柱状图
                            type: ['line', 'bar']
                        },
                        //保存为图片配置项
                        saveAsImage: { 
                          show: true, 
                          name: transferExcelName(picName)
                        },
                    }
                },
                xAxis: [
                  { 
                    type: 'category',
                    axisLabel: {  
                      interval:0,  
                      rotate:40  
                    },  
                    data: this.xAxisArr
                  }
                ],
                yAxis: [
                    { type: 'value' }
                ],
                grid: {
                    left: '10%',
                    bottom: '35%'
                },
                series: [
                       {
                        name: '数量',
                        type: 'bar',
                        data: this.seriesArr, 
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        markLine: {
                            data: [
                              { 
                                type: 'average', 
                                name: '平均值',
                                lineStyle: {
                                    color: 'black'
                                } 
                              }
                            ]
                        }
                    }
                ],
                optionToContent: function(opt) { 
                    //设置数据视图的样式
                    var axisData = opt.xAxis[0].data;
                    var series = opt.series;
                    var table = '<table id="tableExcel_Day" border="1" style="text-align:center;border-collapse:collapse;"  class="table_Qushi"><tbody><tr>' +
                    '<th>站点</th>';
                    for (var i = 0; i < series.length; i++) {
                    table += '<th>' + series[i].name + '</th>';
                    }
            
                    table += '</tr>';
                    for (var i = 0, l = axisData.length; i < l; i++) {
                    table += '<tr>' +
                        '<td>' + axisData[i] + '</td>' +
                        '<td>' + series[0].data[i] + '</td>' +
                        '</tr>';
                    }
                    table += '</tbody></table>';
                    return table;
                },
                // 数据视图刷新的方法
                contentToOption: function(HTMLDomElement,opt) {
                return opt;
                }
            };
            myChart.clear();
            myChart.setOption(option)
          }
      },
      //搜索条件
      searchResult(val){
        //获取列表  
        statiList(val).then(res => {
          this.xAxisArr = [];
          this.seriesArr = [];
          this.dataArr = res;
          if(this.dataArr.length > 0){
            for(let item of this.dataArr){
                if(item.site){
                  this.xAxisArr.push(item.site.name);
                }
                this.seriesArr.push(item.total);   
            }
          }else{
            this.xAxisArr = [];
            this.seriesArr = [];
          }
          //下载图片命名规范 -- 类别名称.png
          if(val.module){
            this.drawMap(val.module);
          }else{
            this.drawMap('数据统计');
          }
        });
      },
      //导出数据表
      exportExcFn(val){
        //获取列表  
        this.$axios.get(process.env.API_BASEURL+'/statistics/export', {
          params: val,
          responseType: 'arraybuffer',
          headers:{
            'Authorization': getToken(), 
            'Content-Type': 'application/json;charset=UTF-8'
          }  
        })
        .then(function (res) {
          let categoryName = '';
          let excelDate = '';
          if(res.config.params && res.config.params.module !=""){
            categoryName = '_'+ transferExcelName(res.config.params.module);
          }
          if(res.config.params && (res.config.params.start_time || res.config.params.end_time) ){
            excelDate    = '_'+ res.config.params.start_time + '_' + res.config.params.end_time;
          }
          //下载Excel命名规则 -- SM_CMS_类别名称_(2019-1-1至2019-1-3)
          fileDownload(res.data, 'SM_CMS'+ categoryName + excelDate +'.xlsx')
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
.my_chart{
  height: 800px;
}
</style>


