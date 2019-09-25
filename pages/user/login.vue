<template>
	<view class="loginCon">
 		<view class="loginLog">
			<image src="../../static/logo.png"></image>
		</view>
		<view class="loginInputBox">
			<view class="loginList">
				<input class="loginInput" type="number" v-model="tel" placeholder="请输入手机号" maxlength="11" adjust-position="false" placeholder-style="color:#9e9e9e;"/>
			</view>
			<view class="loginList">
				<input class="loginInput" type="text" password="true" v-model="pwd" placeholder="请输入登录密码" adjust-position="false" placeholder-style="color:#9e9e9e;"/>
			</view>
		</view>
		<button type="primary" hover-class="bg-red1" class="loginBottom" @tap="doLogin">登录</button>
		<view class="loginTxt">
			<navigator url="/pages/user/getpw" hover-class="none">忘记密码？</navigator>
			<navigator url="/pages/user/reg" hover-class="none">新用户注册</navigator>
		</view>
		<view class="loginModeBox">
			<view class="loginTitel">快速登录方式</view> 
			<view class="loginMode">
				<view v-for="(item,index) in loginMode" :style="'background-color:'+item.color" :key="index" @tap="quickLogin(item.type)">
					<uni-icon :type="item.type" color="white" :size="item.size"></uni-icon> 
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import {mapState,mapMutations} from 'vuex'
	export default {
		components: {uniIcon},
		data() {
			return {
				loginMode:[
					{type:"weixin",color:"#46ab44", size:30,path:"/"},
					{type:"qq",color:"#0093dd",size:30,path:"/"},
					{type:"weibo",color:"#e22429",size:34,path:"/"},
				],	
				tel:'', //手机号
				pwd:'', //密码
				path:'',
				opt:'',
			}
		},
		onLoad(option) {
			if(!option.path){
				if (this.hasLogin && this.userInfo.hash) {
					uni.navigateBack();
					return;
				}
			}
			if(option.path) this.path = option.path;
			if(option.opt) this.opt = option.opt;
			// #ifdef H5
			//console.log(option)
			if(option.code){
				let params = {type:option.type,code:option.code};
				this.getUserInfo(params);
			}
			// #endif
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			// #ifdef H5
			extLogin(type){ //H5快捷登录获取授权链接
				let params = {type:type,path:window.location.href};
				this.$http.get(this.$api.userApi('extLogin'), {data: params}).then(res => {
					if(res.data.status){
						window.location.href = res.data.info;
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
			getUserInfo(params){
				uni.showLoading({title: '正在登录中...'});
				this.$http.get(this.$api.userApi('getUserInfo'), {data: params}).then(res => {
					if(res.data.status){
						uni.hideLoading();
						this.loginOk(res.data.info);
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
			// #endif
			// #ifdef APP-PLUS || H5
			quickLogin(type){
				switch(type){
					case 'weixin':
						// #ifdef H5
						this.extLogin('weixin');
						// #endif
						// #ifdef APP-PLUS
						uni.login({
							provider: 'weixin',
							success: (loginRes) => {
								//console.log(loginRes);
								uni.showLoading({title: '正在登录中...'});
								// 获取用户信息
								uni.getUserInfo({
									provider: 'weixin',
									success: (infoRes) => {
										//console.log(infoRes.userInfo);
										let params = {
											type:type,
											openid:infoRes.userInfo.openId,
											unionid:infoRes.userInfo.unionId,
											mname:infoRes.userInfo.nickName,
											thumb:infoRes.userInfo.avatarUrl,
											sex:infoRes.userInfo.gender
										};
										this.doQuickLogin(params);
									}
								});
							}
						});
						// #endif
					break;
					case 'qq':
						// #ifdef H5
						this.extLogin('qq');
						// #endif
						// #ifdef APP-PLUS
						uni.login({
							provider: 'qq',
							success: (loginRes) => {
								//console.log(loginRes);
								uni.showLoading({title: '正在登录中...'});
								let url = "https://graph.qq.com/oauth2.0/me",params = {access_token:loginRes.authResult.access_token,unionid:1};
								this.$http.get(url, {data: params}).then(res => {
									let data = eval(res.data.replace('callback',''));
									//console.log(data)
									if(data.unionid){
										//获取用户信息
										uni.getUserInfo({
											provider: 'qq',
											success: (infoRes) => {
												//console.log(infoRes.userInfo);
												let params = {
													type:type,
													openid:infoRes.userInfo.openId,
													unionid:data.unionid,
													mname:infoRes.userInfo.nickName,
													thumb:infoRes.userInfo.figureurl_qq_2,
													sex:infoRes.userInfo.gender == '男' ? 1 : 2
												};
												this.doQuickLogin(params);
											}
										});
									}
								}).catch(error => {
									console.error('error:',error);
								});
							}
						});
						// #endif
					break;
					case 'weibo':
						// #ifdef H5
						this.extLogin('weibo');
						// #endif
						// #ifdef APP-PLUS
						uni.login({
							provider: 'sinaweibo',
							success: (loginRes) => {
								//console.log(loginRes);
								uni.showLoading({title: '正在登录中...'});
								// 获取用户信息
								uni.getUserInfo({
									provider: 'sinaweibo',
									success: (infoRes) => {
										//console.log(infoRes.userInfo);
										let params = {
											type:type,
											openid:infoRes.userInfo.openId,
											mname:infoRes.userInfo.nickName,
											thumb:infoRes.userInfo.avatar_large,
											sex:infoRes.userInfo.gender == 'm' ? 1 : 2
										};
										this.doQuickLogin(params);
									}
								});
							}
						});
						// #endif
					break;
				}
			},
			// #endif
			// #ifdef APP-PLUS
			doQuickLogin(params){
				this.$http.post(this.$api.userApi('quickLogin'), {data: params}).then(res => {
					if(res.data.status){
						uni.hideLoading();
						this.loginOk(res.data.info);
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
			// #endif
			doLogin(){
				if(!this.tel || this.tel.length !== 11 || !/^1[345678]\d{9}$/.test(this.tel)){
					uni.showToast({icon: 'none',title: '手机号不正确'});
					return false;
				}
				if(!this.pwd){
					uni.showToast({icon: 'none',title: '请输入密码'});
					return false;
				}
				if (this.pwd.length < 6) {
				    uni.showToast({icon: 'none',title: '密码长度不能低于6位'});
				    return false;
				}
				let params = {tel:this.tel,pwd:this.pwd};
				this.$http.post(this.$api.userApi('login'), {data: params}).then(res => {
					if(res.data.status){
						this.loginOk(res.data.info);
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
			loginOk(info){
				uni.showToast({title:'登录成功',icon:'none'});
				this.login(info);
				uni.$emit('login');
				setTimeout(() => {
					if(this.path){
						uni.redirectTo({
							url:this.path + (this.opt ? '&opt=' + this.opt : '')
						})
					}else{
						//uni.navigateBack();
						uni.switchTab({
							url: '/pages/user/index'
						});
					}
				},1000)
			}
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			uni.switchTab({
			    url: '/pages/user/index'
			});
			return true;
		}
	}
</script>

<style lang="less">
	page{
	 background-color: #f7f7f7;
	}
	.bg-red{background-color: #e83836;}
	.bg-red1{ background-color: #cd0402;}
	.uniRow{
	display: flex;	
	flex-direction:row;
	}
	.uniColumn{
	display: flex;
	flex-direction: column;
	}
	.loginCon{
		.loginLog{
			width:178rpx;
			height:178rpx;
			margin: 8% auto 5% auto;
			image{
				width:178rpx;
				height:178rpx;
			}
		}
		.loginInputBox{
			 background-color: #fff;
			 .loginList{
				 position: relative;
				 padding: 15rpx 20rpx;
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
				 .loginInput{
					 width:100%;
					 font-size: 28rpx;
				 }
			 }
		}
		.loginBottom{
			margin: 90rpx auto 60rpx auto;
			width: 78.5%;
			height: 70rpx;
			line-height: 70rpx;
			.bg-red();
			font-size: 32rpx;
		}
		.loginTxt{
			width: 90%;
			margin: 0 auto 26% auto;
			.uniRow();
			justify-content: space-between;
			font-size: 28rpx;
			color: #e83836;
		}
		.loginModeBox{
			position: relative;
			width: 90%;
			margin: 0 auto;
			padding-top:48rpx;
			&:after{
			position: absolute;
			z-index:9;
			right: 0;
			top: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(.5);
			-ms-transform: scaleY(.5);
					transform: scaleY(.5);
			background-color: #e5e5e5;
			}
			.loginTitel{
				position: absolute;
				top:-23rpx;
				left: 50%;
				margin-left: -69rpx;
				 width: 178rpx;
				 height: 46rpx;
				 background-color: #f7f7f7;
				 font-size: 22rpx;
				 text-align:center;
				 line-height: 46rpx;
				 z-index: 10;
				}
			.loginMode{
				width: 90%;
				margin: 0 auto;
				position: relative;
				.uniRow();
				justify-content: center;
				align-items: center;
				view{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					.uniRow();
					align-items:center;
					justify-content:center;
					margin: 0 50rpx;
				}
			}	
		}
	}
</style>
