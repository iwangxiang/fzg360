<template>
	<view class="broker">
		<view class="brokerList" @tap="goPath(item.USER_ID)">
			<view class="brokerListImage">
				<image :src="item.USER_PHOTO_MIN ? item.USER_PHOTO_MIN : '/static/avatar.jpg'"></image>
			</view>
			<view class="brokerListText">
				<view class="brokerName">
					<view>{{item.USER_NAME}}</view>
					<view>经纪人</view>
				</view>
				<view class="brokerAddress">
					服务区域：{{item.SERVICE_ZONE}}
				</view>
				<view class="brokerYear">
					服务年限：{{item.WORK_TIME}}
				</view>
			</view>
			<view class="brokerListPhone" @tap.stop="$util.doCall(item.USER_NAME,item.USER_MOBILE)">
				<fzg-icon type="fuwurexian" size="15" color="#E73836"></fzg-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "../components/fzg-icon/index.vue";
	export default{
		components:{
			fzgIcon
		},
		props: ['item'],
		methods:{
			goPath(id){
				uni.navigateTo({
					url:'/pages/sale/broker?id='+id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.broker{
		/* margin-top: 44px; */
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
	}
</style>
