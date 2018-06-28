// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import VueAMap from 'vue-amap';
import quickMenu from 'vue-quick-menu'
import Vebar from 'v-charts/lib/bar.js'
import Veline from 'v-charts/lib/line.js'
import Vehistogram from 'v-charts/lib/histogram.js'
import Vegauge from 'v-charts/lib/gauge.js'
import Vering from 'v-charts/lib/ring.js'
import Vepie from 'v-charts/lib/pie.js'
import Vechart from 'v-charts/lib/chart.js'
import jQuery from '../static/jQuery.js'
//文字向上滚动插件
import jQueryTextSlider from '../static/jQuery.textSlider.js'
import { Notification } from 'element-ui';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import './style/reset.css'
import 'v-charts/lib/style.css'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markArea'

Vue.use(VueAMap);
Vue.use(ElementUI);
Vue.use(jQuery)
Vue.config.productionTip = false
Vue.component(Vebar.name, Vebar)
Vue.component(Vehistogram.name, Vehistogram)
Vue.component(Vegauge.name,Vegauge)
Vue.component(Vering.name,Vering)
Vue.component(Vepie.name,Vepie)
Vue.component(Vechart.name,Vechart)
Vue.component(Veline.name,Veline)

VueAMap.initAMapApiLoader({
  key: '812bec1376a6b352d65623aa2de728b2',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

// axios.defaults.baseURL = 'http://118.89.230.78:9081/api/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:3000/api/v1/'

// axios.defaults.headers.common['tokenId'] = sessionStorage.tokenId
axios.defaults.headers.common['Content-Type'] = 'application/json'

Vue.prototype.$ajax = axios
Vue.prototype.qs = qs
Vue.prototype.$notify = Notification

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
