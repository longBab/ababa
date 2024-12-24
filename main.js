import Vue from 'vue';
import App from './App';
import conf from './conf/config.js';
import store from './store';

import vc from './core/vcFramework.js'
// 小程序全局分享设置
// import share from './common/mixin/shareMixin.js'
// Vue.mixin(share)

Vue.config.productionTip = false;
// Vue.prototype.baseUrl = 'https://m-b2b2c.pickmall.cn';
// Vue.prototype.baseUrl = 'http://192.168.10.70:8080';
Vue.prototype.baseUrl = 'https://shop.myxy.ltd';



Vue.prototype.vc = vc;  
Vue.prototype.imgUrl = conf.imgUrl;
App.mpType = 'app';

const app = new Vue({
    ...App,
    store
});
app.$mount();



