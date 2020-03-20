<<<<<<< HEAD
<template>
    <div>
      <el-form-item label="查找坐标:">
          <el-input id="suggestId" name="address_detail" placeholder="请输入地址获取坐标" v-model="address_detail" class="input_style" clearable></el-input>
          <div id="allmap" @click="getClickInfo"></div>
      </el-form-item>
    </div>
</template>
<script>
   export default {
       name: 'mapComp',
       props:{
         lngLat: Object,
       },
       
       data(){
           return {
               address_detail: null, //详细地址
               userlocation: {lng: "", lat: ""},
           }
       },
       mounted(){
           this.$nextTick(function () {
                   var th = this
                   // 创建Map实例
                   var map = new BMap.Map("allmap");
                   // 初始化地图,设置中心点坐标，
                   var point = new BMap.Point(116.379299,39.916967); // 创建点坐标，汉得公司的经纬度坐标
                   map.centerAndZoom(point, 15);
                   map.enableScrollWheelZoom();
                   var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                       {
                          "input": "suggestId", 
                          "location": map
                       })
                   var myValue
                   ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                       var _value = e.item.value;
                       myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                       this.address_detail = myValue
                       setPlace();
                   });

                   function setPlace() {
                       map.clearOverlays();    //清除地图上所有覆盖物
                       function myFun() {
                           th.userlocation = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                           map.centerAndZoom(th.userlocation, 18);
                           map.addOverlay(new BMap.Marker(th.userlocation));    //添加标注
                       }

                       var local = new BMap.LocalSearch(map, { //智能搜索
                           onSearchComplete: myFun
                       });
                       local.search(myValue);
                   }

           })
       },
       methods: {
         getClickInfo(){
           this.$emit('mapconfirm', this.userlocation)
         }
       },
   }
</script>
<style scoped>
  #allmap{
    min-width: 400px;
    height: 400px;
  }
  .input_style{
    margin-bottom:10px;
  }
=======
<template>
    <div>
      <el-form-item label="查找坐标:">
          <el-input id="suggestId" name="address_detail" placeholder="请输入地址获取坐标" v-model="address_detail" class="input_style" clearable></el-input>
          <div id="allmap" @click="getClickInfo"></div>
      </el-form-item>
    </div>
</template>
<script>
   export default {
       name: 'mapComp',
       props:{
         lngLat: Object,
       },
       
       data(){
           return {
               address_detail: null, //详细地址
               userlocation: {lng: "", lat: ""},
           }
       },
       mounted(){
           this.$nextTick(function () {
                   var th = this
                   // 创建Map实例
                   var map = new BMap.Map("allmap");
                   // 初始化地图,设置中心点坐标，
                   var point = new BMap.Point(116.379299,39.916967); // 创建点坐标，汉得公司的经纬度坐标
                   map.centerAndZoom(point, 15);
                   map.enableScrollWheelZoom();
                   var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                       {
                          "input": "suggestId", 
                          "location": map
                       })
                   var myValue
                   ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                       var _value = e.item.value;
                       myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                       this.address_detail = myValue
                       setPlace();
                   });

                   function setPlace() {
                       map.clearOverlays();    //清除地图上所有覆盖物
                       function myFun() {
                           th.userlocation = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                           map.centerAndZoom(th.userlocation, 18);
                           map.addOverlay(new BMap.Marker(th.userlocation));    //添加标注
                       }

                       var local = new BMap.LocalSearch(map, { //智能搜索
                           onSearchComplete: myFun
                       });
                       local.search(myValue);
                   }

           })
       },
       methods: {
         getClickInfo(){
           this.$emit('mapconfirm', this.userlocation)
         }
       },
   }
</script>
<style scoped>
  #allmap{
    min-width: 400px;
    height: 400px;
  }
  .input_style{
    margin-bottom:10px;
  }
>>>>>>> 6a249e407b75d8374ffd6585539ce0b8e9b93aa1
</style>