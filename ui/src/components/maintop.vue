<template>
  <div class="maintop">
    <orderInfo></orderInfo>
    <densityMap></densityMap>
    <!-- <distributionMap /> -->
    <!-- <disMap /> -->
    <salesTrend></salesTrend>
  </div>
</template>
<script>

import orderInfo from "./orderinfo"
import densityMap from "./densitymap"
// import distributionMap from "./distributionMap"
import disMap from "./disMap"
import salesTrend from "./salestrend"

export default {
  name: "maintop",
  components: { orderInfo, densityMap, salesTrend},
  data: () => ({
     data: 1
  })
}
</script>
<style lang="scss" scoped>
  .maintop{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .maintop>div{
    // flex: 1;
    // width: 400px;
    text-align: center;
  }

</style>
