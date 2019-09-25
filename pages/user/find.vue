<template>
	<view class="findContainer">
		<view id="tab-bar" class="topTab">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="topTapList" :class="tabIndex==index ? 'active' : ''" :id="tab.id"
			 :data-current="index">
				<text :id="tab.id" :data-current="index" @tap="tapTab">{{tab.name}}</text>
			</view>
		</view>

		<!--新房-->
		<swiper :current="tabIndex" class="swiperBox" :duration="300" @change="changeTab">

			<swiper-item>
				<scroll-view class="list" scroll-y>
					<view class="selectList">
						<view class="pad10">
							<view>您想在哪里买</view>
							<view class="pickerBox">
								<picker @change="bindPickerChange" :value="index0" :range="areas">
									<view class="fhInput">
										<text class="selectRight">
											{{areas[index0]}}
										</text>
										<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
									</view>
								</picker>
							</view>
						</view>
						<view class="pad10">
							<view>您的价格预算</view>
							<view class="pickerBox">
								<picker @change="bindPriceChange" :value="priceIndex0" :range="budgets">
									<view class="fhInput">
										<text class="selectRight">
											{{budgets[priceIndex0]}}
										</text>
										<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
									</view>
								</picker>
							</view>
						</view>
						<view class="pad10">
							<view>您想买几居</view>
							<view class="pickerBox">
								<picker @change="bindApartmentChange" :value="apartmentIndex0" :range="shis">
									<view class="fhInput">
										<text class="selectRight">
											{{shis[apartmentIndex0]}}
										</text>
										<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
									</view>
								</picker>
							</view>
						</view>
						<template v-if="!hasLogin">
							<!--以下内容是没有登录的时候显示-->
							<view class="pad10">
								<view>您的手机号码</view>
								<view class="inputBox">
									<input class="uni-input" type="number" v-model="tel0" placeholder="请输入您的手机号码" placeholder-style="color:#9e9e9e;" />
									<!-- <uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon> -->
								</view>
							</view>
							<view class="pad10">
								<view>验证码</view>
								<view class="inputBox">
									<view class="yzmInputBox"><input class="uni-input yzm" type="number" v-model="code0" placeholder="请输入验证码"
										 placeholder-style="color:#9e9e9e;" /></view>
									<button class="yzm" plain="true" @tap="getSmsCode(tabIndex)">{{verifyMsg}}</button>
								</view>
							</view>
						</template>
					</view>
					<button type="primary" hover-class="bg-red1" @tap="doSubmit(tabIndex)">发送给置业顾问</button>
				</scroll-view>
			</swiper-item>
			<!--二手房-->
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<view class="selectList">
						<view class="pad10">
							<view>您想在哪里买</view>
							<view class="pickerBox">
								<picker @change="bindPickerChange" :value="index1" :range="areas">
									<view class="fhInput">
										<text class="selectRight">
											{{areas[index1]}}
										</text>
										<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
									</view>
								</picker>
							</view>
						</view>
						<view class="pad10">
							<view>您的价格预算</view>
							<view class="pickerBox">
								<picker @change="bindPriceChange" :value="priceIndex1" :range="budgets">
									<view class="fhInput">
										<text class="selectRight">
											{{budgets[priceIndex1]}}
										</text>
										<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
									</view>
								</picker>
							</view>
						</view>
						<view class="pad10">
							<view>您想买几居</view>
							<view class="pickerBox">
								<picker @change="bindApartmentChange" :value="apartmentIndex1" :range="shis">
									<view class="fhInput">
										<text class="selectRight">
											{{shis[apartmentIndex1]}}
										</text>
										<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
									</view>
								</picker>
							</view>
						</view>
						<template v-if="!hasLogin">
							<!--以下内容是没有登录的时候显示-->
							<view class="pad10">
								<view>您的手机号码</view>
								<view class="inputBox">
									<input class="uni-input" type="number" v-model="tel1" placeholder="请输入您的手机号码" placeholder-style="color:#9e9e9e;" />
									<!-- <uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon> -->
								</view>
							</view>
							<view class="pad10">
								<view>验证码</view>
								<view class="inputBox">
									<view class="yzmInputBox"><input class="uni-input yzm" type="number" v-model="code1" placeholder="请输入验证码"
										 placeholder-style="color:#9e9e9e;" /></view>
									<button class="yzm" plain="true" @tap="getSmsCode(tabIndex)">{{verifyMsg}}</button>
								</view>
							</view>
						</template>
					</view>
					<button type="primary" hover-class="bg-red1" @tap="doSubmit(tabIndex)">发送给置业顾问</button>
				</scroll-view>
			</swiper-item>

		</swiper>
	</view>

</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniIcon
		},
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				/* newsitems: [], */
				tabBars: [{
					name: '买新房',
					id: 'maixinfang'
				}, {
					name: '买二手房',
					id: 'maiesffang'
				}],
				title: 'picker',
				index0: 0,
				priceIndex0: 0,
				apartmentIndex0: 0,
				index1: 0,
				priceIndex1: 0,
				apartmentIndex1: 0,

				areas: [], //区域
				budgets: [], //价格
				shis: [], //居室
				second0: 0, //倒数时间(秒)
				second1: 0, //倒数时间(秒)
				tel0: '',
				code0: '',
				tel1: '',
				code1: '',
				district0: '不限',
				budget0: '不限',
				shi0: '不限',
				district1: '不限',
				budget1: '不限',
				shi1: '不限',
				timer0: null,
				timer1: null,
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			verifyMsg() {
				if (this['second' + this.tabIndex] == 0) {
					return '获取验证码';
				} else {
					if (this['second' + this.tabIndex] < 10) {
						return '重新发送(0' + this['second' + this.tabIndex] + 's)';
					} else {
						return '重新发送(' + this['second' + this.tabIndex] + 's)';
					}
				}
			},
		},
		onLoad() {
			this.getData();
		},
		methods: {
			bindPickerChange: function(e) {
				this['index' + this.tabIndex] = e.target.value;
				this['district' + this.tabIndex] = this.areas[e.target.value];
			},
			bindPriceChange: function(e) {
				this['priceIndex' + this.tabIndex] = e.target.value;
				this['budget' + this.tabIndex] = this.budgets[e.target.value];
			},
			bindApartmentChange: function(e) {
				this['apartmentIndex' + this.tabIndex] = e.target.value;
				this['shi' + this.tabIndex] = this.shis[e.target.value];
			},
			async changeTab(e) {
				let index = e.target.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				/* let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				} */
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			/* getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			}, */
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					/* let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft; */
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			getSmsCode(index) {
				if (this['second' + index] > 0) {
					return;
				}
				if (!this['tel' + index] || this['tel' + index].length !== 11 || !/^1[345678]\d{9}$/.test(this['tel' + index])) {
					uni.showToast({
						icon: 'none',
						title: '手机号不正确'
					});
					return;
				}
				/* if(!this.yzm){
					uni.showToast({icon: 'none',title: '请输入图形验证码'});
					return;
				} */
				this['second' + index] = 60;
				this.$http.post(this.$api.userApi('pwGetCode'), {
					data: {
						tel: this['tel' + index]
					}
				}).then(res => {
					if (res.data.status) {
						uni.setStorageSync('code', res.data.info);
						this['timer' + index] = setInterval(() => {
							this['second' + index]--;
							if (this['second' + index] < 1) {
								clearInterval(this['timer' + index]);
							}
						}, 1000);
					} else {
						uni.showToast({
							title: res.data.info,
							icon: 'none'
						});
						this['second' + index] = 0;
					}
				}).catch(error => {
					console.error('error:', error);
				});
			},
			doSubmit(index) {
				if (!this.hasLogin) {
					if (!this['tel' + index] || this['tel' + index].length !== 11 || !/^1[345678]\d{9}$/.test(this['tel' + index])) {
						uni.showToast({
							icon: 'none',
							title: '手机号不正确'
						});
						return;
					}
					if (!this['code' + index]) {
						uni.showToast({
							icon: 'none',
							title: '请输入验证码'
						});
						return;
					}
				}
				let params = {
					district: this['district' + index],
					budget: this['budget' + index],
					shi: this['shi' + index],
					house_resource: index == 1 ? '二手房' : '新房',
					city: uni.getStorageSync('city')
				};
				if (!this.hasLogin) {
					params['tel'] = this['tel' + index];
					params['code'] = this['code' + index];
					params['authCode'] = uni.getStorageSync('code');
				}
				this.$http.post(this.$api.userApi('intention'), {
					data: params
				}).then(res => {
					if (res.data.status) {
						if (!this.hasLogin) uni.removeStorageSync('code');
					}
					uni.showToast({
						title: res.data.info,
						icon: 'none'
					});
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			async getData() {
				try{
					let res = await this.$http.get(this.$api.siteApi(this.$city, 'getAreas'));
					this.areas = res.data.data;
					let res2 = await this.$http.get(this.$api.userApi('intention'));
					if(res2.data.status){
						this.budgets = res2.data.info.budgets;
						this.shis = res2.data.info.shi;
					}
				} catch (error) {
					console.error('error:',error);
				}
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

	.boder {
		border: solid 1px transparent;
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

	.pad10 {
		padding: 0 20rpx;
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

	.findContainer {
		.uniColumn();
		flex: 1;
		overflow: hidden;
		height: 100%;

		.list {
			width: 100%;
			height: 100%;
		}

		.topTab {
			width: 100%;
			height: 80rpx;
			.boder();
			border-top-color: #e5e5e5;
			border-bottom-color: #e5e5e5;
			.bg-gray();
			.uniRow();
			.fontGray();
			padding: 7px 0;
			box-sizing: border-box;

			.topTapList {
				text-align: center;
				flex-grow: 1;
				border-right: solid 1px #e5e5e5;
				font-size: 28rpx;
				height: 52rpx;
				line-height: 52rpx;

				&:last-child {
					border-right: none;
				}
			}
		}

		.swiperBox {
			flex: 1;
			width: 100%;
			/* height: calc(100% - 100rpx); 
			height: 100vh;*/
		}

		.active {
			color: #3f3f3f;
			font-weight: bold;

			text {
				position: relative;

				&:after {
					content: '';
					position: absolute;
					left: 0;
					width: 100%;
					height: 5rpx;
					.bg-red();
					border-radius: 20rpx;
					-webkit-border-radius: 20rpx;
					bottom: -9px;
				}
			}
		}

		.selectList {
			font-size: 32rpx;

			.pad10 {
				height: 87rpx;
				line-height: 87rpx;
				position: relative;
				background-color: #fff;
				.uniRow();
				justify-content: space-between;
				align-items: center;

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

				.pickerBox {
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					flex: 1;

					.fhInput {
						flex: 1;
						text-align: right;
						font-size: 30rpx;
						.fontGray();
					}

					.arrowRight {
						line-height: 90rpx;
						margin-left: 20rpx;
						margin-right: -10rpx;
					}
				}
			}
		}

		button {
			width: 85%;
			height: 80rpx;
			font-size: 32rpx;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			.bg-red();
			margin: 10% auto;

			&.yzm {
				width: 186rpx;
				height: 58rpx;
				line-height: 58rpx;
				text-align: center;
				font-size: 30rpx;
				color: #e83836;
				background-color: transparent;
				border: none;
				padding: 0;
			}
		}

		.inputBox {
			.uniRow();
			justify-content: space-between;
			align-items: center;

			.uni-input {
				width: 286rpx;
				padding: 0 0;
				.fontGray();
				font-size: 30rpx;
			}

			&.yzm {
				width: 100rpx;
			}

			.yzmInputBox {
				.boder();
				border-right-color: #e5e5e5;

				.uni-input {
					width: 200rpx;
					padding: 0 0px;
					.fontGray();
					font-size: 30rpx;
				}
			}

			.phcolor {
				color: #f30;
			}
		}
	}
</style>
