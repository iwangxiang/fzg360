<template>
	<view class="jsqCon">
		<view class="jsqList">
			<view>物业类型：</view>
			<view class="jsqRight" @tap="actionSheetTap">
				<view class="selectRight">{{list[propertyType]}}</view>
				<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
			</view>
		</view>
		<view class="jsqList">
			<view>计算方式：</view>
			<view class="jsqRight" @tap="actionSheetTap2">
				<view class="selectRight">{{countList[countType]}}</view>
				<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
			</view>
		</view>
		<view class="jsqList">
			<view>房产购置年限：</view>
			<view class="jsqRight" @tap="actionSheetTap3">
				<view class="selectRight">{{yearList[yearType]}}</view>
				<uni-icon type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
			</view>
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
			<view>是否唯一住房：</view>
			<view class="jsqRight">
				<radio-group class="radioBox" @change="radioChange2">
					<label class="radioList" v-for="(item, index) in radioItems" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === onlyCurrent" color="#e83836" style="transform:scale(0.7)"  />
						</view>
						<view>{{item.gender}}</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="jsqList">
			<view>建筑面积：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="houseArea" placeholder="请输入建筑面积" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">平方</view>
		</view>
		<view class="jsqList">
			<view>总价：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="housePrice" placeholder="请输入总价" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">万元</view>
		</view>
		<view class="jsqList" v-if="countway == 2">
			<view>原价：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="ophouse" placeholder="请输入原价" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">万元</view>
		</view>
		<button type="primary" class="jsqBottom" hover-class="bg-red1" @tap="calculate">开始计算</button>
		<page-head></page-head>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import pageHead from '../../components/pageHead.vue'
	export default {
		components: {
			uniIcon,
			pageHead
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
				onlyCurrent:0,
				propertyType: 0,
				list:['普通住宅', '非普通住宅', '经济适用房'],
				countType: 0,
				countList:['按总价计算', '按差价计算'],
				yearType: 0,
				yearList:['不满两年','满两年不满五年','满五年'],
				housenature:1,
				countway:1,
				houseYear:1,
				firsthouse:1,
				onlyhouse:1,
				houseArea:'',
				housePrice:'',
				ophouse:'',
			}
		},
		onLoad() {},
		methods: {
			actionSheetTap() {
				uni.showActionSheet({
					/* title:'标题', */
					itemList: this.list,
					itemColor: "#007AFF",
					success: (e)=>{
						this.propertyType = e.tapIndex;
						this.housenature = e.tapIndex + 1;
						//console.log(this.housenature)
					}
				})
			},
			actionSheetTap2() {
				uni.showActionSheet({
					itemList: this.countList,
					itemColor: "#007AFF",
					success: (e)=>{
						this.countType = e.tapIndex;
						this.countway = e.tapIndex + 1;
						//console.log(this.countway)
					}
				})
			},
			actionSheetTap3() {
				uni.showActionSheet({
					itemList: this.yearList,
					itemColor: "#007AFF",
					success: (e)=>{
						this.yearType = e.tapIndex;
						this.houseYear = e.tapIndex + 1;
						//console.log(this.houseYear)
					}
				})
			},
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
						this.onlyCurrent = i;
						this.onlyhouse = this.onlyCurrent ? 0 : 1;
						//console.log(this.onlyhouse)
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
					uni.showToast({icon: 'none',title: '请输入总价'});
					return;
				}
				if(!/^\d+(\.\d+)?$/.test(this.housePrice)){
					uni.showToast({icon: 'none',title: '请输入正确的总价'});
					return;
				}
				let params = {
					area:this.houseArea,
					price:this.housePrice,
					houseYear:this.houseYear,
					onlyhouseIf:this.onlyhouse,
					firsthouseIf:this.firsthouse,
					countway:this.countway,
					housenature:this.housenature,
					type:'esf'
				};
				if(this.countway == 2) params['ophouse'] = this.ophouse;
				this.$http.post(this.$api.siteApi(this.$city,'taxs'), {data: params}).then(res => {
					if(!res.data){
						uni.showToast({title:'计算失败',icon:'none'});
						return;
					}
					//console.log(res.data)
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

				.arrowRight {
					margin-right: -10upx;
				}

				.jsqInput {
					text-align: right;
					width: 100%;
					padding-right: 10upx;
					box-sizing: border-box;
					color: #9e9e9e;
					font-size: 32rpx;
				}
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
