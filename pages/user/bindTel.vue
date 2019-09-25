<template>
	<view class="pswCon">
		<view class="pswList">
			<view class="pwsLeft">中国+86</view>
			<view class="pwsRight">
				<input class="" type="number" v-model="tel" placeholder="请输入手机号码" maxlength="11" placeholder-style="color:#9e9e9e;"/>
			</view>
		</view>
		<!-- <view class="pswList">
			<view class="yzmRight"><input class="" type="text" v-model="yzm" placeholder="请输入验证码"  placeholder-style="color:#9e9e9e;"/></view>
			<view><image style="width: 150rpx; height: 60rpx;" :src="yzmSrc" @tap="chageCode"></image></view>
		</view> -->
		<view class="pswList">
			<view class="yzmRight"><input class="" type="number" v-model="code" placeholder="请输入短信验证码"  placeholder-style="color:#9e9e9e;"/></view>
			<view><button class="yzmButtom" :class="{cur:isActive}"  @tap="getSmsCode">{{verifyMsg}}</button></view>
		</view>
		<button type="primary" class="pwsButtom" :class="{active: pwsButtom}" hover-class="" @tap="doSubmit">完成</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				tel:'', //手机号
				//yzm:'', //图形验证码
				code:'', //短信验证码
				second:0, //倒数时间(秒)
				isActive:1,
				//pwsButtom:0,
				//yzmSrc:'' ,//验证码图片
				timer:null,
			}
		},
		onLoad(){
			/* let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				uni.redirectTo({
					url:'./login'
				})
				return;
			} */
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/user/bindTel');
				return;
			}
			if(this.userInfo.mtel){
				uni.showToast({title:'您已绑定手机号',icon:'none'});
				setTimeout(() => {
					uni.redirectTo({
						url:'./uinfo'
					})
				},1000);
				return;
			}
			//this.getCode();
		},
		computed:{
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
			/* getCode(){
				this.yzmSrc = 'http://user.fzg360.com/index.php?m=site&a=getCaptcha';
			},
			chageCode(){
				uni.redirectTo({
					url: '/pages/register/register'
				});
			}, */
			getSmsCode(){
				if(this.second > 0){
					return;
				}
				if(!this.tel || this.tel.length !== 11 || !/^1[345678]\d{9}$/.test(this.tel)){
					uni.showToast({icon: 'none',title: '手机号不正确'});
					return;
				}
				/* if(!this.yzm){
					uni.showToast({icon: 'none',title: '请输入图形验证码'});
					return;
				} */
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
				this.$http.post(this.$api.userApi('bindTel'), {data: params}).then(res => {
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
		.pswList{
			position: relative;
			background-color: #fff;
			padding: 14rpx 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			.uniRow();
			/* justify-items: center; */
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
				border-right:solid 1px #e5e5e5;
				font-size: 28rpx;
				padding-right:20rpx;
				line-height: 52rpx;
			}
			.pwsRight{
				flex: 1;
				padding: 0 20rpx;
			}
			.yzmRight{
				flex: 1;
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
