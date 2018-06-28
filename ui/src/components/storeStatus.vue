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
          this.saleData = [];
          data.forEach((item,index)=>{
              this.saleData[index] = {shop: item[0], count: Math.floor(item[1]/100)/100};
          })
      })
      console.log('门店动态saleData',this.saleData)
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
   .storeStatus fieldset legend{
     // font-size: 1.28rem;
   }
   .storeStatus .commontBoxL .topTab{
     // margin-top: 10px;
     width: 326px;
     text-align: right;
     float: right;
   }
   .storeStatus .commontBoxL  p.toggle{
     font-size: 1rem;
     display: inline-block;
     padding: 4px;
     margin-right: 5%;
     margin-bottom: 20px;
     background: #a3a3a3;
     border-radius: 4px;
     cursor: pointer;
     z-index: 9999;
   }
   .storeStatus .commontBoxL  p.toggle.active{
     background: #22baf1;
   }
   .storeStatus .commontBoxL .list,.title{
     width: 100%;
     line-height: 100%;
     overflow:hidden;
     // border: 1px solid #ddd;
     box-sizing: border-box;
   }
   .storeStatus .commontBoxL .title{
     display: flex;
     font-size: 13px;
     width: 100%;
     float: left;
     border: 1px solid #f2f2f2;
     // border-bottom: none;
   }
   .storeStatus .commontBoxL .title span{
     // display: inline-block;
     padding: 5px;
     box-sizing:border-box;
   }
   .storeStatus .commontBoxL .list span, .title span{
      // width: 35%;
      // float: left;
      text-align: center;
      //文字溢出，溢出部分加点
      text-overflow:ellipsis;
      white-space: nowrap;
      overflow: hidden;

   }
   .storeStatus .commontBoxL .list{
     // background: green;
      // display: flex;
   }
   .storeStatus .commontBoxL .shopActive .shop{
     // width:30%;
   }
   .storeStatus .commontBoxL .list span.shopAdress, .title span.shopAdress{
     flex: 1;
   }
   .storeStatus .commontBoxL .list span.shop, .title span.shop{
     flex: 1;
   }
   .storeStatus .commontBoxL .scrollText .list{
     height: 260px;
   }
   .storeStatus .commontBoxL .list li{
     display: flex;
     height: 26px;
     line-height: 26px;
     min-height: 26px;
     background: #012161;
     text-align: center;
     font-size: 12px;
     border: 1px solid #f2f2f2;
     border-top: none;
     border-bottom: none;
     box-sizing: border-box;
   }
   .storeStatus .commontBoxL .list li span{
     // flex:
   }
   .storeStatus .commontBoxL .list li:last-child{
     border-bottom: 1px solid #f2f2f2;
   }
   .storeStatus .commontBoxL .list li:nth-child(2n){
     background: #2c76b5;
   }
   .storeStatus .el-carousel,.produceDy .el-carousel{
     width: 100%;
     height: 100%;
   }
  .storeStatus .commontBoxL .el-table{
    text-align: center;
  }
  .storeStatus .commontBoxL .el-table .has-gutter th>div.cell{
    text-align: center;
  }
  .el-carousel__item{
    margin-right: 1px;
  }
</style>
