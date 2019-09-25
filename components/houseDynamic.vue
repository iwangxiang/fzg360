<template>
	<!-- <view class="viewDynamic"> -->
		<view class="vdCont">
			<view class="sectionName1">
				<image src="/static/point.png"></image>
			</view>
			<view class="sectionName2">
				<text>{{item.create_time}}</text>
				<text>{{item.type}}</text>
			</view>
			<view class="sectionName3">
				{{item.title}}
			</view>
			<view class="sectionName4">
				<u-parse class="uParse" v-if="item.content" :content="item.content" />
			</view>
		</view>
	<!-- </view> -->
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default {
		props: ['item'],
		components: {
			uParse
		},
		methods: {},
	}
</script>

<style lang="less" scoped>
	/* .viewDynamic{ */
		.vdCont{
			border-left: 2px solid #ED8884;
			box-sizing: border-box;
			padding: 0 0 20rpx 20rpx;
			position: relative;
			top: 50rpx;
			.sectionName1{
				width: 8px;
				height: 8px;
				position: absolute;
				left: -10rpx;
				top: -38rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.sectionName2{
				position: relative;
				top: -35rpx;
				&>text{
					color: #9e9e9e;
					font-size: 26rpx;
					margin-right: 10rpx;
				}
				&>text:nth-child(2){
					width: 38rpx;
					height: 42rpx;
					border: 1px solid #ED8884;
					color: #ED8884;
					border-radius: 5px;
					text-align: center;
					font-size: 22rpx;
					padding: 5rpx;
				}
			}
			.sectionName3{
				position: relative;
				top: -30rpx;
				overflow:hidden; 
				text-overflow:ellipsis;
				white-space:nowrap;
				font-size: 32rpx;
				color: #3f3f3f;
			}
			.sectionName4{
				position: relative;
				top: -20rpx;
				font-size: 28rpx;
				color: #9e9e9e;
			}
		}
	/* } */
</style>
