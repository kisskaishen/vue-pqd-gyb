import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import $ from 'jquery'

import {get, post, upload, baseUrl} from './config/api'
import {setCookie, getCookie, clearCookie} from './config/util'

import Util from './config/util'
Vue.use(Util)

Vue.use(ElementUI, { size: 'small' });

Vue.prototype.$setCookie = setCookie
Vue.prototype.$getCookie = getCookie
Vue.prototype.$clearCookie = clearCookie

Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$upload = upload


new Vue({
    el: '#app',
    router,
    // store,
    components: {App},
    template: '<App/>'
})
