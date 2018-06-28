<template>
  <div class="density-map" @dblclick='openDensityMap'>
    <div class="title">
      门店订单分布图
    </div>
    <el-amap
      vid="amapDemo"
      class="amap-demo" :events="mapEvents">
      <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events"  :key='index'></el-amap-marker>
      <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
    </el-amap>
  </div>
</template>
<script>

var mapinstance = null

export default {
  name: "densityMap",
  data: () => ({
    markers: [],
    windows: [],
    // window: '',
    window: '',
    mapEvents: {
        init: (o) => {
          mapinstance = o;
          o.setMapStyle('amap://styles/blue');
            }
        },
       //zoom: 5,
       // center: [121.59996, 31.197646],
       plugin: [{
             pName: 'ToolBar',
             defaultType: 0,
             events: {
               init(o) {
                 return
               }
             }
         }
       ],
       //地图上的点坐标的数据
       markers:[],
       markerss: [],
       searchOption: {
         citylimit: false
       }
  }),
  methods: {
    openDensityMap: function() {
      this.$router.push({name: 'densityMap'})
    }
  },
  mounted() {

    let self = this;
    let markers = [];
    let num = 10;
    let windows = [];
    this.$ajax('/dashboard/viewInterfaceB').then((res) => {

      var data = res.data.data
      for (let i = 0 ; i < data.length ; i ++) {
        markers.push({
          position: data[i].longlat,
          events: {
            click() {
              self.windows.forEach(window => {
                window.visible = false;
              });

              self.window = self.windows[i];
              self.$nextTick(() => {
                self.window.visible = true;
              });
            }
          }
        });

        windows.push({
          position: data[i].longlat,
          content: "订单号："+ data[i].id + "<br/>" + "价格：" + data[i].price + "<br/>" + "时间：" + data[i].paytime + "<br/>" + "店号：" + data[i].store,
          visible: false
        });
      }

      this.markers = markers;
      this.windows = windows;

    })

  }
}
</script>
<style lang="scss">
 .amap-info-contentContainer{
   color: #000;
 }
</style>
