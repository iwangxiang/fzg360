<template>
	<view class="resultCon">
		<view class="resultType">等额本{{current == 1 ? '金' : '息'}}</view>
		<view class="resultTip">{{current == 1 ? '每月还款额递减，所还总利息较低，前期还款额较大。' : '每月还款额固定，所还总利息较多，适合收入稳定者。'}}</view>
		<template v-if="Object.keys(calcResults).length">
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
			<view>
				<view class="dian1">贷款总额：</view>
				<view>{{formatNum(Number(calcResults.totalLoan))}}元</view>
			</view>
			<view>
				<view>还款总额：</view>
				<view>{{formatNum(Number(calcResults.totalPay))}}元</view>
			</view>
			<view>
				<view class="dian2">支付利息：</view>
				<view>{{formatNum(Number(calcResults.totalRate))}}元</view>
			</view>
			<view>
				<view>月均还款：</view>
				<view>{{formatNum(Number(calcResults.perMonAvg))}}元</view>
			</view>
			<template v-if="isZuhe">
				<view>
					<view>公积金按揭年数：</view>
					<view>{{calcResults.anjie_jijin}}</view>
				</view>
				<view>
					<view>公积金利率：</view>
					<view>{{calcResults.lilv_jijin*100}}%</view>
				</view>
				<view>
					<view>商业按揭年数：</view>
					<view>{{calcResults.anjie_shangye}}</view>
				</view>
				<view>
					<view>商业利率：</view>
					<view>{{calcResults.lilv_shangye*100}}%</view>
				</view>
			</template>
			<template v-else>
				<view>
					<view>按揭年数：</view>
					<view>{{calcResults.anjie}}</view>
				</view>
				<view>
					<view>利率：</view>
					<view>{{calcResults.lilv*100}}%</view>
				</view>
			</template>
		</view>
		<view class="resultTxt">以上结果仅供参考</view>
		<view class="resultBox">
			<view class="yearList" v-for="(item,index) in yearList" :key="index">
				<view class="resultList" v-if="index%12 == 0">
					<view>月份</view>
					<view>月供</view>
					<view>月供本金</view>
					<view>月供利息</view>
					<view>剩余贷款</view>
				</view>
				<view class="yearBox" v-if="index%12 == 0">第{{yearList[index].year}}年</view>
				<view class="dateBox">
					<view>{{index%12+1}}月</view>
					<view>¥{{calcResults.perMonPay[index]}}</view>
					<view>¥{{calcResults.perMonCap[index]}}</view>
					<view>¥{{calcResults.perMonRate[index]}}</view>
					<view>¥{{calcResults.lavaLoan[index]}}</view>
				</view>
			</view>
		</view>
		</template>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import uCharts from '@/components/u-charts/u-charts.js';
	var canvaRing = null;
	export default {
		components: {
			uniIcon,
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				loanMoney:'', //贷款金额
                months:'', //贷款年限
                rate:'', //贷款利率
                current: 0, //等额本息或等额本金
                isZuhe: 0, //是否组合贷款
                totalMoney:'', //组合贷款总额
                businessLoanMoney:'', //组合贷款的商业贷款金额
                businessMonths:'', //组合贷款的商业贷款年限
                businessRate:'', //组合贷款的商业贷款利率
                calcResults:{}, //计算结果
				yearList:[],
			}
		},
		onLoad(option) {
			if(!Object.keys(option).length){
				uni.redirectTo({
					url:'./index'
				})
				return;
			}
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
			this.loanMoney = option.loanMoney;
            this.months = option.months;
            this.rate = option.rate;
            if(option.isZuhe){
                this.isZuhe = option.isZuhe;
                this.businessLoanMoney = option.businessLoanMoney;
                this.businessMonths = option.businessMonths;
                this.businessRate = option.businessRate;
            }
			this.current = option.current || 0;
			if(this.isZuhe){ //组合贷款
				let fundResults = {},businessResults = {};
				if(this.current == 1){//等额本金
					fundResults = this.benjinResult(this.loanMoney,this.rate,this.months);
					businessResults = this.benjinResult(this.businessLoanMoney,this.businessRate,this.businessMonths);
				}else{//等额本息
					fundResults = this.benxiResult(this.loanMoney,this.rate,this.months);
					businessResults = this.benxiResult(this.businessLoanMoney,this.businessRate,this.businessMonths);
				}
				this.calcResults = this.getZuheResult(fundResults, businessResults);
			}else{ //商业贷款或公积金贷款
				this.calcResults = this.current == 1 ? this.benjinResult(this.loanMoney,this.rate,this.months) : this.benxiResult(this.loanMoney,this.rate,this.months);
				this.formatResult(this.calcResults);
			}
			let whichYear = 1;
			for (let i = 0; i < this.calcResults.loan_mon; i++) {
				if(i > 0 && i%12 == 0){
					whichYear++;
				}
				let aryItem = {
					year:whichYear,
					index:i
				};
				this.yearList.push(aryItem);
			}
			this.getServerData(this.calcResults.totalLoan,this.calcResults.totalRate);
		},
		methods: {
			benxiResult(loanMoney,rate,months) { //等额本息
                let calcResults = {};
                let rateMonth = rate / 12;
                let vagPay = (loanMoney * 10000 * rateMonth * Math.pow(1 + rateMonth, months) / (Math.pow(1 + rateMonth, months) - 1));
                calcResults.anjie = months / 12 + "年(" + months + "期)";
                calcResults.lilv = rate;//贷款利率
                calcResults.loan_mon = months;//贷款期数
                calcResults.totalLoan = loanMoney*10000; //贷款总额
                calcResults.perMonPay = this.getBenxiMonthMoney(loanMoney,rate,months); //月供
                calcResults.totalPay = (vagPay * months).toFixed(0); //还款总额
                calcResults.totalRate = (calcResults.totalPay - calcResults.totalLoan).toFixed(0); //支付利息
                calcResults.perMonCap = this.getPerMonCap(loanMoney*10000, rate, months, vagPay); //月供本金
                calcResults.perMonRate = this.getDengxPerRate(months, vagPay, calcResults.perMonCap); //月供利息
                calcResults.lavaLoan = this.getDengxLavaLoan(loanMoney*10000, calcResults.perMonCap); //剩余贷款
                calcResults.perMonAvg = vagPay.toFixed(0); //月均还款
                return calcResults;
            },
            benjinResult(loanMoney,rate,months) { //等额本金
                let calcResults = {};
                /*let rateMonth = rate / 12;
                let vagPay = (loanMoney * 10000 * rateMonth * Math.pow(1 + rateMonth, months) / (Math.pow(1 + rateMonth, months) - 1));*/              
                calcResults.anjie = months / 12 + "年(" + months + "期)";                
                calcResults.lilv = rate; //贷款利率
                calcResults.loan_mon = months;//贷款期数
                calcResults.totalLoan = loanMoney*10000; //贷款总额
                calcResults.perMonPay = this.getBenjinMonthMoney(loanMoney,rate,months); //月供
                calcResults.perMonRate = this.getBenjPerMonRate(calcResults.perMonPay, loanMoney*10000); //月供利息
                calcResults.totalRate = Math.round(this.getBenjTotalRate(calcResults.perMonRate)); //支付利息
                calcResults.totalPay = Math.round(loanMoney * 10000 + this.getBenjTotalRate(calcResults.perMonRate)); //还款总额
                calcResults.perMonCap = this.getBenjPerMonCap(loanMoney,months); //月供本金
                calcResults.perMonAvg = (Number.parseInt(loanMoney * 10000 + this.getBenjTotalRate(calcResults.perMonRate)) / months).toFixed(0); //月均还款
				calcResults.lavaLoan = this.getBenjLavaLoan(loanMoney * 10000, calcResults.perMonCap, months); //剩余贷款
				return calcResults;
            },
            getBenxiMonthMoney(loanMoney,rate,months) { //计算等额本息月供，返回值为数组
                let result = [];
                let rateMonth = rate / 12;
                let rel = (loanMoney * 10000 * rateMonth * Math.pow(1 + rateMonth, months) / (Math.pow(1 + rateMonth, months) - 1)).toFixed(0);
                for (let i = 0; i < months; i++) {
                    result[i] = rel;
                }
                return result;
            },
            getPerMonCap(totalLoan, lilv, mon, yueg) {//获取每月支付本金额的函数，返回值为数组
                let result = [];
                result[0] = (yueg - totalLoan * lilv / 12).toFixed(0);
                for (let i = 1; i < mon; i++) {
                    totalLoan = totalLoan - result[i - 1];
                    result[i] = (yueg - totalLoan * lilv / 12).toFixed(0);
                }
                return result;
            },            
            getDengxPerRate(mon, yueg, perMonCap) {//获取每月利息额的函数，返回值为数组
                let result = [];
                for (let i = 0; i < mon; i++) {
                    result[i] = (yueg - perMonCap[i]).toFixed(0);
                }
                return result;
            },
            getDengxLavaLoan(totalLoan, perMonCap) {//根据贷款总额减去已还的本金，算出剩余的贷款
                let result = [];
                result[0] = Number(totalLoan).toFixed(0);
                for (let i = 1; i < perMonCap.length; i++) {
                    result[i] = (result[i - 1] - perMonCap[i]).toFixed(0) < 0 ? 0 : (result[i - 1] - perMonCap[i]).toFixed(0);
                }
                return result;
            },
            getBenjinMonthMoney(loanMoney,rate,months) { //计算等额本金月供，返回值为数组
                let result = [];
                let rateMonth = rate / 12;
                let benjin_month = loanMoney * 10000 / months;
                for (let i = 0; i < months; i++) {
                    result[i] = (loanMoney * 10000 - i * benjin_month) * rateMonth + benjin_month;
                }
                return result;
            },            
            getBenjPerMonRate(perMonthPay, total) { //算取每个月的利息额
                let result = [];
                let len = perMonthPay.length;
                let benjin_month = total / len;
                for (let i = 0; i < len; i++) {
                    result[i] = perMonthPay[i] - benjin_month;
                }
                return result;
            },            
            getBenjTotalRate(perMonRate) {//获取总利息额
                let result = 0;
                let len = perMonRate.length;
                for (let i = 0; i < len; i++) {
                    result += perMonRate[i];
                }
                return result;
            },
            getBenjPerMonCap(loanMoney,months) { //月供本金
                let result = [];
                let cap = loanMoney*10000 / months;
                for (let i = 0; i < this.months; i++) {
                    result[i] = cap;
                }
                return result;
            },
            getBenjLavaLoan(totalLoan, perMonCap, loan_mon) {//获取每月支付本金额的函数，返回值为数组
                let result = [];
                let len = loan_mon;
                let Cap = perMonCap[0];
                result[0] = Number.parseInt(totalLoan);
                for (let i = 1; i < len; i++) {
                    result[i] = result[i - 1] - Cap;
                }
                return result;
            },
            getZuheResult(jijinRes, shangyeRes) { //组合贷款
                let jijinResult = Object.assign({},jijinRes); //$.extend(true, {}, jijinRes);
                let shangyeResult = Object.assign({},shangyeRes); //$.extend(true, {}, shangyeRes);
                let zuhe_result = {};
                zuhe_result.loan_mon = jijinResult.loan_mon > shangyeResult.loan_mon ? jijinResult.loan_mon : shangyeResult.loan_mon;
                zuhe_result.anjie_jijin = jijinResult.anjie;
                zuhe_result.anjie_shangye = shangyeResult.anjie;
                zuhe_result.lilv_jijin = jijinResult.lilv;
                zuhe_result.lilv_shangye = shangyeResult.lilv;
                zuhe_result.totalLoan = Number.parseInt(jijinResult.totalLoan) + Number.parseInt(shangyeResult.totalLoan);
                zuhe_result.totalPay = Number.parseInt(jijinResult.totalPay) + Number.parseInt(shangyeResult.totalPay);
                zuhe_result.totalRate = Number.parseInt(jijinResult.totalRate) + Number.parseInt(shangyeResult.totalRate);
				zuhe_result.perMonPay = this.formatLavaLoan(this.getZuhePerMonPay(jijinResult, shangyeResult));
                zuhe_result.perMonAvg = this.formatLavaLoan(this.getZuheMonAvg(zuhe_result.loan_mon, zuhe_result.totalPay));
                zuhe_result.perMonRate = this.formatLavaLoan(this.getZuhePerMonRate(jijinResult, shangyeResult));
                zuhe_result.perMonCap = this.getZuhePerMonCap(jijinResult, shangyeResult);
                zuhe_result.lavaLoan = this.formatLavaLoan(this.getZuhelavaLoan(zuhe_result.perMonCap, zuhe_result.totalLoan, zuhe_result.loan_mon));
                zuhe_result.perMonCap = this.formatLavaLoan(this.getZuhePerMonCap(jijinResult, shangyeResult));
                zuhe_result.totalPay = Number.parseInt(jijinResult.totalPay) + Number.parseInt(shangyeResult.totalPay);
                return zuhe_result;
            },            
            getZuhePerMonPay(jijin, shengye) {//求得每个月月供---数组
                let result = Object.assign({},jijin.loan_mon > shengye.loan_mon ? jijin.perMonPay : shengye.perMonPay);
                let temp = Object.assign({},jijin.loan_mon > shengye.loan_mon ? shengye.perMonPay : jijin.perMonPay);
                let loan_mon = jijin.loan_mon < shengye.loan_mon ? jijin.loan_mon : shengye.loan_mon;
                let len = jijin.loan_mon < shengye.loan_mon ? shengye.loan_mon : jijin.loan_mon;
                for (let i = 0; i < loan_mon; i++) {
					result[i] = Number(result[i]) + Number(temp[i]);
                }
                result.length = len;
                return result;
            },
            formatLavaLoan(lavaLoan) {//转换剩余贷款额
                let len = lavaLoan.length;
                for (let i = 0; i < len; i++) {
					lavaLoan[i] = this.formatNum(Math.round(lavaLoan[i]));
                }
                return lavaLoan;
            },
			formatResult(obj) {
				this.formatLavaLoan(obj.perMonPay);
				this.formatLavaLoan(obj.perMonCap);
				this.formatLavaLoan(obj.perMonRate);
				this.formatLavaLoan(obj.lavaLoan);
			},
            formatNum(strNum) {//格式化为金钱格式
                if (strNum.length <= 3) {
                    return strNum;
                }
                if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                    return strNum;
                }
                let a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
                let re = new RegExp();
                re.compile("(\\d)(\\d{3})(,|$)");
                while (re.test(b)) {
                    b = b.replace(re, "$1,$2$3");
                }
                return a + "" + b + "" + c;
            },
            getZuheMonAvg(loan_mon, totalPay) {//求得每个月月供的均值
				return Number.parseInt(totalPay / loan_mon);
            },
            getZuhePerMonRate(jijin, shangye) {//计算每个月的利息---数组
                let result = Object.assign({},jijin.loan_mon > shangye.loan_mon ? jijin.perMonRate : shangye.perMonRate); //$.extend(true, {}, jijin.loan_mon > shangye.loan_mon ? jijin.perMonRate : shangye.perMonRate);
                let temp = Object.assign({},jijin.loan_mon > shangye.loan_mon ? shangye.perMonRate : jijin.perMonRate); //$.extend(true, {}, jijin.loan_mon > shangye.loan_mon ? shangye.perMonRate : jijin.perMonRate);
                let loan_mon = jijin.loan_mon < shangye.loan_mon ? jijin.loan_mon : shangye.loan_mon;
                let len = jijin.loan_mon < shangye.loan_mon ? shangye.loan_mon : jijin.loan_mon;
                for (let i = 0; i < loan_mon; i++) {
                    result[i] = Number(result[i]) + Number(temp[i]);
                }
                result.length = len;
                return result;
            },
            getZuhePerMonCap(jijin, shengye) {//计算每个月交出的本金额 ---数组
                let result = Object.assign({},jijin.loan_mon > shengye.loan_mon ? jijin.perMonCap : shengye.perMonCap); //$.extend(true, {}, jijin.loan_mon > shengye.loan_mon ? jijin.perMonCap : shengye.perMonCap);
                let temp = Object.assign({},jijin.loan_mon > shengye.loan_mon ? shengye.perMonCap : jijin.perMonCap); //$.extend(true, {}, jijin.loan_mon > shengye.loan_mon ? shengye.perMonCap : jijin.perMonCap);
                let loan_mon = jijin.loan_mon < shengye.loan_mon ? jijin.loan_mon : shengye.loan_mon;
                let len = jijin.loan_mon < shengye.loan_mon ? shengye.loan_mon : jijin.loan_mon;
                for (let i = 0; i < loan_mon; i++) {
                    result[i] = Number(result[i]) + Number(temp[i]);
                }
                result.length = len;
                return result;
            },
            getZuhelavaLoan(zuhePerMonPay, zuheTotalLoan, zuheLoan_mon) {//计算每个月的剩余贷款额 ---数组
                let result = [];
                result[0] = Number(zuheTotalLoan);
                for (let i = 1; i < zuheLoan_mon; i++) {
                    result[i] = Number(result[i - 1]) - Number(zuhePerMonPay[i]);
                }
                return result;
            },
			getServerData(totalLoan,totalRate) {
				let Ring = {
					series: [{
							"name": "贷款总额",
							"data": Number.parseInt(totalLoan)
						},
						{
							"name": "支付利息",
							"data": Number.parseInt(totalRate)
						}
					]
				};
				for(let i = 0 ;i < Ring.series.length;i++){
					Ring.series[i].format=()=>{return Ring.series[i].name+Ring.series[i].data};
				}
				this.textarea = JSON.stringify(Ring);
				setTimeout(() => {
					this.showRing("canvasRing", Ring);
				},1000);
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
			touchRing(e) {
				canvaRing.showToolTip(e, {
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
		background: #fff;
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
		padding: 0 20upx;
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

	.fontGray {
		color: #9e9e9e
	}

	.fontRed {
		color: #e83836
	}

	.bg-white {
		background-color: #fff;
	}

	.resultCon {
		.resultType {
			width: 710upx;
			height: 68upx;
			line-height: 68upx;
			text-align: center;
			margin: 20upx auto 0 auto;
			.boder();
			border-color: #e83836;
			font-size: 36upx;
			border-radius: 10upx;
			.fontRed();
		}

		.resultTip {
			font-size: 24upx;
			.fontGray();
			text-align: center;
			line-height: 48upx;
			height: 48upx;
		}

		.charts {
			width: 375upx;
			height: 500upx;
			background-color: #FFFFFF;
			margin: 0 auto;
		}

		.qiun-title-dot-light {
			border-bottom: solid 1px #e5e5e5;
			font-size: 32upx;
			color: #000000;
			padding-bottom: 20upx;
			padding-top: 10upx;
		}

		.qiun-title-bar {
			width: 96%;
			padding: 10upx 2%;
			flex-wrap: nowrap;
		}

		.taxesDetailed {
			.boder();
			border-bottom-color: #e5e5e5;
			.bg-white();
			.pad10();
			font-size: 28upx;
			padding: 20upx;

			&>view {
				width: 710upx;
				margin: 20upx auto;
				box-sizing: border-box;
				.uniRow();
				justify-content: space-between;
				align-items: center;

				&>view {
					padding-left: 60upx;
				}

				&>view:nth-child(2) {
					.fontGray();
				}
			}

			.titel {
				.fontGray();
			}

			.dian1 {
				position: relative;

				&::before {
					content: "";
					width: 20upx;
					height: 20upx;
					position: absolute;
					background-color: #1890ff;
					left: 0;
					top: 50%;
					margin-top: -10upx;
					border-radius: 50%;
				}
			}

			.dian2 {
				.dian1();

				&::before {
					background-color: #2fc25b;
				}
			}

		}

		.resultTxt {
			font-size: 28upx;
			text-align: center;
			height: 80upx;
			line-height: 80upx;
			.fontGray();
		}

		.resultBox {
			.uniColumn();
			font-size: 28upx;

			.resultList {
				.uniRow();
				height: 80upx;
				line-height: 80upx;
				background-color: #e5e5e5;
				text-align: left;
				padding: 0 20upx;

				&>view {
					padding-right: 30upx;
					box-sizing: border-box;
				}

				&>view:nth-of-type(1) {
					width: 14%;
				}

				&>view:nth-of-type(2) {
					width: 23%;
				}

				&>view:nth-of-type(3) {
					width: 23%;
				}

				&>view:nth-of-type(4) {
					width: 23%;
				}

				&>view:nth-of-type(5) {
					width: 27%
				}
			}

			.yearList {
				.yearBox {
					height: 60upx;
					line-height: 60upx;
					text-align: left;
					color: #666;
					background-color: #f2f2f2;
					padding: 0 20upx;
				}
				

				.dateBox {
					.uniRow();
					height: 60upx;
					line-height: 60upx;
					text-align: left;
					.fontGray();
					padding: 0 20upx;

					&>view {
						padding-right: 30upx;
						box-sizing: border-box;
					}

					&>view:nth-of-type(1) {
						width: 14%;
					}

					&>view:nth-of-type(2) {
						width: 23%;
					}

					&>view:nth-of-type(3) {
						width: 23%;
					}

					&>view:nth-of-type(4) {
						width: 23%;
					}

					&>view:nth-of-type(5) {
						width: 27%
					}
				}

			}

		}

	}
</style>
