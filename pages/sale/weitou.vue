<template>
	<view class="jsqCon">

		<view class="jsqList">
			<view>小区名称：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="text" v-model="title" placeholder="请填写小区名称" placeholder-style="color:#9e9e9e;" />
			</view>
		</view>
		<view class="jsqList">
			<view>建筑面积：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="digit" v-model="area" placeholder="请填写建筑面积" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">平米</view>
		</view>
		<view class="jsqList">
			<view>售价：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="text" v-model="price" placeholder="请输入价格" placeholder-style="color:#9e9e9e;" />
			</view>
			<view class="dw">万元/套</view>
		</view>
		<view class="jsqList">
			<view>姓名：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="text" v-model="name" placeholder="请输入姓名" placeholder-style="color:#9e9e9e;" />
			</view>
		</view>
		<view class="jsqList">
			<view>联系电话：</view>
			<view class="jsqRight">
				<input class="jsqInput" type="text" v-model="tel" placeholder="请输入联系电话" placeholder-style="color:#9e9e9e;" />
			</view>
		</view>
		<button type="primary" class="jsqBottom" hover-class="bg-red1" @tap="doSubmit">确认发布</button>
	</view>
</template>

<script>
	export default {
    data() {
        return {
			title:'',
			area:'',
			price:'',
			name:'',
			tel:'',
		}
    },
    methods: {
		doSubmit() {
			if(!this.title){
				uni.showToast({icon: 'none',title: '请输入小区名称'});
				return false;
			}
			if(!this.area){
				uni.showToast({icon: 'none',title: '请输入建筑面积'});
				return false;
			}
			if(!this.price){
				uni.showToast({icon: 'none',title: '请输入售价'});
				return false;
			}
			if(!this.name){
				uni.showToast({icon: 'none',title: '请输入姓名'});
				return false;
			}
			if(!this.tel || this.tel.length !== 11 || !/^1[345678]\d{9}$/.test(this.tel)){
				uni.showToast({icon: 'none',title: '手机号不正确'});
				return false;
			}
			let params = {title:this.title,area:this.area,price:this.price,name:this.name,tel:this.tel,city:uni.getStorageSync('city')};
			this.$http.post(this.$api.fuberApi('doSaleForm'), {data: params}).then(res => {
				if(res.data.status){
					uni.showToast({title:res.data.info,icon:'none'});
					setTimeout(() => {
						uni.reLaunch({
							url:'/pages/user/index'
						})
					},1000)
				}else{
					uni.showToast({title:res.data.info,icon:'none'});
				}
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

				.selectRight {
					color: #9e9e9e;
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
