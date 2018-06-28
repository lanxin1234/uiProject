<template>
    <div class="outWapper">
      <div class="top">
        <header>
          <router-link :to="{ name: 'dashboard' }"><h1 class='logo'>世纪易联</h1></router-link>
           <carousel></carousel>
           <div class="menu">
             <el-menu
             class="el-menu-demo"
             mode="horizontal"
             :router='false'
             @select="handleSelect"
             background-color="#363636"
             text-color='#3aafd3'
             active-text-color='#fff'>
               <el-submenu index="2">
                  <template slot="title" class="menu">
                    <i class="el-icon-menu"></i>
                  </template>
                  <el-menu-item index='2-1'>
                    <router-link :to="{ name: 'dashboard' }">统计</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-2'>
                    <router-link :to="{ name: 'orderInfo' }">销售详情</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-2'>
                    <router-link :to="{ name: 'densityMap' }">门店订单地图分布</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-2'>
                    <router-link :to="{ name: 'salesTrend' }">实时销售趋势对比</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-3'>
                    <router-link :to="{ name: 'topTen' }">直营店销售TOP</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-4'>
                    <router-link :to="{ name: 'schedule' }">销售进度</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-5'>
                    <router-link :to="{ name: 'productTypeStatus' }">品类销售动态</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-6'>
                    <router-link :to="{ name: 'saleStatus' }">商品销售动态</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-7'>
                    <router-link :to="{ name: 'storeStatus' }">门店动态</router-link>
                  </el-menu-item>
                  <el-menu-item index='2-8'>
                    <router-link :to="{ name: 'income' }">收入成本与毛利</router-link>
                  </el-menu-item>
               </el-submenu>
             </el-menu>
           </div>
        </header>
    </div>
    <transition name="fade" mode='out-in'>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>

import carousel from './carousel'

export default {
  name: "top",
  components: { carousel},
  data: () => ({
    activeIndex: '1',
    activeIndex2: '1'
  }),
  methods:{
    handleSelect(key, keyPath) {
        // console.log(key, keyPath);
    }
  }
}
</script>
<style lang="scss" scoped>
 .top{
   position: absolute;
   z-index: 9;
   color: #fff;
 }
 .top header .menu{
   height: 40px;
   position: absolute;
   right: 0px;
   top: 50%;
   transform: translate(-50%,-50%);
 }
 .el-menu{
   height: 40px;
 }
 .el-menu-item a{
   display: inline-block;
   width: 100%;
   color: #3aafd3;
 }
 //菜单栏中选中的文字的颜色
 .el-menu-item a.router-link-active{
   color:#ccc;
 }
</style>
