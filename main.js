import Vue from 'vue'
import App from './App'
import store from './store'
import util from '@/common/util'
import request from '@/common/request/request'
import api from '@/common/request/api'
import tool from '@/common/tool'
import {curver} from '@/common/cfgs'
// #ifdef H5
import '@/common/ican-H5Api' //对齐部分H5Api
import wechat from '@/common/wechat'
if(wechat.isWeixin()){
    Vue.prototype.$wechat = wechat;
}
// #endif
Vue.prototype.$api = api
Vue.prototype.$store = store
Vue.prototype.$util = util;
Vue.prototype.$city = util.getCity();
Vue.prototype.$version = curver.val;



// 全局配置
request.setConfig({
	//baseUrl: 'https://'+util.getCity()+'.fzg360.com', // 此为测试地址，需加入到域名白名单，或者更改为您自己的线上地址即可
	// 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
	header: {
		'Accept': '*/*;version='+curver.val,
		'content-type' : 'application/x-www-form-urlencoded'
	}
})
 
// 设置请求拦截器
request.interceptors.request(config => {
	// 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数
	let userInfo = uni.getStorageSync('userInfo') || {};
	config['data'] = config['data'] || {};
	if(userInfo.hash){
		config['data']['hash'] = userInfo.hash;
	}
	return config; // 返回修改后的配置，如未修改也需添加这行
})

// 设置响应拦截器
request.interceptors.response(res => {
	// 接收请求，执行响应操作
	switch(res.statusCode){
		case 200:
			return res; // 原样返回
		break;
		case 401:
			//uni.removeStorageSync('userInfo');
			uni.showToast({title:'该用户无效',icon:'none'});
			store.commit('logout'); //用户无效时注销退出
			return false;
		break;
		case 404:
			uni.showToast({title:'网络异常，请重试',icon:'none'});
			return false;
		break;
	}
	// return false;    // 阻止返回,页面不会接收返回值
	// return {message: '自定义值，来自拦截器'};   // 返回您自定义的值，将覆盖原始返回值
	// return Promise.reject('error from response interceptors') // 向外层抛出错误，用catch捕获
	//return res; // 原样返回
})
//挂载到全局vue实例上，在页面中可以使用this.$request调用request实例下相应方法
Vue.prototype.$http = request;
Vue.prototype.$tool = tool;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
