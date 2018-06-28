<template>
  <div class="shopSchedule">
    <fieldset class='commontBoxL'>
       <legend class='textL'>销售进度(年)</legend>
       <div class="shopsToggle">
         <el-select @change='switchStore' v-model="storeNum" placeholder="请选择">
           <el-option
             v-for="item in storeName"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
       </div>
      <div id="main" class='radarStyle'
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      ></div>
       <div class="ratio">
            <span>销售达成率: {{saleRate}}%</span>
            <span>毛利达成率: {{grossRate}}%</span>
            <span>计划销售: {{plannedSales}}</span>
            <span>实际销售: {{actualSales}}</span>
            <span>计划毛利: {{plannedProfit}}</span>
            <span>实际毛利: {{actualProfit}}</span>
       </div>
    </fieldset>
  </div>
</template>
<script>
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/radar');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/axis')
require('echarts/lib/component/angleAxis')
require('echarts/lib/component/axisPointer')
require('echarts/lib/chart/gauge')

export default {
  name: "shopSchedule",
  data: () => ({
    loading: true,
    plannedSales: '···',
    actualSales: '···',
    plannedProfit: '···',
    actualProfit: '···',
    storeNum: "请选择",
    storeName:[
      {
        label: "···",
        value: "001"
      },{
        label: "···",
        value: "002"
      },{
        label: "···",
        value: "003"
      }
    ],
    saleRate: '....',
    grossRate: '...'
  }),
  created: function () {
    //获取门店列表
    this.$ajax.get('dashboard/getStore').then((res)=>{
      var data = res.data.data;
        data.forEach((item,index)=>{
          this.storeName[index] = {label: item[0], value: item[1]}
      })
      console.log('门店',data)
    })
   },
   mounted() {
     this.$ajax.get('dashboard/viewInterfaceE').then((res)=>{
       var data = res.data.data;
        //计划销售的数据
        this.plannedSales = Math.floor(data[0][0] *100)/100
        //实际销售的数据
        this.actualSales = Math.floor(data[0][1] *100)/100
        //销售达成率
        this.saleRate = Math.floor(data[0][2] *100)/100
        //计划毛利的数据
        this.plannedProfit = Math.floor(data[0][3] *100)/100
        //实际毛利的数据
        this.actualProfit = Math.floor(data[0][4] *100)/100
        //毛利达成率
        this.grossRate = Math.floor(data[0][5] *100)/100
       console.log('销售进度的数据',data[0])
       this.chartData()
     })
   },
   methods: {
     chartData() {
       var rocket = 'path://M-244.396,44.399c0,0,0.47-2.931-2.427-6.512c2.819-8.221,3.21-15.709,3.21-15.709s5.795,1.383,5.795,7.325C-237.818,39.679-244.396,44.399-244.396,44.399z M-260.371,40.827c0,0-3.881-12.946-3.881-18.319c0-2.416,0.262-4.566,0.669-6.517h17.684c0.411,1.952,0.675,4.104,0.675,6.519c0,5.291-3.87,18.317-3.87,18.317H-260.371z M-254.745,18.951c-1.99,0-3.603,1.676-3.603,3.744c0,2.068,1.612,3.744,3.603,3.744c1.988,0,3.602-1.676,3.602-3.744S-252.757,18.951-254.745,18.951z  M-255.521,2.228v-5.098h1.402v4.969c1.603,1.213,5.941,5.069,7.901,12.5h-17.05C-261.373,7.373-257.245,3.558-255.521,2.228zM-265.07,44.399c0,0-6.577-4.721-6.577-14.896c0-5.942,5.794-7.325,5.794-7.325s0.393,7.488,3.211,15.708C-265.539,41.469-265.07,44.399-265.07,44.399z M-252.36,45.15l-1.176-1.22L-254.789,48l-1.487-4.069l-1.019,2.116l-1.488-3.826h8.067L-252.36,45.15z';
       var _line = 'path://M0.626,200V0H0.374v200C0.462,200,0.551,200,0.626,200z';
       var v1dom = document.getElementById("main");
       var v1 = echarts.init(v1dom);
       v1.resize();
       //获取数据
       var indicatorData = [
         {
           name: '销售达成率 '+this.saleRate+ '%',
           max: 100
         }, {
           name: '毛利达成率 '+this.grossRate+ '%',
           max: 100
         }];
     var rotate = 45;
     var width = 4;
     var option = {
    // backgroundColor: '#091a2a',
    title: {
        text: this.saleRate,
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'bold',
            color: "#fff",
            fontSize: 70
        },
        zlevel: 21
    },
    tooltip: {},
    xAxis: {
        // max: 1000,
        // min: 0,
        // interval: 100,
        show: false,
        // silent: true
    },
    yAxis: {
        //
        // max: 1000,
        // min: 0,
        // interval: 100,
        show: false,
        // silent: true
    },
    radar: {
        center: ['50%', '50%'],
        indicator: indicatorData,
        radius: '65%',
        splitNumber: 4,
        shape: 'circle',
        name: {
          //雷达的数据的文本样式
            textStyle: {
                color: '#fff',
                fontSize: 12,
                fontFamily: "Microsoft YaHei"
            },
            padding: [2, 2, 2, 2]
        },
        splitLine: {
            lineStyle: {
                color: '#4f8bbe',
                opacity: 0.5,
                type: 'dotted'
            }
        },
        splitArea: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#4f8bbe',
                opacity: 0.5,
                type: 'dotted'
            }
        },
        axisTick: {
            show: true
        },
        axisLabel: {
            show: false,
            formatter: function(value, index) {
                return value;
            }
        },
        zlevel: 20
    },
    series: [
        {
            name: '左下红弧',
            type: 'gauge',
            radius: '99%',
            startAngle: -160,
            endAngle: -170,
            zlevel: 22,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#d70029'],
                        [1, '#d70029']
                    ],
                    width: 4,
                    shadowColor: '#d70029',
                    shadowOffsetX: 0,
                    shadowOffsetY: -12,
                    shadowBlur: 120,
                    opacity: 1,
                }
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        },
        {
            name: '右上红弧',
            type: 'gauge',
            radius: '99%',
            startAngle: -340,
            endAngle: -350,
            zlevel: 22,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#d70029'],
                        [1, '#d70029']
                    ],
                    width: 4,
                    shadowColor: '#d70029',
                    shadowOffsetX: 0,
                    shadowOffsetY: -12,
                    shadowBlur: 120,
                    opacity: 1,
                }

            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        },
        {
            name: '右外圈',
            type: 'gauge',
            radius: '99%',
            startAngle: -320,
            endAngle: -400,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#0e313f'],
                        [0.8, '#0e313f'],
                        [1, '#0e313f']
                    ],
                    width: 4,
                    // shadowColor: '#d70029',
                    shadowOffsetX: 0,
                    shadowOffsetY: -12,
                    shadowBlur: 120,
                    opacity: 1,
                }
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        },
        {
            name: '左外圈',
            type: 'gauge',
            radius: '99%',
            startAngle: -140,
            endAngle: -220,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.2, '#0e313f'],
                        [0.8, '#0e313f'],
                        [1, '#0e313f']
                    ],
                    width: 4,
                    // shadowColor: '#d70029',
                    shadowOffsetX: 0,
                    shadowOffsetY: -12,
                    shadowBlur: 120,
                    opacity: 1,
                }
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        },
        {
            name: '蓝色外圈1',
            type: 'gauge',
            radius: '99%',
            startAngle: -85 + rotate,
            endAngle: -115 + rotate,
            splitNumber: 4,
            axisLine: {
                lineStyle: {
                    color: [
                        [1, '#1e5a67']
                    ],
                    width: width,
                    opacity: 1,
                }

            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        }, {
            name: '蓝色外圈2',
            type: 'gauge',
            radius: '99%',
            startAngle: -155 + rotate,
            endAngle: 175 + rotate,
            splitNumber: 4,
            axisLine: {
                lineStyle: {
                    color: [
                        [1, '#1e5a67']
                    ],
                    width: width,
                    opacity: 1,
                }

            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        }, {
            name: '蓝色外圈3',
            type: 'gauge',
            radius: '99%',
            startAngle: 25 + rotate,
            endAngle: -5 + rotate,
            splitNumber: 4,
            axisLine: {
                lineStyle: {
                    color: [
                        [1, '#1e5a67']
                    ],
                    width: width,


                    opacity: 1,
                }

            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        }, {
            name: '蓝色外圈4',
            type: 'gauge',
            radius: '99%',
            startAngle: 95 + rotate,
            endAngle: 65 + rotate,
            splitNumber: 4,
            axisLine: {

                lineStyle: {
                    color: [
                        [1, '#1e5a67']
                    ],
                    width: width,
                    opacity: 1,
                }

            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            detail: {
                show: false
            }
        },
        {
            type: 'pie',
            radius: ['72%', '92%'],
            label: {
                normal: {
                    position: 'center'
                }
            },
            data: [{
                value: 1000,
                tooltip: {
                    show: false
                },
                //圆环的样式
                itemStyle: {
                    normal: {
                        color: '##1e5a67',
                        opacity: 1
                    }
                }
            }]
        },
        {
            name: '雷达线ALL',
            type: 'radar',
            silent: true,
            lineStyle: {
                normal: {
                    type: 'dotted',
                    color: "#355862",
                    width: 0,
                    opacity: 1,
                }
            },
            data: [
                [100, 100]
            ],
            label: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    opacity: 0,
                }
            },
            areaStyle: {
                normal: {
                    color: '#0d6dba',
                    opacity: 0
                }
            }
        },
        {
            name: '雷达线2',
            type: 'radar',
            silent: true,
            lineStyle: {
                normal: {
                    type: 'dotted',
                    color: "#355862",
                    width: 0,
                    opacity: 0.8,
                }
            },
            data: [
                {
                    name: 'A',
                    value: [90, 90],
                    symbol: 'circle',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.85,
                        }
                    }
                }
            ],
            itemStyle: {
                normal: {
                    opacity: 0
                }
            },
            areaStyle: {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    opacity: 0
                }
            }
        },
        {
            name: '雷达线3',
            type: 'radar',
            silent: true,
            lineStyle: {
                normal: {
                    type: 'dotted',
                    color: "#355862",
                    width: 2,
                    opacity: 0.6,
                }
            },
            data: [
                // [200, 200, 200, 200, 200]
                {
                    name: 'B',
                    value: [80, 80],
                    symbol: 'circle',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.85
                        }
                    }
                }
            ],
            itemStyle: {
                normal: {
                    opacity: 0

                }
            },
            areaStyle: {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    opacity: 0
                }
            }
        },
        {
            name: '雷达线4',
            type: 'radar',
            silent: true,
            lineStyle: {
                normal: {
                    type: 'dotted',
                    color: "#355862",
                    width: 2,
                    opacity: 0.4,

                }
            },
            data: [
                {
                    name: 'B',
                    value: [60, 60],
                    symbol: 'circle',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 1
                        }
                    }
                }
            ],
            itemStyle: {
                normal: {
                    opacity: 0

                }
            },
            areaStyle: {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    opacity: 0
                }
            }
        },
        {
            name: '雷达线5',
            type: 'radar',
            silent: true,
            lineStyle: {
                normal: {
                    type: 'dotted',
                    color: "#355862",
                    width: 2,
                    opacity: 0.2,
                },
            },
            data: [
                {
                    name: 'B',
                    value: [50, 50],
                    symbol: 'circle',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 1
                        }
                    }
                }
            ],
            itemStyle: {
                normal: {
                    opacity: 0

                }
            },
            areaStyle: {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    opacity: 0
                }
            }
        },
        {
            name: '数据显示',
            type: 'radar',
            lineStyle: {
                normal: {
                    width: 0.1,
                    opacity: 0.1
                }
            },
            data: [this.saleRate,this.grossRate],
            symbolSize: 0,
            itemStyle: {
                normal: {
                    borderColor: '#32565f',
                    borderWidth: 4,
                }
            },
            areaStyle: {
                normal: {
                    color: '#ca4a49',
                    opacity: 0.85
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            zlevel: 21
        },
        {
            name: "仪盘表",
            type: "gauge",
            // min: 0,
            // max: 360,
            startAngle: 0,
            endAngle: 15,
            splitNumber: 5,
            radius: '92%',
            // radius: ['72%', '92%'],
            zlevel: 22,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.1, "#d70029"],
                        [1, "#0d2534"]
                    ],
                    // width: 90,
                    opacity: 0
                },
            },
            axisTick: {
                lineStyle: {
                    // color: '#4dfdfe',
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
                        color: '#4dfdfe',
                        offset: 0.9,
                    }, {
                        color: '#143a49',
                        offset: 0.2
                    }]),
                    width: 2,
                    opacity: [
                        [0.1, 1],
                        [0.5, 0.5],
                        [1, 0.1]
                    ]
                },
                length: '22%',
                splitNumber: 2
            },
            pointer: {
                shadowColor: '#fff',
                shadowBlur: 5,
                show: false
            },
            axisLabel: {
                distance: 10,
                textStyle: {
                    color: "#fff"
                },
                show: false,
            },
            splitLine: {
                "show": false
            },
            itemStyle: {
                normal: {
                    color: "#494f50"
                }
            },
            detail: {

                show: false
            }
        },
        {
            name: "仪盘表",
            type: "gauge",
            // min: 0,
            // max: 360,
            startAngle: 180,
            endAngle: 195,
            splitNumber: 5,
            radius: '92%',
            zlevel: 22,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.1, "#d70029"],
                        [1, "#0d2534"]
                    ],
                    // width: 90,
                    opacity: 0
                },
            },
            axisTick: {
                lineStyle: {
                    // color: '#4dfdfe',
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
                        color: '#4dfdfe',
                        offset: 0.9,
                    }, {
                        color: '#143a49',
                        offset: 0.2
                    }]),
                    width: 2,
                    opacity: [
                        [0.1, 1],
                        [0.5, 0.5],
                        [1, 0.1]
                    ]
                },

                length: '22%',
                splitNumber: 2
            },
            pointer: {
                shadowColor: '#fff',
                shadowBlur: 5,
                show: false
            },
            axisLabel: {
                distance: 10,
                textStyle: {
                    color: "#fff"
                },
                show: false,
            },
            splitLine: {
                "show": false
            },
            itemStyle: {
                normal: {
                    color: "#494f50"
                }
            },
            detail: {
                show: false
            }
        }
    ]
};
var wrapperHidth = $('.radarStyle').height();
if (wrapperHidth > 350) {
   option.radar.name.padding = [20,20,20,20];
} else {
   option.radar.name.padding = [2,2,2,2];
}
v1.setOption(option);

function animate() {

    var series1 = option.series[option.series.length - 2];
    // series1.startAngle += 1;
    series1.startAngle = Date.now() * 0.01;
    series1.endAngle = series1.startAngle + 15;

    var series2 = option.series[option.series.length - 1];
    // series2.startAngle += 1;
    series2.startAngle = Date.now() * 0.01 + 180;
    series2.endAngle = series2.startAngle + 15;
    v1.setOption(option);
    requestAnimationFrame(animate)
}
setTimeout(animate, 500)

},
switchStore: function() {
  this.plannedSales = this.actualSales=this.saleRate=this.plannedProfit=this.actualProfit=this.grossRate = '···'
  this.chartData()
  this.$ajax.get('dashboard/viewInterfaceE?num='+ this.storeNum).then((res)=>{
    var data = res.data.data;
    console.log(data)
    if(!data[0]){
      this.plannedSales = this.actualSales=this.saleRate=this.plannedProfit=this.actualProfit=this.grossRate = 0
      console.log(this.plannedSales)
      this.$notify({
          title: '数据为空',
          message: '请选择其他门店',
          type: 'warning',
        })
    }
    if(data[0]){
      //计划销售的数据
      this.plannedSales = Math.floor(data[0][1] *100)/100
      //实际销售的数据
      this.actualSales = Math.floor(data[0][2] *100)/100
      //销售达成率
      this.saleRate = Math.floor(data[0][3] *100)/100
      //计划毛利的数据
      this.plannedProfit = Math.floor(data[0][4] *100)/100
      //实际毛利的数据
      this.actualProfit = Math.floor(data[0][5] *100)/100
      //毛利达成率
      this.grossRate = Math.floor(data[0][6] *100)/100
    }
    this.chartData()
  })
  console.log('门店编码',this.storeNum);
   }
  }
}
</script>
<style lang="scss" >
//更改销售进度的选择框的样式
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
  width: 180px;
}
</style>
