<template>
	<view class="answerCon">
		<view class="answerList">
			<view class="answerTitel">{{item.title}}</view>
			<view class="answerDetail" v-if="item.content">{{item.content}}</view>
			<view class="answerTip">
				<view><fzg-icon type="time" size="12" color="#9e9e9e"></fzg-icon>{{item.create_time}}</view>
				<view v-if="item.replys_count"><fzg-icon type="reply" size="12" color="#9e9e9e"></fzg-icon>{{item.replys_count}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import fzgIcon from "./fzg-icon/index.vue"
	export default {
		components: {
			uniIcon,
			fzgIcon
		},
		props: ['item'],
		methods: {
			
		},
	}
</script>
<style lang="less">
	page {
		background: #fff;
		display: block;
		width: 100%;
		height: 100%;
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
	.answerCon{
		 padding: 10upx 20upx 20upx 20upx;
		 width: 100%;
		 box-sizing: border-box;
		.answerList{
			padding-top: 20upx;
			position: relative;
			padding-bottom: 40upx;
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
			.answerTitel{
				font-size: 28upx;
				color: #3f3f3f;
			}
			.answerDetail{
				font-size: 26upx;
				.fontGray();
				margin-top:10upx;
				
			}
			.answerTip{
				font-size: 24upx;
				margin-top:16upx;
				.fontGray();
				.uniRow();
				view{ margin-right: 8upx;}
				&>view:nth-child(1){
					margin-right: 20upx;
				}
			}
		} 
		
	}
</style>
