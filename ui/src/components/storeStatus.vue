<template>
  <div class="storeStatus" @dblclick='openstoreStatus'>
    <fieldset class='commontBoxL'>
       <legend class='textL'>门店动态</legend>
       <div class="topTab">
         <p :class='[titleClass, {active: active == index}]'
            v-for='(item, index) in tabs'
            @click='toggle(index)'
            @dblclick='zoom(index)'>
           {{item}}
         </p>
           <el-dialog
             :title='title'
             :visible.sync="dialogVisible"
              width="60%"
             :before-close="handleClose">
             <el-table
                 :data="tablesData"
                 stripe
                 border
                 height='600px'
                 style="width: 100%"
                 :highlight-current-row='true'
                 :row-class-name="tableRowClassName">
                 <el-table-column
                   prop="shop"
                   label="门店"
                   >
                 </el-table-column>
                 <el-table-column
                   prop="count"
                   label="销售收入">
                 </el-table-column>
               </el-table>
           </el-dialog>
       </div>
       <el-carousel indicator-position='none' :interval='30000' @change='change' ref='shopCarousel' arrow="never">
       <el-carousel-item class='shopCarous' >
         <div class="newShop">
            <p class='title'>
             <span class='shopAdress'>门店</span>
             <span class='shop'>销售收入(万)</span>
           </p>
           <div id="scrollDivShop">
             <div class="scrollText">
                  <ul class="list">
                   <li v-for='(item,index) in saleData'>
                     <span class='shopAdress'>{{item.shop}}</span>
                     <span class='shop'>{{item.count}}</span>
                   </li>
               </ul>
             </div>
           </div>
           <div class="data-empty" v-if='unSaleData'>数据正在准备中···</div>
          </div>
        </el-carousel-item>
        </el-carousel>
    </fieldset>
  </div>
</template>
<script>
export default {
  name: "storeStatus",
  data: () => ({
    unSaleData: false,
    bigWidth: false,
    dialogVisible: false,
    tablesData: [],
    title: '门店销售',
    active: '0',
    titleClass: 'toggle',
    tabs:['门店销售'],
    saleData : []
  }),
  created() {
    //获取门店的销售数据
    this.getData()
    // setInterval(()=>{
    //   this.getData()
    // },600000)
  },
  mounted() {
    this.$nextTick(function () {
        if(this.saleData.length > 10){
          $("#scrollDivShop").textSlider({line:3,speed:800,timer:1000});
        }
        var carouselWidth = $('.shopCarous').width();
        $('.shopCarous').addClass('is-animating')
        $('.shopCarous').eq(0).css('transform','translateX('+0+'px)')
        $('.shopCarous').eq(1).css('transform','translateX('+carouselWidth+'px)')

        //当切换到大图表的时候，更改图表的高度
        var wrapperWidth = $(".storeStatus").width();
        if (wrapperWidth > 1000) {
          this.bigWidth = true;
          $(' .shopCarous ').height('520px');
          $(' .storeStatus .commontBoxL .list').css({'height':'520px','mix-height': '520px'});
          $('.storeStatus .el-carousel').height('520px');
        } else {
          this.bigWidth = false;
          $(' .shopCarous ').height('300px');
          $(' .storeStatus .commontBoxL .list').css({'height':'260px','mix-height': '300px'});
          $('.storeStatus .el-carousel').height('300px');
        }
    })
  },
  methods: {
    getData () {
      this.$ajax.get('dashboard/viewInterfaceG').then((res)=>{
        var data = res.data.data;
        console.log('门店动态的数据',res.data.data)
          if(!data[0]){
              this.unSaleData = true
          }
          this.saleData = {};
          data.forEach((item,index)=>{
              this.saleData[index] = {shop: item[0], count: Math.floor(item[1]/100)/100};
          })
          this.tablesData = this.saleData
      })
    },
    toggle (index) {
      this.active = index;
      this.$refs.shopCarousel.setActiveItem(index)
    },
    change (callback) {
      this.active = callback
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex == 0) {
          return 'warning-row';
        } else if (rowIndex == 2) {
          return 'success-row';
        }
        return '';
    },
    zoom(index) {
      this.dialogVisible = true
    },
    openstoreStatus() {
      this.$router.push({name: 'storeStatus'})
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
