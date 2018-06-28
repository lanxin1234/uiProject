<template>
  <div class="income" @dblclick='openIncome'>
    <fieldset class='commontBoxL'>
       <legend class='textL'>收入成本与毛利</legend>
       <div class="" id='incomeChartBox'>

       </div>
    </fieldset>
  </div>
</template>
<script>

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
import 'echarts/lib/component/dataZoom'
var chartData = []

export default {
  name: "income",
  data: () => ({
    incomeChartheight: '400px',
    option: {},
    labelShow: false,
  }),
  created() {

  },
  methods: {
    getData () {
      var self = this
      this.option = {
        legend: {
          top: '20px',
          left: 'center',
          textStyle:{
            color: '#ccc'
          }
        },
        textStyle: {
            color: '#ccc',
        },
        title: {
          text:'收入成本与毛利',
          top: '-200'
        },
        grid:{
          left: '60px',
          right: '60px',
          top: '100px'
        },
       dataZoom: [
             {
               type: 'slider',
               show: true,
               xAxisIndex: [0],
               start: 1,
               end: 35,
               bottom: '0px'
             },
             {
               type: 'inside',
               xAxisIndex: [0],
               start: 1,
               end: 35,
               bottom: '0px'
             }
        ],
        tooltip: {
          trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#fff'
              }
            }
        },
        toolbox: {
          show:true,
          top: '-5',
          showTitle: false,
          feature: {
            saveAsImage: {},
            restore: {},
            magicType: {
              type: ['line', 'bar']
            },
            myToogleChart: {
              show: true,
              title: '切换类型',
              icon: 'path://M219.456 73.152v82.304a64 64 0 0 0 64 64h457.088a64 64 0 0 0 64-64V73.152H896a128 128 0 0 1 128 128V896a128 128 0 0 1-128 128H128a128 128 0 0 1-128-128V201.152a128 128 0 0 1 128-128h91.456z m0 365.696h585.088V365.696H219.52v73.152z m0 219.456h585.088V585.152H219.52v73.152z m0 219.392h585.088v-73.152H219.52v73.152zM356.48 0h310.912a64 64 0 0 1 64 64v18.304a64 64 0 0 1-64 64H356.48a64 64 0 0 1-64-64V64a64 64 0 0 1 64-64z',
              onclick: function (){
                self.labelShow = !self.labelShow;
                self.option.series.forEach((item)=>{
                  item.label.show = self.labelShow
                })
                var myChart = echarts.init(document.getElementById('incomeChartBox'));
                myChart.setOption(self.option);
              }
            }
          }
        },
        color:
          ['#19d4ae','#5ab1ef','#fa6e86','#ffb980','#01426d','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83']
        ,
        xAxis: {
           type: 'category'
        },
        yAxis: [
          {
            type: 'value',
            name: '数值／万元',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
                show: false
            }
          }
        ],
        dataset: {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: ['店铺','销售额','上周同期销售','去年同期销售','毛利', '上周同期毛利','去年同期毛利'],
          source: chartData
          // { '店铺': '海淀', '销售额': 1880, '毛利': 1523, '上周同期销售': 8000, '去年同期销售': 53,'上周同期毛利': 8, '去年同期毛利': 0.53},
          // { '店铺': '昌平', '销售额': 2223, '毛利': 1921, '上周同期销售': 6000, '去年同期销售': 56,'上周同期毛利': 8, '去年同期毛利': 1.53},
      },
        series: [
          {
            type: 'bar',
            smooth: true,
            label:{
               show: false,
               position: 'top'
            }
          },
          {
            type: 'bar',
            smooth: true,
            label:{
               show: false,
               position: 'top'
            }
          },
          {
            type: 'bar',
            smooth: true,
            label:{
               show: false,
               position: 'top'
            }
          },
          {
            type: 'line',
            smooth: true,
            label:{
               show: false,
               position: 'top'
            }
          },
          {
            type: 'line',
            smooth: true,
            label:{
               show: false,
               position: 'top'
            }
          },
          {
            type: 'line',
            smooth: true,
            label:{
               show: false,
               position: 'top'
            }
          }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
          return idx * 20;
        }
      }
      this.$nextTick(function () {
        var myChart = echarts.init(document.getElementById('incomeChartBox'));
        var wrapperWidth = $('.income').width()
        if( wrapperWidth > 1000){
          this.option.dataZoom[0].show = true
          this.option.dataZoom[0].end = 100
          $('.income .ve-histogram').css({'padding-top': '50px'})
        } else {
          this.option.dataZoom[0].show = true
          this.option.dataZoom[0].end = 50
          $('.income .ve-histogram').css({'padding-top': '0px'})
        }
        myChart.setOption(this.option);
      })
    },
    openIncome () {
       this.$router.push({name: 'income'})
    }
  },
  mounted() {
    var salesData = [];
    var profitData = [];
    this.$ajax.get('dashboard/viewInterfaceISales').then((res)=>{
      salesData = res.data.data;
       salesData.forEach((item,index)=>{
          chartData[index] ={ '店铺': item[0], '销售额': Math.floor(item[1]/100)/100,
          '上周同期销售': Math.floor(item[2]/100)/100,
          '去年同期销售': Math.floor(item[3]/100)/100,
           }
       })
       this.$ajax.get('dashboard/viewInterfaceIProfit').then((res)=>{
         profitData = res.data.data;
         for(var i = 0; i < chartData.length; i++){
           for(var j = 0; j < profitData.length; j++){
             if(chartData[i].店铺 == profitData[j][0]){
                 chartData[i].毛利 = Math.floor(profitData[j][1]/100)/100;
                 chartData[i].上周同期毛利 = Math.floor(profitData[j][2]/100)/100;
                 chartData[i].去年同期毛利 = Math.floor(profitData[j][3]/100)/100;
             }
           }
         }
         console.log('收入成本与毛利的数据',chartData)
         this.getData()
       })
    })
  }
}
</script>
<style lang="scss" scoped>
  // .income fieldset legend.textL{
  //   text-align: left;
  //   width: 126px;
  //   margin-left: 40px;
  // }
  // .income .ve-histogram{
  //  height: 500px;
  // }
  // .income .ve-histogram>div div{
  //   height: 500px;
  //   background: green;
  // }
  // #incomeChartBox{
  //   width: 100%;
  //   height: 92%;
  //   margin: 0 auto;
  // }
</style>
