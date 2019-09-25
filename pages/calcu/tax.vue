<template>
	<view class="findContainer">
		<view id="tab-bar" class="topTab">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="topTapList" :class="tabIndex==index ? 'active' : ''" :id="tab.id"
			 :data-current="index">
				<text :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</text>
			</view>
		</view>
		<swiper :current="tabIndex" class="swiperBox" :duration="300" @change="changeTab">
			<!--新房-->
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<new-house></new-house>
					<template v-if="xfResult">
					<view class="bg-white qiun-title-bar qiun-common-mt ddd">
						<view class="qiun-title-dot-light">参考税金</view>
					</view>
					<view class="uniRow">
						<view class="qiun-charts">
							<!--#ifdef MP-ALIPAY -->
							<canvas canvas-id="canvasRing" id="canvasRing" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"
							 @touchstart="touchRing"></canvas>
							<!--#endif-->
							<!--#ifndef MP-ALIPAY -->
							<canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchRing"></canvas>
							<!--#endif-->
						</view>
						<view class="taxesDetailed">
							<view class="titel">税金明细：</view>
							<view>房款总价：{{totalPrice}}万元</view>
							<view class="dian2">契税：{{qTax}}元</view>
							<view>合同工本费：{{htgbTax}}元</view>
							<view class="dian1">维修基金：{{wxjjTax}}元</view>
							<view class="dian3">权属登记费：{{qsdjTax}}元</view>
							<view>税金总额：{{taxTotal}}元</view>
							<view class="titel">以上计算结果仅供参考</view>
						</view>
					</view>
					</template>
				</scroll-view>
			</swiper-item>
			<!--二手房-->
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<esf-house></esf-house>
					<template v-if="esfResult">
					<view class="bg-white qiun-title-bar qiun-common-mt">
						<view class="qiun-title-dot-light">参考税金</view>
					</view>
					<view class="uniRow">
						<view class="qiun-charts">
							<!--#ifdef MP-ALIPAY -->
							<canvas canvas-id="canvasRing2" id="canvasRing2" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"
							 @touchstart="touchRing2"></canvas>
							<!--#endif-->
							<!--#ifndef MP-ALIPAY -->
							<canvas canvas-id="canvasRing2" id="canvasRing2" class="charts" @touchstart="touchRing2"></canvas>
							<!--#endif-->
						</view>
						<view class="taxesDetailed">
							<view class="titel">税金明细：</view>
							<view>房款总价：{{totalPrice2}}万元</view>
							<view class="dian1">增值税：{{yhTax}}元</view>
							<view class="dian2">契税：{{qTax2}}元</view>
							<view class="dian4">印花税：{{individualTax}}元</view>
							<view class="dian3">个人所得税：{{stamptax}}元</view>
							<view class="dian5">工本印花税：{{costtax}}元</view>
							<view class="dian6">综合地价款：{{syntheticaltax}}元</view>
							<view class="dian7">土地出让金：{{tdcrjTax}}元</view>
							<view>税金总额：{{taxTotal2}}元</view>
							<view class="titel">以上计算结果仅供参考</view>
						</view>
					</view>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>

</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import newHouse from '../../components/calculator/newHouse.vue'
	import esfHouse from '../../components/calculator/esfHouse.vue'
	import uCharts from '@/components/u-charts/u-charts.js';
	var canvaRing = null,canvaRing2 = null;
	export default {
		components: {
			uniIcon,
			newHouse,
			esfHouse
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [{
					name: '新房',
					id: 'newshouse'
				}, {
					name: '二手房',
					id: 'esfhouse'
				}],
				scrollTop:0,
				xfResult:false,
				esfResult:false,
				totalPrice:0,
				totalPrice2:0,
				qTax:0,
				qTax2:0,
				htgbTax:0,
				wxjjTax:0,
				qsdjTax:0,
				taxTotal:0,
				taxTotal2:0,
				yhTax:0,
				individualTax:0,
				stamptax:0,
				costtax:0,
				syntheticaltax:0,
				tdcrjTax:0,
			}
		},
		onLoad() {
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: (res) => {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						this.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(375);
			this.cHeight = uni.upx2px(500);
			uni.$on('taxResult',data => {
				//console.log('监听到事件来自 update ，携带参数 msg 为：' + data.zongjia);
				if(data.type == 'xf'){
					this.totalPrice = Number.parseFloat(data.zongjia);
					this.qTax = Number.parseInt(data.qishui);
					this.htgbTax = Number.parseInt(data.gongbenfei);
					this.wxjjTax = Number.parseInt(data.weixiujijin);
					this.qsdjTax = Number.parseInt(data.quanshudengjifei);
					this.taxTotal = Number.parseInt(data.shuifeizongjia);
					this.xfResult = true;
				}else{
					this.totalPrice2 = Number.parseFloat(data.house_total);
					this.qTax2 = Number.parseInt(data.deed); //契税
					this.yhTax = Number.parseInt(data.saletax); //增值税
					this.individualTax = Number.parseInt(data.individualIncometax); //印花税
					this.stamptax = Number.parseInt(data.stamptax); //个人所得税
					this.costtax = Number.parseInt(data.costtax); //工本印花税
					this.syntheticaltax = Number.parseInt(data.Syntheticaltax); //综合地价款
					this.taxTotal2 = Number.parseInt(data.total);
					this.tdcrjTax = Number.parseInt(data.tudichurangjin); //土地出让金
					this.esfResult = true;
				}
				this.getServerData(data);
				setTimeout(() => {
					let view = uni.createSelectorQuery().select(".qiun-title-bar");
					view.boundingClientRect(data => {
						//console.log("得到布局位置信息" + JSON.stringify(data));
						//console.log("节点离页面顶部的距离为" + data.top);
						this.scrollTop = data.top;
						uni.pageScrollTo({ //没有效果？
							scrollTop: this.scrollTop
						});
					}).exec();
				},1500)
			})
		},
		methods: {
			async changeTab(e) {
				let index = e.target.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
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
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			getServerData(obj) {
				let series;
				if(obj.type == 'xf'){
					series = [{
							"name": "契税",
							"data": Number.parseInt(obj.qishui),
							"color":'#bae796'
						},
						{
							"name": "工本费",
							"data": Number.parseInt(obj.gongbenfei),
							"color":'#ffa585'
						},
						{
							"name": "维修基金",
							"data": Number.parseInt(obj.weixiujijin),
							"color":'#00b6f1'
						},
						{
							"name": "权属登记费",
							"data": Number.parseInt(obj.quanshudengjifei),
							"color":'#ffd974'
						}
					];
				}else{
					series = [{
							"name": "增值税",
							"data": Number.parseInt(obj.saletax),
							"color":'#6dbffe'
						},
						{
							"name": "契税",
							"data": Number.parseInt(obj.deed),
							"color":'#baea96'
						},
						{
							"name": "印花税",
							"data": Number.parseInt(obj.individualIncometax),
							"color":'#fd6e9e'
						},
						{
							"name": "个人所得税",
							"data": Number.parseInt(obj.stamptax),
							"color":'#fffa59'
						},
						{
							"name": "工本印花税",
							"data": Number.parseInt(obj.costtax),
							"color":'#fda585'
						},
						{
							"name": "综合地价款",
							"data": Number.parseInt(obj.Syntheticaltax),
							"color":'#ff7c7d'
						},
						{
							"name": "土地出让金",
							"data": Number.parseInt(obj.tudichurangjin),
							"color":'#fd6e9e'
						}
					];
				}
				let Ring = {
					series: series
				};
				this.textarea = JSON.stringify(Ring.series);
				obj.type == 'xf' ? this.showRing("canvasRing", Ring) : this.showRing2("canvasRing2", Ring);
			},
			showRing(canvasId, chartData) {
				canvaRing = new uCharts({
					$this: this,
					canvasId: canvasId,
					type: 'ring',
					fontSize: 11,
					legend: false,
					/* title: {
						name: '',
						color: '#7cb5ec',
						fontSize: 25 * _self.pixelRatio,
						offsetY: -20 * _self.pixelRatio,
					},
					subtitle: {
						name: '',
						color: '#666666',
						fontSize: 15 * _self.pixelRatio,
						offsetY: 30 * _self.pixelRatio,
					}, */
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 40 * this.pixelRatio,
							lableWidth: 15
						}
					},
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					series: chartData.series,
					animation: true,
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					disablePieStroke: true,
					dataLabel: false,
				});
			},
			showRing2(canvasId, chartData) {
				canvaRing2 = new uCharts({
					$this: this,
					canvasId: canvasId,
					type: 'ring',
					fontSize: 11,
					legend: false,
					/* title: {
						name: '',
						color: '#7cb5ec',
						fontSize: 25 * _self.pixelRatio,
						offsetY: -20 * _self.pixelRatio,
					},
					subtitle: {
						name: '',
						color: '#666666',
						fontSize: 15 * _self.pixelRatio,
						offsetY: 30 * _self.pixelRatio,
					}, */
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 40 * this.pixelRatio,
							lableWidth: 15
						}
					},
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					series: chartData.series,
					animation: true,
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					disablePieStroke: true,
					dataLabel: false,
				});
			},
			touchRing(e) {
				canvaRing.showToolTip(e, {
					format: (item) => {
						return item.name + ':' + item.data
					}
				});
			},
			touchRing2(e) {
				canvaRing2.showToolTip(e, {
					format: (item) => {
						return item.name + ':' + item.data
					}
				});
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #F7F7F7;
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

	.bg-white {
		background-color: #fff;
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
	.font-gray{
		color: #9e9e9e;
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

		.charts {
			width:375rpx;
			height:500rpx;
			background-color: #FFFFFF;
		}

		.qiun-title-dot-light {
			border-bottom: solid 1px #e5e5e5;
			font-size: 32rpx;
			color: #000000;
			padding-bottom:20rpx;
			padding-top:10rpx;
		}

		.qiun-title-bar {
			width: 96%;
			padding: 10rpx 2%;
			flex-wrap: nowrap;
		}
		.taxesDetailed{
			.bg-white();
			.pad10();
			font-size:28rpx;
			padding: 20rpx;
			view{
				width: 400rpx;
				margin: 20rpx auto;
				padding-left: 40rpx;
				box-sizing: border-box;
			}
			.titel{
				.font-gray();
			}
			.dian1{
				position: relative;
				&::before{
					content: "";
					width: 20rpx;
					height: 20rpx;
					position:absolute;
					background-color: #1890ff;
					left: 0;
					top: 50%;
					margin-top: -10rpx;
					border-radius: 50%;
				}
			}
			.dian2{
				.dian1();
				&::before{
					background-color: #2fc25b;	
				}
			}
			.dian3{
				.dian1();
				&::before{
					background-color: #facc14;
				}
			}
			.dian4{
				.dian1();
				&::before{
					background-color: #fd6e9e;
				}
			}
			.dian5{
				.dian1();
				&::before{
					background-color: #fda585;
				}
			}
			.dian6{
				.dian1();
				&::before{
					background-color: #ff7c7d;
				}
			}
			.dian7{
				.dian1();
				&::before{
					background-color: #fd6e9e;
				}
			}
		}
	}
</style>
