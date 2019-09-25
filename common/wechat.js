import request from '@/common/request/request'
var jweixin = require('jweixin-module');

export default {
	isWeixin:() => { //判断是否是微信端
        var ua = navigator.userAgent.toLowerCase();
        var isWX = ua.match(/MicroMessenger/i) == "micromessenger";
        return isWX;
    },
    initJssdk:(callback ,url) => {//初始化sdk配置
		//服务端进行签名
		request.get('http://jsb.fzg360.com/jssdkSign.php', {data: {url:url}}).then(res => {
			//console.log(res.data)
			if(res.data){
				jweixin.config({
				     debug: true, //正式上线后设置为false
				     appId: res.data.appId,
				     timestamp:res.data.timestamp,
				     nonceStr: res.data.nonceStr,
				     signature:res.data.signature,
				     jsApiList: [  
						'checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
				     ]  
				});
				//配置完成后，再执行分享等功能  
				if(callback){
				    callback(res.data);
				}
			}
		}).catch(error => {
			console.error('error:',error);
		});
    },
    share:function(data ,url){//在需要自定义分享的页面中调用
        url = url ? url : encodeURIComponent(window.location.href.split('#')[0]); //encodeURIComponent
        if(!this.isWeixin()){
            return;
        }
		//每次都需要重新初始化配置，才可以进行分享
        this.initJssdk((signData) => {
            jweixin.ready(() => {
                let shareData = {
                     title: data.title,
                     desc: data.desc,
					 imgUrl: data.img,
                     link: data.link,
                     success: (res) => {
                        uni.showToast({title:'分享成功',icon:'none'});
						uni.$emit('shareYes',{type:'weixin'});
                     },
                     cancel: (res) => {
						 uni.showToast({title:'取消分享',icon:'none'});
                     }
                 };
                 //分享给朋友接口  
                 jweixin.onMenuShareAppMessage(shareData);
                 //分享到朋友圈接口  
                 jweixin.onMenuShareTimeline(shareData);
				 //分享到QQ接口
				 jweixin.onMenuShareQQ(shareData);
				 //分享到腾讯微博
				 jweixin.onMenuShareWeibo(shareData);
            });  
        } ,url);  
    }  
}