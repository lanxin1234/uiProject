<template>
  <div class="saleStatus" @dblclick='opensaleStatus'>
    <fieldset class='commontBoxL'>
       <legend class='textL'>商品销售动态</legend>
       <div class="topTab">
         <p :class='[titleClass, {active: active == index}]'
            v-for='(item, index) in tabs'
            @click='toggle(index)'
            @dblclick='openDia(index)'>
           {{item}}
         </p>
         <el-dialog
           :title='titleDia'
           :visible.sync="dialogVisible"
            width="60%"
           :before-close="handleClose">
           <el-table
               :data="tablesData"
               stripe
               border
               height='600px'
               style="width: 100%"
               :highlight-current-row='true'>
               <el-table-column
                 　:prop="columnOne"
                 　:label="columnOneLabel">
               </el-table-column>
               <el-table-column
                 　:prop="columnTwo"
                 　:label="columnTwoLabel"
                 　width='200px'>
               </el-table-column>
               <el-table-column
                 　:prop="columnThree"
                 　:label="columnThreeLabel">
               </el-table-column>
               <el-table-column
                 　:prop="columnFour"
                 　:label="columnFourLabel">
               </el-table-column>
             </el-table>
         </el-dialog>
       </div>
       <!-- interval的值是调节轮播图自动切换的时间，单位是毫秒 -->
         <el-carousel trigger="click" indicator-position='none' :interval='8000' @change='change' ref='carousel' arrow="never">
           <el-carousel-item class='proCarous'>
             <p class='title'>
               <span class='shop'>商品编码</span>
               <span class='shopAdress'>商品名称</span>
               <span class='shopAdress'>销售收入(万)</span>
               <span class='shopAdress'>销售毛利(万)</span>
             </p>
             <div id="scrollDivNew">
               <div class="scrollText">
                 <ul class="list">
                   <li v-for='(item,index) in newProduces'>
                     <span class='shop'>{{item.num}}</span>
                     <span class='shopAdress'>{{item.name}}</span>
                     <span class='shopAdress'>{{item.count}}</span>
                     <span class='shopAdress'>{{item.profit}}</span>
                   </li>
                 </ul>
               </div>
             </div>
             <div class="data-empty" v-if='news'>数据正在准备中···</div>
           </el-carousel-item>
           <el-carousel-item class='proCarous'>
             <p class='title'>
              <span class='shop'>排名</span>
              <span class='shop'>商品编码</span>
              <span class='shopAdress'>商品名称</span>
              <span class='shopAdress'>销售收入(万)</span>
             </p>
             <div id="scrollDivSell">
               <div class="scrollText">
                    <ul class="list">
                     <li v-for='(item,index) in sellBetters'>
                       <span class='shop'>{{item.rank}}</span>
                       <span class='shop'>{{item.num}}</span>
                       <span class='shopAdress'>{{item.name}}</span>
                       <span class='shopAdress'>{{item.count}}</span>
                     </li>
                 </ul>
               </div>
             </div>
             <div class="data-empty" v-if='sell'>数据正在准备中···</div>
           </el-carousel-item>
           <el-carousel-item class='proCarous'>
             <p class='title'>
              <span class='shop'>排名</span>
              <span class='shop'>商品编码</span>
              <span class='shopAdress'>商品名称</span>
              <span class='shopAdress'>销售收入(元)</span>
            </p>
             <div id="scrollDivUnsold">
               <div class="scrollText">
                    <ul class="list">
                     <li v-for='(item,index) in unSoldGoods'>
                       <span class='shop'>{{item.rank}}</span>
                       <span class='shop'>{{item.num}}</span>
                       <span class='shopAdress'>{{item.name}}</span>
                       <span class='shop'>{{item.count}}</span>
                     </li>
                 </ul>
               </div>
             </div>
             <div class="data-empty" v-if='unSold'>数据正在准备中···</div>
           </el-carousel-item>
       </el-carousel>
    </fieldset>
  </div>
</template>
<script>
export default {
  name: "saleStatus",
  data: () => ({
    //是否有新品
    news: true,
    //是否有畅销品
    sell: true,
    //是否有滞销品
    unSold: true,
    tablesData: [],
    columnOne: '',
    columnOneLabel: '',
    columnTwo: '',
    columnTwoLabel: '',
    columnThree: '',
    columnThreeLabel: '',
    columnFour : '',
    columnFourLabel: '',
    titleDia: '',
    dialogVisible: false,
    titleClass: 'tab',
    active: '0',
    tabs:['新品','畅销品','滞销品']
  }),
  created() {
    this.newProduces = []
    this.sellBetters = []
    this.unSoldGoods = []
     this.getData()
     // setInterval(()=>{
     //   this.getData()
     // },600000)
  },
  mounted() {
    this.$nextTick(function () {
        if(this.newProduces.length > 10){
          //line的值是调节文本向上滚动的条数
          $("#scrollDivNew").textSlider({line:4,speed:3000,countr:5000});
        }
        if(this.sellBetters.length > 6){
          $("#scrollDivSell").textSlider({line:4,speed:3000,countr:5000});
        }
        if(this.unSoldGoods.length > 6){
          $("#scrollDivUnsold").textSlider({line:4,speed:3000,countr:5000});
        }
     })
  },
  methods: {
    getData () {
      this.$ajax.get('dashboard/viewInterfaceH').then((res)=>{
        var data = res.data.data;
        //新品的数据
        data.newProductsDynamic.forEach((item,index)=>{
          this.newProduces[index] = {num: item[0],name: item[1],count:Math.floor(item[2]*100)/100,profit: Math.floor(item[3]/100)/100};
        })
        if(!data.newProductsDynamic[0]){
            this.news = true;
            // this.tabs = ['畅销品','滞销品'];
        }else{
          this.news = false;
          // this.tabs = ['新品','畅销品','滞销品'];
        }
        //畅销品的数据
        data.sellingProductsDynamic.forEach((item,index)=>{
          this.sellBetters[index] = {rank:item[3], num:item[0], name:item[1],count: Math.floor(item[2] / 100)/100};
        })
        if(!data.sellingProductsDynamic[0]){
            this.sell = true;
            // this.tabs = ['畅销品','滞销品'];
        }else{
          this.sell = false;
          // this.tabs = ['新品','畅销品','滞销品'];
        }
        //滞销品的数据
        data.unsalableProductsDynamic.forEach((item,index)=>{
          this.unSoldGoods[index] = {rank:item[3], num:item[0], name:item[1],count: Math.floor(item[2] * 100)/100};
        })
        if(!data.unsalableProductsDynamic[0]){
            this.unSold = true;
        }else{
          this.unSold = false;
        }
        console.log('商品销售动态的数据',data)
      })
    },
    toggle (index) {
      this.$refs.carousel.setActiveItem(index)
       this.active = index;
    },
    change (callback) {
      this.active = callback;
    },
    opensaleStatus () {
      this.$router.push({name: 'saleStatus'});
    },
    zoomOut () {
      this.$nextTick(function(){
        var wrapperWidth = $('.saleStatus').width();
        if(wrapperWidth > 600){
           // $('.saleStatus .proCarous').height('500px')
        }
      })
    },
    openDia(index) {
      this.dialogVisible = true
      if( index == 1 ){
        this.tablesData = this.sellBetters
        this. titleDia = '畅销品'
      }
      if (index == 2 ){
       this.tablesData = this.unSoldGoods
       this. titleDia = '滞销品'
      }
      if(index == 0){
        this.tablesData = this.newProduces;
        this.columnOne = 'num';
        this.columnOneLabel = '商品编码';
        this.columnTwo = 'name'
        this.columnTwoLabel = '商品名称'
        this.columnThree = 'count'
        this.columnThreeLabel = '销售收入'
        this.columnFour = 'profit'
        this.columnFourLabel = '销售毛利'
        this. titleDia = '新品'
      }
      if(index == 1){
        this.columnOne = 'rank';
        this.columnOneLabel = '排名';
        this.columnTwo = 'num'
        this.columnTwoLabel = '商品编码'
        this.columnThree = 'name'
        this.columnThreeLabel = '商品名称'
        this.columnFour = 'count'
        this.columnFourLabel = '销售收入(单位:万元)'
      }
       if(index == 2){
        this.columnOne = 'rank';
        this.columnOneLabel = '排名';
        this.columnTwo = 'num'
        this.columnTwoLabel = '商品编码'
        this.columnThree = 'name'
        this.columnThreeLabel = '商品名称'
        this.columnFour = 'count'
        this.columnFourLabel = '销售收入(单位:元)'
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
