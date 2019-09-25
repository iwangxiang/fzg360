<template>
	<view class="viewShopping" @tap="goPath(item.id)">
		<view class="vsCont">
			<view class="sectionName1">
				<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
			</view>
			<view class="sectionName2">
				<view>{{item.title}}</view>
				<view>
					<view>
						<fzg-icon class="yuedushu" type="yuedushu-"></fzg-icon>
						<text>{{item.clicks}}</text>
					</view>
					<view>{{item.createTime}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "./fzg-icon/index.vue";
	export default{
		props: ['item','site'],
		components:{
			fzgIcon
		},
		methods: {
			goPath(id){
				uni.navigateTo({
					url:'/pages/news/pcDetail?id='+id+(this.site && this.site != this.$city ? '&site='+this.site : '')
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.viewShopping{
		.vsCont{
			display: flex;
			justify-content: space-between;
			padding: 40rpx 0;
			border-bottom: 1px solid #e5e5e5;
			.sectionName1{
				width: 190rpx;
				height: 137rpx;
				border: 1px solid #F7F7F7;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.sectionName2{
				width: 485rpx;
				height: 137rpx;
				margin-left: 20rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				&>view:nth-child(1){
					word-break:break-all;
					display:-webkit-box;
					-webkit-line-clamp:2;
					-webkit-box-orient:vertical;
					overflow:hidden;
					font-size: 32rpx;
					color: #3f3f3f;
				}
				&>view:nth-child(2){
					display: flex;
					justify-content: space-between;
					position: relative;
					height: 30rpx;
					line-height: 25rpx;
					&>view:nth-child(1){
						position: absolute;
						left: 0;
						top: 0;
						&>text{
							font-size:22rpx;
							color: #999999;
							position: absolute;
							top:4rpx;
							left: 40rpx;
						}
					}
					&>view:nth-child(2){
						position: absolute;
						right: 0;
						top: 2rpx;
						font-size: 24rpx;
						color: #9e9e9e;
					}
				}
			}
		}
	}
</style>
