<template>
	<view class="sharePopup">
		<uni-popup :show="show" position="bottom" @hidePopup="togglePopup()">
			<view class="sharePopupTitle">分享到</view>
			<view class="sharePopupContent">
				<view v-for="(item,index) in shareList" :key="index" @tap="share(item.type)">
					<view :style="'background-color:#'+item.color">
						<fzg-icon :type="item.type" size="30" color="#ffffff"></fzg-icon>
					</view>
					<text>{{item.text}}</text>
				</view>
			</view>
			<view class="sharePopupBtn" @click="togglePopup()">取消分享</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from './uni-popup/uni-popup.vue'
	import fzgIcon from './fzg-icon/index.vue'
	export default{
		props:['show','shareParams','isCallback'],
		data(){
			return{
				shareList:[
					{
						type:"friends",
						text:"微信朋友圈",
						color:"86ce98"
					},
					{
						type:"wechat",
						text:"微信",
						color:"7ab6d2"
					},
					{
						type:"blog",
						text:"微博",
						color:"e1706c"
					},
					{
						type:"qzone",
						text:"QQ空间",
						color:"e9c86b"
					},
					{
						type:"qq",
						text:"QQ好友",
						color:"5d8cc4"
					},
					{
						type:"lianjie",
						text:"复制链接",
						color:"7ab6d2"
					}
				]
			}
		},
		methods:{
			togglePopup() {
				this.$emit('hidePopup')
			},
			share(type){
				switch(type){
					case 'friends':
						this.weixinShare('WXSenceTimeline');
					break;
					case 'wechat':
						this.weixinShare('WXSceneSession');
					break;
					case 'blog':
						this.weiboShare();
					break;
					case 'qzone':
					case 'qq':
						this.qqShare();
					break;
					case 'lianjie':
						this.copyShare();
					break;
				}
			},
			weixinShare(scene){ //微信分享
			    uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: this.shareParams.img,
					success: (res) => {
						//console.log("success:" + JSON.stringify(res));
						if(this.isCallback){
							let params = {type:'weixin'};
							uni.$emit('shareYes',params);
						}else{
							uni.showToast({title:'分享成功',icon:'none'});
						}
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
				this.togglePopup();
			},
			qqShare(){ //qq分享
			    uni.share({
					provider: "qq",
					type: 2,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: this.shareParams.img,
					success: (res) => {
						//console.log("success:" + JSON.stringify(res));
						if(this.isCallback){
							let params = {type:'qq'};
							uni.$emit('shareYes',params);
						}else{
							uni.showToast({title:'分享成功',icon:'none'});
						}
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
				this.togglePopup();
			},
			weiboShare(){ //新浪微博分享,新浪微博仅支持分享本地音视频
			    uni.share({
					provider: "sinaweibo",
					type: 0,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: '../static/logo.png', //{"errMsg":"share:fail:分享图片仅支持本地路径"}
					success: (res) => {
						//console.log("success:" + JSON.stringify(res));
						if(this.isCallback){
							let params = {type:'weibo'};
							uni.$emit('shareYes',params);
						}else{
							uni.showToast({title:'分享成功',icon:'none'});
						}
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
				this.togglePopup();
			},
			copyShare(){
				uni.setClipboardData({
					data:this.shareParams.title + this.shareParams.link,
					success:function(){
						uni.showToast({title:'复制成功',icon:'none'});
					},
					fail:function(err){
						console.log(err);
					}
				})
			}
		},
		components:{
			uniPopup,
			fzgIcon
		}
	}
</script>

<style lang="less" scoped>
	.sharePopup{
		.sharePopupTitle{
			font-size: 30rpx;
			line-height: 80rpx;
			border-bottom: 1px solid #e5e5e5;
		}
		.sharePopupContent{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			width: 700rpx;
			margin: 0 auto;
			line-height: normal;
			padding: 40rpx 0 20rpx 0;
			&>view{
				width: 200rpx;
				margin-bottom: 20rpx;
				&>view{
					width: 100rpx;
					height: 100rpx;
					line-height: 115rpx;
					border-radius: 50%;
					margin: 0 auto;
				}
				&>text{
					font-size: 26rpx;
					color: #3f3f3f;
					display: block;
					margin-top: 20rpx;
				}
			}
		}
		.sharePopupBtn{
			font-size: 30rpx;
			line-height: 80rpx;
			border-top: 1px solid #e5e5e5;
			background-color: #f9f9f9;
		}
	}
</style>
