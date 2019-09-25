<template>
	<!--没有内容时显示-->
	<view class="noContent">
		<image src="/static/sc_bg.png"></image>
		<view>暂无相关内容</view>
	</view>
</template>

<script>
	export default {
		props: []
	}
</script>

<style lang="less">
	.bg-white {
		background-color: #fff;
	}
	.uniColumn {
		display: flex;
		flex-direction: column;
	}
	.noContent {
		height: 100%;
		.bg-white();
		font-size: 28rpx;
		margin: 0 auto;
		.uniColumn();
		justify-content: center;
		align-items: center;
	
		view {
			font-size: 28rpx;
			margin-top: 10rpx;
		}
	
		image {
			width: 142rpx;
			height: 59rpx;
		}
	}
</style>
