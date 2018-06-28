<template>
  <div class="dataCenter">
      <div class="">
        <topTen class='commont'></topTen>
        <schedule class='commont'></schedule>
        <!-- <schedule class='commont'></schedule> -->
        <productTypeStatus class='commont'></productTypeStatus>
      </div>
      <div class="bottom">
        <storeStatus class='commont'></storeStatus>
        <saleStatus class='commont'></saleStatus>
        <income class='commont'></income>
      </div>
  </div>
</template>
<script>

import topTen from './topTen'
import schedule from './schedule'
import productTypeStatus from './productTypeStatus'
import storeStatus from './storeStatus'
import saleStatus from './saleStatus'
import income from './income'
export default {
  name: "dataCenter",
  data: () => ({

  }),
  components:{
    'topTen': topTen,
    'schedule': schedule,
    'productTypeStatus': productTypeStatus,
    'income': income,
    'saleStatus': saleStatus,
    'storeStatus': storeStatus
  }
}
</script>
<style lang="scss" scoped>

</style>
