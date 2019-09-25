<template>
	<view class="findContainer">
		<!-- <view id="tab-bar" class="topTab">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="topTapList" :class="tabIndex==index ? 'active' : ''" :id="tab.id"
			 :data-current="index">
				<text :id="tab.id" :data-current="index" @tap="tapTab">{{tab.name}}</text>
			</view>
		</view>

		
		<swiper :current="tabIndex" class="swiperBox" :duration="300" @change="changeTab">

			<swiper-item>
				<scroll-view class="list" scroll-y>
					<new-house></new-house>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<esf-house></esf-house>
				</scroll-view>
			</swiper-item>

		</swiper> -->
		<scroll-view class="list" scroll-y v-if="show">
			<view v-if="listData.length">
				<view class="newHouseList" v-for="(item,index) in listData" :key="index">
					<view class="state" @tap="goDetail(item.id)">
						<view class="left">{{item.statusStr}}</view>
						<view class="right" v-if="item.status > 3 && item.status < 8">{{item.iscomment ? '已评价' : '去评价'}}</view>
					</view>
					<view class="lpList" @tap="goDetail(item.id)">
						<image :src="item['param'].thumb ? item['param'].thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
						<view class="lpInfor">
							<view>
								<view>{{item.city ? '【'+item.cityStr+'】' : ''}}{{item['param'].subject}}</view>
								<view class="price">{{!item['param'].dj || item['param'].dj == 0 ? '价格待定' : item['param'].dj + (item['param'].djunit == 0 ? '元/㎡' : item['param'].djunit)}}</view>
							</view>
							<uni-icon type="arrowright" color="#3f3f3f" size="18"></uni-icon>
						</view>
					</view>
					<view class="state" v-if="item.status > 1">
						<view class="jjrBox">
							<image :src="item.thumb ? item.thumb : '../../static/avatar.jpg'"></image>
							<view class="name">{{item.mname}}</view>
						</view>
						<view class="tools">
							<fzg-icon type="bohao" color="#e83836" size="20" @tap="$util.doCall(item.mname,item.mtel)"></fzg-icon>
							<fzg-icon type="weiliao" color="#e83836" size="18" @tap="tochat(item.manager)"></fzg-icon>
						</view>
					</view>
					<view class="state" v-else>
						<view class="jjrBox">
							<image src="../../static/avatar.jpg"></image>
							<view class="name">正在为您安排掌柜经纪人</view>
						</view>
						<view class="tools">
							<button @tap.stop="cancelOrder(item.id)">取消预约</button>
						</view>
					</view>
					<view class="timeBox" v-if="item.status > 1">
						<view>预约时间：<text>{{item.orderdateStr}}</text></view>
						<view>看房时间：<text>{{item.lookdateStr}}</text></view>
						<view>见面时间：<text>{{item.place}}</text></view>
					</view>
				</view>
				<uni-load-more :status="status" :content-text="contentText" />
			</view>
			<no-content v-else></no-content>
			<!-- <view class="newHouseList">
				<view class="state">
					<view class="left">已带看</view>
					<view class="right">去评价</view>
				</view>
				<view class="lpList">
					<image src="../../static/buildingBanner.jpg"></image>
					<view class="lpInfor">
						<view>
							<view>双城峰景</view>
							<view class="price">30000元/㎡</view>
						</view>
						<uni-icon type="arrowright" color="#3f3f3f" size="18"></uni-icon>
					</view>
				</view>
				<view class="state">
					<view class="jjrBox">
						<image src="../../static/avatar.jpg"></image>
						<view class="name">姓名</view>
					</view>
					<view class="tools">
						<fzg-icon type="bohao" color="#e83836" size="20"></fzg-icon>
						<fzg-icon type="weiliao" color="#e83836" size="18"></fzg-icon>
					</view>
				</view>
				<view class="timeBox">
					<view>预约时间：<text>2017-05-25 15：30：00</text></view>
					<view>看房时间：<text>2017-05-25 15：30：00</text></view>
					<view>见面时间：<text>石湾镇双城峰景售楼中心</text></view>
			
				</view>
			</view>-->
		</scroll-view>
	</view>

</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import noContent from '../../components/noContent.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			uniIcon,
			fzgIcon,
			uniLoadMore,
			noContent
		},
		data() {
			return {
				show:false,
				listData: [], //列表数据
				reload: false, //重新加载标志
				status: 'more', //加载的状态
				contentText: { //加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				page:1 ,//页数
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
		},
		onLoad() {
			uni.$once('login',() => { //监听登录事件
				this.reload = true;
				this.page = 1;
				this.status = 'more';
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/user/appointment');
				return;
			}
			uni.$on('upOrder',() => { //监听取消预约事件
				this.reload = true;
				this.page = 1;
				this.status = 'more';
				this.getData();
			})
			this.getData();
		},
		onPullDownRefresh() {
			this.reload = true;
			this.page = 1;
			this.getData();
		},
		onReachBottom() {
			if(this.status == 'noMore') return;
			this.status = 'more';
			this.getData();
		},
		methods: {
			goDetail(id){
				uni.navigateTo({
					url: '/pages/user/appDetail?id='+id
				})
			},
			tochat(manager){
				let params = "id="+manager.mid+"&name="+manager.mname+"&thumb="+manager.thumb
				uni.navigateTo({
					url: "/pages/msg/chat?"+params
				})
			},
			cancelOrder(id){
				uni.showModal({
					title: '温馨提示',
					content: '确定取消预约吗?',
					success: (res) => {
						if (res.confirm) {
							let params = {id:id};
							uni.showLoading({title:'正在取消...'});
							this.$http.get(this.$api.userApi('cancelOrder'), {data: params}).then(res => {
								if(res.data.status){
									uni.hideLoading();
									uni.showToast({title: res.data.info,icon: 'none'});
									uni.$emit('upOrder');
								}else{
									uni.showToast({title: '取消预约失败',icon: 'none'});
								}
							}).catch(error => {
								uni.showToast({title:'该用户无效',icon:'none'});
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getData(){
				let params = {city:this.$city,page:this.page};
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.userApi('orderHouseList'), {data: params}).then(res => {
					if(res.data.status){
						if(this.page == 1){
							uni.showToast({
								title: '请求成功',
								icon: 'success',
								// #ifndef MP-ALIPAY
								duration:500,
								mask: true
								// #endif
							});
						}
						this.reload && uni.stopPullDownRefresh();
						let list = res.data.info;
						this.listData = this.reload ? list : this.listData.concat(list);
						this.show = true;
						if(this.listData.length >= res.data.total) this.status = 'noMore';
						++this.page;
						this.reload = false;
					}else{
						uni.showToast({title: '加载数据失败',icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #F7F7F7;
		display: block;
		width: 100%;
		height: 100%;
	}

	.boder {
		border: solid 1px transparent;
	}

	.bg-gray {
		background-color: #f7f7f7;
	}

	.bg-red {
		background-color: #e83836;
	}

	.bg-red1 {
		background-color: #cd0402;
	}

	.bg-white {
		background-color: white;
	}

	.pad10 {
		padding: 0 20rpx;
	}

	.fontGray {
		color: #9e9e9e;
	}

	.uniRow {
		display: flex;
		flex-direction: row;
	}

	.uniColumn {
		display: flex;
		flex-direction: column;
	}

	.findContainer {
		.uniColumn();
		flex: 1;
		overflow: hidden;
		height: 100%;
		
		.newHouseList {
			.bg-white();
		
			.state {
				.uniRow();
				justify-content: space-between;
				align-items: center;
				padding: 10px;
				position: relative;
				.bg-white();
		
				&:after {
					position: absolute;
					z-index: 9;
					right: 0;
					bottom: 0;
					left: 0;
					height: 1px;
					content: '';
					-webkit-transform: scaleY(.5);
					-ms-transform: scaleY(.5);
					transform: scaleY(.5);
					background-color: #e5e5e5;
				}
		
				.left {
					font-size: 26rpx;
				}
		
				.right {
					font-size: 24rpx;
					color: #e83836;
					.boder();
					border-color: #e83836;
					border-radius: 10rpx;
					padding: 2px 5px;
				}
		
				.jjrBox {
					.uniRow();
					align-items: center;
		
					image {
						width: 66rpx;
						height: 66rpx;
						border-radius: 50%;
					}
		
					.name {
						font-size: 26rpx;
						color: #383838;
						margin-left: 7px;
					}
				}
		
				.tools {
					.uniRow();
		
					view {
						margin-left: 20px;
					}
				}
			}
		
			.lpList {
				.uniRow();
				align-items: center;
				padding: 10px;
				position: relative;
		
				&:after {
					position: absolute;
					z-index: 9;
					right: 0;
					bottom: 0;
					left: 0;
					height: 1px;
					content: '';
					-webkit-transform: scaleY(.5);
					-ms-transform: scaleY(.5);
					transform: scaleY(.5);
					background-color: #e5e5e5;
				}
		
				image {
					width: 206rpx;
					height: 148rpx;
					margin-right: 15px;
				}
		
				.lpInfor {
					flex: 1;
					.uniRow();
					justify-content: space-between;
					align-items: center;
					font-size: 26rpx;
		
					.price {
						color: #e83836;
						margin-top: 10px;
					}
				}
			}
		
			.timeBox {
				padding: 10px;
				font-size: 22rpx;
				color: #9e9e9e;
		
				text {
					color: #383838;
				}
		
				view {
					margin: 5px
				}
			}
		}
		.list {
			width: 100%;
			height: 100%;
		}

		/* .topTab {
			width: 100%;
			height: 80rpx;
			.boder();
			border-top-color: #e5e5e5;
			border-bottom-color: #e5e5e5;
			.bg-gray();
			.uniRow();
			.fontGray();
			padding: 7px 0;
			box-sizing: border-box;

			.topTapList {
				text-align: center;
				flex-grow: 1;
				border-right: solid 1px #e5e5e5;
				font-size: 28rpx;
				height: 52rpx;
				line-height: 52rpx;

				&:last-child {
					border-right: none;
				}
			}
		}

		.swiperBox {
			flex: 1;
			width: 100%;

		}

		.active {
			color: #3f3f3f;
			font-weight: bold;

			text {
				position: relative;

				&:after {
					content: '';
					position: absolute;
					left: 0;
					width: 100%;
					height: 5rpx;
					.bg-red();
					border-radius: 20rpx;
					-webkit-border-radius: 20rpx;
					bottom: -9px;
				}
			}
		} */
	}
</style>
