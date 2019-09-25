<template>
	<view class="videoView">
		<view class="content">
			<view>{{ videoData.subject }}</view>
			<view><text>{{ videoData.createdate }}</text> <text>来源</text></view>
			<view>
				<video-view :url="videoData.ypdz" :poster="videoData.thumb" title="掌柜视野"></video-view>
			</view>
			<view>浏览：{{ videoData.clicks }}</view>
		</view>
		<view class="fenxiang">
			<worldLike :aid="videoData.aid" :digg="videoData.digg" active="vdoDetail"></worldLike>
			<!-- #ifdef APP-PLUS -->
			<view>
				<text>分享到：</text>
				<view @tap="weixinShare('WXSceneSession')">
					<fzg-icon type="wechat" size="20" color="#ffffff"></fzg-icon>
				</view>
				<view @tap="qqShare">
					<fzg-icon type="qq" size="20" color="#ffffff"></fzg-icon>
				</view>
				<view @tap="doPop">. . .</view>
			</view>
			<!-- #endif -->
		</view>

		<view class="banner" v-for="(item,index) in adverts" :key="index" @tap="goWebView(item.link)">
			<image :src="item.image"></image>
		</view>
		<view class="hot">
			<view>
				热门视频
			</view>
			<view>
				<view v-for="item in hotVideos" :key="item.aid" @tap="goView(item.aid)">
					<view>
						<image :src="item.thumb"></image>
					</view>
					<view>
						<view>{{ item.subject }}</view>
						<view>
							<fzg-icon color="#333333" type="browse"></fzg-icon>
							<text>{{ item.clicks }}</text>
							<fzg-icon type="time"></fzg-icon>
							<text>{{ item.ctime }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<share-popup :show="show" :shareParams="shareParams" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import sharePopup from "../../components/sharePopup.vue";
	import videoView from "../../components/video.vue";
	import worldLike from '../../components/worldLike.vue';
	export default{
		onLoad(option) {
			if (!option || !option.aid) {
				uni.navigateBack();
				return;
			}
			this.aid = option.aid;
			this.getData(option.aid)
		},		
		data(){
			return{
				show:false,
				aid:'',
				videoData:{},
				hotVideos:[],
				adverts:[],
				shareParams:{},//分享对象
			}
		},
		components:{
			fzgIcon,
			sharePopup,
			videoView,
			worldLike
		},
		methods:{
			goBack(){
				uni.navigateBack();
			},
			closePoP(){
				this.show = false;
			},
			doPop(){
				this.show=true;
			},
			goView(aid){
				uni.navigateTo({
					url:"/pages/world/videoView?aid=" + aid
				});
			},		
			goWebView(link){
				let url = "/pages/index/webView?title=掌柜视野&url=" + encodeURIComponent(link);
				uni.navigateTo({
					url:url
				});
			},										
            getData(aid){ 
				let params = {aid:aid};
            	this.$http.get(this.$api.worldApi('vdoDetail'), {data: params}).then(res => {
					if(res.data.status == 1){
						this.shareParams = {
							title:res.data.info.subject,
							desc:res.data.info.abstract,
							img: res.data.info.thumb,
							link:res.data.info.moburl
						};
						// #ifdef H5
						if (this.$wechat && this.$wechat.isWeixin()) {
							this.shareParams.link = window.location.href;
							this.$wechat.share(this.shareParams);
						}
						// #endif
						this.videoData = res.data.info;
						this.hotVideos = res.data.hvdos;
						this.adverts = res.data.advs;
					}else{
						uni.showToast({title:'加载数据失败'});
					}
            	}).catch(error => {
            		uni.showToast({title:'加载数据失败'});
					uni.navigateBack();
            	})
            },
			// #ifdef APP-PLUS
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
						uni.showToast({title:'分享成功',icon:'none'});
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
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
						uni.showToast({title:'分享成功',icon:'none'});
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
			}
			// #endif
		},
		// #ifdef APP-PLUS || H5
		onNavigationBarButtonTap() {
			// #ifdef H5
			uni.showToast({ title: '请在手机浏览器中进行分享', icon: 'none' });
			// #endif
			// #ifdef APP-PLUS
			this.show = true;
			// #endif
		},
		// #endif
		// #ifdef MP
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自右上角分享按钮
				uni.showToast({title:'分享成功',icon:'none'});
			}
			return {
				title: this.shareParams.title,
				path: '/pages/world/videoView?aid='+this.aid,
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		}
		// #endif
	}
</script>

<style lang="less" scoped>
	.videoView{
		.content{
			&>view:nth-child(1){
				padding: 20rpx 0 0 20rpx;
				font-size: 30rpx;
				color: #333333;
			}
			&>view:nth-child(2){
				font-size: 24rpx;
				color: #a9a9a9;
				padding: 10rpx 0 0 20rpx;
			}
			&>view:nth-child(3){
				height: 500rpx;
				margin-top: 20rpx;
				video{
					width: 100%;
					height: 100%;
				}
				image{
					width: 100%;
					height: 100%;
				}
			}
			&>view:nth-child(4){
				font-size: 26rpx;
				color: #3f3f3f;
				text-align: right;
				padding: 20rpx 20rpx 0 0;
			}
		}
		.fenxiang{
			display: flex;
			justify-content: space-between;
			margin-top: 50rpx;
			padding: 0 20rpx;
			&>view:nth-child(1){
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #EF7372;
				border-radius: 10rpx;
				text-align: center;
				color: #ffffff;
				font-size: 26rpx;
				.iFzgIcon{
					margin-right: 10rpx;
				}
			}
			&>view:nth-child(2){
				font-size: 24rpx;
				color: #333333;
				width: 300rpx;
				height: 60rpx;
				line-height: 60rpx;
				display: flex;
				justify-content: space-between;
				&>view{
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					text-align: center;
					line-height: 60rpx;
				}
				&>text:nth-child(1){
					margin-right: -20rpx;
				}
				&>view:nth-child(2){
					background-color: #3FB135;
				}
				&>view:nth-child(3){
					background-color: #4CAFEA;
				}
				&>view:nth-child(4){
					background-color: #1e5196;
					color: #ffffff;
					line-height: 40rpx;
					font-size: 28rpx;
				}
			}
		}
		.banner{
			height: 115rpx;
			margin-top: 30rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.hot{
			&>view:nth-child(1){
				height: 60rpx;
				line-height: 60rpx;
				padding-left: 20rpx;
				background-color: #f8f8f8;
				font-size: 30rpx;
				border-bottom: 1px solid #e5e5e5;
			}
			&>view:nth-child(2){
				&>view{
					display: flex;
					justify-content: space-between;
					border-bottom: 1px solid #e5e5e5;
					padding: 20rpx;
					&>view:nth-child(1){
						width: 250rpx;
						height: 180rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					&>view:nth-child(2){
						flex: 1;
						margin-left: 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						&>view:nth-child(1){
							font-size: 30rpx;
							color: #383838;
							word-break:break-all;
							display:-webkit-box;
							-webkit-line-clamp:2;
							-webkit-box-orient:vertical;
							overflow:hidden; 
						}
						&>view:nth-child(2){
							&>text:nth-child(2),&>text:nth-child(4){
								font-size: 26rpx;
								color: #999999;
								margin:0 20rpx 0 10rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
