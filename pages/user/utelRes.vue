<template>
	<view class="pswCon">
		<view class="fixBox">绑定手机号码可以确保账号安全，兑换礼品更方便快捷</view>
		<view class="pswBox">
			<view class="pswList">
				<view class="pwsRight">
					<input type="text" v-model="tel" placeholder="请输入新的手机号" maxlength="11" placeholder-style="color:#9e9e9e;"/>
				</view>
			</view>
			<view class="pswList pswBox">
				<view class="">
					<input class="pwsInput" type="number" v-model="code" placeholder="请输入短信验证码" placeholder-style="color:#9e9e9e;"/>
				</view>
				<view><button class="yzmButtom" :class="{cur:isActive}" @tap="getSmsCode">{{verifyMsg}}</button></view><!--有两个状态，颜色不同-->
			</view>
			<button type="primary" class="pwsButtom" :class="{active: pwsButtom}" hover-class="" @tap="doSubmit">提交</button><!--输入电话时增加样式active-->
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				isActive:1,
				tel:'', //手机号
				second:0, //倒数秒
				code:'', //验证码
				timer:null
			}
		},
		onLoad(){
			if(!this.hasLogin || !this.userInfo.hash){
				uni.redirectTo({
					url:'./login'
				})
				return;
			}
			if(!this.userInfo.mtel){
				uni.redirectTo({
					url:'./bindTel'
				})
				return;
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo']),
			verifyMsg(){
				if(this.second == 0){
					return '获取验证码';
				}else{
					if(this.second < 10){
						return '重新发送(0'+this.second+'s)';
					}else{
						return '重新发送('+this.second+'s)';
					}
				}
			},
			pwsButtom(){
				if(this.tel && this.code){
					return true;
				}else{
					return false;
				}
			}
		},
		methods: {
			...mapMutations(['login']),
			getSmsCode(){
				if(this.second > 0){
					return;
				}
				if(!this.tel || this.tel.length !== 11 || !/^1[345678]\d{9}$/.test(this.tel)){
					uni.showToast({icon: 'none',title: '手机号不正确'});
					return;
				}
				this.second = 60;
				this.isActive = 0;
				this.$http.post(this.$api.userApi('getCode'), {data: {tel:this.tel}}).then(res => {
					if(res.data.status){
						uni.setStorageSync('code',res.data.info);
						this.timer = setInterval(() => {
							this.second--;
							if (this.second < 1) {
								this.isActive = 1;
								clearInterval(this.timer);
							}
						},1000);
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
						this.second = 0;
						this.isActive = 1;
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
			doSubmit() {
				if(!this.pwsButtom) return;
				if(!this.tel || this.tel.length !== 11 || !/^1[345678]\d{9}$/.test(this.tel)){
					uni.showToast({icon: 'none',title: '手机号不正确'});
					return false;
				}
				if(!this.code){
					uni.showToast({icon: 'none',title: '请输入验证码'});
					return false;
				}
				let params = {tel:this.tel,code:this.code,authCode:uni.getStorageSync('code')};
				this.$http.post(this.$api.userApi('changeTel'), {data: params}).then(res => {
					if(res.data.status){
						uni.removeStorageSync('code');
						uni.showToast({title:res.data.info,icon:'none'});
						let userInfoStorage = uni.getStorageSync('userInfo');
						userInfoStorage.mtel = this.tel;
						//uni.setStorageSync('userInfo',userInfoStorage);
						this.login(userInfoStorage);
						setTimeout(() => {
							uni.redirectTo({
								url:'./uinfo'
							})
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
page{
	 background-color: #f7f7f7;
	}
.uniRow{
	display: flex;	
	flex-direction:row;
	}
.bg-gray{background-color: #666;}
.bg-red{background-color: #e83836;}
.pswCon{
	position: relative;
	padding-top:64rpx;
	.fixBox{
		width: 100%;
		position: absolute;
		height:64rpx;
		line-height: 64rpx;
		background-color: rgba(232, 56, 54,0.3);
		color: #e83836;
		text-align: center;
		font-size: 24rpx;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.pswBox{
		 .pswList{
			position: relative;
			background-color: #fff;
			padding: 14rpx 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			.uniRow();
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
			.pwsLeft{
				font-size: 28rpx;
				line-height: 52rpx;
			}
			.pwsRight{
				flex: 1;
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
		.yzmButtom{
			padding: 0 10rpx;
			color: #fff;
			height: 40rpx;
			line-height:40rpx;
			font-size: 24rpx;
			background-color: #999;
			&.cur{
				.bg-red();
			}
		}
		& .pswBox{
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
