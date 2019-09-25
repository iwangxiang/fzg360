<template>
	<view class="fbCon">
		<view class="feedbox">
			<textarea @input="bindTextAreaBlur" maxlength="500" placeholder-style="color:#9e9e9e" placeholder="写下您的反馈意见吧"/>
			<text>{{size}}</text>
		</view>
		<button type="primary" class="pwsButtom" :class="{active: pwsButtom}" hover-class="" @tap="doSubmit">提交</button><!--输入内容时增加样式active-->
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				size:500,
				content:'',
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
			pwsButtom(){
				if(this.content){
					return true;
				}else{
					return false;
				}
			}
		},
		onLoad(){
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/config/feedback');
				return;
			}
		},
		methods: {
			bindTextAreaBlur: function (e) {
				//console.log(e.detail.value)
				this.content = e.detail.value;
				this.size = 500 - Number.parseInt(this.strlen(this.content));
			},
			strlen(str){
				let tmp = '**';
				return str.replace(/[^\x00-\xff]/g, tmp).length;
			},
			doSubmit() {
				if(!this.pwsButtom) return;
				if(!this.content){
					uni.showToast({icon: 'none',title: '请输入反馈内容'});
					return false;
				}
				if(this.strlen(this.content) > 500){
					uni.showToast({icon: 'none',title: '您的字数已超'});
					return false;
				}
				let params = {content:this.content};
				this.$http.post(this.$api.userApi('addresponse'), {data: params}).then(res => {
					if(res.data.status){
						uni.showToast({title:res.data.info,icon:'none'});
						setTimeout(() => {
							uni.navigateBack();
						},1500) 
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			}
		}
	}
</script>
<style lang="less">
	.bg-red{ color: #e83836;}
	.bg-gray{background-color: #666;}
	.fbCon {
		padding: 20rpx;

		.feedbox {
			width: 100%;
			height: 360rpx;
			padding: 20rpx;
			box-sizing: border-box;
			border: solid 1px #e5e5e5;
			border-radius: 10rpx;
			position: relative;
			text{
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				font-size: 24rpx;
				color: #9e9e9e;
			}
		}
		.pwsButtom{
			width:42.6%;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 32rpx;
			margin: 100rpx auto;
			background-color: #666666;
			.bg-gray()
		}
		& .active{
			.bg-red();
		}
	
	}
</style>
