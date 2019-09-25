<template>
	<view class="jsqCon">
		<view class="jsqList">
			<view>建筑面积：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="houseArea" placeholder="请输入面积" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">平方</view>
		</view>
		<view class="jsqList">
			<view>单价：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="housePrice" placeholder="请输入单价" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">元/平方</view>
		</view>
		<view class="jsqList">
			<view>是否首次购房：</view>
			<view class="jsqRight">
				<radio-group class="radioBox" @change="radioChange">
					<label class="radioList" v-for="(item, index) in radioItems" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" color="#e83836" style="transform:scale(0.7)"  />
						</view>
						<view>{{item.gender}}</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="jsqList">
			<view>是否包含电梯：</view>
			<view class="jsqRight">
				<radio-group class="radioBox" @change="radioChange2">
					<label class="radioList" v-for="(item, index) in radioItems" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === elevatorCurrent" color="#e83836" style="transform:scale(0.7)"  />
						</view>
						<view>{{item.gender}}</view>
					</label>
				</radio-group>
			</view>
		</view>
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
						value: 'ture',
						gender: '是',
						checked: 'true'
					},
					{
						value: 'flase',
						gender: '否',
					},
				],
				current: 0,
				elevatorCurrent:0,
				houseArea:'',
				housePrice:'',
				firsthouse:1,
				elevator:1,
			}
		},
		onLoad() {
			
		},
		methods: {
			radioChange(evt) {
				for (let i = 0; i < this.radioItems.length; i++) {
					if (this.radioItems[i].value === evt.target.value) {
						this.current = i;
						this.firsthouse = this.current ? 0 : 1;
						//console.log(this.firsthouse)
						break;
					}
				}
			},
			radioChange2(evt) {
				for (let i = 0; i < this.radioItems.length; i++) {
					if (this.radioItems[i].value === evt.target.value) {
						this.elevatorCurrent = i;
						this.elevator = this.elevatorCurrent ? 0 : 1;
						//console.log(this.elevator)
						break;
					}
				}
			},
			calculate(){
				if(!this.houseArea){
					uni.showToast({icon: 'none',title: '请输入房屋面积'});
					return;
				}
				if(!/^\d+(\.\d+)?$/.test(this.houseArea)){
					uni.showToast({icon: 'none',title: '请输入正确的房屋面积'});
					return;
				}
				if(!this.housePrice){
					uni.showToast({icon: 'none',title: '请输入单价'});
					return;
				}
				if(!/^\d+(\.\d+)?$/.test(this.housePrice)){
					uni.showToast({icon: 'none',title: '请输入正确的单价'});
					return;
				}
				let params = {
					area:this.houseArea,
					price:this.housePrice,
					isFirstHouse:this.firsthouse,
					elevator:this.elevator,
					type:'xf',
					houseType:1
				};
				this.$http.post(this.$api.siteApi(this.$city,'taxs'), {data: params}).then(res => {
					if(!res.data.data){
						uni.showToast({title:'计算失败',icon:'none'});
						return;
					}
					uni.$emit('taxResult',res.data.data);
				}).catch(error => {
					console.error('error:',error);
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
				justify-content: flex-end;
				align-items: center;
				padding-right: 10upx;
				.radioBox {
					.uniRow();

					label {
						.uniRow();
						flex: 1;
						text-align: center;
						justify-content: center;
						margin-left: 60upx;
					}
				}

				.selectRight {
					color: #9e9e9e;
				}
			}

			.jsqInput {
				text-align: right;
				width: 100%;
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
		.qiun-charts {
			width: 750upx;
			height: 500upx;
			background-color: #FFFFFF;
		}
		
		.charts {
			width: 750upx;
			height: 500upx;
			background-color: #FFFFFF;
		}
	}
</style>
