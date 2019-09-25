<template>
	<view class="detailsPics">
		<view class="content">
			<view class="header">
				<view class="headerTab">
					<scroll-view class="uni-swiper-tab" scroll-x="true" :scroll-left="scrollLeft">
						<view v-for="(item,index) in types" :key="index" :data-current="index" :data-id="item.id" :data-begin="item.begin" :data-end="item.end" class="swiper-tab-list" :class="{active: typeId == index}" @tap="doTab">
							{{item.title}}
						</view>
					</scroll-view>
				</view>
				<view class="headerText">
					<view>{{catImgTitle}} {{catImgIndex}}/{{catImgTotal}}</view>
				</view>
			</view>
			<view class="cont">
				<view class="sectionName1">
					<view class="iSwiper">
						<swiper class="iSwiperContent" @change="swiperChange" :current="current">
							<template v-for="img in imgs">
								<swiper-item v-for="item in img" :key="item.id">
									<view class="rotate" v-if="item.catid && item.catid == 1" :data-title="item.alt" :data-url="item.link" @tap.stop="goWebView"><image src="../../static/rotate.png"></image></view>
									<view class="aerospace" v-if="item.catid && item.catid == 2" :data-title="item.alt" :data-url="item.link" @tap.stop="goWebView"><image src="../../static/aerospace.png"></image></view>
									<image @tap="preImg(current)" :src="item.img ? item.img : 'data:image/gif;base64,R0lGODlhgAJoAfcAANPT1f7+/tLS1P39/dXV19bW2Pv7+/z8/OLi49DQ0vPz9NnZ29fX2eHh4tjY2tvb3fX19dHR0+/v8Onp6vj4+NPT1uXl5t3d3u/v7/Pz8+fn6Ofn6fr6+vf39/Hx8ezs7ff3+Ovr7Orq6/T09dra3N3d3/z8/fT09ODg4dzc3uLi5O7u7/v7/Pb29tvb3OPj5P39/ubm5/Dw8Orq7OTk5fn5+t/f4fb29+Tk5ujo6e3t7t7e39zc3d7e4PLy8+Hh4/Dw8d/f4NfX2Pj4+fn5+enp6/r6+9bW2dXV1vX19tra29jY2dLS1fHx8uDg4tPT1P7+/f7+/9nZ2tTU1eXl5/Ly8tHR1NbW19TU1+Pj5ezs7P39/M/P0u3t7dXV2Pb2+Orq6v///u7u7uvr7djY2+np6ebm6Pv7+uzs7t7e4dDQ0+Pj4+vr6+Xl5dnZ3Ojo6O3t7+jo6uLi4ufn59vb28/P0fX19Pr6+eLi5ebm5tLS0/X199/f3/Hx8+/v8fPz9fz8+/Ly9Nvb3tfX2t3d4M7O0N3d3fT09vb29dra2vj499ra3dzc3+Dg4+7u8Pf39tTU2PLy8eHh4fj4+vz8/t/f4t7e3vr6/Pv7/dnZ2fDw8tHR0u7u7dLS1v39/+Pj5s3Nzs3N0PPz8unp7Pf39dDQ0fn5+PHx8OTk5Pf3+f///9TU1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5RjNBNTk2Q0YyMzExRTdBN0EwQjRERTkxQkUzNzQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5RjNBNTk3Q0YyMzExRTdBN0EwQjRERTkxQkUzNzQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTlGM0E1OTRDRjIzMTFFN0E3QTBCNERFOTFCRTM3NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTlGM0E1OTVDRjIzMTFFN0E3QTBCNERFOTFCRTM3NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAf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'"></image>
								</swiper-item>
							</template>
						</swiper>
					</view>
				</view>
			</view>
			<view class="footer">
				<view>
					<view @tap="toChat">掌聊</view>
					<view @tap="$util.doCall('',tel)">拨打热线</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue";
	export default{
		data(){
			return{
				imgShow: false,
				images:[], //图片数组
				imgsTotal:0, //图片总数
				imgs:{}, //图片集
				catalog:{}, //相册分类
				typeId:0,//相册分类id
				types:{},//该楼盘的相册分类
				key:0, //传值过来的图片key值
				current:0, //图片索引
				catImgTitle:'',//分类的图片名
				catImgIndex:0,//分类的图片索引
				catImgTotal:0,//分类的图片总数
				scrollLeft:0,
				managers:[],
				tel:''
			}
		},
		components:{
			fzgIcon
		},
		onLoad(option){
			let data = JSON.parse(decodeURIComponent(option.data));
			//console.log(data)
			this.managers = data.managers || [];
			this.tel = data.tel || '';
			this.imgsTotal = Number.parseInt(data.imgsTotal) || 0;
			this.imgs = data.imgs || {};
			this.catalog = data.catalog || {};
			this.key = Number.parseInt(data.key) || 0;
			let n = 0,a = 1;
			for(let i in this.imgs){
				n += this.imgs[i].length;
				this.types[i] = {id:a,title:this.catalog[i],count:this.imgs[i].length,begin:n-this.imgs[i].length,end:n};
				a++;
				for(let j = 0; j < this.imgs[i].length; j++){
					if(this.key == this.imgs[i][j].key){ //根据传值过来的key来获取相册图片名，图片索引及该分类下的图片总数
						this.catImgTitle = this.imgs[i][j].alt;
						this.catImgIndex = j + 1;
						this.catImgTotal = this.imgs[i].length;
						break;
					}
				}
			}
			//console.log(this.types)
			let m = 0, slideIndex = 0;
			for(let i in this.imgs){
				for(let j = 0; j < this.imgs[i].length; j++){
					if(this.key == this.imgs[i][j].key){ //根据传值过来的key来获取相册分类id及该图片的索引
						this.typeId = i;
						slideIndex = m;
					}
					m++;
					this.images.push(this.imgs[i][j].img);
				}
			}
			this.current = slideIndex;
			this.setBarTitle(this.current + 1,this.imgsTotal);
		},
		methods:{
			toChat() { 
			    if(!this.hasLogin || !this.userInfo.mid){
			        this.$tool.tab('user/index', '请登录聊天')
			    }
			    if(this.managers[0]){ // 多个经纪人,设置pop弹窗选择?
			        let mr = this.managers[0];
			        let params = "id="+mr.mid+"&name="+mr.name+"&thumb="+mr.thumb;
			        uni.navigateTo({
			        	url: "/pages/msg/chat?"+params
			        })
			    }else{
			        uni.showToast({title:'没有设置聊天经纪人。'})
			    }
			},
			setBarTitle(index,total){ //改变导航栏标题
				uni.setNavigationBarTitle({
					title: index + '/' + total
				})
			},
			goWebView(e){
				//console.log(e);
				let title = e.currentTarget.dataset.title,url = e.currentTarget.dataset.url;
				uni.navigateTo({
					url:"/pages/index/webView?title="+title+"&url=" + encodeURIComponent(url)
				});
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
			doTab(e){
				this.typeId = e.target.dataset.current;
				this.current = Number.parseInt(e.target.dataset.begin);
				//this.scrollLeft = e.target.dataset.id > 2 ? e.target.dataset.id * 45 : 0;
				/* this.setBarTitle(this.current + 1,this.imgsTotal);
				let end = e.target.dataset.end;
				this.catImgIndex = this.current > 0 ? (end - this.current - 1) : this.current + 1;
				this.catImgTotal = this.imgs[this.typeId].length; */
			},
			swiperChange(e){
				//console.log(e.detail.source)
				this.current = Number.parseInt(e.detail.current);
				for(let i in this.types){
					//根据图片切换的索引值获取图片分类的id
					if(this.current >= this.types[i].begin && this.current < this.types[i].end){
						this.catImgIndex = this.current - this.types[i].begin + 1;
						this.typeId = i;
						this.scrollLeft = this.types[i].id > 2 ? this.types[i].id * 45 : 0;
						break;
					}
				}
				//console.log(this.typeId)
				for(let j = 0; j < this.imgs[this.typeId].length; j++){
					if(this.catImgIndex == j + 1){
						this.catImgTitle = this.imgs[this.typeId][j].alt;
						break;
					}
				}
				this.catImgTotal = this.imgs[this.typeId].length;
				this.setBarTitle(this.current + 1,this.imgsTotal);
			},
		},
		onNavigationBarButtonTap(){
			let data = {imgs:this.imgs,catalog:this.catalog,imgsTotal:this.imgsTotal};
			uni.navigateTo({
				url:`./picAll?data=${encodeURIComponent(JSON.stringify(data))}`
			})
		}
	}
</script>

<style lang="less">
	@import '../../common/uni.css';
	page{
		height: 100%;
		background-color: #000000;
		.detailsPics{
			.content{
				border-top: 1px solid #676767;
				.header{
					padding: 0 20rpx;
					margin-top: 20rpx;
					.headerTab{
						.uni-swiper-tab {
						    height: 67rpx;
						    line-height: 67rpx;
							border-bottom: none;
						    .swiper-tab-list {
						        padding: 0 15rpx;
						        font-size: 28rpx;
						        border-radius: 40rpx;
						        text-align: center;
						        color: #ffffff;
						    }
						    .active{
						    	background-color: #535353;
						    	color: #ffffff;
						    }
						}
					}
					.headerText{
						color: #ffffff;
						font-size: 28rpx;
						margin-top: 20rpx;
					}
				}
				.cont{
					.sectionName1,.sectionName2{
						.iSwiper{
							position: absolute;
							top: 50%;
							left: 0;
							margin-top: -250rpx;
							width: 100%;
							height: 500rpx;
							.iSwiperContent{
								height: 500rpx;
								position: relative;
								.rotate{
									width: 114rpx;
									height: 121rpx;
									position: absolute;
									top: 50%;
									left: 50%;
									margin-top: calc(-114rpx/2);
									margin-left: calc(-121rpx/2);
									z-index: 9;
									image{
										width: 100%;
										height: 100%;
										vertical-align: text-top;
									}
								}
								.aerospace{
									width: 89rpx;
									height: 89rpx;
									position: absolute;
									top: 50%;
									left: 50%;
									margin-top: calc(-89rpx/2);
									margin-left: calc(-89rpx/2);
									z-index: 9;
									image{
										width: 100%;
										height: 100%;
										vertical-align: text-top;
									}
								}
								image{
									width: 100%;
									height: 100%;
								}
							}
						}
					}
				}
				.footer{
					position: absolute;
					bottom: 20rpx;
					left: 0;
					width: 100%;
					&>view{
						display: flex;
						justify-content: space-between;
						padding: 0 20rpx;
						&>view{
							width: 48%;
							height: 90rpx;
							color: #ffffff;
							border-radius: 10rpx;
							text-align: center;
							line-height: 90rpx;
							font-size: 28rpx;
						}
						&>view:nth-child(1){
							background-color: #EF8733;
						}
						&>view:nth-child(2){
							background-color: #E83836;
						}
					}
				}
			}
		}
	}
</style>