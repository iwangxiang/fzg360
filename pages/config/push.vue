<template>
	<view class="setBox">
		<view class="setList">
			<view class="setCon">
				<view class="setListLeft">消息开关</view>
				<label>
					<checkbox value="cb" color="#e83836" checked="true" />
				</label>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="less">
	page {
		background-color: #F7F7F7;
	}
	.setBox{
		.boder{border: solid 1px transparent;}
		.bg-gray{ background-color: #f7f7f7;}
		.bg-red{background-color: #e83836;}
		.bg-white{ background-color: #fff;}
		.bg-red1{ background-color: #cd0402;}
		.pad10{padding: 0 10px;}
		.fontGray{color: #9e9e9e;}
		.uniRow{
			display: flex;	
			flex-direction:row;
			}
		.uniColumn{
			display: flex;
			flex-direction: column;
			}
		.setList{
			padding: 0 14px;
			.bg-white();
			.setCon{
				height: 80rpx;
				line-height: 80rpx;
				.uniRow();
				position: relative;
				justify-content: space-between;
				align-items: center;
				&:after{
				position: absolute;
				z-index:9;
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
				&:last-child:after{
					 background-color: transparent;
				}
				.setListLeft{
					font-size: 28rpx;
					text{ margin-left:10px;}
				}
			}
			.textRight{ color: #9e9e9e; font-size: 28rpx;}
		}
	}
</style>
