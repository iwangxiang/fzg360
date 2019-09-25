<template>
	<view class="imagePreview">
		<view class="iSwiper">
			<swiper class="iSwiperContent" @change="swiperChange" :current="current">
				<swiper-item v-for="(item,index) in imgs" :key="index">
					<image :src="item.img" @tap="preImg(current)"></image>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				imgShow: false,
				images:[], //图片数组
				imgsTotal:0, //图片总数
				imgs:[], //图片集
				key:0, //传值过来的图片key值
				current:0, //图片索引
			}
		},
		onLoad(option){
			let data = JSON.parse(decodeURIComponent(option.data));
			//console.log(data)
			this.key = data.key || 0;
			this.imgs = data.imgs || [];
			this.imgsTotal = Number.parseInt(this.imgs.length) || 0;
			this.imgs.map((item,index) => {
				if(item.key == this.key){
					this.current = index;
				}
				this.images.push(item.img);
			})
			this.setBarTitle(this.current + 1,this.imgsTotal);
		},
		methods: {
			setBarTitle(index,total){ //改变导航栏标题
				uni.setNavigationBarTitle({
					title: index + '/' + total
				})
			},
			swiperChange(e){
				//console.log(e.detail.source)
				this.current = Number.parseInt(e.detail.current);
				this.setBarTitle(this.current + 1,this.imgsTotal);
			},
			preImg(index){
				if (this.imgShow) { //防止点击过快导致重复调用 
					return;
				}
				this.imgShow = true;
				setTimeout(() => {
					this.imgShow = false;
				}, 1000)
				setTimeout(() => {
					uni.previewImage({
						current: this.images[index],
						urls: this.images
					})
				}, 150)
			},
		},
		onNavigationBarButtonTap(e){
			if(e.index == 0){
				uni.saveImageToPhotosAlbum({
					filePath: this.images[this.current],
					success: function () {
						uni.showToast({icon: 'none',title: '保存成功'});
					}
				});
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #010101;
		height: 100%;
	}
	.imagePreview{
		height: 100%;
		display: flex;
		align-items: center;
		.iSwiper{
			width: 100%;
			height: 500rpx;
			.iSwiperContent{
				height: 500rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
