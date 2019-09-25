<template>
	<view class="jsqCon">
		<view class="jsqList">
			<view>还款方式：</view>
			<view class="jsqRight">
				<radio-group  class="radioBox" @change="radioChange">
					<label class="" v-for="(item, index) in radioItems" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" color="#e83836" style="transform:scale(0.7)" />
						</view>
						<view>{{item.gender}}</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="jsqList">
			<view>贷款金额：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="number" v-model="loanMoney" placeholder="80" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">万元</view>
		</view>
		<view class="jsqList">
			<view>按揭年数：</view>
			<view class="jsqRight">
				<picker @change="bindPickerChange" :value="yearIndex" :range="yearList" range-key="year" class="jsqpicker">
					<view>
						<text class="selectRight">
							{{yearList[yearIndex].year}}
						</text>
						<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
					</view>
				</picker>
			</view>
		</view>
		<view class="jsqList">
			<view>利率：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="loanRate" placeholder="3.25" placeholder-style="color:#9e9e9e;" />
				<!-- <input class="jsqInput" type="digit" placeholder="4.90" placeholder-style="color:#9e9e9e;" /> -->
			</view>
		</view>
		<view class="remarks">备注：<text>公积金贷款利率3.25%</text></view>
		<button type="primary" class="jsqBottom" hover-class="bg-red1" @tap="calculate">开始计算</button>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniIcon
		},
		data() {
			return {
				radioItems: [{
						value: 'benxi',
						gender: '等额本息',
						checked: 'true'
					},
					{
						value: 'benjing',
						gender: '等额本金',
					},
				],
				current: 0,
				loanMoney:80, //公积金贷款金额
				loanYear:'20年(240期)', //公积金贷款年限
				loanRate:3.25, //公积金贷款利率
				actRate: 3.25 / 100,
				yearList:[], //按揭年数数组
				yearIndex:19, //按揭年数初始化索引
			}
		},
		created() {
			for (let i = 1; i < 31; i++) {
				this.yearList.push({year:i + "年" + "(" + i * 12 + "期)"});
			}
		},
		methods: {
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.yearIndex = e.target.value;
				this.loanYear = this.yearList[e.target.value].year;
			},
			radioChange(evt) {
				for (let i = 0; i < this.radioItems.length; i++) {
					if (this.radioItems[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			calculate(){
				if(!this.loanMoney){
					uni.showToast({icon: 'none',title: '请输入公积金贷款额'});
					return;
				}
				if(!this.loanRate){
					uni.showToast({icon: 'none',title: '请输入公积金贷款利率'});
					return;
				}
				let month = this.loanYear.match(/\((\S*)\)/);
				let months = month[1].substr(0,month[1].length-1);
				this.actRate = this.loanRate/100;
				uni.navigateTo({
					url:'../../pages/calcu/loanRes?loanMoney='+this.loanMoney+'&months='+months+'&rate='+this.actRate+'&current='+this.current
				})
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
		background-color: #f7f7f7;
	}

	.bg-red {
		background-color: #e83836;
	}

	.bg-red1 {
		background-color: #cd0402;
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

	.jsqCon {
		.jsqList {
			background-color: #fff;
			position: relative;
			padding: 15upx 20upx;
			font-size: 32upx;
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

			view {
				height: 60upx;
				line-height: 60upx;
			}

			.jsqRight {
				flex: 1;
				.uniRow();
				align-items: center;

				.radioBox {
					.uniRow();

					label {
						.uniRow();
						flex: 1;
						text-align: center;
						justify-content: center;
						margin-left: 30upx;
					}
				}
			}

			.jsqInput {
				text-align: right;
				width: 100%;
				padding-right: 10upx;
				box-sizing: border-box;
				color: #9e9e9e;
				font-size: 32rpx;
			}

			.jsqpicker {
				flex: 1;

				view {
					.uniRow();
					justify-content: space-between;
				}
			}
			.selectRight{
				color: #9e9e9e;
			}
		}

		.remarks {
			font-size: 24upx;
			color: #e83836;
			text-align: right;
			padding-right: 20upx;
			line-height: 52upx;

			text {
				color: #9e9e9e;
			}
		}

		.jsqBottom {
			width: 85%;
			height: 80upx;
			font-size: 32upx;
			color: #fff;
			text-align: center;
			line-height: 80upx;
			.bg-red();
			margin: 10% auto;
		}
	}
</style>
