<template>
	<view class="iNewHouse" @tap="goNewHousePath(item.id)">
		<view>
			<view>
				<image lazy-load :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
			</view>
			<view v-if="item.favprice">
				<text>{{item.favprice}}</text>
			</view>
		</view>
		<view>
			<view>
				<text>{{item.title}}</text>
			</view>
			<view>
				<text>{{item.area_id}}</text>
				<text>{{item.price}}</text>
			</view>
			<view>
				<view>
					<text>{{item.sale}}</text>
				</view>
				<view v-for="(iitem,iindex) in item.wylxArr" :key="iindex">
					<text>{{iitem}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['item','site'],
		methods: {
			goNewHousePath(id){
				uni.navigateTo({
					url:'/pages/house/home?id='+id+(this.site && this.site != this.$city ? '&site='+this.site : '')
				})
			}
		},
	}
</script>

<style lang="less">
	.iNewHouse {
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
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			&>view:nth-child(1) {
				text {
					font-size: 34rpx;
					color: #3f3f3f;
				}
			}
			&>view:nth-child(2) {
				display: flex;
				justify-content: space-between;

				&>text:nth-child(1) {
					font-size: 26rpx;
					color: #3f3f3f;
				}
				&>text:nth-child(2) {
					font-size: 30rpx;
					color: #e83836;
					font-weight: bold;
				}
			}
			&>view:nth-child(3) {
				display: flex;
				&>view:nth-child(1) {
					width: 65rpx;
					background-color: #ffeeee;
					&>text {
						color: #fa5452;
					}
				}
				&>view {
					width: 110rpx;
					height: 34rpx;
					line-height: 20rpx;
					background-color: #f6f6f6;
					text-align: center;
					border-radius: 5rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-right: 10rpx;
					&>text {
						font-size: 20rpx;
						color: #9e9e9e;
					}
				}
			}
		}
	}
</style>
