<template>
	<view class="integralCon">
		<view class="topBg">
			<view>
				<view class="integralTaskBox">
					<view class="progressBarWhite">
						<view class="progressBar" :style="{width: percent+'%'}">
							<image src="../../static/gold.png" class="gold"></image>
						</view>
					</view>
					<view class="taskTxt">积分任务</view>
				</view>
				<view class="integralnum">{{totalpoint}}</view>
				<view class="qiBao">
					<view class="sjxBg">
						<view class="sjxBgTop"></view>
					</view>
					恭喜你！超越了{{defeat}}%的掌柜网友
				</view>
			</view>
			<view class="topBar">
				<view  @tap="$tool.nav('jifen/task')">
					<text>积分明细</text>
					<text class="sj"></text>
				</view>
				<view @tap="$tool.nav('jifen/rule')">
					<text>积分规则</text>
					<text class="sj"></text>
				</view>
			</view>
		</view>
		<view class="integralList">
			<view class="integralTitle">
				<view>积分兑换</view>
				<view class="thjl" @tap="$tool.nav('jifen/exchange')">
					兑换记录<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
				</view>
			</view>
			<view v-if="listData.length">
			<view class="listBox" v-for="item in listData" :key="item.id" :data-id="item.id" @tap="goDetail">
				<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
				<view class="rightBox">
					<view>
						<view class="name">{{item.name}}</view>
						<view class="jf">{{item.point ? item.point+'积分' : '待定'}}<text>{{item.price > 0 ? '￥'+item.price : '价格待定'}}</text></view>
					</view>
					<view>
						<view>剩余{{item.renum}}份</view>
						<view class="exchangeBnt" v-if="item.renum > 0">立即兑换</view><!--兑换完毕增加样式active-->
						<view class="exchangeBnt active" v-else>兑换完毕</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status" :content-text="contentText" />
			</view>
			<no-content v-else></no-content>
		</view>
	</view>
</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import noContent from '../../components/noContent.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			uniIcon,
			uniLoadMore,
			noContent
		},
		data() {
			return {
				info:{},
				totalpoint:'',
	    		defeat:0,
	    		percent:'',
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
		onLoad(option) {
			uni.$once('login',() => { //监听登录事件
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/jifen/index');
				return;
			}
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
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			goDetail(e){
				let id = e.currentTarget.dataset.id;
				uni.navigateTo({
					url:'./cargo?id='+id
				})
			},
			getData(){
				let params = {page:this.page};
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.userApi('pointList'), {data: params}).then(res => {
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
							this.totalpoint = res.data.totalpoint;
							this.defeat = Number.parseFloat(res.data.defeat)*100;
							this.percent = Number.parseFloat(res.data.getpoint/res.data.allpoint).toFixed(2)*100;
						}
						this.reload && uni.stopPullDownRefresh();
						let list = res.data.info;
						this.listData = this.reload ? list : this.listData.concat(list);
						if(this.listData.length >= res.data.total) this.status = 'noMore';
						++this.page;
						this.reload = false;
					}else{
						uni.showToast({title: '加载数据失败',icon:'none'});
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
		background-color: #fff;
	}

	.pad10 {
		padding: 20rpx;
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

	.font-gray {
		color: #9e9e9e;
	}

	.integralCon {
		.topBg {
			background: linear-gradient(to top, #453673, #916ebe);
			width: 100%;
			height:231px;
			padding-top:34px;
			box-sizing: border-box;
			.uniColumn();
			justify-content: space-between;

			.topBar {
				width: 100%;
				height: 43px;
				background-color: #634c90;
				.uniRow();
				align-content: center;
				align-items: center;
				padding: 9px 0;
				box-sizing: border-box;

				view{
					flex: 1;
					color: #c1c1c1;
					text-align: center;
					font-size: 15px;
					border-right: solid 1px #6e5f8f;
					.uniRow();
					align-items: center;
					justify-content:center;
					&:last-child {
						border-right: none;
					}
					.sj{
						display: inline-block;
						width: 0;
						height: 0;
						border-top:6px solid transparent;
						border-bottom:6px solid transparent;
						border-left:6px solid #c1c1c1;
						margin-left: 5px;
					}
				}
			}

			.integralTaskBox {
				width: 100%;
				.uniRow();
				justify-content: space-between;
				align-content: center;

				.progressBarWhite {
					width: 76%;
					height: 10px;
					.bg-white();
					border-top-right-radius: 10px;
					border-bottom-right-radius: 10px;

					.progressBar {
						
						height: 100%;
						background: linear-gradient(to right, #ffff00, #00ffe4);
						position: relative;
						border-top-right-radius: 10px;
						border-bottom-right-radius: 10px;
					}

					.gold {
						width: 15px;
						height: 16px;
						position: absolute;
						top: 50%;
						margin-top: -8px;
						right: -8px;

					}
				}

				.taskTxt {
					font-size: 15px;
					color: #fff;
					padding-right: 10px;
				}
			}

			.integralnum {
				font-size: 35px;
				color: #fff;
				margin-top:25px;;
				text-align: center;
			}

			.qiBao {
				width: 52.6%;
				height: 30px;
				line-height: 30px;
				background-color: rgba(255, 255, 255, 0.3);
				font-size: 12px;
				color: #fff;
				text-align: center;
				line-height: 30px;
				border-radius: 15px;
				margin: 10px auto 0 auto;
				position: relative;

				.sjxBg {
					display: block;
					position: absolute;
					top: -12px;
					left: 50%;
					margin-left: -25px;
					width: 0;
					height: 0;
					border-width: 0 25px 12px;
					border-style: solid;
					border-color: transparent transparent transparent;
					border-bottom-color: rgba(255, 255, 255, 0.3);
				}
			}

		}

		.integralList {
			padding: 0 20rpx;

			.integralTitle {
				.uniRow();
				justify-content: space-between;
				padding: 36rpx 0;
				position: relative;
				font-size: 32rpx;

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
				
				view {
					font-size: 32rpx;
				}
				.thjl{
					color: #9e9e9e;
				}
			}

			.listBox {
				position: relative;
				padding: 40rpx 0;

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

				.uniRow();

				image {
					width: 232rpx;
					height: 176rpx;
					margin-right: 20rpx;
				}

				.rightBox {
					flex: 1;
					.uniColumn();
					justify-content: space-between;
					font-size: 22rpx;

					.name {
						font-size: 26rpx;
					}

					.jf {
						color: #e83836;
						font-size: 22rpx;
						margin-top: 10rpx;

						text {
							text-decoration: line-through;
							color: #3f3f3f;
							margin-left: 10px;
						}
					}

					&>view:nth-child(2) {
						.uniRow();
						justify-content: space-between;
						align-items: flex-end;

						.exchangeBnt {
							.bg-white();
							.boder();
							border-color: #e83836;
							color: #e83836;
							font-size: 28rpx;
							border-radius: 10rpx;
							padding: 5px 10px;
						}

						& .active {
							background-color: #e2e2e2;
							border: solid 1px #e2e2e2;
							.fontGray();
						}
					}
				}
			}
		}
	}
</style>
