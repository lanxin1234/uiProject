<template>
  <div class="dashboard">
    <div class="content">
      <maintop></maintop>
      <dataCenter></dataCenter>
    </div>
  </div>
</template>
<script>

import top from './top'
import maintop from './maintop'
import dataCenter from './dataCenter'

export default {
  name: "dashboard",
  data: () => ({
    msg: 'shuju'
  }),
  components: {
    'top': top,
    'maintop': maintop,
    'dataCenter': dataCenter
  }
}
</script>
<style lang="scss" scoped>
</style>
