<template>
	<view class="videoView">
		<video v-if="!isWebView" :src="url" controls :poster="poster"></video>
		<view @tap="goWebView(url)" v-if="isWebView" :style="{ 'background': 'url(' + poster + ') no-repeat center center'}">
			<image class="play-icon"  src="/static/play.png" mode=""></image>			
		</view>
	</view>
</template>

<script>
	export default{
		props:['url','poster','title'],
		created(){
			let type = ['mp4'];
			if(RegExp("\.(" + type.join('|') + ")$","i").test(this.url)){
				this.isWebView = false;
			}else{
				this.isWebView = true;
			}
		},
		data(){
			return {
				isWebView:true,
			}
		},
		methods:{
			goWebView(url){
				uni.navigateTo({
					url:"/pages/index/webView?title="+this.title+"&url=" + encodeURIComponent(url)
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.videoView{
		width: 100%;
		height: 100%;
		view,video{
			width: 100%;
			height: 100%;
			position: relative;
		}
		.play-icon{
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			position: absolute;
			margin: auto;
			width: 108upx;
			height: 108upx;
			
		}
	}
</style>
