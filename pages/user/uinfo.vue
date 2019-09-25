<template>
	<view class="zlContainer">
		<!-- <view>
			<fzg-icon @tap="goBack" type="back" size="20"></fzg-icon>
			<view>个人资料</view>
			<view class="rightTxt" @tap="mesEdit">{{iFlag}}</view>
		</view> -->
		<view class="zlList marb20">
			<view>我的头像</view>
			<view class="uniRow" @click="chooseImage">
				<view class="headBox">
					<image :src="userInfo.thumb ? userInfo.thumb : '../../static/zl_head.jpg'"></image>
				</view>
				<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
			</view>
		</view>
		<view class="zlcon">
			<view class="zlList">
				<view>昵称</view>
				<view class="boxRight">
					<input class="zlInput" type="text" v-model="mname" placeholder="输入新的昵称" placeholder-style="color:#9e9e9e;" />
				</view>
			</view>
			<view class="zlList">
				<view>性别</view>
				<view class="genderBox">
					<radio-group @change="radioChange" class="radioBox">
						<label class="" v-for="(item, index) in items" :key="item.value">
							<view>
								<radio :value="item.value" :checked="index === current" color="#3f3f3f" />
							</view>
							<view>{{item.gender}}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="zlList">
				<view>邀请码</view>
				<view class="boxRight">
					<input class="zlInput" type="text" v-model="inviteCode" placeholder="填写可为好友增加100积分" placeholder-style="color:#9e9e9e;" />
				</view>
			</view>
			<view class="zlList" v-if="userInfo.mtel">
				<view>手机号码</view>
				<view class="boxRight">
					<input class="zlInput" type="number" :value="userInfo.mtel" placeholder="" placeholder-style="color:#9e9e9e;"
					 disabled />
				</view>
			</view>
			<!--以下是编辑的状态时候显示-->
			<view class="zlList" @tap="modify('tel')">
				<view>修改手机号码</view>
				<uni-icon type="arrowright" color="#9e9e9e" size="18"></uni-icon>
			</view>
			<view class="zlList" @tap="modify('pwd')">
				<view>修改密码</view>
				<uni-icon type="arrowright" color="#9e9e9e" size="18"></uni-icon>
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<view class="zlList">
				<view>绑定社交帐号</view>
				<view class="sjList">
					<view class="yuan" :class="{'bg-wx': userInfo.quickLogin && userInfo.quickLogin.includes('weixin')}" @tap="quickLogin('weixin')">
						<uni-icon type="weixin" color="#fff" size="14"></uni-icon>
					</view>
					<!--如已绑定增加样式bg-qq-->
					<view class="yuan" :class="{'bg-qq': userInfo.quickLogin && userInfo.quickLogin.includes('qq')}" @tap="quickLogin('qq')">
						<uni-icon type="qq" color="#fff" size="14"></uni-icon>
					</view>
					<!--如已绑定增加样式bg-wx-->
					<view class="yuan" :class="{'bg-sina': userInfo.quickLogin && userInfo.quickLogin.includes('weibo')}" @tap="quickLogin('weibo')">
						<uni-icon type="weibo" color="#fff" size="18"></uni-icon>
					</view>
					<!--如已绑定增加样式bg-sina-->
				</view>
			</view>
			<!-- #endif -->
		</view>
		<button type="primary" class="pwsButtom" :class="{active: pwsButtom}" hover-class="" @tap="doSubmit">确定</button>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue"
	import {
		uniIcon
	} from '@dcloudio/uni-ui'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import util from '../../common/util'
	export default {
		components: {
			fzgIcon,
			uniIcon
		},
		data() {
			return {
				items: [{
						value: 'BOY',
						gender: '男',
						checked: 'true'
					},
					{
						value: 'GIRL',
						gender: '女',
					},
				],
				current: 0,
				//selecActive: false,
				/* iFlag: "编辑", */
				mname: '', //用户名
				sex: 1, //性别
				inviteCode: '', //邀请码
				hash: '', //用户加密的hash
			}
		},
		
		onLoad(option) {
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/user/uinfo');
				return;
			}
			//console.log(this.userInfo.quickLogin)
			this.mname = this.userInfo.mname;
			this.userInfo.pinviteCode && (this.inviteCode = this.userInfo.pinviteCode);
			this.current = this.userInfo.sex - 1;
			this.hash = this.userInfo.hash;
			// #ifdef H5
			console.log(option)
			if(option.code){
				let params = {type:option.type,code:option.code};
				this.getUserInfo(params);
			}
			// #endif
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			pwsButtom() {
				if (this.mname) {
					return true;
				} else {
					return false;
				}
			}
		},
		methods: {
			...mapMutations(['login']),
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						this.sex = i + 1;
						break;
					}
				}
			},
			chooseImage: function() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						//console.log('chooseImage success, temp path is', res.tempFilePaths[0])
						let imageSrc = res.tempFilePaths[0],
							url = 'https://user.fzg360.com/index.php?v=' + this.$version + '&m=Api&a=changeThumb&hash=' + this.hash; //this.$api.userApi('changeThumb')
						uni.uploadFile({
							url: url,
							filePath: imageSrc,
							fileType: 'image',
							name: 'filedata',
							//header:{'Accept':'*/*;version='+this.$version},
							/* formData: {
								'hash': this.hash
							}, */
							success: (res) => {
								uni.showToast({
									title: '上传成功',
									icon: 'success'
								})
								this.userInfo.thumb = JSON.parse(res.data); //imageSrc
								let userInfoStorage = uni.getStorageSync('userInfo');
								userInfoStorage.thumb = JSON.parse(res.data);
								this.login(userInfoStorage);
							},
							fail: (err) => {
								console.log('uploadImage fail', err);
								uni.showModal({
									content: err.errMsg,
									showCancel: false
								});
							}
						});
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
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
				uni.showLoading({title: '获取用户信息中...'});
				this.$http.get(this.$api.userApi('getUserInfo'), {data: params}).then(res => {
					if(res.data.status){
						uni.hideLoading();
						if(this.userInfo.hash && res.data.info.do){
							let info = res.data.info;
							this.userInfo.quickLogin = info.msg;
							console.log(this.userInfo)
							uni.setStorageSync('userInfo',this.userInfo);
							uni.showToast({title:info.do == 'bind' ? '绑定成功' : '解绑成功',icon:'none'});
						}else{
							uni.showToast({title:'登录成功',icon:'none'});
							this.login(res.data.info);
							uni.$emit('login');
							setTimeout(() => {
								uni.navigateBack();
								/* uni.switchTab({
									url: '/pages/user/index'
								}); */
							},1000)
						}
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
								uni.showLoading({title: '获取用户信息中...'});
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
								uni.showLoading({title: '获取用户信息中...'});
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
								uni.showLoading({title: '获取用户信息中...'});
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
						if(this.userInfo.hash && res.data.info.do){
							let info = res.data.info;
							this.userInfo.quickLogin = info.msg;
							console.log(this.userInfo)
							uni.setStorageSync('userInfo',this.userInfo);
							uni.showToast({title:info.do == 'bind' ? '绑定成功' : '解绑成功',icon:'none'});
						}else{
							uni.showToast({title:'登录成功',icon:'none'});
							this.login(res.data.info);
							uni.$emit('login');
							setTimeout(() => {
								uni.navigateBack();
								/* uni.switchTab({
									url: '/pages/user/index'
								}); */
							},1000)
						}
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
			// #endif
			modify(type) {
				if (!this.userInfo.mtel) {
					uni.showModal({
						title: '提示',
						content: '请先绑定手机号',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: './bindTel'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return;
				}
				let tel = util.hideTel(this.userInfo.mtel);
				uni.showModal({
					title: '修改' + (type == 'tel' ? '手机号码' : '登录密码'),
					content: '将给手机' + tel + '发送验证码',
					success: (res) => {
						if (res.confirm) {
							let params = {
								tel: this.userInfo.mtel
							};
							this.$http.post(this.$api.userApi('pwGetCode'), {
								data: params,
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
								}
							}).then(res => {
								if (res.data.status) {
									uni.setStorageSync('code', res.data.info);
									//uni.setStorageSync('tel',this.userInfo.mtel);
									uni.navigateTo({
										url: type == 'tel' ? './utel' : './editpw'
									});
								} else {
									uni.showToast({
										title: res.data.info,
										icon: 'none'
									});
								}
							}).catch(error => {
								console.error('error:', error);
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			goBack() {
				uni.navigateBack();
			},
			/* mesEdit() {
				this.selecActive = !this.selecActive;
				this.iFlag = this.selecActive ? "编辑" : "完成";
			}, */
			doSubmit() {
				if (!this.pwsButtom) return;
				if (!this.mname) {
					uni.showToast({
						icon: 'none',
						title: '请输入您的昵称'
					});
					return false;
				}
				let params = {
					mname: this.mname,
					sex: this.sex,
					invitecode: this.inviteCode
				};
				this.$http.post(this.$api.userApi('setMemInfo'), {
					data: params
				}).then(res => {
					if (res.data.status) {
						uni.showToast({
							title: res.data.info,
							icon: 'none'
						});
						let userInfoStorage = uni.getStorageSync('userInfo');
						userInfoStorage.mname = this.mname;
						userInfoStorage.sex = this.sex;
						userInfoStorage.invitemember = res.data.invite_member;
						this.inviteCode && (userInfoStorage.pinviteCode = this.inviteCode);
						//uni.setStorageSync('userInfo',userInfoStorage);
						this.login(userInfoStorage);
						//this.selecActive = false;
					} else {
						uni.showToast({
							title: res.data.info,
							icon: 'none'
						});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			}
		}
	}
</script>
<style lang="less">
	page {
		background: #F7F7F7;
		display: block;
		width: 100%;
		height: 100%;
	}

	.bg-gray {
		background-color: #666;
	}

	.bg-red {
		background-color: #e83836;
	}

	.uniRow {
		display: flex;
		flex-direction: row;
	}

	.uniColumn {
		display: flex;
		flex-direction: column;
	}

	.zlContainer {

		/*padding-top: 118rpx;
		 &>view:nth-child(1) {
			width: 750rpx;
			height: 118rpx;
			margin: 0 auto;
			.uniRow();
			justify-content: space-between;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
			border-bottom: 1px solid #e5e5e5;
			background-color: #f7f7f7;
			&>view:nth-child(1) {
				margin-left: 10rpx;
			} 
			
			&>view:nth-child(1) {
				color: #383838;
				font-size: 32rpx;
			}
			
			&>view:nth-child(3) {
				margin-right: 20rpx;
				font-size: 28rpx;
			}
		
		}*/
		.zlList {
			font-size: 32rpx;
			padding: 20rpx;
			background-color: #fff;
			position: relative;
			.uniRow();
			align-items: center;
			justify-content: space-between;

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

			&.marb20 {
				margin-bottom: 20rpx;
			}

			.boxRight {
				flex: 1;
			}

			.headBox {
				width: 80rpx;
				height: 80rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}
			}

			.arrowRight {
				line-height: 80rpx;
				margin-right: -5px;
			}

			.genderBox {
				flex: 1;

				.radioBox {
					.uniRow();

					label {
						.uniRow();
						flex: 1;
						text-align: center;
						justify-content: center;

						&:last-child {
							border-left: solid 1px #e5e5e5;
						}
					}
				}
			}

			.sjList {
				.uniRow();

				.yuan {
					.uniRow();
					align-items: center;
					justify-content: center;
					background: #9e9e9e;
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 50%;
					text-align: center;
					margin-left: 10rpx;

					&.bg-qq {
						background: #42aae9;
					}

					&.bg-wx {
						background: #3fb135;
					}

					&.bg-sina {
						background: #e04d69;
					}
				}
			}
		}

		.zlcon {
			position: relative;

			&:after {
				position: absolute;
				z-index: 9;
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

			.zlInput {
				width: 100%;
				text-align: right;
			}
		}

		.pwsButtom {
			width: 42.6%;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 32rpx;
			margin: 100rpx auto;
			background-color: #666666;
			.bg-gray()
		}

		& .active {
			.bg-red();
		}

	}
</style>
