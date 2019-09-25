<template>
	<view class="myConcernList" v-if="show">
		<!--有内容时显示-->
		<view v-if="listData.length">
			<view class="concerenBox" v-for="(item,index) in listData" :key="index" :data-id="item.fzgid" @tap="goPath">
				<image :src="item['param'].thumb ? item['param'].thumb : '../../static/agenthead.png'"></image>
				<view class="concernRight">
					<view class="infoTxt">
						<view>{{item['param'].source}}</view>
						<view>{{item['param'].description}}</view>
						<view>粉丝数：{{item.nums}}</view>
					</view>
					<view>
						<view class="concernBottom" @tap.stop="cancelConcern(item.fzgid)">取消关注</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	import noContent from '../../components/noContent.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
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
				concernFzgids:[],
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad(){
			uni.$once('login',() => { //监听登录事件
				this.page = 1;
				this.reload = true;
				this.status = 'more';
				//console.log(this.page)
				if(uni.getStorageSync('fzgids_'+this.$city)){
					this.concernFzgids = uni.getStorageSync('fzgids_'+this.$city);
				}
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/user/favor');
				return;
			}
			if(uni.getStorageSync('fzgids_'+this.$city)){
				this.concernFzgids = uni.getStorageSync('fzgids_'+this.$city);
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
		methods: {
			goPath(e){
				let id = e.currentTarget.dataset.id;
				uni.navigateTo({
					url:'../news/zgHao?id='+id
				})
			},
			cancelConcern(fzgid) {
				let params = {fzgid: fzgid, city: this.$city };
				this.$http.get(this.$api.userApi('concern'), { data: params }).then(res => {
					if (res.data.status) {
						if(this.concernFzgids.includes(fzgid)){
							this.concernFzgids.splice(this.concernFzgids.findIndex(item => item === fzgid), 1);
							uni.setStorageSync('fzgids_'+this.$city,this.concernFzgids);
						}
						this.reload = true;
						this.status = 'more';
						this.page = 1;
						this.getData();
						uni.showToast({ title: res.data.info, icon: 'none'});
					}else{
						uni.showToast({ title: res.data.info, icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			getData(){
				let params = {city:this.$city,page:this.page};
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.userApi('concernsList'), {data: params}).then(res => {
					//console.log(res.data.info)
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
						uni.showToast({title: '暂无内容',icon:'none'});
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



	.myConcernList {
		height: 100%;

		&>view {
			padding: 0 20rpx;
			.bg-white();

			.concerenBox {
				position: relative;
				padding: 40rpx 0;
				.uniRow();
				align-items: center;

				image {
					width: 118rpx;
					height: 118rpx;
					border-radius: 50%;
				}

				.concernRight {
					flex: 1;
					.uniRow();
					justify-content: space-between;
					align-items: center;
					margin-left: 30rpx;

					.infoTxt {
						.uniColumn();

						&>view {
							margin-top: 10rpx;
						}

						&>view:nth-child(1) {
							font-size: 32rpx;
						}

						&>view:nth-child(2) {
							font-size: 24rpx;
							.fontGray();
						}

						&>view:nth-child(3) {
							font-size: 24rpx;
							.fontGray();
						}
					}

					.concernBottom {
						width: 190rpx;
						height: 58rpx;
						.bg-red();
						border-radius: 10rpx;
						color: #fff;
						line-height: 58rpx;
						text-align: center;
						font-size: 32rpx;
						&.active{
							background-color: #9e9e9e;
						}
					}
				}
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
			}
		}
	}
</style>
