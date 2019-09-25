<template>
	<view class="faqList">
		<view class="content">
			<view>
				<view v-for="(item, index) in viewTitle" :key="index" @tap="doChanges(index)">
					<text :class="{ active: tabIndex == index }">{{ item }}</text>
				</view>
			</view>
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
							<swiper-item v-for="(item, index) in swiperList" :key="index">
								<view class="swiper-item uni-bg-red" @tap="goPath('/pages/world/houseView?aid=' + item.aid)">
									<image :src="item.thumb"></image>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view>
				<view v-show="tabIndex == item.tabIndex" v-for="(item, index) in viewContent" :key="index" class="iActive" @tap="goPath('/pages/world/faqView?aid=' + item.aid)">
					{{ format(item.subject) }}
				</view>
			</view>
		</view>
		<uni-load-more :status="status" :content-text="contentText" />
	</view>
</template>

<script>
	import fzgIcon from '../../components/fzg-icon/index.vue';
	import {
		uniIcon,
		uniLoadMore
	} from '@dcloudio/uni-ui';
	export default {
		onLoad() {
			this.getData();
		},
		onPullDownRefresh() {
			this.viewContent = [];
			this.reload = true;
			this.page = 1;
			this.getData();
		},
		onReachBottom() {
			this.status = 'more';
			this.getData();
		},
		data() {
			return {
				tabIndex: 0,
				iFlag: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				viewTitle: ['热门问题', '最新问题'],
				viewContent: [],
				page: 1,
				reload: false,
				swiperList: [],
				status: 'more', //加载的状态
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				}
			};
		},
		components: {
			fzgIcon,
			uniIcon,
			uniLoadMore
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/world/search?model=faq'
			});
		},
		methods: {
			format(val) {
				return val.length > 25 ? val.slice(0, 25) + '...' : val;
			},
			goBack() {
				uni.navigateBack();
			},
			doChanges(index) {
				this.tabIndex = index;
				this.viewContent = [];
				this.page = 1;
				this.getData();
			},
			goPath(url) {
				uni.navigateTo({
					url: url
				});
			},
			getData() {
				let params = {
					page: this.page
				};
				if (this.tabIndex == 0) params.order = 2; //order=2按点击排序
				this.viewContent.length && (this.status = 'loading');
				this.$http
					.get(this.$api.worldApi('faqList'), {
						data: params
					})
					.then(res => {
						let list = res.data.info;
						list.map(item => {
							item.tabIndex = this.tabIndex;
						});
						if (this.page == 1) {
							uni.showToast({
								title: '请求成功',
								icon: 'success',
								// #ifndef MP-ALIPAY
								duration:500,
								mask: true
								// #endif
							});
							this.viewContent = list;
							if (this.swiperList.length == 0) this.swiperList = res.data.house;
						} else {
							this.viewContent = this.reload ? list : this.viewContent.concat(list);
						}
						this.reload && uni.stopPullDownRefresh();
						this.status = 'more';
						if (this.viewContent.length >= res.data.total) this.status = 'noMore';
						++this.page;
						this.reload = false;
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

<style lang="less" scoped>
	.faqList {
		.content {
			&>view:nth-child(1) {
				width: 100%;
				height: 70rpx;
				display: flex;
				justify-content: space-between;
				position: fixed;
				top: 0;
				/* #ifdef !MP */
				top: 44px;
				/* #endif */
				z-index: 9;
				background-color: #ffffff;
				border-bottom: 1px solid #e5e5e5;

				&>view {
					width: 50%;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;

					&>text {
						font-size: 28rpx;
						color: #333333;
					}

					.active {
						color: red;
						border-bottom: 2px solid red;
					}
				}

				&>view:nth-child(1) {
					border-right: 1px solid #e5e5e5;
				}
			}

			.uni-padding-wrap {
				height: 380rpx;
				padding: 0;
				margin-top: 70rpx;

				.swiper {
					height: 380rpx;
				}

				.swiper-item {
					height: 380rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			&>view:nth-child(3) {
				.iActive {
					border-bottom: 1px solid #e5e5e5;
					height: 65rpx;
					line-height: 65rpx;
					font-size: 28rpx;
					padding-left: 20rpx;
				}
			}
		}
	}
</style>
