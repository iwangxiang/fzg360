<template>
	<view class="videoList">
		<view class="content">
			<view @tap="goPath(item.aid)" v-for="item in listData" :key="item.aid">
				<view>
					<image lazy-load :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
				</view>
				<view>{{ item.subject }}</view>
				<view>
					<fzg-icon type="browse"></fzg-icon>
					<text>{{ item.clicks }}</text>
					<fzg-icon type="time"></fzg-icon>
					<text>{{ item.ctime }}</text>
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
		data() {
			return {
				listData: [],
				keyword: '',
				page: 1, //页数
				reload: false, //重新加载标志
				show: false,
				status: 'more', //加载的状态
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				}
			};
		},
		onLoad() {
			this.getData();
		},
		onPullDownRefresh() {
			this.reload = true;
			this.page = 1;
			this.getData();
		},
		onReachBottom() {
			this.status = 'more';
			this.getData();
		},
		components: {
			fzgIcon,
			uniLoadMore,
			uniIcon
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/world/search?model=vdo'
			});
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			goPath(aid) {
				uni.navigateTo({
					url: '/pages/world/videoView?aid=' + aid
				});
			},
			getData() {
				let params = {
					page: this.page
				};
				if (this.keyword) params['keyword'] = this.keyword;
				this.listData.length && (this.status = 'loading');
				this.$http
					.get(this.$api.worldApi('vdoList'), {
						data: params
					})
					.then(res => {
						this.show = false;
						if (this.page == 1) {
							uni.showToast({
								title: '请求成功',
								icon: 'success',
								// #ifndef MP-ALIPAY
								duration:500,
								mask: true
								// #endif
							});
							this.listData = res.data.info;
						} else {
							let list = res.data.info;
							this.listData = this.reload ? list : this.listData.concat(list);
						}
						this.reload && uni.stopPullDownRefresh();
						this.status = 'more';
						if (this.listData.length >= res.data.total) this.status = 'noMore';
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
	.videoList {
		background-color: #f7f7f7;

		.content {
			&>view {
				background-color: #ffffff;
				padding: 20rpx 32rpx 0;
				margin-bottom: 10rpx;

				&>view:nth-child(1) {
					height: 457rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				&>view:nth-child(2) {
					font-size: 30rpx;
					color: #383838;
					margin-top: 20rpx;
				}

				&>view:nth-child(3) {
					padding: 10rpx 0;

					&>text:nth-child(2),
					&>text:nth-child(4) {
						font-size: 24rpx;
						color: #666666;
						margin: 0 20rpx 0 0;
					}
				}
			}
		}
	}
</style>
