<template>
  <div class="schedule"  @dblclick='openSchedule'>
    <div class="wapper">
      <saleProgress></saleProgress>
    </div>
  </div>
</template>
<script>

import saleProgress from './saleProgress'
export default {
  name: "schedule",
  data: () => ({

  }),
  components: {
    'saleProgress': saleProgress,
  },
  methods: {
    openSchedule() {
       this.$router.push({name: 'schedule'})
    }
  }
}
</script>
<style lang="scss" scoped>
    .schedule .wapper{
      width: 100%;
      height: 100%;
      display: flex;
    }
    .schedule .clear{
      width: 100%;
      float: left;
    }
</style>
