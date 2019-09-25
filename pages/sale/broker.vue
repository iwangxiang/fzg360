<template>
	<view class="brokerDetails">
		<view class="brokerList">
			<view class="brokerListImage">
				<image :src="user.USER_PHOTO_MIN ? user.USER_PHOTO_MIN : '/static/avatar.jpg'"></image>
			</view>
			<view class="brokerListText">
				<view class="brokerName">
					<view>{{user.USER_NAME}}</view>
					<view>经纪人</view>
				</view>
				<view class="brokerAddress">
					服务区域：{{user.SERVICE_ZONE}}
				</view>
				<view class="brokerYear">
					服务年限：{{user.WORK_TIME}}
				</view>
			</view>
			<view class="brokerListPhone" @tap="$util.doCall(user.USER_NAME,user.USER_MOBILE)">
				<fzg-icon type="fuwurexian" size="15" color="#E73836"></fzg-icon>
			</view>
		</view>
		<view class="being">
			正在出售房源：{{user.SALE_NUM}}套
		</view>
		<view v-if="listData.length">
		<sale-lists v-for="(item,index) in listData" :key="index" :item="item"></sale-lists>
		<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import saleLists from '@/components/saleLists.vue'
	import noContent from '../../components/noContent.vue'
	export default{
		data(){
			return{
				id:'',
				user:{},
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
		components:{
			fzgIcon,
			saleLists,
			uniLoadMore,
			noContent
		},
		onLoad(option){
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
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
		methods:{
			getData(){
				let params = {id:this.id,city:this.$city,page:this.page};
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.fuberApi('userEsf'), {data: params}).then(res => {
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
							this.user = res.data.user;
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
					uni.showToast({title: '加载数据失败',icon:'none'});
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.brokerDetails{
		.brokerList{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 48rpx 20rpx;
			border-bottom: 1px solid #E1E1E2;
			.brokerListImage{
				width: 108rpx;
				height: 108rpx;
				image{
					width: 100%;
					height: 100%;
					vertical-align: text-top;
					border-radius: 50%;
				}
			}
			.brokerListText{
				
				flex: 1;
				margin-left: 20rpx;
				.brokerName{
					display: flex;
					font-size: 16px;
					color: #3F3F3F;
					&>view:nth-child(2){
						border: 1px solid #B2D9FF;
						font-size: 12px;
						border-radius: 4px;
						color: #B2D9FF;
						padding: 0 3px;
						margin-left: 10rpx;
					}
				}
				.brokerAddress,.brokerYear{
					width: 500rpx;
					font-size: 14px;
					color: #9E9E9E;
					margin-top: 5rpx;
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
				}
			}
			.brokerListPhone{
				width: 68rpx;
				height: 50rpx;
				border-radius: 5px;
				text-align: center;
				line-height: 50rpx;
				border: 1px solid #E73836;
			}
		}
		.being{
			height: 72rpx;
			background-color: #FED7D6;
			color: #E73836;
			font-size: 16px;
			line-height: 72rpx;
			padding: 0 0 0 20rpx;
		}
	}
</style>
