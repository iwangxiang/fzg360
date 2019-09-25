<template>
	<view class="articleContent">
		<image src="../../static/logo.png"></image>
		<view class="edition">{{$version}}</view>
		<view><u-parse class="articleTxt" v-if="info.content" :content="info.content" /></view>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default {
		data() {
			return {
				info:'',
			}
		},
		components: {
			uParse
		},
		onLoad() {
			this.getData();
		},
		methods: {
			getData(){
				this.$http.get(this.$api.siteApi(this.$city,'aboutInfo')).then(res => {
					if(res.data.code == 0){
						this.info = res.data.data;
					}else{
						uni.showToast({title:res.data.msg,icon:'none'});
					}
				}).catch(error => {
					console.error('error:',error);
				});
			}
		}
	}
</script>
<style lang="less">
	.articleContent{
		display: -webkit-flex; 
		display: flex;
		flex-direction: column;
		-webkit-flex-direction:column;
		padding: 10px;
		font-size: 30rpx;
		line-height:1.5;
		/* align-items:center;
		-webkit-align-items:center; */
		image{
			width: 178rpx;
			height: 178rpx;
			margin: 20rpx auto;
		}
		.edition{
			text-align:center;
			font-size:32rpx;
			color: #9e9e9e;
			line-height:54rpx;
		
		}
		.articleTxt {
			color: #000;
			font-size: 30rpx;
			line-height:54rpx;
			margin: 10rpx 0;
		}
	}
</style>
