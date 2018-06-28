<template>
  <div class="productTypeStatus" @dblclick='openproductTypeStatus'>
    <fieldset class='commontBoxL'>
       <legend class='textL'>品类销售动态</legend>
       <div class="outBox">
           <ve-ring
           :data="chartData"
           :settings="chartSettings"
           :title='titleOption'
           :legend='legendOption'
           :colors='chartColors'
           :grid='chartGrid'
           :judge-width='judge'
           :set-option-opts='true'
           :height='ringHeight'
           >
           <div class="data-empty" v-if='unRingData'>数据正在准备中···</div>
         </ve-ring>
         <div class="pieBox">
            <div id='secondType'>
            </div>
           <!-- <div class="layoutPie">
             <ve-pie
             :key='allData.index'
             :data="allData.pieChartData"
             :legend-visible='false'
             :settings="allData.pieChartSettings"
             :title='allData.titleOption'
             :colors='chartColors'
              height='160px'
              width='100px'>
             </ve-pie>
             <ve-pie
             :key='allData.index'
             :data="allData.pieChartData"
             :legend-visible='false'
             :settings="allData.pieChartSettings"
             :title='allData.titleOption'
             :colors='chartColors'
              height='160px'
              width='100px'>
             </ve-pie>
           </div>
           <div class="layoutPie">
             <ve-pie
             :key='allData.index'
             :data="allData.pieChartData"
             :legend-visible='false'
             :settings="allData.pieChartSettings"
             :title='allData.titleOption'
             :colors='chartColors'
              height='160px'
              width='100px'>
             </ve-pie>
             <ve-pie
             :key='allData.index'
             :data="allData.pieChartData"
             :legend-visible='false'
             :settings="allData.pieChartSettings"
             :title='allData.titleOption'
             :colors='chartColors'
              height='160px'
              width='100px'>
             </ve-pie>
           </div> -->
         </div>
       </div>
    </fieldset>
  </div>
</template>
<script>
 import 'v-charts/lib/style.css'
 let echarts = require('echarts/lib/echarts')
 require('echarts/lib/chart/line')
 import 'echarts/lib/component/dataZoom'
export default {
  name: "productTypeStatus",
  data: () => ({
    unRingData: true,
    ringHeight: '400px',
    legendOption:{
      top: 0,
      show: false
    },
    titleOption: {
      text: '一级品类数据',
      textStyle: {
        color: '#ddd'
      }
    },
    judge: true,
    chartColors: ['#22baf1','#ff8400','#7d90a6','#60a0a8','#96d668','orange','#91c8ae','#c23631'],
    chartGrid: {
      // show: false,
      // left:'center',
      // top: '50%',
      // right: '50%'
    },
    chartSettings : {
      dimension: '品类',
      metrics: ' 销售收入',
      dataType: 'value',
      selectedMode: 'single',
      hoverAnimation: false,
      radius: ['40%', '90%'],
      offsetY: 180,
      center: ['50%','50%'],
      legendLimit: 3,
      limitShowNum: 6,
      label: {
        show: true,
        color: '#fff',
        position: 'inside',
        formatter: '{c},\n{d}%',
      }
    },
    chartData: {
      columns: ['品类', '销售收入'],
      rows: []
    },
    secondTypeOption: {},
    secondTypeData: []
  }),
  created() {

 },
 methods: {
   getData() {
     //获取环图,一级品类的数据
     this.$ajax.get('dashboard/viewInterfaceF').then((res)=>{
      var data = res.data.data;
      if(!data.firstGradeResult[0]){
          this.unRingData = true
      }
      if(data.firstGradeResult[0]){
        this.unRingData = false
        var fistTypeData = []
        data.firstGradeResult.forEach((item,index)=>{
           fistTypeData.push({'品类': item[0],' 销售收入': Math.floor(item[1]/100)/100})
        })
        this.chartData.rows = fistTypeData
      }
      this.secondTypeData = []
      data.secondGradeResult.forEach((item,index)=>{
        this.secondTypeData.push({'品类': item[0],'销售收入': Math.floor(item[1]/100)/100})
      })
      this.setSecondOption()
      console.log('品类销售动态的数据',data)
     })
   },
   openproductTypeStatus() {
      this.$router.push({name: 'productTypeStatus'})
   },
   toggleLayout() {
     this.$nextTick(function () {
       var wrapperWidth = $('.productTypeStatus').width()
       if (wrapperWidth >= 1000) {
         this.legendOption.show = true
         this.ringHeight = '600px'
         this.chartSettings.radius = ['30%','80%'];
         this.chartSettings.offsetY = '260px'
         this.chartSettings.label.formatter = '{b},\n({c},\n{d}%)';
       } else {
         this.legendOption.show = false
         this.ringHeight = '400px'
         this.chartSettings.radius = ['40%','90%'];
         this.chartSettings.label.formatter = '{d}%';
       }
     })
   },
   setSecondOption () {
     //二级品类的配置
           this.secondTypeOption = {
              color: ['#ec4863'],
              title: {
                 text: '二级品类数据',
                 textStyle:{
                   color: '#eee',
                 }
              },
                tooltip: {trigger: 'axis'},
                legend: {
                    data:['销量']
                },
                dataZoom: [
                  {
                    type: 'slider',
                    show: false,
                    xAxisIndex: [0],
                    start: 1,
                    end: 35
                  },
                  {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 1,
                    end: 35
                  }
                ],
                xAxis: {
                  type: 'category',
                "axisLine": {
                    lineStyle: {
                        color: '#FF4500'
                    }
                },
                "axisTick": {
                    "show": false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                 },
                 boundaryGap: false,
                  },
                  yAxis: {
                    name: '数值／万元',
                    "axisLine": {
                       lineStyle: {
                        color: '#fff'
                       }
                 },
                 splitLine: {
                     show: true,
                     lineStyle: {
                         color: '#fff'
                     }
                 },
                 "axisTick": {
                     "show": false
                 },
                 axisLabel: {
                     textStyle: {
                         color: '#fff'
                     }
                 },
                 type: 'value'
                },
                series: [
                  {
                    name: '销售收入',
                    smooth: true,
                    type: 'line',
                    symbolSize: 8,
                    symbol: 'circle',
                }
              ],
              dataset: {
                dimensions: ['品类','销售收入'],
                source: this.secondTypeData
            },
       }
     this.$nextTick(function(){
       var wapperWidth = $('.productTypeStatus').width();
       if(wapperWidth > 1000){
          this.secondTypeOption.dataZoom.forEach((item)=>{
            item.show = true
          })
       }
       var myChart = echarts.init(document.getElementById('secondType'));
         myChart.setOption(this.secondTypeOption);
     })
   }
 },
 mounted() {
      this.getData()
       //更改饼图的半径大小
       this.toggleLayout()
       setTimeout(()=>{
         this.toggleLayout()
       },500)
   }
}
</script>
<style lang="scss" scoped>
#secondType{
  width: 100%;
  height: 100%;
}
</style>
