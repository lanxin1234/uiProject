<template>
  <div class="dailyOrders">
    <div class="search">
      <div class="">
        <span>订单时间</span>
        <el-date-picker
           v-model="value7"
           type="daterange"
           align="right"
           unlink-panels
           range-separator="至"
           start-placeholder="开始日期"
           end-placeholder="结束日期"
           :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="">
         <span class='store'>门店</span>
         <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult">
         </el-amap-search-box>
       </div>
       <el-button round @click='submit' class='submit'>搜索</el-button>
    </div>
    <el-amap ref="map"
      vid="amapDemo"
      :center="mapCenter"
      :zoom="zoom"
      :plugin="plugin"
      :events="mapEvents"
      id='dailyOrdersMap'>
      <el-amap-marker v-for="(marker,index) in markers" :position="marker" :key='index'></el-amap-marker>
    </el-amap>
  </div>
</template>
<script>

var mapinstance = null
import { AMapManager } from 'vue-amap';

export default {
  name: "dailyOrders",
  data: () => ({
    //时间选择器的数据
    lng: 0,
    lat: 0,
    pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value6: '',
      value7: '',
      //地图的数据
     AMapManager,
     zoom: 12,
     center: [121.59996, 31.197646],
     plugin: [{
           pName: 'ToolBar',
           defaultType: 0,
           events: {
             init(o) {
               console.log(o);
             }
           }
       }
     ],
     //地图上的点坐标的数据
     markers: [
            [121.59996, 31.197646],
            [121.40018, 31.197622],
            [121.69991, 31.207649]
     ],
     searchOption: {
       citylimit: false
     },
     mapCenter: [121.59996, 31.197646],
     //门店搜索的级联选择器的数据
     casOptions: [
       {
         value: 'mentouguo',
         label: '门头沟区',
         children: [
           {
             value: 'sanjiadian',
             label: '三家店',
           },{
             value: 'chengzidian',
             label: '城子店',
           },{
             value: 'xiufudian',
             label: '秀府店',
           },{
             value: 'donglongmendian',
             label: '东龙门店',
           }
         ]
       },
       {
         value: 'shijingshan',
         label: '石景山区',
         children: [
           {
             value: 'pingguoyuandian',
             label: '苹果园店',
           },{
             value: 'guchengdian',
             label: '古城店',
           },{
             value: 'jindingjiedian',
             label: '金顶街店',
           },{
             value: 'qixingyuandian',
             label: '七星园店',
           }
         ]
       },
       {
         value: 'haidian',
         label: '海淀区',
         children: [
           {
             value: 'shijichengdian',
             label: '世纪城店',
           },{
             value: 'wanliudian',
             label: '万柳店',
           },{
             value: 'weigongcundian',
             label: '魏公村店',
           },{
             value: 'wukesongdian',
             label: '五棵松店',
           }
         ]
       }
     ]
  }),
  created() {
    this.mapEvents = {
      init: (o) => {
        mapinstance = o;
        console.log(o.getCenter())
        console.log(this.$refs.map.$$getInstance())
        o.getCity(result => {
          console.log(result)
        })
      },
      'moveend': () => {
        console.log('map moveend')
      },
      'zoomchange': () => {
        console.log('map zoomchange')
      },
      'click': (e) => {
        alert('map clicked');
      }
    }
  },
  methods: {
    getMap() {
          // amap vue component
          console.log(amapManager._componentMap);
          // gaode map instance
          console.log(amapManager._map);
    },
    submit() {

    },
    addMarker: function() {
          let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
          let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
          this.markers.push([lng, lat]);
     },
    onSearchResult(pois) {
      // let latSum = 0;
      // let lngSum = 0;
      // if (pois.length > 0) {
      //   pois.forEach(poi => {
      //     let {lng, lat} = poi;
      //     lngSum += lng;
      //     latSum += lat;
      //     this.markers.push([poi.lng, poi.lat]);
      //   });
      //   let center = {
      //     lng: lngSum / pois.length,
      //     lat: latSum / pois.length
      //   };
      //   console.log('center',center)
      //   this.mapCenter = [center.lng, center.lat];
      // }
      mapinstance.setZoomAndCenter(15,[pois[0].lng,pois[0].lat])
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
