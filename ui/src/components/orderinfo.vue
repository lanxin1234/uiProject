<template>
  <div class="order-info" @dblclick='openOrderInfo'>
    <div>
      <div>
        <h5>订单金额(万元)</h5>
        <h4><strong>{{daySum}}</strong></h4>
        <!-- <div>直营店：{{directSum}} <span>专卖店：{{specialSum}}</span></div> -->
        <div>本月：{{monthSum}} <span>  </span></div>
        <div>本年(千万)：{{yearSum}}</div>
      </div>
      <div class="num">
        <h5>订单数量</h5>
        <h4><strong>{{dayNum}}</strong></h4>
        <!-- <div>直营店：{{directNum}} <span>专卖店：{{specialNum}}</span></div> -->
        <div>本月：{{monthNum}} <span>  </span></div>
        <div>本年(千万)：{{yearNum}}</div>
      </div>
    </div>
    <div>
      <div class="ave-price">
        <h5>客单价</h5>
        <h4><strong>{{dayAve}}</strong></h4>
        <div>本月平均：{{monthAve}}</div>
        <div>本年平均(千万)：{{yearAve}}</div>
      </div>
      <div>
        <h5>线上销售数量</h5>
        <h4><strong>{{daySale}}</strong></h4>
        <!-- <div>直营店：{{directSale}} <span>专卖店：{{specialSale}}</span></div> -->
        <div>本月：{{monthSale}} <span>  </span></div>
        <div>本年(千万)：{{yearSale}}</div>
      </div>
    </div>
    <div>
      <div class="flow">
        <h5>客流量(UV)</h5>
        <h4><strong>{{dayFlow}}</strong></h4>
        <div>本月：{{monthFlow}}</div>
        <div>本年(千万)：{{yearFlow}}</div>
      </div>
      <div class="rate">
        <h5>转化率(%)</h5>
        <h4><strong>{{dayRate}}</strong></h4>
        <div>本月：{{monthRate}}</div>
        <div>本年(千万)：{{yearRate}}</div>
      </div>
    </div>
  </div>
</template>

<script>

import increase from "../assets/increase.png"
import decrease from "../assets/decrease.png"

export default {
  name: 'orderInfo',
  data () {
    return {
      sum: "86.44",
      directSum: "44.44",
      specialSum: "42",
      daySum: "300",
      monthSum: "44621.20",
      yearSum: "315008.48",
      num: "950",
      directNum: "44.44",
      specialNum: "42",
      dayNum: "6754",
      monthNum: "44621.20",
      yearNum: "315008.48",
      avePrice: "909.88",
      dayAve: "894.11",
      monthAve: "894.11",
      yearAve: "889.45",
      sale: "86.44",
      directSale: "44.44",
      specialSale: "42",
      daySale: "44333",
      monthSale: "44621.20",
      yearSale: "315008.48",
      flow: "909.88",
      dayFlow: '88',
      monthFlow: "894.11",
      yearFlow: "889.45",
      rate: "42",
      dayRate: "88",
      monthRate: "44621.20",
      yearRate: "315008.48",
    }
  },
  methods: {
    openOrderInfo: function() {
      this.$router.push({name: 'orderInfo'})
    },
    getInfo: function() {
      this.$ajax.get('dashboard/viewInterfaceA').then((res) => {
        var data = res.data.data
        this.dayNum = this.calcu(data.TotalOrder[0][0])
        this.monthNum = this.calcu(data.TotalOrder[0][1])
        this.yearNum = this.calcu(data.TotalOrder[0][2])
        this.daySum = this.calcu(data.orderAmount[0][0])
        this.monthSum = this.calcu(data.orderAmount[0][1])
        this.yearSum = Math.floor(data.orderAmount[0][2]/10000000 * 100)/100
        this.dayAve = (data.perCustomerTransaction[0][0] == null) ? 0 : this.calcu(data.perCustomerTransaction[0][0])
        this.monthAve = (data.perCustomerTransaction[0][1]== null) ? 0 : this.calcu(data.perCustomerTransaction[0][1])
        this.yearAve = (data.perCustomerTransaction[0][2]== null) ? 0 : this.calcu(data.perCustomerTransaction[0][2])
        this.daySale = this.calcu(data.onlineSales[0][0])
        this.monthSale = this.calcu(data.onlineSales[0][1])
        this.yearSale = Math.floor(data.onlineSales[0][2]/10000000 * 100)/100
        this.dayFlow = this.calcu(data.trafficCounting[0][0])
        this.monthFlow = this.calcu(data.trafficCounting[0][1])
        this.yearFlow = Math.floor(data.trafficCounting[0][2]/10000000 * 100)/100
        this.dayRate = (data.conversionRates[0][0] == null) ? 0 : this.calcu(data.conversionRates[0][0])
        this.monthRate = (data.conversionRates[0][1] == null) ? 0 : this.calcu(data.conversionRates[0][1])
        var x= Math.floor(data.conversionRates[0][2]/10000000 * 100)/100
        this.yearRate = (data.conversionRates[0][2] == null) ? 0 : x
      })
    },
    calcu: function (x){
      var y = Math.floor( x/10000 * 100)/100
      return y
    }
  },
  created: function() {
    this.getInfo()
  }
}
</script>

<style scoped>
</style>
