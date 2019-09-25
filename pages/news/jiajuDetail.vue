<template>
	<view class="newsDetail-container" v-if="detailShow">
		<view>
			<view class="widthMargin detailTit">{{ info.title }}</view>
			<view class="widthMargin detail-origin">
				<text>{{ info.createdate }}</text>
				<text>来源&nbsp;:&nbsp;{{ info.source ? info.source + ' ' : '' }}{{ info.author }}</text>
			</view>
			<view class="widthMargin detailContent">
				<u-parse class="uParse" v-if="info.content" :content="info.content" @preview="preview" @navigate="navigate" />
			</view>
			<view class="widthMargin readShare-box">
				<view class="readShare1">
					<view class="zanSum" :class="{ 'zanSum-active': zanSumActive }" @click="doAddLikes">
						<view class="zan-icon-box"><fzg-icon class="zan-icon" type="dianzan-"></fzg-icon></view>
						<text>{{ info.likes }}</text>
					</view>
					<view class="readSum">
						<text>阅读</text>
						<text>{{ info.hits }}</text>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="readShare2">
					<view>分享到：</view>
					<view class="wechatIcon" @tap="weixinShare('WXSceneSession')">
						<fzg-icon class="shareIconf" type="wechat"></fzg-icon>
					</view>
					<view class="friendIcon" @tap="weixinShare('WXSenceTimeline')">
						<fzg-icon class="shareIconf" type="friends"></fzg-icon>
					</view>
					<view class="qqIcon" @tap="qqShare">
						<fzg-icon class="shareIconf" type="qq"></fzg-icon>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<share-popup :show="show" :shareParams="shareParams" @hidePopup="closePoP"></share-popup>
	</view>
</template>
<script>
import { uniIcon} from '@dcloudio/uni-ui';
import fzgIcon from '@/components/fzg-icon/index';
import sharePopup from '@/components/sharePopup.vue';
import uParse from '@/components/gaoyia-parse/parse.vue';
export default {
	components: {
		uniIcon,
		fzgIcon,
		sharePopup,
		uParse
	},
	data() {
		return {
			zanSumActive: false,
			commentBtnActive: false,
			detailShow:false,
			show: false,
			id: '',
			info: {}, //内容
			shareParams:{},//分享对象
		};
	},
	onLoad(option) {
		if(!option || !option.id){
			uni.navigateBack();
			return;
		}
		this.id = option.id;
		this.getData();
	},
	methods: {
		closePoP() {
			this.show = false;
		},
		sharePo() {
			this.show = true;
		},
		preview(src, e) {
			// do something
		},
		navigate(href, e) {
			// do something
		},
		getData() {
			let params = { id: this.id };
			this.$http
				.get(this.$api.siteApi(this.$city, 'furnitureView'), { data: params })
				.then(res => {
					if (res.data.code == 0) {
						this.shareParams = {
							title:res.data.data.title,
							desc:res.data.data.abstract,
							img: res.data.data.thumb,
							link:res.data.data.url
						};
						// #ifdef H5
						if (this.$wechat && this.$wechat.isWeixin()) {
							this.shareParams.link = window.location.href;
							this.$wechat.share(this.shareParams);
						}
						// #endif
						this.info = res.data.data;
						this.detailShow = true;
						let likeFurnitureIds = uni.getStorageSync('likeFurnitureIds') || [];
						if (likeFurnitureIds.includes(this.id)) {
							this.zanSumActive = true;
						}
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none'});
					}
				})
				.catch(error => {
					uni.showToast({ title: '加载数据失败', icon: 'none'});
				});
		},
		doAddLikes() {
			let likeFurnitureIds = uni.getStorageSync('likeFurnitureIds') || [];
			if (likeFurnitureIds.includes(this.id)) {
				uni.showToast({ title: '文章已赞', icon: 'none' });
				return;
			}
			let params = { id: this.id };
			this.$http
				.get(this.$api.siteApi(this.$city, 'furnitureAddlikes'), { data: params })
				.then(res => {
					if (res.data.code == 0) {
						uni.showToast({ title: res.data.msg, icon: 'none' });
						this.zanSumActive = true;
						this.info.likes++;
						likeFurnitureIds.push(this.id);
						uni.setStorageSync('likeFurnitureIds', likeFurnitureIds);
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none' });
					}
				})
				.catch(error => {
					uni.showToast({ title: '点赞失败', icon: 'none' });
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
			uni.showToast({ title: '分享成功', icon: 'none' });
		}
		return {
			title: this.shareParams.title,
			path: '/pages/news/jiajuDetail?id='+this.id,
			imageUrl: this.shareParams.img,
			desc: this.shareParams.desc,
		}
	}
	// #endif
};
</script>

<style lang="less">
.newsDetail-container {
	/* padding-bottom: 116rpx; */
}
.diflex {
	display: flex;
	display: -webkit-flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-content: center;
}
.widthMargin {
	width: 94%;
	margin: 0 auto;
}
.detailTit {
	font-size: 36rpx;
	font-weight: bold;
	line-height: 1.4;
	margin-top: 50rpx;
}
.detail-origin text {
	font-size: 26rpx;
	color: #919191;
	margin-right: 25rpx;
	line-height: 1;
}
.detailContact {
	margin-top: 30rpx;
	.diflex();
	align-items: center;
	& > view:nth-of-type(1) {
		.diflex();
		justify-content: flex-start;
		align-items: center;
	}
}
.detailContact-head {
	width: 85rpx;
	height: 85rpx;
	border-radius: 50%;
	margin-right: 30rpx;
	& image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
.detailContact-head-mess {
	font-size: 28rpx;
	color: #888;
	line-height: 1.5;
	& > view {
		& > text:nth-of-type(1) {
			margin-right: 10rpx;
		}
	}
}
.detailContact-btn {
	font-size: 28rpx;
	display: inline-block;
	padding: 10rpx 20rpx;
	background: #e83836;
	border-radius: 10rpx;
	-webkit-border-radius: 10rpx;
	color: #fff;
}
.detailContent {
	& > view {
		width: 100%;
		font-size: 32rpx;
		color: #333;
		line-height: 1.8;
		margin-top: 30rpx;
		& > image {
			width: 100%;
		}
	}
}
.readShare-box {
	.diflex();
	margin: 30rpx auto;
	& .readShare1 view {
		display: inline-block;
	}
	& .readShare2 {
		& > view {
			display: inline-block;
		}
		& > view:nth-of-type(3) {
			margin: 0 10rpx;
		}
	}
}
.shareIconf {
	font-size: 36rpx !important;
	color: #fff !important;
}
.shareIcons {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	line-height: 66rpx;
	text-align: center;
}
.wechatIcon {
	background: #29d150;
	.shareIcons();
}
.friendIcon {
	background: #4eb575;
	.shareIcons();
}
.qqIcon {
	background: #20b1ec;
	.shareIcons();
}

.zanSum {
	color: #e83836;
	font-size: 28rpx;
	& .zan-icon-box {
		background: #e83836;
		width: 55rpx;
		height: 55rpx;
		line-height: 49rpx;
		text-align: center;
		border-radius: 50%;
		-webkit-border-radius: 50%;
		margin-right: 10rpx;
		.zan-icon {
			color: #fff !important;
			font-size: 28rpx !important;
		}
	}
}
.zanSum-active {
	& .zan-icon:before {
		content: '\e6bf';
	}
}
.readSum {
	margin-left: 20rpx;
	text {
		font-size: 30rpx;
		color: #a7a7a7;
		margin: 0 5rpx;
	}
}
.readShare2 {
	font-size: 28rpx;
	line-height: 60rpx;
}

.shoucang-active {
	& .shoucangBtn {
		color: #e83836 !important;
	}
	& .shoucangBtn:before {
		content: '\e6c6';
	}
}
.uParse {
	font-size: 16px;
	color: #333;
	line-height: 1.8;
	margin-top: 15px;
}
</style>
