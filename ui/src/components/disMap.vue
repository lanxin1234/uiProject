<template>
  <div class="dis-map"   @dblclick='openDisMap'>
    <div id="mapCharts" ></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
var option = null
require('echarts/lib/chart/bar')
require('echarts/lib/chart/scatter')
require('echarts/lib/chart/map')
require('echarts/map/js/china')
require('echarts/map/js/province/yunnan')
require('echarts/map/js/province/beijing')
// require('echarts/map/js/province/hebei')
export default{
  name:"dismap",
  data() {
    return{
      showData:[{
        name: "0109",
        value: 114,
        time:"20180987",
        store:'哈尔滨'
      }],
      longlatData: {}
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.drawLine()
  },
  methods: {
    drawLine: function(){
      let mapChart = echarts.init(document.getElementById('mapCharts'))
      var data = this.showData
      var geoCoordMap = this.longlatData
      // var data = [
      //      {name: '0', value: 114, time:"20180987", store:"北京"},
      //      {name: '1', value: 119, time:"20180987", store:"北京"},
      //      {name: '2', value: 136, time:"20180987", store:"北京"},
      //      {name: '3', value: 143, time:"20180987", store:"北京"},
      //      {name: '4', value: 147, time:"20180987", store:"北京"},
      //      {name: '5', value: 193, time:"20180987", store:"北京"},
      // ]
      // var geoCoordMap = {
      //     '0':[126.63,45.75],
      //     '1':[118.02,39.63],
      //     '2':[119.57,39.95],
      //     '3':[113.16,27.83],
      //     '4':[114.48,38.03],
      //     '5':[116.7,39.53],
      // }
      var convertData = function (data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name]
          console.log("geoCoord",geoCoord)
          if (geoCoord) {
            res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value,data[i].time,data[i].store)
            })
          }
        }
      return res
      }
    mapChart.setOption(option = {
      backgroundColor: '#000',
      title: {
        text: '门店订单分布图',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip : {
        trigger: 'item',
        formatter: function (a) {
          // console.log(a)
          var res = a.data.value[4]+ "<br />订单号：" + a.data.name + "<br />" + "金额：" + a.data.value[2] +"<br /> 时间："+ a.data.value[3]
          return res
        },
        textStyle: {
          padding:[10,10],
          align: "left"
        }
      },
      legend: {
        orient: 'vertical',
        y: 'bottom',
        x:'right',
        data:['订单'],
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
        map: '北京',
        label: {
            emphasis: {
                show: true,
                textStyle:{
                  color: "#ddb926"
                }
            }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#111'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series : [
        {
          name: '订单',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          symbolSize: function (val) {
            return val[2] / 10;
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ddb926'
            }
          }
        },
        {
          name: '门店',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: convertData(data.sort(function (a, b) {
            return b.value - a.value;
          })),
          symbolSize: function (val) {
            return val[2] / 10;
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        }
      ]})
    },
    openDisMap: function() {
      this.$router.push({name: 'disMap'})
    },
    getMapData: function() {
      var self = this
      this.$ajax('/dashboard/viewInterfaceB').then((res) => {
        var data = res.data.data
        data.forEach((item,index)=>{
          self.showData[index] = {name: item.id, value: item.price, time: item.paytime, store: item.store}
        })
        // var data = [{
        //   id: "0129029102",
        //   paytime: "20810101",
        //   longlat: [116.4,45.75],
        //   store: "北京店",
        //   price: 1000
        // },{
        //   id: "1",
        //   paytime: "1",
        //   longlat: [1,1],
        //   store: "1",
        //   price: 1
        // }]
        // var x={}
        for(var i=0; i< data.length; i++){
          var key = data[i].id
          var value = data[i].longlat
          self.longlatData[key] = value
          // x[key]=value
        }
        console.log(x)
        this.drawLine()
      })
    }
  },
  created() {
    this.getMapData()
  }
}
</script>
<style>
</style>
