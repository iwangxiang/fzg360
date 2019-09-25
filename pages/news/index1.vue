<template>
	<view class="newsContainer">
		<view class="news-search-box">
			<view class="news-search">
				<view class="searchCity" @tap="changCity">
					<text>{{city}}</text>
					<fzg-icon class="searchCityIcon" type="open"></fzg-icon>
				</view>
				<view class="search-input-box">
					<view>
						<fzg-icon class="searchIcon" type="bsearch"></fzg-icon>
					</view>
					<view class="search-input" @tap="goPath({type:'search'})">
						<input type="text" placeholder="请输入新闻关键词" placeholder-style="color:#b3b6be" disabled="true"/>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab swiperbg-box" scroll-x :scroll-into-view="scrollInto">
				<view v-for="(tab, index) in tabBars" :key="tab.id" :id="'tab'+index" class="swiper-tab-list">
					<text :class="tabIndex == index ? 'active' : ''" :id="'news_' + tab.id" :data-current="index" :data-type="tab.type"
					 :data-catid="tab.catid" @click="tapTab">
						{{ tab.name }}
					</text>
				</view>
			</scroll-view>
			<scroll-view class="list" scroll-y :scroll-with-animation="true" @scrolltolower="loadMore(tabIndex)" v-if="show">
				<view v-for="(tab, index) in tabBars" :key="index">
					<swiper v-if="catid == 3 && tab.catid == 3 && sliderList.length" class="banner-swiper" duration="300" autoplay="true"
					 interval="3500" circular="true">
						<block v-for="slider in sliderList" :key="slider.id">
							<swiper-item>
								<view @tap="goPath({type:'advert', link:slider.link})">
									<image :src="slider.thumb" mode="widthFix"></image>
									<view class="swiper-text" v-if="slider.title">
										<text>{{ slider.title }}</text>
									</view>
								</view>
							</swiper-item>
						</block>
					</swiper>
					<view class="newsContentBox" v-if="index == tabIndex">
						<view v-if="tabBars[tabIndex].data.length">
							<view v-for="(item, iindex) in tabBars[tabIndex].data" :key="iindex">
								<news-lists v-if="item.recommend" :item="item" :type="tab.type" @click="goPath"></news-lists>
								<view v-else-if="item.video_url">
									<!--视频-->
									<!-- 深圳视频开头 -->
									<view class="playBack-box" v-if="tab.type == 'video' && $city == 'sz'">
										<view class="playBack-head" v-if="heraldCount > 0 && iindex == 0" @tap="goPath({type:'dsfc',title:livingData.title,url:livingData.jumpurl})">
											<view class="playBack-head1">直播预告</view>
											<view class="playBack-head2">
												<text class="playBack-tit-name">{{livingData.title}}</text>
												<view class="playBack-tit-time">
													<text class="titTimefont">开播时间：</text>
													<text class="titTimefont timeMonth">{{livingData.begindate}}</text></view>
											</view>
										</view>
										<view class="nowPlayBox" v-if="livingCount > 0 && iindex == 0" @tap="goPath({type:'dsfc',title:livingData.title,url:livingData.jumpurl})">
											<image class="nowPlayImage" :src="livingData.thumb ? livingData.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
											<view class="nowPlayExplainBox">
												<text class="nowPlayExplain1">{{livingData.title}}</text>
												<view class="nowPlayExplain2">
													<text class="explainW">有</text><text class="nowPlaySum">{{livingData.hits}}</text><text class="explainW">人正在观看直播</text>
												</view>
											</view>
											<image class="nowPlayBtn" src="../../static/play.png" mode="aspectFit"></image>
											<view class="nowPlaylogo"><text class="nowPlayLogoFont">正在直播</text></view>
										</view>
										<view class="playBack-tit-box" v-if="iindex == 0">
											<text class="playBackTit">精彩回放</text>
											<view class="titLine titLeftLine"></view>
											<view class="titLine titRightLine"></view>
										</view>
										<view class="playBackContent-box" @tap="goPath({type:'dsfc',title:item.title,url:item.jumpurl})">
											<view class="playBackContent">
												<view class="playBackContent-img">
													<image class="playBackContentImage" :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
													<image class="playBackContentImageIcon" src="../../static/playback.png"></image>
												</view>
												<view class="playBackMess">
													<text class="playBackMessTxt">{{item.title}}</text>
													<view class="playBackMessTimeSum">
														<text class="playBackMessTime">{{item.begindate}}</text>
														<text class="playBackMessSum">{{item.hits}}人观看</text>
													</view>
												</view>
											</view>
										</view>
									</view>
									<!-- 深圳视频结束 -->
									<view class="newsContent newsContent3" v-else @tap="goPath({type:'video', id:item.id})">
										<view class="newsContent-tit">
											<text>{{ item.title }}</text>
										</view>
										<view class="newsContent3-img" @tap.stop="goWebView('视频',item.video_url)">
											<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
											<view class="video-play-btn">
												<image src="../../static/play.png"></image>
											</view>
										</view>
										<view class="newsContent-txt">
											<view class="newsContent-txt1">
												<view>
													<fzg-icon class="browse-icon" type="yuedushu-"></fzg-icon>
													<text>{{ item.clicks }}</text>
												</view>
												<!-- <view>
													<fzg-icon class="coin-icon" type="coin"></fzg-icon>
													<text>{{ item.compoint }}积分</text>
												</view> -->
												<text>{{ item.createdate }}</text>
											</view>
											<!-- <view class="newsContent-txt2">
												<text>{{ item.createdate }}</text>
											</view> -->
										</view>
									</view>
								</view>
								<view v-else-if="tab.type == 'appnews'" @tap="goPath({type:'advert', link:item.link})">
									<!--广告-->
									<!--横幅广告-->
									<view class="column-adv" v-if="item.catalog == 1">
										<image :src="item.thumb"></image>
										<view class="close-adv" @tap.stop="closeAd(index,iindex)">关闭</view>
									</view>
									<!--小图广告-->
									<view class="newsContent-adv1" v-else-if="item.catalog == 2">
										<view class="newsContent newsContent1 newsContentadv1">
											<view class="newsContent1-box">
												<view class="newsContent-tit">
													<text>{{ item.title }}</text>
												</view>
												<view class="newsContentadv1-txt">
													<text>广告</text>
													<!-- <text>房产</text> -->
												</view>
											</view>
											<view class="newsContent1-img">
												<image :src="item.thumb"></image>
											</view>
										</view>
									</view>
									<!--大图广告-->
									<view class="newsContent-adv1 newsContent-adv2" v-else-if="item.catalog == 3">
										<view class="newsContent newsContent3 newsContentadv1">
											<view class="newsContent-tit">
												<text>{{ item.title }}</text>
											</view>
											<view class="newsContent3-img">
												<image :src="item.thumb"></image>
												<view class="close-adv1" @tap.stop="closeAd(index,iindex)"><text>关闭</text></view>
											</view>
											<view class="newsContent-txt newsContentadv2-txt">
												<view class="newsContent-txt1 newsContentadv1-txt">
													<text>广告</text>
													<!-- <text>房产</text> -->
												</view>
												<navigator url="">
													<view class="newsContent-txt2"><text>了解详情 &gt;&gt;</text></view>
												</navigator>
											</view>
										</view>
									</view>
									<!--视频广告-->
									<view class="newsContent-adv1 newsContent-adv3" v-else>
										<view class="newsContent newsContent3 newsContentadv1">
											<view class="newsContent-tit">
												<text>{{ item.title }}</text>
											</view>
											<view class="newsContent3-img">
												<image :src="item.thumb"></image>
												<view class="video-play-btn">
													<image src="../../static/play.png"></image>
												</view>
												<view class="close-adv1" @tap.stop="closeAd(index,iindex)"><text>关闭</text></view>
											</view>
											<view class="newsContent-txt newsContentadv2-txt">
												<view class="newsContent-txt1 newsContentadv1-txt">
													<text>广告</text>
													<!-- <text>房产</text> -->
												</view>
												<navigator url="">
													<view class="newsContent-txt2"><text>了解详情 &gt;&gt;</text></view>
												</navigator>
											</view>
										</view>
									</view>
								</view>
							</view>
							<uni-load-more :status="tabIndexArr[index].status" :content-text="contentText" />
						</view>
						<no-content v-else></no-content>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	import {
		uniIcon,
		uniLoadMore
	} from '@dcloudio/uni-ui';
	import fzgIcon from '@/components/fzg-icon/index';
	import newsLists from '../../components/newsLists.vue'
	import noContent from '../../components/noContent.vue'
	export default {
		components: {
			uniIcon,
			fzgIcon,
			newsLists,
			uniLoadMore,
			noContent
		},
		data() {
			return {
				city: '城市',
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [], //分类导航
				sliderList: [], //幻灯片
				listData: [], //列表数据
				livingCount: 0,
				livingData: {},
				heraldCount: 0,
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				type: '', //加载类型
				catid: '', //类型id
				tabIndexArr: [],
				show: false,
				scrollInto: ''
			};
		},
		onLoad() {
			this.initCity();
			this.getNewsCatalog();
		},
		onPullDownRefresh() {
			this.tabIndexArr[this.tabIndex].reload = true;
			this.tabIndexArr[this.tabIndex].page = 1;
			this.getData(this.type, this.catid, this.tabIndex);
		},
		onReachBottom() {
			if (this.tabIndexArr[this.tabIndex].status == 'noMore') return;
			this.tabIndexArr[this.tabIndex].status = 'more';
			this.getData(this.type, this.catid, this.tabIndex);
		},
		methods: {
			changCity() {
				uni.navigateTo({
					url: '/pages/index/city?type=news'
				});
			},
			setCity(name) {
				this.city = name;
			},
			initCity() {
				let cityStorage = uni.getStorageSync('cityName');
				if (cityStorage) this.setCity(cityStorage);
			},
			goPath(e) {
				switch (e.type) {
					case 'search':
						uni.navigateTo({
							url: '/pages/index/search?type=0'
						});
						break;
					case 'appnews':
						if (e.sid) {
							this.goWebView(e.title, e.url);
						} else {
							uni.navigateTo({
								url: './detail?id=' + e.id
							});
						}
						break;
					case 'live':
						uni.navigateTo({
							url: './liveDetail?id=' + e.id
						});
						break;
					case 'video':
						uni.navigateTo({
							url: './videoDetail?id=' + e.id
						});
						break;
					case 'pcnews':
						uni.navigateTo({
							url: './pcDetail?id=' + e.id
						});
						break;
					case 'finance':
						uni.navigateTo({
							url: './pcDetail?type=' + e.type + '&id=' + e.id
						});
						break;
					case 'topic':
						this.goWebView(e.title, e.url);
						break;
					case 'dsfc':
						//let url = 'http://news.fzg360.com/dsfc/detail/id/'+item.id+'.html?inWebView=1';
						this.goWebView(e.title, e.url); //服务端接口设置跳转链接
						/*uni.navigateTo({
			            url: './dsfcDetail?id=' + item.id
					});*/
						break;
					case 'advert':
						this.$util.openAdDetail(e.link);
						break;
				}
			},
			goWebView(title, url) {
				uni.navigateTo({
					url: "/pages/index/webView?title=" + title + "&url=" + encodeURIComponent(url)
				});
			},
			closeAd(index1, index2) {
				uni.showModal({
					content: '是否关闭本条广告？',
					success: (res) => {
						if (res.confirm) {
							this.listData[index1].data.splice(index2, 1);
						}
					}
				})
			},
			loadMore(tabIndex) {
				if (this.tabIndexArr[tabIndex].status == 'noMore') return;
				this.tabIndexArr[tabIndex].status = 'more';
				this.getData(this.type, this.catid, tabIndex);
			},
			async tapTab(e) {
				//点击顶部分类切换
				this.type = e.target.dataset.type;
				this.catid = e.target.dataset.catid;
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return;
				}
				if (!this.listData[tabIndex]['data'].length && this.tabIndexArr[tabIndex].status !== 'noMore') {
					this.show = false;
					this.getData(this.type, this.catid, tabIndex);
				}
				//this.scrollLeft = (tabIndex - 1) * 75;
				this.isClickChange = true;
				this.tabIndex = tabIndex;
				this.scrollInto = 'tab' + (tabIndex - 2 > 0 ? tabIndex - 2 : 0);
			},
			getNewsCatalog() {
				this.$http
					.get(this.$api.siteApi(this.$city, 'newsCatalog'))
					.then(res => {
						let data = res.data.data,
							financeIndex, type, catid;
						data.map((item, index) => {
							if (item.type == 'finance') {
								financeIndex = index;
								type = item.type;
								catid = item.catid;
							}
							this.tabIndexArr.push({
								page: 1,
								status: 'loading',
								reload: false
							});
							let aryItem = {
								name: item.name,
								data: [],
								catid: item.catid,
								type: item.type
							};
							this.listData.push(aryItem);
						})
						this.tabBars = this.listData;
						data.forEach((item, index) => {
							if (index == 0) {
								this.type = item.type;
								this.catid = item.catid;
								this.getData(item.type, item.catid, 0);
							}
						})
						setTimeout(() => {
							let financeIndexStorage = uni.getStorageSync('financeIndex') || '';
							if (financeIndexStorage) {
								this.tapTab({
									target: {
										dataset: {
											current: financeIndex,
											type: type,
											catid: catid
										}
									}
								});
								uni.removeStorageSync('financeIndex');
							}
						}, 500)
					})
					.catch(error => {
						console.error('error:', error);
					});
			},
			getData(type, catid, tabIndex) {
				let requestObj = {
					appnews: 'newsCatidList',
					video: 'videoList',
					live: 'liveList',
					topic: 'topicList',
					pcnews: 'newsPcList',
					finance: 'financeList'
				};
				if (this.$city == 'sz') requestObj['video'] = 'dsfcList';
				let params = {
					catid: catid,
					page: this.tabIndexArr[tabIndex].page
				};
				this.listData[tabIndex]['data'].length && (this.tabIndexArr[tabIndex].status = 'loading');
				if (this.tabIndexArr[tabIndex].page == 1) {
					uni.showLoading({
						title: '加载中'
					});
				}
				this.$http
					.get(this.$api.siteApi(this.$city, requestObj[type]), {
						data: params
					})
					.then(res => {
						if (this.tabIndexArr[tabIndex].page == 1) {
							uni.hideLoading();
							if (res.data.data.slides) this.sliderList = res.data.data.slides;
							if (requestObj['video'] == 'dsfcList') { //深圳都市房产
								this.livingCount = res.data.data.livingCount;
								this.heraldCount = res.data.data.herald;
								if (res.data.data.living) this.livingData = res.data.data.living;
							}
						}
						this.tabIndexArr[tabIndex].reload && uni.stopPullDownRefresh();
						let list = res.data.data.lists;
						this.listData[tabIndex]['data'] = this.tabIndexArr[tabIndex].reload ? list : this.listData[tabIndex]['data'].concat(
							list);
						this.tabBars = this.listData;
						//console.log(this.tabBars)
						this.show = true;
						if (this.listData[tabIndex].data.length >= res.data.data.total) this.tabIndexArr[tabIndex].status = 'noMore';
						++this.tabIndexArr[tabIndex].page;
						this.tabIndexArr[tabIndex].reload = false;
					})
					.catch(error => {
						uni.showToast({
							title: '加载数据失败'
						});
					});
			}
		}
	};
</script>

<style lang="less">
	@import '../../common/uni.css';

	page {
		height: 100%;
		font-size: 28upx;
	}

	.newsContainer {
		height: 94%;
	}

	.diflex {
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-content: center;
	}

	.news-search-box {
		background: #f9f9f9;
		padding: 15upx 0 0;

		& .news-search {
			width: 90%;
			margin: 0 auto;
			box-sizing: border-box;
			background: #e9e9e9;
			border-radius: 8upx;
			-webkit-border-radius: 8upx;
			padding: 5upx 0;
			.diflex();
			justify-content: flex-start;
			align-items: center;

			& .searchCity {
				width: 180upx;
				height: 40upx;
				line-height: 40upx;
				text-align: center;
				border-right: 1px solid #e5e5e5;

				& text {
					font-size: 28upx;
				}

				& .searchCityIcon {
					font-size: 24upx !important;
					vertical-align: -3upx;
					margin-left: 10upx;
					color: #848484 !important;
				}
			}

			& .search-input-box {
				width: 100%;
				.diflex();
				margin-left: 30upx;

				& .searchIcon {
					font-size: 36upx !important;
					vertical-align: -8upx;
					color: #999 !important;
				}

				& .search-input {
					width: 100%;
					margin: 0 10upx 0 15upx;

					& input {
						width: 100%;
						padding: 5upx 0;
						font-size: 28upx;
					}
				}
			}
		}
	}

	.uni-tab-bar .list {
		width: 100%;
		height: 90%;
	}

	.swiperbg-box {
		background: #f9f9f9;
	}

	.uni-swiper-tab {
		border-bottom: none;

		& .swiper-tab-list {
			font-size: 32upx;
			color: #999a9a;
			width: auto;
			margin: 0 40upx;
		}

		& .active {
			color: #2d2d2d;
			font-weight: bold;
			padding-bottom: 20upx;
			border-bottom: 6upx solid #e83836;
		}
	}

	.banner-swiper {
		& swiper-item {
			width: 100%;
			height: 360upx;
			position: relative;

			& image {
				width: 100%;
				height: 100%;
			}

			& .swiper-text {
				position: absolute;
				bottom: 0;
				left: 0;
				display: block;
				width: 100%;
				background: rgba(0, 0, 0, 0.6);

				& text {
					display: block;
					width: 94%;
					margin: 0 auto;
					color: #fff;
					height: 50upx;
					line-height: 50upx;
					font-size: 24upx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
			}
		}
	}

	/* .newsContent1 {
	.diflex();
	width: 100%;
	& .newsContent1-box {
		width: 70%;
		display: flex;
		diplay: -webkit-flex;
		flex-direction: column;
		justify-content: space-between;
	}
	& .newsContent1-img {
		width: 26%;
		height: 138upx;
		overflow: hidden;
		& > image {
			width: 100%;
			height: 100%;
		}
	}
} */
	.newsContent {
		width: 94%;
		margin: 0 auto;
		padding: 30upx 0;
		border-bottom: 1px solid #e5e5e5;

		& .newsContent-tit {
			font-size: 34upx;
			line-height: 1.5;
			color: #3f3f3f;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		& .newsContent-txt {
			font-size: 24upx;
			color: #999;
			.diflex();

			& .newsContent-txt1>view {
				display: inline-block;

				.browse-icon,
				.coin-icon {
					color: #999 !important;
					font-size: 26upx !important;
					vertical-align: 2upx;
					margin-right: 10upx;
				}

				& text {
					margin-right: 20upx;
				}
			}
		}
	}

	.newsContent2 {
		& .newsContent2-img {
			.diflex();
			padding: 20upx 0;

			&>view {
				width: 32%;
				height: 165upx;
				overflow: hidden;

				&>image {
					width: 100%;
					height: 100%;
				}
			}

			&>view:nth-of-type(2) {
				margin: 0 2%;
			}
		}
	}

	.newsContent3 {
		& .newsContent3-img {
			width: 100%;
			height: 360upx;
			padding: 20upx 0;
			position: relative;

			&>image {
				width: 100%;
				height: 100%;
			}

			& .video-play-btn {
				position: absolute;
				top: 50%;
				margin-top: -54upx;
				left: 50%;
				margin-left: -54upx;
				width: 108upx;
				height: 108upx;

				&>image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.column-adv {
		padding: 16upx 0;
		background: #f7f7f7;
		width: 100%;
		height: 120upx;
		position: relative;

		&>image {
			width: 100%;
			height: 100%;
		}

		&>.close-adv {
			position: absolute;
			top: 30upx;
			right: 3%;
			color: #fff;
			border: 1px solid #fff;
			padding: 5upx 10upx;
			border-radius: 6upx;
			-webkit-border-radius: 6upx;
			font-size: 24upx;
			line-height: 1;
		}
	}

	.newsContent-adv1 {
		background: #f7f7f7;

		& .newsContentadv1 {
			border-bottom: none;

			& .newsContentadv1-txt text:nth-of-type(1) {
				font-size: 24upx;
				line-height: 1;
				border: 1px solid #b6b6b6;
				padding: 0upx 10upx;
				border-radius: 6upx;
				-webkit-border-radius: 6upx;
				color: #b6b6b6;
				background: #fff;
			}

			& .newsContentadv1-txt text:nth-of-type(2) {
				font-size: 24upx;
				line-height: 1;
				color: #a1a1a1;
				margin-left: 15upx;
			}
		}
	}

	.newsContent-adv2 {
		& .newsContent3-img {
			position: reltive;
		}

		& .close-adv1 {
			font-size: 24upx;
			color: #fff;
			line-height: 1;
			padding: 5upx 10upx;
			border: 1px solid #fff;
			border-radius: 6upx;
			-webkit-border-radius: 6upx;
			position: absolute;
			top: 40upx;
			right: 3%;
		}
	}

	.newsContent-adv3 {
		& .newsContent {
			width: 100%;
		}

		& .close-adv1 {
			font-size: 24upx;
			color: #fff;
			line-height: 1;
			padding: 5upx 10upx;
			border: 1px solid #fff;
			border-radius: 6upx;
			-webkit-border-radius: 6upx;
			position: absolute;
			top: 40upx;
			right: 3%;
		}

		& .newsContent3-img {
			width: 100%;
			height: 360upx;
		}

		& .newsContent-tit,
		& .newsContent-txt {
			width: 94%;
			margin: 0 auto;
		}
	}

	.nowPlayBox {
		position: relative;
		margin-bottom: 30upx;
	}

	.nowPlayImage {
		width: 750upx;
		height: 480upx;
	}

	.nowPlayExplainBox {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 750upx;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 15upx 0;
	}

	.nowPlayExplain1 {
		font-size: 32upx;
		color: #fff;
		padding: 0 20upx;
		overflow: hidden;
		text-overflow: ellipsis;
		/* #ifndef APP-PLUS */
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		/* #endif */
		lines: 1;
	}

	.nowPlayExplain2 {
		flex-direction: row;
		padding: 0 20upx;
		overflow: hidden;
		text-overflow: ellipsis;
		/* #ifndef APP-PLUS */
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		/* #endif */
		lines: 1;
		margin-top: 5upx;
	}

	.explainW {
		font-size: 32upx;
		color: #fff;
	}

	.nowPlaySum {
		font-size: 32upx;
		color: #e83836;
		font-weight: 700;
		margin: 0 10upx;
	}

	.nowPlayBtn {
		width: 108upx;
		height: 108upx;
		position: absolute;
		top: 180upx;
		left: 321upx;
	}

	.nowPlaylogo {
		position: absolute;
		top: 30upx;
		left: 30upx;
	}

	.nowPlayLogoFont {
		font-size: 28upx;
		color: #e83836;
		border-width: 1px;
		border-style: solid;
		border-color: #e83836;
		border-radius: 30upx;
		width: 170upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
		background-color: #fff;
	}

	.playBack-head {
		padding: 30upx 50upx;
		flex-direction: row;
		align-items: center;
	}

	.playBack-head1 {
		font-size: 40upx;
		width: 90upx;
		text-align: center;
		margin-right: 20upx;
	}

	.playBack-head2 {
		width: 540upx;
	}

	.playBack-tit-name {
		font-size: 32upx;
		overflow: hidden;
		text-overflow: ellipsis;
		/* #ifndef APP-PLUS */
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		/* #endif */
		lines: 1;
	}

	.playBack-tit-time {
		flex-direction: row;
		margin-top: 10upx;
	}

	.titTimefont {
		font-size: 28upx;
	}

	.timeMonth {
		margin: 0 10upx;
	}

	.playBack-tit-box {
		position: relative;
		margin: 0 0 20upx;
	}

	.playBackTit {
		display: block;
		font-size: 36upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}

	.titLine {
		width: 230upx;
		height: 2upx;
		background-color: #e6e6e6;
		position: absolute;
		top: 30upx;
	}

	.titLeftLine {
		left: 40upx;
	}

	.titRightLine {
		right: 40upx;
	}

	.playBackContent {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 0 20upx;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #e4e4e4;
		padding: 30upx 0;
	}

	.playBackContent-img {
		position: relative;
		width: 190upx;
		height: 136upx;
	}

	.playBackContentImage {
		width: 190upx;
		height: 136upx;
	}

	.playBackContentImageIcon {
		position: absolute;
		top: 10upx;
		right: 5upx;
		width: 76upx;
		height: 34upx;
	}

	.playBackMess {
		width: 500upx;
		height: 150upx;
		margin-left: 30upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.playBackMessTxt {
		font-size: 32upx;
		color: #3f3f3f;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.playBackMessTimeSum {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.playBackMessTime {
		width: 300upx;
		font-size: 24upx;
		color: #999;
		margin-right: 30upx;
	}

	.playBackMessSum {
		width: 200upx;
		text-align: right;
		font-size: 24upx;
		color: #999;
	}
</style>
