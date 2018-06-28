<template>
  <div class="sales-trend" @dblclick='openSalesTrend'>
    <h5>实时销售趋势对比</h5>
    <div class="sales-trend-wrap">
      <div id="sales-chart"></div>
    </div>
    <div class="switch-store">
      <el-select @change='getTrend' v-model="storeNum" placeholder="请选择">
        <el-option
          v-for="item in storeName"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
var self = this

import storeOption from '../assets/switchstore.png'

export default {
  name: 'salesTrend',
  data() {
    return {
      storeNum: "999",
      storeName: [
        {
          label: "...",
          value: "002"
        }
      ],
      chartData:{
        xdata: [],
        salesAmount: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 23.6, 20.0, 6.4, 3.3],
        salesNum: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      }
    }
  },
  mounted() {
    this.getTrend()
  },
  methods: {
    openSalesTrend: function() {
      this.$router.push({name: 'salesTrend'});
    },
    drawLine: function() {
      let myChart = echarts.init(document.getElementById('sales-chart'))
      myChart.setOption({
        title: {
          text: '数据趋势',
          textStyle: {
            color: '#fff',
          },
          top: '10px',
          left: '5px'
        },
        textStyle: {
            color: '#ccc',
        },
        tooltip: {
          trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
        },
        toolbox: {
          top: '8px',
          showTitle: false,
          feature: {
            magicType: {show: true, type: ['line', 'bar']},
            saveAsImage: {show: true}
          }
        },
        legend: {
          top: '40px',
          left: '5px',
          textStyle:{
            color: '#ccc'
          }
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '5%',
            top: '24%',
            containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.chartData.xdata,
          axisPointer: {
            type: 'shadow'
          }
        }],
        yAxis: [
          {
            type: 'value',
            name: '销售额/万元',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
                show: false
            }
          }
        ],
        series: [
          {
            name:'销售额',
            type:'line',
            symbol: 'none',
            data: this.chartData.salesAmount,
            color: '#E10000'
          },{
            name:'销售数量',
            type:'line',
            symbol: 'none',
            data: this.chartData.salesNum,
            color:'#D8D800'
          }
        ]
      })
    },
    getTrend: function() {
      var qs = this.qs.stringify({
        num: this.storeNum
      })
      this.$ajax('/dashboard/viewInterfaceC?' + qs).then((res) => {
        var data = res.data.data
        var salesDatatime = []
        var amount = []
        var num = []
        data.forEach((item)=>{
          salesDatatime.push(item[0])
          amount.push(Math.floor(item[2]/10000 * 100)/100)
          num.push(Math.floor(item[3]/10000 * 100)/100)
        })
        this.chartData.xdata = salesDatatime
        this.chartData.salesAmount = amount
        this.chartData.salesNum = num
        this.drawLine()
      })
    },
    getStoreNum: function() {
      this.$ajax.get('dashboard/getStore').then((res)=>{
        var data = res.data.data;
          data.forEach((item,index)=>{
            this.storeName[index] = {label: item[0], value: item[1]}
        })
        this.storeNum = '请选择';
      })
    }
  },
  created() {
    this.getStoreNum()
  }
}
</script>

<style>
.el-select {
  width: 150px;
}
 .el-select .el-input.is-focus .el-input__inner {
  border-color: #000;
  border: none;
}
.el-input__inner{
  background-color: #000;
  color: #ccc;
  border: none;
}
.el-select-dropdown__list {
  background-color: #000;
  color: #ccc;
}
 .el-select-dropdown__item:hover {
  background-color: #2D2D2D;
  color: #ccc;
}
.el-select-dropdown__item.selected {
  background-color: #000;
  color: #3db3dd;
}
 .el-select .el-input__inner:focus {
  border-color: #000;
}
 .el-input__inner {
  border-color: #000;
  border: none;
}
.el-input__inner:focus {
  border-color: #000;
}
.el-input__inner:hover {
  border-color: #000;
}
.el-select-dropdown {
  border-color: #000;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
  background-color: #2D2D2D;
}
.el-popper .popper__arrow {
  border-width: 0px;
}
.el-popper[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: #000;
}
.el-select-dropdown__item {
  width: 150px;
}
</style>
