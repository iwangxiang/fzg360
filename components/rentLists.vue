<template>
	<view class="iRentHouse" @tap="goPath(item.ID)">
		<view>
			<view>
				<image lazy-load :src="item.THUMB_URL ? item.THUMB_URL : 'https://static.fzg360.com/images/app/esf_nopic.jpg'"></image>
			</view>
		</view>
		<view>
			<view>
				<text>{{item.LEASE_SUBJECT}}</text>
			</view>
			<view>
				<text>{{item.LEASE_AREA}}{{item.LEASE_ROOM ? ' | '+item.LEASE_ROOM : ''}}{{item.LEASE_DIRECT ? ' | '+item.LEASE_DIRECT : ''}}</text>
				<text>{{item.LEASE_TOTAL_PRICE}}</text>
			</view>
			<view>
				<view>
					<text>{{item.REGION_NAME}}{{item.SECTION_NAME}}</text>
				</view>
			</view>
			<view v-if="item.TAGS">
				<view v-for="(TAG,index) in item.TAGS" :key="index">
					<text>{{TAG}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['item'],
		methods: {
			goPath(id){
				uni.navigateTo({
					url:"/pages/rent/detail?id="+id
				})
			}
		},
	}
</script>

<style lang="less">
	.iRentHouse {
		display: flex;
		padding: 40rpx 20rpx;
		border-bottom: 1px solid #E5E5E5;
		&>view:nth-child(1) {
			width: 248rpx;
			position: relative;
			&>view:nth-child(1) {
				width: 248rpx;
				height: 178rpx;
				image {
					width: 100%;
					height: 100%;
					vertical-align: text-top;
				}
			}
			&>view:nth-child(2) {
				position: absolute;
				top: 10rpx;
				left: -7rpx;
				width: 68rpx;
				height: 48rpx;
				text-align: center;
				line-height: 30rpx;
				background: url(../static/discount.png) no-repeat;
				background-size: 100%;
				text {
					font-size: 20rpx;
					color: #ffffff;
				}
			}
		}
		&>view:nth-child(2) {
			width: 424rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			&>view:nth-child(1) {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				line-height: 100%;

				text {
					font-size: 32rpx;
					color: #3f3f3f;
				}
			}

			&>view:nth-child(2) {
				display: flex;
				justify-content: space-between;
				position: relative;
				top: 15rpx;

				&>text:nth-child(1) {
					font-size: 22rpx;
					color: #9e9e9e;
				}

				&>text:nth-child(2) {
					font-size: 30rpx;
					color: #e83836;
					font-weight: bold;
				}
			}

			&>view:nth-child(3) {
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;

				&>view {
					text {
						font-size: 22rpx;
						color: #9e9e9e;
					}
				}
			}

			&>view:nth-child(4) {
				display: flex;
				margin-top: 10rpx;

				&>view {
					width: 110rpx;
					height: 34rpx;
					line-height: 20rpx;
					line-height: 20rpx;
					text-align: center;
					border: 1px solid #5990D3;
					border-radius: 3px;
					margin-right: 10rpx;

					text {
						font-size: 22rpx;
						color: #5990D3;
					}
				}
			}
		}
	}
</style>
