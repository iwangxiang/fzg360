<template>
	<view class="yyContainer">
		<view class="stepsContainer">
			<uni-steps :options="list" :active="active" />
		</view>
		<view class="houseContainer" @tap="$tool.nav('house/home?id='+info.houseid)">
			<image :src="param.thumb ? param.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
			<view class="yyState">
				<view class="name">{{info.city ? '【'+info.cityStr+'】' : ''}}{{param.title}}</view>
				<view>看房时间：<text>{{info.lookdateStr}}</text></view>
				<view>见面地点：<text>{{info.place}}</text></view>
				<view v-if="info.status > 1 && info.status < 8">掌柜经纪人：<text>{{manager.mname}}</text></view>
				<view class="telBox" v-if="info.status > 1 && info.status < 8" @tap.stop="$util.doCall(manager.mname,manager.mtel)">
					<view>联系电话：{{manager.mtel}}</view>
					<fzg-icon type="bohao" color="#e83836" size="24"></fzg-icon>
				</view>
			</view>
		</view>
		<!--未确认状态 -->
		<view class="jjrContaner" v-if="info.status < 4 || info.status == 8">
			<view v-if="info.status == 1">
				<view class="jjrBox">
					<view class="leftBox">
						<view class="jjrHead">
							<image src="../../static/zl_head.jpg"></image>
						</view>
						<view>正在为您安排社区经纪人</view>
					</view>
					<view class="yyBnt" @tap="cancelOrder(id)">取消预约</view>
				</view>
				<!--正在分配-->
				<view class="timeBox" v-if="leftsecond > 0">
					<uni-countdown border-color="#e83836" splitor-color="#e83836" :show-day="false" :hour="Number(lefthour)" :minute="Number(leftminute)"
					 :second="Number(leftsecond)" />
					<view class="state">正在分配中，请耐心等待！</view>
				</view>
				<!--60分钟后状态-->
				<view class="cancelBox" v-else>
					尊敬用户，我们抱歉地通知您：由于相关经纪人正在忙与带看，当有空闲经纪人的时候我们会第一时间给您确认安排。
				</view>
			</view>
			<!--取消预约后-->
			<view class="cancelBox" v-if="info.status == 8">
				<view class="txt">您已取消预约看房</view>
				<view class="bnt" @tap="addOrder(info.houseid)">重新预约</view>
			</view>
		</view>
		<!--已确认时显示-->
		<view class="jjrInfor" v-if="(info.status == 2 || info.status == 3) && manager.mname">
			<view>
				<view class="titel">经纪人信息</view>
				<view class="right">已确认并分配</view>
			</view>
			<view class="jjrList">
				<view class="jjrRate">
					<view>掌柜经纪人：{{manager.mname}}</view>
					<view class="rate">
						<view>评分：</view>
						<uni-rate :disabled="true" :value="manager.scores" size="18" color="#e2e2e2" active-color="#fc973f" />
					</view>
				</view>
				<view class="jjrDetail">
					<image :src="manager.thumb ? manager.thumb : '../../static/jjrHead.png'"></image>
					<view class="jjrListRight">
						<view class="boxFirst">
							<view class="dk">
								<fzg-icon type="finish" color="#e83836" size="18"></fzg-icon>
								<view>最近带看：<text>{{manager.daikanNum}}套</text></view>
							</view>
							<view class="cjl">
								<fzg-icon type="done" color="#e83836" size="18"></fzg-icon>
								<view>成交量：<text>{{manager.chengjiaoNum}}套</text></view>
							</view>
						</view>
						<view class="box">
							<view>服务楼盘：</view>
							<view>{{houses}}</view>
						</view>
						<view class="box">
							<view>联系电话：</view>
							<view>{{manager.mtel}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--已带看-->
		<view class="scoreCon" v-if="info.status >= 4 && info.status !== 8 && manager.mname">
			<!--未评价-->
			<view class="jjrScore" v-if="!manager.iscomment">
				<view class="agent">
					<image :src="manager.thumb ? manager.thumb : '../../static/jjrHead.png'"></image>
					<view>掌柜经纪人：{{manager.mname}}</view>
				</view>
				<view>
					<view class="scoreBox">
						<view class="title">为经纪人评分</view>
						<uni-rate :value="0" size="30" margin="15" color="#e2e2e2" active-color="#fc973f" @change="onChange" />
					</view>
					<!-- <view class="evaluate">
						<view class="active">态度很好</view>
						<view>很好</view>
						<view>好</view>
						<view>态度很好</view>
						<view>很好</view>
						<view>好</view>
						<view>态度很好</view>
					</view> -->
					<view class="fbCon">
						<view class="feedbox">
							<textarea @input="bindTextAreaBlur" maxlength="300" placeholder-style="color:#9e9e9e;font-size:12px;"
							 placeholder="写下您对掌柜经纪人和社区经纪人的评价吧。" />
							<text>{{size}}</text>
						</view>
					</view>
				</view>
			</view>
			<!--已评价-->
			<view class="jjrScore" v-else>
				<view class="scoreState">
					<image :src="manager.thumb ? manager.thumb : '../../static/jjrHead.png'"></image>
					<view class="name">掌柜经纪人：{{manager.mname}}</view>
					<view class="score">
						<view class="titel">我的评价</view>
						<view>
						<uni-rate :disabled="true" :value="manager.score" size="30" margin="15" color="#e2e2e2" active-color="#fc973f" />
						</view>
						<view class="py">{{manager.content}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="yyListTitel" v-if="newHouseItems.length">预约本小区的用户还预约了</view>
		<view v-if="newHouseItems.length">
			<house-lists v-for="item in newHouseItems" :key="item.id" :item="item"></house-lists>
		</view>
		<view class="yybnt">
			<view @tap="$util.doCall(mname,mtel)">
				<fzg-icon type="bohao" color="#fff" size="22"></fzg-icon>
				<view>联系掌柜经纪人</view>
			</view>
			<view v-if="info.status >= 4 && info.status < 8 && !info.iscomment" @tap="doComment">
				<fzg-icon type="tijiao" color="#fff" size="22"></fzg-icon>
				<view>提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import houseLists from '@/components/houseLists.vue'
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			uniSteps,
			fzgIcon,
			houseLists,
			uniCountdown,
			uniRate
		},
		data() {
			return {
				active: 1,
				list: [{
					title: '待确认',
					type: 'affirm'
				}, {
					title: '已确认',
					type: 'yiqueren'
				}, {
					title: '带看中',
					type: 'looknh'
				}, {
					title: '已带看',
					type: 'finish'
				}, {
					title: '成交',
					type: 'done'
				}],
				newHouseItems: [], //(新房)
				id:'',
				param:{},
				info:{},
				houses:'',
				manager:{},
				mname:'',
				mtel:'',
				leftday:0,
				lefthour:0,
				leftminute:0,
				leftsecond:0,
				size:300,
				mpoint:0,
				content:'',
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(option) {
			if(!option.id){
				uni.navigateBack();
				return;
			}
			uni.$once('login',() => { //监听登录事件
				this.id = option.id;
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/user/appDetail?id'+option.id);
				return;
			}
			this.id = option.id;
			this.getData();
		},
		methods: {
			onChange(e) {
				//console.log(e.value)
				this.mpoint = e.value;
			},
			bindTextAreaBlur: function (e) {
				//console.log(e.detail.value)
				this.content = e.detail.value;
				this.size = 300 - Number.parseInt(this.strlen(this.content));
			},
			strlen(str){
				let tmp = '**';
				return str.replace(/[^\x00-\xff]/g, tmp).length;
			},
			addOrder(houseId) {
				if(!this.hasLogin || !this.userInfo.hash){
					this.$util.ckLogin('/pages/user/addDetail?id='+this.id);
					return;
				}
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
				uni.showModal({
					title: '温馨提示',
					content: '您确定要重新预约吗?',
					success: (res) => {
						if (res.confirm) {
							let params = {houseid: houseId, city: this.$city};
							this.$http.get(this.$api.userApi('addOrder'), { data: params}).then(res => {
								if(res.data.status){
									uni.showModal({
										title: '温馨提示',
										content: res.data.info,
										cancelText: '好的',
										confirmText: '查看预约',
										success: (res) => {
											if (res.confirm) {
												uni.navigateTo({
													url:'../user/appointment'
												})
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
								}else{
									uni.showToast({ title: res.data.info, icon: 'none'});
								}
							}).catch(error => {
								uni.showToast({title:'该用户无效',icon:'none'});
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			cancelOrder(id){
				uni.showModal({
					title: '温馨提示',
					content: '确定取消预约吗?',
					success: (res) => {
						if (res.confirm) {
							let params = {id:id};
							uni.showLoading({title:'正在取消...'});
							this.$http.get(this.$api.userApi('cancelOrder'), {data: params}).then(res => {
								if(res.data.status){
									uni.hideLoading();
									uni.showToast({title: res.data.info,icon: 'none'});
									uni.$emit('upOrder');
								}else{
									uni.showToast({title: '取消预约失败',icon: 'none'});
								}
							}).catch(error => {
								uni.showToast({title:'该用户无效',icon:'none'});
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			doComment() {
				if(!this.mpoint){
					uni.showToast({icon: 'none',title: '请为经纪人评分'});
					return false;
				}
				if(!this.content){
					uni.showToast({icon: 'none',title: '请输入评价内容'});
					return false;
				}
				if(this.strlen(this.content) > 300){
					uni.showToast({icon: 'none',title: '您的字数已超'});
					return false;
				}
				let params = {orderid:this.id,mpoint:this.mpoint,content:this.content};
				this.$http.post(this.$api.userApi('doScores'), {data: params}).then(res => {
					if(res.data.status){
						uni.showToast({title:res.data.info,icon:'none'});
						this.getData();
						uni.$emit('upOrder');
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			getData() {
				let params = {id:this.id};
				this.$http.get(this.$api.userApi('orderDetail'), {data: params}).then(res => {
					if(res.data.status){
						let stat = res.data.info.status;
						this.info = res.data.info;
						this.param = res.data.info.param;
						if(res.data.info.manager){
							this.manager = res.data.info.manager;
							this.mname = this.manager.mname;
							this.mtel = this.manager.mtel;
						}
						if(stat > 1 && stat < 4) this.getHouses(res.data.info.manager.mid);
						if(stat < 4){
							let houseids = res.data.info.houseData.join(',');
							this.gethouseData(res.data.info.houseid,houseids);
						}
						if(stat < 8){
							if(stat == 1){
								let leftsecond = Number.parseInt((Number(this.info.createdate)*1000 + 30*60*1000 - new Date().getTime())/1000);
								this.leftday = Number(Math.floor(leftsecond/(60*60*24)));
								if(this.leftday < 0) return;
								this.lefthour = Number(Math.floor((leftsecond-this.leftday*24*60*60)/3600));
								this.leftminute = Number(Math.floor((leftsecond-this.leftday*24*60*60-this.lefthour*3600)/60));
								this.leftsecond = Number(Math.floor(leftsecond-this.leftday*24*60*60-this.lefthour*3600-this.leftminute*60));
								//console.log(this.leftday + ' ' +this.lefthour + ' ' + this.leftminute + ' ' + this.leftsecond)
							}
							if(stat >= 5) this.active = 4;
							else this.active = Number(stat) - 1;
						}else this.active = -1;
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			getHouses(mid){
				let params = {mid:mid};
				this.$http.get(this.$api.siteApi(this.$city,'getManagerHouses'), {data: params}).then(res => {
					if(res.data.code == 0){
						this.houses = res.data.data;
					}
				}).catch(error => {
					console.error('error:', error);
				});
			},
			gethouseData(houseId,houseIds){
				let params = {id:houseId,ids:houseIds};
				this.$http.get(this.$api.siteApi(this.$city,'nearHouseList'), {data: params}).then(res => {
					if(res.data.code == 0){
						this.newHouseItems = res.data.data;
					}
				}).catch(error => {
					console.error('error:', error);
				});
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
		display: block;
		width: 100%;
		height: 100%;
	}

	.uniRow {
		display: flex;
		flex-direction: row;
	}

	.uniColumn {
		display: flex;
		flex-direction: column;
	}

	.bg-gray {
		background-color: #9e9e9e;
	}

	.font-gray {
		color: #9e9e9e;
	}

	.bg-gray7 {
		background-color: #f7f7f7;
	}

	.yyContainer {
		padding: 10px 0 50px 0;

		.stepsContainer {
			position: relative;
			padding: 0 10px 10px;

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
		}

		.houseContainer {
			position: relative;
			padding: 10px;
			.uniRow();
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

			image {
				width: 206rpx;
				height: 148rpx;
				margin-right: 15px;
			}

			.yyState {
				flex: 1;
				.uniColumn;
				justify-content: space-between;
				font-size: 22rpx;
				.font-gray();

				.name {
					font-size: 26rpx;
					color: #383838;
				}

				text {
					color: #383838;
				}

				.telBox {
					.uniRow();
					justify-content: space-between;
					align-items: center;
				}
			}
		}

		.jjrContaner {
			padding: 10px;

			.jjrBox {
				.uniRow();
				justify-content: space-between;
				align-items: center;

				.leftBox {
					.uniRow();
					align-items: center;

					.jjrHead {
						width: 64rpx;
						height: 64rpx;
						margin-right: 10rpx;
						border-radius: 10rpx;

						image {
							width: 64rpx;
							height: 64rpx;
							border-radius: 10rpx;
						}
					}

					&>view:nth-child(2) {
						font-size: 26rpx;
					}
				}

				.yyBnt {
					font-size: 22rpx;
					.font-gray();
					background-color: #f7f7f7;
					border-radius: 5rpx;
					padding: 5rpx 20rpx;

				}
			}

			.timeBox {
				.uniColumn();
				align-content: center;
				padding-top: 20rpx;

				.state {
					text-align: center;
					font-size: 26rpx;
					.font-gray();
					margin-top: 30rpx;
				}
			}
			.cancelBox{
				.uniColumn();
				font-size: 26rpx;
				align-items: center;
				padding: 10px;
				.txt{
					font-size:30rpx;
					text-align: center;
					.font-gray();
				}
				.bnt{
					width: 260rpx;
					height: 70rpx;
					background-color: #e83836;
					color: #fff;
					font-size:30rpx;
					line-height: 70rpx;
					border-radius: 10rpx;
					text-align: center;
					margin-top:30rpx;
				}
			}
		}

		.yyListTitel {
			padding: 10px;
			font-size: 30rpx;
			.bg-gray7();
		}

		.jjrInfor {
			&>view:nth-child(1) {
				.uniRow();
				justify-content: space-between;
				padding: 10px;
				.bg-gray7();

				.titel {
					font-size: 30rpx;
				}

				.right {
					font-size: 24rpx;
					color: #e83836;
				}
			}

			.jjrList {
				font-size: 28rpx;

				.jjrRate {
					padding: 10px;
					.uniRow();
					justify-content: space-between;
					align-items: center;

					.rate {
						.uniRow();
						align-items: center;
					}
				}

				.jjrDetail {
					.uniRow();
					position: relative;
					padding: 10px;
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
					image{
						width: 128rpx;
						height: 128rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
					.jjrListRight{
						flex: 1;
						font-size: 24rpx;
						.boxFirst{
							width: 100%;
							flex: 1;
							.uniRow();
							justify-content: space-between;
							align-content: center;
							.dk{
							.uniRow();
							margin-right: 5px;
							.font-gray();
							align-items: center;
							text{
								color: #383838;
							}
							view{margin-left: 5px;}
							}
							.cjl{
								.dk();
							}
						}
						.box{
							.uniRow();
							justify-content: space-between;
							font-size: 24rpx;
							margin-top: 5px;
							.font-gray();
							&>view:nth-child(2){
								flex: 1;
								color: #3f3f3f;
							}
						}
					}
				}

			}

		}
		.scoreCon{
			.bg-gray7();
			padding-top: 10px;
			.jjrScore{
				padding: 10px;
				background-color: #fff;
				.agent{
					.uniRow();
					align-items: center;
					font-size: 28rpx;
					position: relative;
					padding-bottom: 10px;
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
					image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-right:20rpx;
					}
				}
				.scoreBox{
					.uniColumn();
					padding-top: 20px;
					padding-bottom: 10px;
					align-items: center;
					.title{
						font-size: 24rpx;
						.font-gray();
						margin-bottom: 10px;
					}
				}
				.evaluate{
					.uniRow();
					flex-wrap:wrap;
					width: 90%;
					margin: 0 auto;
					justify-content: center;
					view{
						border: solid 1px #e5e5e5;
						color: #383838;
						padding: 5px 10px;
						border-radius:4px;
						margin: 5px;
						.font-gray();
						font-size: 26rpx;
						&.active{
						background-color: #fc973f;
						color: #fff;
						border-color: #fc973f;
						}
					}
				}
				.fbCon {
					padding: 20rpx;
					font-size: 24rpx;
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
				
				}
			}
			.scoreState{
				padding:20px 10px 10px 10px;
				.uniColumn();
				justify-content: center;
				align-items: center;
				image{
					width: 128rpx;
					height: 128rpx;
				}
				.name{
					font-size: 28rpx;
					margin-top: 10px;
				}
				.score{
					width: 90%;
					margin: 30px auto 10px auto;
					border-top: solid 1px #e5e5e5;
					position: relative;
					.uniColumn();
					padding-top: 30px;
					view{
						margin: 0 auto;
					}
					.py{
					font-size: 32rpx;
					text-align: left;
					margin-top: 20px;
					}
					.titel{
						position:absolute;
						left: 50%;
						top: -20rpx;
						margin-left: -85rpx;
						width: 170rpx;
						height: 40rpx;
						background-color: #fff;
						text-align: center;
						line-height:40rpx;
						font-size: 24rpx;
					}
				}
			}
		}
		.yybnt{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height:50px;
			background-color: #e83836;
			color: #fff;
			text-align: center;
			line-height: 50px;
			.uniRow();
			&>view:nth-child(1) {
				background-color: #e83836;
				text-align: center;
				flex: 2;
				.uniRow();
				justify-content:center;
				align-items: center;
				view{
					margin-left: 5px;
				}

			}
			&>view:nth-child(2) {
				flex: 1;
				background-color: #fc973f;
				text-align: center;
				.uniRow();
				justify-content:center;
				align-items: center;
				color: #fff;
				view{
					margin-left: 5px;
				}
			}
			
		}
	}
</style>
