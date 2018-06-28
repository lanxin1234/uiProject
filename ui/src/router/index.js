import Vue from 'vue'
import Router from 'vue-router'
import dashboard from '@/components/dashboard'
import income from '@/components/income'
import topTen from '@/components/topTen'
import top from '@/components/top'
import schedule from '@/components/schedule'
import productTypeStatus from '@/components/productTypeStatus'
import saleStatus from '@/components/saleStatus'
import storeStatus from '@/components/storeStatus'
import dailyOrders from '@/components/dailyOrders'
import salesTrend from '@/components/salestrend'
import orderInfo from '@/components/orderinfo'
import densityMap from '@/components/densitymap'
import disMap from '@/components/disMap'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'top',
      component: top,
      redirect: { name: 'dashboard' },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: dashboard
        },{
          path: 'salesTrend',
          name: 'salesTrend',
          component: salesTrend
        },{
          path: 'orderInfo',
          name: 'orderInfo',
          component: orderInfo
        },{
          path: 'densityMap',
          name: 'densityMap',
          component: densityMap
        },{
          path: 'disMap',
          name: 'disMap',
          component: disMap
        },{
          path: 'income',
          name: 'income',
          component: income
        },{
          path: 'topTen',
          name: 'topTen',
          component: topTen
        },{
          path: 'schedule',
          name: 'schedule',
          component: schedule
        },{
          path: 'productTypeStatus',
          name: 'productTypeStatus',
          component: productTypeStatus
        },{
          path: 'saleStatus',
          name: 'saleStatus',
          component: saleStatus
        },{
          path: 'storeStatus',
          name: 'storeStatus',
          component: storeStatus
        },{
          path: 'dailyOrders',
          name: 'dailyOrders',
          component: dailyOrders
        }
      ]
    }

  ]
})
