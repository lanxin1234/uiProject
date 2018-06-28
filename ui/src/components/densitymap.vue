<template>
  <div class="density-map" @dblclick='openDensityMap'>
    <div class="title">
      门店订单分布图
    </div>
    <el-amap
      vid="amapDemo"
      class="amap-demo" :zoom="zoom" :center="center" :events="mapEvents">
      <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events"  :key='index'></el-amap-marker>
      <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
    </el-amap>
  </div>
</template>
<script>

var mapinstance = null
var self = this
export default {
  name: "densityMap",
  data: () => ({
    markers: [],
    windows: [],
    window: '',
    mapEvents: {
      init: (o) => {
        mapinstance = o;
        o.setMapStyle('amap://styles/blue');
        AMapUI.loadUI(['geo/DistrictExplorer'],function(DistrictExplorer){
          self.a.methods.initPage(DistrictExplorer);
        })
      }
    },
    zoom: 8,
    center: [116.39996, 40.197646],
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
    },
    initPage: function (DistrictExplorer){
      var districtExplorer = new DistrictExplorer({
          map: mapinstance
      });
      var countryCode = 100000, //全国
          provCodes = [
              110000
          ],
          cityCodes = [];
          districtExplorer.loadMultiAreaNodes(
              //只需加载全国和市，全国的节点包含省级
              [countryCode].concat(cityCodes),
              function(error, areaNodes) {

                  var countryNode = areaNodes[0],
                      cityNodes = areaNodes.slice(1);

                  var path = [];


                  //首先放置背景区域，这里是大陆的边界
                  path.push(self.a.methods.getLongestRing(countryNode.getParentFeature()));



                  for (var i = 0, len = provCodes.length; i < len; i++) {
                      //逐个放置需要镂空的省级区域
                      path.push.apply(path, self.a.methods.getAllRings(countryNode.getSubFeatureByAdcode(provCodes[i])));
                  }

                  for (var i = 0, len = cityNodes.length; i < len; i++) {
                      //逐个放置需要镂空的市级区域
                      // path.push.apply(path, getAllRings(cityNodes[i].getParentFeature()));
                  }

                  //绘制带环多边形
                  var polygon = new AMap.Polygon({
                      bubble: true,
                      lineJoin: 'round',
                      strokeColor: 'black', //线颜色
                      strokeOpacity: 1, //线透明度
                      strokeWeight: 0, //线宽
                      fillColor: 'black', //填充色
                      fillOpacity: 1, //填充透明度
                      map: mapinstance,
                      path: path
                  });
              });
    },
    getLongestRing: function(feature) {
        var rings = self.a.methods.getAllRings(feature);

        rings.sort(function(a, b) {
            return b.length - a.length;
        });

        return rings[0];
    },
    getAllRings: function(feature) {

        var coords = feature.geometry.coordinates,
            rings = [];

        for (var i = 0, len = coords.length; i < len; i++) {
            rings.push(coords[i][0]);
        }
        return rings;
    }
  },
  mounted() {
    let self = this;
    var dom = $(".density-map").width()
    if(dom < 900){
      self.zoom = 8,
      self.center = [116.39996, 40.197646]
    }else if(dom < 1601){
      self.zoom = 8.8
      self.center=[116.59996, 40.397646]
    }else{
      self.zoom = 9.4
      self.center=[116.59996, 40.397646]
    }

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
          content: "订单号："+ data[i].id + "<br/>" + "金额(元)：" + data[i].price + "<br/>" + "时间：" + data[i].paytime + "<br/>" + "店号：" + data[i].store,
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
