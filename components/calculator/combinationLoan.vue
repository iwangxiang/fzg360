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
			<view>公积金贷款金额：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="number" v-model="fundLoanMoney" placeholder="80" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">万元</view>
		</view>
		<view class="jsqList">
			<view>公积金按揭年数：</view>
			<view class="jsqRight">
				<picker @change="bindPickerChange" :value="fundYearIndex" :range="fundYearList" range-key="year" class="jsqpicker">
					<view>
						<text class="selectRight">
							{{fundYearList[fundYearIndex].year}}
						</text>
						<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
					</view>
				</picker>
			</view>
		</view>
		<view class="jsqList">
			<view>公积金利率：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="fundLoanRate" placeholder="3.25" placeholder-style="color:#9e9e9e;" />
			</view>
		</view>
		<view class="jsqList">
			<view>商业贷款金额：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="number" v-model="businessLoanMoney" placeholder="80" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">万元</view>
		</view>
		<view class="jsqList">
			<view>商业按揭年数：</view>
			<view class="jsqRight">
				<picker @change="bindPickerChange2" :value="businessYearIndex" :range="businessYearList" range-key="year" class="jsqpicker">
					<view>
						<text class="selectRight">
							{{businessYearList[businessYearIndex].year}}
						</text>
						<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
					</view>
				</picker>
			</view>
		</view>
		<view class="jsqList">
			<view>商业利率：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="businessLoanRate" placeholder="4.90" placeholder-style="color:#9e9e9e;" />
			</view>
		</view>
		<view class="remarks">备注：<text>公积金贷款利率3.25%。商业贷款利率4.9%。</text></view>
		<button type="primary" class="jsqBottom" hover-class="bg-red1" @tap="calculate">开始计算</button>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui'
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
				fundLoanMoney:80, //公积金贷款金额
				businessLoanMoney:100, //商业贷款金额
				fundLoanYear:'20年(240期)', //公积金贷款年限
				businessLoanYear:'20年(240期)', //商贷年限
				fundLoanRate:3.25, //公积金贷款利率
				actFundRate:0.0325,
				businessLoanRate:4.9, //商贷利率
				actBusinessRate:0.049,
				fundYearList:[], //公积金按揭年数数组
				fundYearIndex:19, //公积金按揭年数初始化索引
				businessYearList:[], //商业贷款按揭年数数组
				businessYearIndex:19, //商业贷款按揭年数初始化索引
			}
		},
		created() {
			for (let i = 1; i < 31; i++) {
				this.fundYearList.push({year:i + "年" + "(" + i * 12 + "期)"});
				this.businessYearList.push({year:i + "年" + "(" + i * 12 + "期)"});
			}
		},
		methods: {
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.fundYearIndex = e.target.value;
				this.fundLoanYear = this.fundYearList[e.target.value].year;
			},
			bindPickerChange2: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.businessYearIndex = e.target.value;
				this.businessLoanYear = this.businessYearList[e.target.value].year;
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
				if(!this.fundLoanMoney){
					uni.showToast({icon: 'none',title: '请输入公积金贷款额'});
					return;
				}
				if(!this.fundLoanRate){
					uni.showToast({icon: 'none',title: '请输入公积金贷款利率'});
					return;
				}
				if(!this.businessLoanMoney){
					uni.showToast({icon: 'none',title: '请输入商业贷款额'});
					return;
				}
				if(!this.businessLoanRate){
					uni.showToast({icon: 'none',title: '请输入商业贷款利率'});
					return;
				}
				let fundMonth = this.fundLoanYear.match(/\((\S*)\)/);
				let fundMonths = fundMonth[1].substr(0,fundMonth[1].length-1);
				this.actFundRate = this.fundLoanRate/100;
				let businessMonth = this.businessLoanYear.match(/\((\S*)\)/);
				let businessMonths = businessMonth[1].substr(0,businessMonth[1].length-1);
				this.actBusinessRate = this.businessLoanRate/100;
				uni.navigateTo({
					url:'../../pages/calcu/loanRes?loanMoney='+this.fundLoanMoney+'&businessLoanMoney='+this.businessLoanMoney+'&months='+fundMonths+'&businessMonths='+businessMonths+'&rate='+this.actFundRate+'&businessRate='+this.actBusinessRate+'&isZuhe=1&current='+this.current
				})
			}
		},
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
			padding: 15rpx 20rpx;
			font-size: 32rpx;
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
				height: 60rpx;
				line-height: 60rpx;
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
						margin-left: 30rpx;
					}
				}
			}

			.jsqInput {
				text-align: right;
				width: 100%;
				padding-right: 10rpx;
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
			font-size: 24rpx;
			color: #e83836;
			text-align: right;
			padding-right: 20rpx;
			line-height: 52rpx;

			text {
				color: #9e9e9e;
			}
		}

		.jsqBottom {
			width: 85%;
			height: 80rpx;
			font-size: 32rpx;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			.bg-red();
			margin: 10% auto;
		}
	}
</style>
