import Vue from 'vue'

export default {
    getCity:() => { //获取城市
		var city = uni.getStorageSync('city') || 'dg';
		uni.$on('changeCity',data => { //监听选择城市事件
			if(data.city !== city){
				Vue.prototype.$city = city = data.city;
			}
		})
        return city;
    },
	hideTel:(tel) => { //隐藏手机号中间4位
		let reg = /^(\d{3})\d{4}(\d{4})$/;
		tel = tel.replace(reg, "$1****$2");
		return tel;
	},
	doCall:(name,tel) => { //通用拨打电话方法,$util.doCall()
		if(typeof(tel) == 'undefined' || !tel){
			uni.showToast({ title: '暂无联系方式', icon: 'none'});
			return false;
		}
		uni.showModal({
			title: '温馨提示',
			content: '确定拨打'+name+'电话'+tel+'?',
			success: (res) => {
				if (res.confirm) {
					tel = tel.replace(/\s*转\s*/,',');
					tel = tel.replace(/\s*-\s*/g,'');
					uni.makePhoneCall({
						phoneNumber: tel
					});
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	},
	ckLogin:(path,opt) => { //检查是否登录,path为页面路由，opt为操作方法
		let userInfo = uni.getStorageSync('userInfo') || {};
		//console.log(path)
		if(userInfo.hash){
			uni.navigateTo({
				url:path
			})
		}else{
			uni.navigateTo({
				url:'/pages/user/login?path=' + path + (opt ? '&opt=' + opt : '')
			})
		}
	},
	openAdDetail:(link) => { //广告跳转路由
		let site,type,id;
		if(link.match(/([^\.\/]+)\.fzg360\.com\/(\w+)\/[a-z]+\/[a-z]+/i)){
			site = link.match(/([^\.\/]+)\.fzg360\.com\/(\w+)\/[a-z]+\/[a-z]+/i)[1];
			type = link.match(/([^\.\/]+)\.fzg360\.com\/(\w+)\/[a-z]+\/[a-z]+/i)[2];
		}
	    let matches = link.match(/\/(\d+)\.html/);
	    if(matches != null) id = matches[1];
		if(type == 'news'){
			uni.navigateTo({
				url:'/pages/news/pcDetail?id='+id
			})
		}else if(type == 'house'){
			uni.navigateTo({
				url:'/pages/house/home?id='+id+'&site='+site
			})
		}else{
			uni.navigateTo({
				url:'/pages/index/webView?url=' + encodeURIComponent(link)
			});
		}
	}
}