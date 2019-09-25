<template>
	<view class="allPics">
		<view class="effectImages" v-for="(img,index) in imgs" :key="index">
			<view class="eiTitle">
				{{catalog[index]}}
			</view>
			<view class="eiContent">
				<view v-for="item in img" :key="item.key" @tap="goPhoto(item)"><image :src="item.img_s ? item.img_s : 'https://static.fzg360.com/images/app/nopic.gif'"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				imgs:{}, //图片集
				catalog:{}, //相册分类
				imgsTotal:0,
			}
		},
		onLoad(option){
			let data = JSON.parse(decodeURIComponent(option.data));
			//console.log(data)
			this.imgs = data.imgs || {};
			this.catalog = data.catalog || {};
			this.imgsTotal = Number.parseInt(data.imgsTotal) || 0;
		},
		methods:{
			goPhoto(item){
				let data = {
					key:item.key,
					catalog:this.catalog,
					imgs:this.imgs,
					imgsTotal:this.imgsTotal
				};
				uni.navigateTo({
					url:`/pages/house/pics?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
		}
	}
</script>

<style lang="less">
	.allPics{
		background-color: #e5e5e5;
		.effectImages,.peripheryImages{
			padding: 0 20rpx;
			background-color: #ffffff;
			.eiTitle{
				padding: 20rpx 0 40rpx 0;
				font-size: 32rpx;
				color: #333333;
			}
			.eiContent{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				&>view{
					width: 223rpx;
					height: 178rpx;
					border:1px solid #e5e5e5;
					margin-bottom: 20rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.peripheryImages{
			margin-top: 20rpx;
		}
	}
</style>
