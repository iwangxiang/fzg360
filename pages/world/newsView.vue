<template>
	<view class="newsView">
		<view class="content">
			<view>{{ info.subject }}</view>
			<view>
				<text>{{ info.createdate }}</text>
				<text>来源：{{ info.source }}</text>
			</view>
			<u-parse v-if="info.content" :content="info.content" />
			<view>
				<worldLike :aid="info.aid" :digg="info.digg" active="newsDetail"></worldLike>
				<!-- #ifdef APP-PLUS -->
				<view>
					<text>分享到：</text>
					<view @tap="weixinShare('WXSceneSession')"><fzg-icon type="wechat" size="20" color="#ffffff"></fzg-icon></view>
					<view @tap="qqShare"><fzg-icon type="qq" size="20" color="#ffffff"></fzg-icon></view>
					<view @tap="doPop">. . .</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<view class="banner" v-for="item in advs" :key="item.aid" :row="item"><image @tap="goadv(item)" :src="item.image"></image></view>
		<view class="news">
			<view>
				<text>相关新闻</text>
				<view @tap="newList">
					更多
					<uni-icon class="iUniIcon" type="forward" size="20" color="#919191"></uni-icon>
				</view>
			</view>
			<view>
				<view v-for="item in relarcs" :key="item.aid" :row="item" @tap="goPath(item.aid)">{{ item.subject }}</view>
			</view>
		</view>
		<view class="iLike">
			<view>
				<text>猜你喜欢</text>
				<view @tap="houseList">
					更多
					<uni-icon class="iUniIcon" type="forward" size="20" color="#919191"></uni-icon>
				</view>
			</view>
			<view class="worldList"><world-house v-for="item in house" :key="item.aid" :row="item"></world-house></view>
		</view>
		<share-popup :show="show" :shareParams="shareParams" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
import fzgIcon from '../../components/fzg-icon/index.vue';
import uniIcon from '../../components/uni-icon/uni-icon.vue';
import sharePopup from '../../components/sharePopup.vue';
import worldHouse from '../../components/worldHouse.vue';
import worldLike from '../../components/worldLike.vue';
import uParse from '@/components/gaoyia-parse/parse.vue';
export default {
	onLoad(e) {
		if (!e || !e.aid) {
			uni.navigateBack();
			return;
		}
		this.aid = e.aid;
		this.getData(e.aid);
		// uni.setStorageSync('isDigg', false);
	},
	data() {
		return {
			show: false,
			house: [],
			relarcs: [],
			advs: [],
			info: [],
			aid:0,
			shareParams:{},//分享对象
		};
	},
	components: {
		fzgIcon,
		uniIcon,
		sharePopup,
		worldHouse,
		uParse,
		worldLike //	点赞组件
	},
	methods: {
		getData(aid) {
			let params = { aid: aid };
			this.$http
				.get(this.$api.worldApi('newsDetail'), { data: params })
				.then(res => {
					// console.log(res.data);
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
					this.info = res.data.info;
					this.house = res.data.house;
					this.advs = res.data.advs;
					this.relarcs = res.data.relarcs;
					this.digg = res.data.info.digg;
				})
				.catch(error => {
					uni.showToast({ title: '加载数据失败'});
				});
		},
		goBack() {
			uni.navigateBack();
		},
		closePoP() {
			this.show = false;
		},
		doPop() {
			this.show = true;
		},
		goPath(aid) {
			// console.log(aid);
			uni.navigateTo({
				url: '/pages/world/newsView?aid=' + aid
			});
		},
		goadv: item => {
			uni.navigateTo({
				url: '/pages/index/webView?url=' + encodeURIComponent(item.link) + '&title=' + encodeURIComponent(item.subject)
			});
		},
		newList: () => {
			uni.navigateTo({
				url: '/pages/world/newsList'
			});
		},
		houseList: () => {
			uni.navigateTo({
				url: '/pages/world/houseList'
			});
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
			path: '/pages/world/newsView?aid='+this.aid,
			imageUrl: this.shareParams.img,
			desc: this.shareParams.desc,
		}
	}
	// #endif
};
</script>

<style lang="less" scoped>
.newsView {
	.content {
		padding: 0 20rpx;
		& > view:nth-child(1) {
			font-size: 38rpx;
			color: #383838;
			padding-top: 40rpx;
		}
		& > view:nth-child(2) {
			font-size: 24rpx;
			color: #919191;
			margin: 20rpx 0 50rpx 0;
		}
		& > view:nth-child(3) {
			font-size: 28rpx;
			color: #333333;
			text-align: justify;
			line-height: 200%;
		}
		& > view:nth-child(4) {
			display: flex;
			justify-content: space-between;
			margin-top: 50rpx;
			& > view:nth-child(1) {
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #ef7372;
				border-radius: 10rpx;
				text-align: center;
				color: #ffffff;
				font-size: 26rpx;
				.iFzgIcon {
					margin-right: 10rpx;
				}
			}
			& > view:nth-child(2) {
				font-size: 24rpx;
				color: #333333;
				width: 300rpx;
				height: 60rpx;
				line-height: 60rpx;
				display: flex;
				justify-content: space-between;
				& > view {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					text-align: center;
					line-height: 60rpx;
				}
				& > text:nth-child(1) {
					margin-right: -20rpx;
				}
				& > view:nth-child(2) {
					background-color: #3fb135;
				}
				& > view:nth-child(3) {
					background-color: #4cafea;
				}
				& > view:nth-child(4) {
					background-color: #1e5196;
					color: #ffffff;
					line-height: 40rpx;
					font-size: 28rpx;
				}
			}
		}
	}
	.banner {
		height: 115rpx;
		margin-top: 30rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.news {
		margin-top: 20rpx;
		& > view:nth-child(1) {
			height: 68rpx;
			line-height: 68rpx;
			font-size: 30rpx;
			color: #383838;
			background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
			background-size: 6rpx 36rpx;
			display: flex;
			justify-content: space-between;
			& > text {
				margin-left: 40rpx;
			}
			& > view {
				margin-right: 10rpx;
			}
		}
		& > view:nth-child(2) {
			& > view {
				height: 100rpx;
				line-height: 100rpx;
				padding-left: 16rpx;
				border-bottom: 1px solid #e5e5e5;
				font-size: 28rpx;
				color: #333333;
			}
		}
	}
	.iLike {
		margin-top: 20rpx;
		& > view:nth-child(1) {
			height: 68rpx;
			line-height: 68rpx;
			font-size: 30rpx;
			color: #383838;
			background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
			background-size: 6rpx 36rpx;
			display: flex;
			justify-content: space-between;
			& > text {
				margin-left: 40rpx;
			}
			& > view {
				margin-right: 10rpx;
			}
		}
		.worldList {
			padding: 0 20rpx;
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
	}
}
</style>
