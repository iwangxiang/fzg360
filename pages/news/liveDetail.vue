<template>
	<view v-if="detailShow">
		<view class="liveTimage" v-if="info.playStatusOrg == 'start'">
			<video :src="sourceUrl" controls="true" :poster="info.thumb_cover ? info.thumb_cover : 'https://static.fzg360.com/images/app/nopic.gif'" autoplay="true" danmu-btn="true" enable-danmu="true" objectFit="fill"></video>
		</view>
		<view v-else>
			<view v-if="videos.length">
				<view class="liveTimage">
					<video :src="topVideo" :poster="info.thumb_cover ? info.thumb_cover : 'https://static.fzg360.com/images/app/nopic.gif'" controls="true" autoplay="true" danmu-btn="true" enable-danmu="true" objectFit="fill"></video>
				</view>
				<scroll-view scroll-x="true" scroll-left="" class="liveSc-box">
					<view class="video_nav" v-for="(item,index) in videos" :key="index" :data-video="item.video" @tap="changeVideo">
						<text>{{item.title}}</text>
						<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
					</view>
				</scroll-view>
			</view>
			<view class="liveTimage" v-else><image mode="widthFix" :src="info.thumb_banner ? info.thumb_banner : 'https://static.fzg360.com/images/app/nopic.gif'"></image></view>
		</view>
		<view class="liveT-h1">
			<view :class="{ tapClass: liveTabSc }" @tap="liveTapSc">现场直击</view>
			<view v-if="info.flow" :class="{ tapClass: liveTabAc }" @tap="liveTapAc">活动流程</view>
		</view>
		<!--现场直击-->
		<view :class="{liveHide:liveHidSc}">
			<view class="liveIntro">
				<view class="liveIn-h1">{{info.title}}</view>
				<view class="writer">房掌柜采编中心 / {{info.clicks}}人观看</view>
				<view class="live_introduction" v-if="info.content">
					<u-parse v-if="info.content" :content="info.content" @preview="preview" @navigate="navigate" />
				</view>
			</view>
			<view class="liveMore" v-if="listData.length">
				<view v-for="(item,index) in listData" :key="index">
					<view class="monickerbox ">
						<view class="line_bg"><view class="line_black"></view></view>
						<view class="line_tit">{{item.spokesman}}</view>
						<view class="line_time">{{item.publish_time}}</view>
					</view>
					<view class="liveMain" v-if="item.content">
						<u-parse class="p" :content="item.content" @preview="preview" @navigate="navigate" />
					</view>
				</view>
			</view>
			<!-- <view class="loadmore">↻ 点击查看更多</view> -->
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<!--活动流程-->
		<view v-if="info.flow" :class="{liveHide:liveHidAc}">
			<view class="liveIntro">
				<view class="live_introduction">
					<u-parse v-if="info.flow" :content="info.flow" @preview="preview" @navigate="navigate" />
				</view>
			</view>
		</view>

		<!-- loadmoreNull -->
		<view class="appIocn">
			<view @tap="goWebView('房掌柜APP下载','https://android.myapp.com/myapp/detail.htm?apkName=com.fzg360.app')">
				<image mode="widthFix" src="http://img.fzg360.com/share/icon/m_app.png"></image>
			</view>
			<view @tap="goWebView('掌销宝下载','http://a.app.qq.com/o/simple.jsp?pkgname=com.fzg360.bao')">
				<image mode="widthFix" src="http://img.fzg360.com/share/icon/m_zxb.png"></image>
			</view>
			<view><image mode="widthFix" src="http://img.fzg360.com/share/icon/m_wei.png"></image></view>
		</view>
		<view class="footText">房掌柜（FZG360.com）版权所有</view>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default {
		data() {
			return {
				liveTabSc: true,
				liveTabAc: false,
				liveHidSc:false,
				liveHidAc:true,
				detailShow:false,
				id:'',
				info:{},
				videos:[],
				sourceUrl:'',
				topVideo:'',
				concernFzgids:[],
				isConcerned:false,
				listData: [], //列表数据
				reload: false, //重新加载标志
				status: 'more', //加载的状态
				contentText: { //加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				page:1 ,//页数
			};
		},
		components:{
			uniLoadMore,
			uParse
		},
		onLoad(option) {
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			this.getData();
		},
		onReachBottom() {
			if(this.status == 'noMore') return;
			this.status = 'more';
			this.getData();
		},
		methods: {
			liveTapSc() {
				(this.liveTabAc = false), (this.liveTabSc = true),(this.liveHidSc=false),(this.liveHidAc=true);
			},
			liveTapAc() {
				(this.liveTabAc = true), (this.liveTabSc = false),(this.liveHidSc=true),(this.liveHidAc=false);
			},
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			},
			changeVideo(e){
				let video = e.currentTarget.dataset.video;
				this.topVideo = video;
			},
			goWebView(title,url){
				uni.navigateTo({
					url:"/pages/index/webView?title="+title+"&url=" + encodeURIComponent(url)
				});
			},
			getData(){
				let params = {id:this.id,page:this.page,limit:10};
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.siteApi(this.$city,'liveDetail'), {data: params}).then(res => {
					if(res.data.code == 0){
						if(this.page == 1){
							uni.showToast({
								title: '请求成功',
								icon: 'success',
								// #ifndef MP-ALIPAY
								duration:500,
								mask: true
								// #endif
							});
							this.info = res.data.data.row;
							//console.log(this.info.our_url)
							// #ifdef H5
							// our_url:rtmp://58.60.191.122/live/xhtd3,wap不能播放,显示海报
							if(this.info.our_url){
								let our_url = this.info.our_url;
								if(our_url.indexOf('rtmp://') >= 0){
									this.info.our_url = '';
									this.info.playStatusOrg = 'wait'; // 显示海报
								}
							}
							// #endif
							this.sourceUrl = this.info.our_url ? this.info.our_url : res.data.data.res['m3u8url'];
							if(res.data.data.video){
								this.videos = res.data.data.video;
								this.topVideo = this.info.topVideo.video;
								//console.log(this.topVideo)
							}
							this.detailShow = true;
						}
						this.reload && uni.stopPullDownRefresh();
						let list = res.data.data.dialogue;
						this.listData = this.reload ? list : this.listData.concat(list);
						if(this.listData.length >= res.data.data.total) this.status = 'noMore';
						++this.page;
						this.reload = false;
					}else{
						uni.showToast({title: '加载数据失败',icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title: '加载数据失败',icon:'none'});
				})
			}
		}
	}
</script>
<style lang="less">
/*直播详情头部图片*/
.liveTimage {
	width: 100vw;

	image {
		width: 100vw;
	}
	video {
		width: 100vw;
	}
}
.liveHide{ display: none}
/*直播内容*/
.liveSc-box {
	white-space: nowrap;
	width: 100%;
	height: 148px;
	background: #000;
	padding-bottom: 10px;
}
.video_nav {
	width: 160px;

	overflow: hidden;
	background: #000;
	border: 1px solid #e83836;
	display: inline-block;
	margin-top: 15px;
	margin-left: 10px;
	text {
		text-align: center;
		height: 24px;
		line-height: 24px;
		color: #fff;
		font-size: 14px;
		overflow: hidden;
		width: 150px;
		text-overflow: ellipsis;
		padding: 5px;
		display: block;
	}
	image {
		width: 160px;
		height: 96px;
	}
}
.liveT-h1 {
	font-size: 16px;
	text-align: center;
	color: #313131;
	background-color: #fff;
	font-weight: bold;
	padding: 5px 0;
	display: flex;
	flex-flow: row nowrap;
	view {
		flex: 1 0 auto;
		text-align: center;
	}
	view.tapClass {
		color: #e83836;
	}
}

.liveIntro {
	background-color: #f6f1e8;
	padding: 15px;
	box-sizing: border-box;

	.liveIn-h1 {
		text-align: center;
		font-size: 18px;
		padding-bottom: 6px;
		font-weight: bold;
	}

	.writer {
		font-size: 12px;
		color: #999;
		text-align: center;
		margin-top: 10px;
	}

	.live_introduction {
		color: #121212;
		margin: 10px 0 0;
		line-height: 1.5;
		text-align: left;
		font-size: 15px;

		& view {
			font-size: 16px;
			color: #333;
			margin: 10px 0;
			line-height: 1.5;
		}
	}
}

.liveMore {
	& :nth-child(odd) view {
		background-color: #f6f6f6;
	}

	& :nth-child(even) view {
		background-color: #fff;
	}

	.monickerbox {
		padding: 10px 10px;
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;

		.line_bg {
			width: 4px;
			height: 10px;
			background-color: #e83836;
			margin-right: 10px;
			padding-top: 10px;

			.line_black {
				width: 4px;
				height: 10px;
				background-color: #000;
			}
		}

		.line_tit {
			text-align: center;
			font-size: 16px;
			font-weight: bold;
			height: 20px;
			line-height: 20px;
			flex-grow: 1;
			text-align: left;
		}

		.line_time {
			color: #e83836;
			font-size: 14px;
			height: 20px;
			line-height: 20px;
			flex-grow: 2;
			text-align: right;
		}
	}

	.liveMain {
		padding: 10px;
		box-sizing: border-box;

		.p {
			text-align: justify;
			font-size: 16px;
			color: #333;
			margin: 10px 0;
			line-height: 1.5;
		}
	}
}

.loadmore {
	border-radius: 20px;
	-webkit-border-radius: 20px;
	-moz-border-radius: 20px;
	background-color: #e83836;
	padding: 10px;
	text-align: center;
	width: 80%;
	margin: 10px auto;
	color: #fff;
	cursor: pointer;
	font-size: 14px;
}

.loadmoreNull {
	background-color: #ccc;
}

.appIocn {
	width: 100vw;
	display: flex;
	flex-flow: row nowrap;

	view {
		flex-grow: 1;
		justify-content: space-around;
		padding: 10px;

		image {
			width: 100%;
		}
	}
}

.footText {
	width: 100%;
	font-size: 16px;
	background-color: #e83836;
	text-align: center;
	color: #fff;
	margin-top: 5px;
}
</style>
