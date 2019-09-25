<template>
	<view class="newsDetail-container" v-if="detailShow">
		<view>
			<view class="detail-adv" v-if="topAds.length" v-for="(item, index) in topAds" :key="index" @tap="openAdDetail(item)">
				<image :src="item.thumb"></image>
			</view>
			<view class="widthMargin detailTit">{{ info.title }}</view>
			<view class="widthMargin detail-origin">
				<text>{{ info.issuedate }}</text>
				<text>来源&nbsp;:&nbsp;{{ info.source ? info.source + ' ' : '' }}{{ info.author }}</text>
			</view>
			<view class="widthMargin detailContent">
				<u-parse class="uParse" v-if="info.content" :content="info.content" @preview="preview" @navigate="navigate" />
			</view>
			<view class="widthMargin readShare-box">
				<view class="readShare1">
					<view class="zanSum" :class="{ 'zanSum-active': zanSumActive }" @click="doAddLikes">
						<view class="zan-icon-box">
							<fzg-icon class="zan-icon" type="dianzan-"></fzg-icon>
						</view>
						<text>{{ info.like_num }}</text>
					</view>
					<view class="readSum">
						<text>阅读</text>
						<text>{{ info.clicks }}</text>
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
			<view class="detail-adv" v-if="relateAds.length" v-for="(item, index) in relateAds" :key="index" @tap="openAdDetail(item)">
				<image :src="item.thumb"></image>
			</view>
			<view class="newsDetail-zgrd-box" v-if="relates.length">
				<view class="zgrd-tit"><text>相关新闻</text></view>
				<view class="zgrd-content">
					<view v-for="item in relates" :key="item.id" @tap="goDetail(item.id)">
						<text>{{ item.title }}</text>
					</view>
				</view>
				<!-- <view class="checkMore" @tap="openMore">查看更多</view> -->
			</view>
			<view class="detail-adv" v-if="recAds.length" v-for="(item, index) in recAds" :key="index" @tap="openAdDetail(item)">
				<image :src="item.thumb"></image>
			</view>
			<view class="newsDetail-zgrd-box" v-if="recommends.length">
				<view class="zgrd-tit"><text>精彩推荐</text></view>
				<view class="zgrd-content">
					<view v-for="item in recommends" :key="item.id" @tap="goDetail(item.id)">
						<text>{{ item.title }}</text>
					</view>
				</view>
				<!-- <view class="checkMore" @tap="openMore">查看更多</view> -->
			</view>
		</view>
		<share-popup :show="show" :shareParams="shareParams" isCallback="1" @hidePopup="closePoP"></share-popup>
		<view class="shareLinkBox" v-if="shareStatus">
			<view class="shareLinkTit">
				<fzg-icon class="shareLinkTitIcon" type="ok"></fzg-icon>
				<text>分享成功</text>
			</view>
			<view class="shareLinkMess">
				<view class="shareLinkMessTit">相关推荐</view>
				<view class="linkMessBox">
					<view class="LinkMess" v-for="item in recommends" :key="item.id" @tap="goDetail(item.id)">
						<fzg-icon class="dotIcon" type="yuan"></fzg-icon>
						<text>{{ item.title }}</text>
					</view>
				</view>
				<view class="moreLink" @tap="openMore">查看更多</view>
				<view class="shareCloseIcon" @tap="closeShare">
					<fzg-icon class="closeIcon" type="close1"></fzg-icon>
				</view>
			</view>
		</view>
		<view class="weicon" v-if="ztArr">
			<view class="ztcon" v-for="(item,index) in ztArr" :key="index" @tap="goWebView(item.title,item.url,index)">
				<image src="http://m.dg.fzg360.com/static/mobile/images/830_top.jpg" mode="widthFix"></image>
				<text>{{item.title}}</text>
			</view>
		</view>
		<view class="detailFoot">
			<view @tap="goWebView('房掌柜APP下载','https://android.myapp.com/myapp/detail.htm?apkName=com.fzg360.app')">
				<image src="http://img.fzg360.com/share/icon/m_app.png" mode="widthFix"></image>
			</view>
			<view @tap="goWebView('掌销宝下载','http://a.app.qq.com/o/simple.jsp?pkgname=com.fzg360.bao')">
				<image src="http://img.fzg360.com/share/icon/m_zxb.png" mode="widthFix"></image>
			</view>
			<view>
				<image src="http://img.fzg360.com/share/icon/m_wei.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui';
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
				type: 'news', //默认是news
				info: {}, //内容
				shareParams: {}, //分享对象
				relates: [], //相关新闻
				recommends: [], //精彩推荐
				ztArr: {}, //专题830
				likeNewsPcIds: [],
				topAds:[],
				relateAds:[],
				recAds:[],
				shareStatus:false,
				site:''
			};
		},
		onLoad(option) {
			this.id = option.id;
			option.type && (this.type = option.type);
			this.site = option.site ? option.site : this.$city;
			this.likeNewsPcIds = uni.getStorageSync('likeNewsPcIds_' + this.site) || [];
			uni.$on('shareYes',(data) => { //监听分享成功事件
				this.shareStatus = true;
			})
			this.getData();
		},
		methods: {
			closePoP() {
				this.show = false;
			},
			sharePo() {
				this.show = true;
			},
			closeShare(){
				this.shareStatus = false;
			},
			openAdDetail(item){
				this.$util.openAdDetail(item.link);
			},
			openMore() {
				uni.switchTab({
					url: '/pages/news/index'
				});
			},
			goWebView(title,url,id){
				if(id){
					url = 'http://m.'+this.site+'.fzg360.com/Zt830/View/id/'+id+'.html';
				}
				uni.navigateTo({
					url:"/pages/index/webView?title="+title+"&url=" + encodeURIComponent(url)
				});
			},
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			},
			goDetail(id) { // @tap="$tool.nav('news/pcDetail?id='+item.id)",小程序会报错
				uni.navigateTo({
					url: './pcDetail?id=' + id+(this.site != this.$city ? '&site='+this.site : '')
				})
			},
			getData() {
				let params = {
					id: this.id,
					type: this.type
				};
				this.$http.get(this.$api.siteApi(this.site, 'newsPcView'), {
					data: params
				}).then(res => {
					if (res.data.code == 0) {
						this.shareParams = {
							title: res.data.data.info.title,
							desc: res.data.data.info.description,
							img: res.data.data.info.thumb,
							link: res.data.data.info.url
						};
						// #ifdef H5
						if (this.$wechat && this.$wechat.isWeixin()) {
							this.shareParams.link = window.location.href;
							this.$wechat.share(this.shareParams);
						}
						// #endif
						this.info = res.data.data.info;
						this.relates = res.data.data.relates;
						this.recommends = res.data.data.recommends;
						//Object.keys(res.data.data.zt830).length && (this.ztArr = Object.values(res.data.data.zt830));
						this.ztArr = res.data.data.zt830;
						this.topAds = res.data.data.topAds;
						this.relateAds = res.data.data.relateAds;
						this.recAds = res.data.data.recAds;
						this.detailShow = true;
						if (this.likeNewsPcIds.includes(this.id)) {
							this.zanSumActive = true;
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				}).catch(error => {
					uni.showToast({
						title: '加载数据失败',
						icon: 'none'
					});
				});
			},
			doAddLikes() {
				if (this.likeNewsPcIds.includes(this.id)) {
					uni.showToast({
						title: '文章已赞',
						icon: 'none'
					});
					return;
				}
				let params = {
					id: this.id
				};
				this.$http.get(this.$api.siteApi(this.site, 'newsPcAddlikes'), {
					data: params
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						this.zanSumActive = true;
						this.info.like_num++;
						this.likeNewsPcIds.push(this.id);
						uni.setStorageSync('likeNewsPcIds_' + this.site, this.likeNewsPcIds);
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				}).catch(error => {
					uni.showToast({
						title: '点赞失败',
						icon: 'none'
					});
				});
			},
			// #ifdef APP-PLUS
			weixinShare(scene) { //微信分享
				uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: this.shareParams.img,
					success: (res) => {
						this.shareStatus = true;
						uni.showToast({
							title: '分享成功',
							icon: 'none'
						});
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
			},
			qqShare() { //qq分享
				uni.share({
					provider: "qq",
					type: 2,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: this.shareParams.img,
					success: (res) => {
						this.shareStatus = true;
						uni.showToast({
							title: '分享成功',
							icon: 'none'
						});
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
			uni.showToast({
				title: '请在手机浏览器中进行分享',
				icon: 'none'
			});
			// #endif
			// #ifdef APP-PLUS
			this.show = true;
			// #endif
		},
		// #endif
		// #ifdef MP
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自右上角分享按钮
				this.shareStatus = true;
			}
			return {
				title: this.shareParams.title,
				path: '/pages/news/pcDetail?id=' + this.id+(this.site != this.$city ? '&site='+this.site : ''),
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

		&>view:nth-of-type(1) {
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

		&>view {
			&>text:nth-of-type(1) {
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
		&>view {
			width: 100%;
			font-size: 32rpx;
			color: #333;
			line-height: 1.8;
			margin-top: 30rpx;

			&>image {
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
			&>view {
				display: inline-block;
			}

			&>view:nth-of-type(3) {
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

	.zgrd-tit {
		background: #f7f7f7;
		padding: 20upx 0;

		text {
			display: block;
			width: 94%;
			margin: 0 auto;
			font-size: 32upx;
			font-weight: bold;
		}
	}

	.zgrd-content {
		&>view {
			border-bottom: 1px solid #e1e1e1;
			padding: 30upx 0;
		}

		& text {
			display: block;
			width: 94%;
			margin: 0 auto;
			font-size: 30upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
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

	.shareLinkBox {
		width: 600rpx;
		position: fixed;
		z-index:999;
		top: 300rpx;
		left: 50%;
		margin-left: -300rpx;
		background: #fff;
		border-radius: 30rpx;
		border: 1px solid #f8f8f8;
		padding-bottom: 30rpx;

		& .shareLinkTit {
			padding: 15rpx 0;
			background: #f7f7f7;
			text-align: center;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;

			& text {
				font-size: 32rpx;
				color: #de2020;
			}
		}

		& .shareLinkMess {
			width: 94%;
			margin: 0 auto;

			& .shareLinkMessTit {
				font-size: 32rpx;
				color: #9e9e9e;
				border-bottom: 1px solid #e4e4e4;
				padding: 10rpx 0;
			}

			& .linkMessBox {
				padding: 10rpx 0 20rpx;
			}
		}

		& .LinkMess {
			font-size: 28rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			padding: 10rpx 0;
		}

		& .moreLink {
			background: #e83836;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			padding: 10rpx 0;
			border-radius: 10rpx;
		}
	}

	.shareLinkTitIcon {
		font-size: 28rpx !important;
		color: #de2020 !important;
		margin-right: 10rpx;
	}

	.dotIcon {
		color: #000 !important;
		font-size: 32rpx !important;
	}

	.shareCloseIcon {
		position: absolute;
		top: -20rpx;
		right: -20rpx;
		width: 80rpx;
		height: 80rpx;
		text-align: center;

		& .closeIcon {
			font-size: 60rpx !important;
			line-height: 80rpx;
		}
	}

	.weicon {
		padding:20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items:center;
		& .ztcon {
			width: 345rpx;
			text-align: center;

			& image {
				display: block;
				width: 345rpx;
			}

			& text {
				font-size: 28rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}
	.detailFoot{
		padding:0rpx 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items:center;
		& image{
			display: block;
			width:240rpx;
		}
	}
	.detail-adv {
		width: 100%;
		height: 120upx;
	
		&>image {
			width: 100%;
			height: 100%;
		}
	}
</style>
