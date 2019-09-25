<template>
	<view class="recondContainer">
		<view v-if="listData.length">
		<view class="recondList" v-for="item in listData" :key="item.id" :data-id="item.pid" @tap="goDetail">
			<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
			<view>
				<view>
					<view>{{item.name}}</view>
					<view class="jf">{{item.point ? item.point+'积分' : '待定'}}<text>{{item.price > 0 ? '￥'+item.price : '价格待定'}}</text></view>
				</view>
				<view class="dhbnt">兑换成功</view>
			</view>
		</view>
		<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
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
		onLoad() {
			uni.$once('login',() => { //监听登录事件
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/jifen/exchange');
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
				this.$http.get(this.$api.userApi('exprizeList'), {data: params}).then(res => {
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
	.font-red {
		 color: #e83836;
	}
	.recondContainer {
		.recondList {
			.bg-white();
			padding:20px 10px;
			.uniRow();
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
				width: 235rpx;
				height: 176rpx;
				margin-right:10px;
			}
			&>view:last-child{
				flex: 1;
				font-size: 26rpx;
				.uniColumn();
				justify-content: space-between;
				.jf{
					font-size: 22rpx;
					.font-red();
					margin-top: 10px;
					text{
						color: #3f3f3f;
						text-decoration: line-through;
						margin-left: 5px;
						
					}
				}
				.dhbnt{
					font-size: 28rpx;
					text-align: right;
					color: #f39840;
				}
			}
		}
	}
</style>
