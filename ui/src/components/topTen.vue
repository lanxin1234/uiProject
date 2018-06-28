<template>
  <div class="topTen" @dblclick='opentopTen'>
    <fieldset class='commontBoxL'>
       <legend class='textL'  @click="dialogVisible = true">门店销售TOP10</legend>
         <ve-chart
         :data='chartData'
         :settings='chartSettings'
         :legend-visible='false'
         :xAxis='xAxis'
         :textStyle='textStyle'
         :axisSite='axisSite'
         :visual-map='visualMap'
         :grid="grid"
         :toolbox='toolboxOption'
         :height='height'
         :judge-width='judge'
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
         >
       </ve-chart>
    </fieldset>
  </div>
</template>
<script>

export default {
  name: "topTen",
  data: () => ({
    loading: false,
    judge: true,
    height: '400px',
    dialogVisible: false,
     xAxis: {
       show: false,
     },
     textStyle: {
       color: '#fff',
     },
     textStyleDia: {
       color: '#434343',
     },
     axisSite: {
       top: ['利润']
     },
     //视觉映射组件
     visualMap: {
       type: 'continuous',
       dimension: 0,
       left: '-200%',
       calculable: true,
       padding: 10,
       bottom: 74,
       itemWidth: 12,
       min: 0,//这里应该是用户自定义，data[i].data[9].value[0],
       max: 5000,//这里也是用户自定义的，data[i].data[0].value[0],默认为[0,200]
       text: ['Height','Low'],
       textStyle: {
         color: '#ddd'
       },
       inRange: {
         color: ['#8083da','#01babc','lightskyblue', 'yellow', 'orangered', 'red']
       }
     },
     grid: {
       show: false,
       top: '15%',
       left: 'center',
       width: '90%'
     },
     chartSettings: {
       title: {
         text: '一级品类数据'
       },
       series: {
         roam: true,
       },
       type: 'bar',
       dimension: ['分店'],
       metrics: ['利润'],
       radius: [60],
       label: {
         normal: {
           show: true,
           position: 'insideRight',
           formatter: '{c}'
         }
       }
     },
     typeArr: ['bar','pie'],
     index: 0
  }),
  created() {
    this.chartData = {
        columns: ['分店', '利润'],
        //显示的数据大于10时，条形图显示的文字不全，但是这个显示的top前10的数据，所以不考虑数据太多的情况,这里的数值必须按从小到大排序
        rows: [
          // {'分店': '杭州', '利润': 23 },
          // {'分店': '浙江', '利润': 25660},
          // {'分店': '深圳', '利润': 30530 },
          // {'分店': '广州', '利润': 50000 },
          // {'分店': '上海', '利润': 70000 },
          // {'分店': '河北', '利润': 90000 },
          // {'分店': '重庆', '利润': 100000 },
          // {'分店': '辽宁', '利润': 120000 },
          // {'分店': '西藏', '利润': 130000},
          // {'分店': '重庆', '利润': 140000 }
        ]
      }
      this.getData()
      //更换图表的类型,以及下载图片的小工具配置
      var self = this
      this.toolboxOption = {
        feature: {
            magicType: {type: ['pie']},
            saveAsImage: {backgroundColor: '#000'},
            //还原功能
            // restore: {},
            // dataView: {show: true,readOnly: true},
            myToogleChart: {
              show: true,
              title: '切换类型',
              icon: 'path://M1252.838233 407.733734H51.978606a51.851071 51.851071 0 0 1-44.962418-24.668822 48.499835 48.499835 0 0 1 13.032585-63.859667L434.019529 11.077697a51.478711 51.478711 0 0 1 70.934499 9.30899 48.499835 48.499835 0 0 1-9.495169 69.072701l-295.094962 219.692149h1051.357258c26.34444 0 49.151464 19.176518 51.478711 44.776238a48.499835 48.499835 0 0 1-13.032585 37.701407 51.199441 51.199441 0 0 1-37.235958 16.104552zM838.960566 1023.988829a50.454722 50.454722 0 0 1-47.941295-33.512361 48.592924 48.592924 0 0 1 17.221631-54.923038l295.094962-219.692148H51.792426a50.733992 50.733992 0 0 1-51.478711-44.776239 48.499835 48.499835 0 0 1 13.032585-37.794497 51.199441 51.199441 0 0 1 37.329048-16.011462h1200.859627a51.757981 51.757981 0 0 1 44.962418 24.668822 48.499835 48.499835 0 0 1-13.125675 63.859667l-413.877666 308.127548A51.199441 51.199441 0 0 1 838.960566 1023.988829z',
              onclick: function (){
                self.index++
                if (self.index >= self.typeArr.length) {
                  self.index = 0 ;
                  self.chartSettings.label.normal.formatter = '{c}'
                }
                self.chartSettings.type = self.typeArr[self.index]
                if(self.index == 1){
                  self.chartSettings.label.normal.formatter = '{b}: \n {c},\n({d}% )'
                }
              }
            }
        },
        right: '3%',
        bottom: '10%',
        z: 3
      }
  },
  methods: {
    changeType: function () {
      this.index++
      if (this.index >= this.typeArr.length) { this.index = 0 }
      this.chartSettings = { type: this.typeArr[this.index] }
    },
    opentopTen() {
      this.$router.push({name: 'topTen'})
    },
    toggleLayout() {
      this.$nextTick(function () {
        var wrapperWidth = $('.topTen').width()
        if (wrapperWidth > 1000) {
          this.height = '550px';
          this.chartSettings.radius = [150];
        } else {
          this.height = '400px';
          this.chartSettings.radius = [60];
        }
      })
    },
    getData() {
      //获取数据
      this.$ajax.get('/dashboard/viewInterfaceD').then((res)=>{
        var data = res.data.data;
        // //当店铺的数量小于10时，显示全部的店铺，
        var shopNum = res.data.data.length;
        if(shopNum <= 10 ){
          var data =  res.data.data;
        }else{
          //当店铺的数量大于10时，显示前10的店铺的销售数量。
          var data = res.data.data.slice(0,10)
        }
        console.log('门店销售top的数据',data)
        this.visualMap.min = Math.floor(data[0][1]/100)/100;
        this.visualMap.max = Math.floor(data[data.length-1][1]/100)/100;
        data.forEach((item,index)=>{
          this.chartData.rows[index] = {'分店': data[index][0], '利润': Math.floor(data[index][1] /100)/100}
        })
        if(!this.chartData.rows[0]) return this.loading = true;
      })
    }
   },
  mounted() {
      //更改饼图的半径大小
      this.toggleLayout()
      setTimeout(()=>{
        this.toggleLayout()
      },500)
  }
}
</script>
<style lang="scss">
  .topTen .commontBoxL .ve-chart{
    width: 90%;
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    margin: 0 auto;
  }
  .topTen .textL{
    width: 154px;
    margin-left: 152px;
  }
</style>
