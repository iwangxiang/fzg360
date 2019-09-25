<template>
	<view class="detailContainer">
		<image :src="info.thumb ? info.thumb : 'https://static.fzg360.com/images/app/nopic.gif'" style="height:500rpx;"></image>
		<view class="goodsCon">
			<view class="goodsName">{{info.name}}</view>
			<view class="goodsPrice"><text>{{info.price ? '￥'+info.price : '暂无价格'}}</text>剩余{{info.renum}}份</view>
			<view class="goodsPrice">需消耗积分：<text>{{info.point}}积分/张</text></view>
			<view class="goodsDetail">
				<u-parse v-if="info.notice" :content="info.notice" @preview="preview" @navigate="navigate" />
			</view>
			<view class="goodsDetail">
				<u-parse v-if="info.description" :content="info.description" @preview="preview" @navigate="navigate" />
			</view>
		</view>
		<view class="footBox on" v-if="info.renum > 0" @tap="doExprize">兑换</view><!--兑换完毕去掉on-->
		<view class="footBox" v-else>兑换完毕</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import uParse from '@/components/gaoyia-parse/parse.vue';
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				id:'',
				info:{},
			}
		},
		components: {
			uniIcon,
			fzgIcon,
			uParse
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad(option) {
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			uni.$once('login',() => { //监听登录事件
				this.id = option.id;
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/jifen/cargo?id='+option.id);
				return;
			}
			this.id = option.id;
			this.getData();
		},
		methods: {
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			},
			doExprize(){
				uni.showModal({
					title: '温馨提示',
					content: '确定使用'+this.info.point+'积分兑换改商品?',
					success: (res) => {
						if (res.confirm) {
							let params = {pid: this.id};
							uni.showLoading({title: '正在提交兑换...'});
							this.$http.get(this.$api.userApi('exprize'), { data: params}).then(res => {
								uni.hideLoading();
								uni.showToast({ title: res.data.info, icon: 'none'});
							}).catch(error => {
								uni.showToast({title:'该用户无效',icon:'none'});
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getData() {
				let params = { id: this.id};
				this.$http.get(this.$api.userApi('prizeView'), { data: params }).then(res => {
					if (res.data.status) {
						this.info = res.data.info;
					} else {
						uni.showToast({ title: res.data.info, icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
		}
	}
</script>
<style lang="less">
	page {
		background: #fff;
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
		padding: 20rpx;
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

	.font-gray {
		color: #9e9e9e;
	}

	.font-red {
		color: #e83836;
	}
	.detailContainer{
		image{
			width: 100%;
			height: auto;
		}
		.goodsCon{
		 padding: 10px;	
		 .goodsName{
			 font-size: 30rpx;
		 }
		 .goodsPrice{
			 font-size: 26rpx;
			 margin-top: 5px;
			 text{
				 .font-red();
				 margin-right: 10px;
			 }
		 }
		 .goodsDetail{
			 font-size: 26rpx;
			 margin-top:15px;
			 line-height: 42rpx;
		 }
		}
		.footBox{
			width: 100%;
			height: 100rpx;
			background-color: #f7f7f7;
			border-bottom: solid 1px #e5e5e5;
			font-size: 36rpx;
			text-align: center;
			line-height: 100rpx;
			color: #3f3f3f;
			position: fixed;
			bottom: 0;
			left: 0;
			&.on{
				background-color: #e83836;
				color: #fff;
			}
		}
		
	}
	
</style>
