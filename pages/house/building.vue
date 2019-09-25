<template>
	<view class="floor">
		<view class="banner">
			<view v-if="buildingArr.length">
			<view v-for="(item,index) in buildingArr" :key="index" v-if="item.show" class="label_1" :class="'ldspan__'+item.saleStr" :style="{top: (item.topRelative + thumbTop - sOffsetTop) + 'px' , left: (item.leftRelative + thumbLeft - sOffsetLeft) + 'px',backgroundColor:(curBuildingID == item.id ? labelInfoColor : labelActiveColor) }" @tap="doLabel(item.id)">
				{{item.title}}
				<fzg-icon class="fzgIcon" type="open" size="10" color="#EE9044"></fzg-icon>
			</view>
			</view>
			<view class="iSelected" v-if="sectionbackground">
				<view class="sectionName1">
					<view v-if="sellingCount" @tap="zaishou">
						在售
						<fzg-icon class="fzgIcon" :type="zaishouFlag ? 'zaishouxuanzhong' : 'zaishou'" size="10" color="#F09247"></fzg-icon>
					</view>
					<view v-if="presellCount" @tap="daishou">
						待售
						<fzg-icon class="fzgIcon" :type="daishouFlag ? 'zaishouxuanzhong' : 'zaishou'" size="10" color="#34AEE5"></fzg-icon>
					</view>
					<view @tap="shouwan">
						售完
						<fzg-icon class="fzgIcon" :type="shouwanFlag ? 'zaishouxuanzhong' : 'zaishou'" size="10" color="#9E9E9E"></fzg-icon>
					</view>
					<view>
						选中
						<fzg-icon class="fzgIcon" type="zaishou" size="10" color="#E83836"></fzg-icon>
					</view>
				</view>
			</view>
			<view class="iClick" @tap="shouqi" :style="'background-color:'+ activeColor+';color:'+textColor">
				{{shouqiTextFlag}}
			</view>
			<movable-area class="movableBox" :style="{width: viewW + 'px',height:viewH + 'px'}">
				<movable-view class="movableContent" :style="{width: thumbW + 'px',height:thumbH + 'px'}" direction="all" :x="offsetLeft + thumbLeft" :y="offsetTop + thumbTop" @change="onChange">
					<image mode="aspectFill" :src="info.thumb"></image>
				</movable-view>
			</movable-area>
		</view>
		
		<swiper class="iSwiperContent" :current="current" @change="changeSwiper">
			<swiper-item v-for="(item,index) in buildingArr"  :key="index">
				<view class="floorInfo">
					<view class="floorInfoContent">
						<view>
							<text>{{item.title}}</text>
							<text>{{item.saleText}}</text>
							<uni-icon class="iUniIcon" type="forward"></uni-icon>
						</view>
						<view>
							<text>开盘时间: {{item.opendate}}</text>
							<text>交房时间: {{item.residedate}}</text>
						</view>
						<view>
							<text>单元数: {{item.unit ? item.unit+'个' : '待定'}}</text>
							<text>梯户比: {{item.elevator ? item.elevator : '待定'}}</text>
						</view>
						<view>
							<text>楼层数: {{item.floor ? item.floor+'层' : '待定'}}</text>
							<text>在售房源数: {{item.household ? item.household+'个' : '待定'}}</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="floorHouseType">
			<view class="floorHouseTypeTitle">楼栋户型</view>
			<view class="typeHouseList">
				<view v-for="(tab,index) in building" :key="index" v-if="tab.data.length">
					<view v-if="curBuildingID == index" v-for="(item,iindex) in tab.data" :key="iindex" @tap="goPath(item.outsid,item.id)">
						<view>
							<view>
								<image :src="item.thumb"></image>
							</view>
							<view>
								<view>
									<text>{{item.xiangq}}</text>
									<text>{{item.mj}}</text>
								</view>
								<view>{{item.price}}</view>
								<view>{{item.title}}</view>
								<view>{{item.sale}}</view>
							</view>
						</view>
					</view>
					<uni-load-more v-if="curBuildingID == index" :status="building[index].status" :content-text="contentText" />
				</view>
			</view>
		</view>
		
		<view class="statement">
			<view>
				<text>
					免责声明：本站楼盘信息旨在为用户提供更多信息的无偿服务，信息以政府部门登记备案为准，请谨慎核查。
				</text>
			</view>
		</view>
		
		<share-popup :show="show" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import sharePopup from "../../components/sharePopup.vue";
	export default{
		data(){
			return{
				show:false,
				zaishouFlag:true,
				daishouFlag:true,
				shouwanFlag:true,
				sectionbackground:true,
				iSelectedColorFlag:true,
				shouqiTextFlag:"收起",
				activeColor:"#ffffff",
				textColor:"#3f3f3f",
				labelActiveColor:"#EE9044",
				labelInfoColor:"#E83836",
				labelIndex:0,
				topx:80,
				leftx:30,
				
				viewW:0,
				viewH:0,
				id:'',
				shapanId:'',
				info:{}, //沙盘信息
				thumbW:0,//沙盘图片计算后的相对宽度
				thumbH:0,//沙盘图片计算后的相对高度
				building:{}, //楼栋对象集
				buildingArr:[], //楼栋数组
				curBuildingID:0, //当前楼栋id
				buildingSpansLocations:[],
				sellingCount:0,
				presellCount:0,
				selloutCount:0,
				offsetLeft:0,
				offsetTop:0,
				sOffsetLeft:0,
				sOffsetTop:0,
				current:0, //swiper的索引值
				thumbLeft:0,
				thumbTop:0,
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				site:''
			}
		},
		components:{
			fzgIcon,
			uniIcon,
			sharePopup,
			uniLoadMore
		},
		onLoad(option) {
			if(!option || !option.id || !option.shapanId){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			this.shapanId = option.shapanId;
			this.site = option.site ? option.site : this.$city;
			const res = uni.getSystemInfoSync();
			this.viewW = res.windowWidth; //375
			//this.viewH = 500;
			this.viewH = res.windowWidth/1.5; //250
			/* console.log(this.viewW);
			console.log(this.viewH); */
			this.getData();
		},
		onReachBottom() {
			if (this.tabIndexArr[this.tabIndex].status == 'noMore') return;
			this.tabIndexArr[this.tabIndex].status = 'more';
			this.getData(this.tabIndex);
		},
		methods:{
			doPop(){
				this.show=true;
			},
			closePoP(){
				this.show = false;
			},
			zaishou(){
				this.buildingArr.map((item,index) => {
					if(item.sale == 2){
						item.show = this.zaishouFlag ? 0 : 1;
					}
				})
				this.zaishouFlag=!this.zaishouFlag;
			},
			daishou(){
				this.buildingArr.map((item,index) => {
					if(item.sale == 1){
						item.show = this.daishouFlag ? 0 : 1;
					}
				})
				this.daishouFlag=!this.daishouFlag;
			},
			shouwan(){
				this.buildingArr.map((item,index) => {
					if(item.sale == 3){
						item.show = this.shouwanFlag ? 0 : 1;
					}
				})
				this.shouwanFlag=!this.shouwanFlag;
			},
			shouqi(){
				this.sectionbackground=!this.sectionbackground;
				this.iSelectedColorFlag=!this.iSelectedColorFlag;
				this.shouqiTextFlag=this.sectionbackground?"收起":"展开";
				this.activeColor=this.sectionbackground?"#ffffff":"#E83836";
				this.textColor=this.sectionbackground?"#3f3f3f":"#ffffff";
			},
			doLabel(buildingId){
				this.buildingArr.map((item,index) => {
					if(item.id == buildingId){
						this.current = index;
					}
				})
			},
			goPath(outsid,id){
				uni.navigateTo({
					url:'/pages/house/hxView?id='+id+(outsid ? '&outsid='+outsid : '')+(this.site != this.$city ? '&site='+this.site : '')
				})
			},
			changeSwiper(e){
				//console.log(e.detail.current)
				this.buildingArr.map((item,index) => {
					if(e.detail.current == index){
						this.curBuildingID = item.id;
					}
				})
				//console.log(this.curBuildingID)
				this.showBuildingHx();
				//this.labelIndex=e.detail.current;
				//console.log(this.labelIndex);
			},
			onChange: function(e) {
				//console.log(e.detail)
				var r = this.getLeftAndTop(this.offsetLeft + e.detail.x, this.offsetTop + e.detail.y);
				/* this.offsetLeft = e.detail.x;
				this.offsetTop = e.detail.y;
				this.sOffsetLeft = Math.abs(e.detail.x);
				this.sOffsetTop = Math.abs(e.detail.y); */
				this.sOffsetLeft = Math.abs(r.left) - Math.abs(this.thumbLeft);
				this.sOffsetTop = Math.abs(r.top) - Math.abs(this.thumbTop);
			},
			initShapanSize() {
				var l = this.info.shapanW,h = this.info.shapanH,
				c = this.viewW,k = this.viewH,
				d,g,j,e;
				g = l > 400 ? 400 : l;
				d = g / l * h;
				j = g / c;
				e = d / k;
				if (j < 1 || e < 1) {
					if (j > e) {
						d = k;
						g = d / h * l
					} else {
						g = c;
						d = g / l * h
					}
				}
				this.thumbW = g;
				this.thumbH = d;
				/* console.log(this.viewW)
				console.log(this.thumbW)
				console.log(this.thumbH) */
			},
			initBuildingId() {
				let c = this.building,e;
				for (let d in c) {
					if (Object.prototype.hasOwnProperty.call(c, d)) { //Javascript中Object对象原型上的hasOwnProperty()用来判断一个属性是定义在对象本身而不是继承自原型链。
						e = c[d];
						if (e.sale == 2) {
							this.curBuildingID = d;
							break
						}
						if (e.sale == 1) {
							this.curBuildingID = d
						}
					}
				}
				if (!this.curBuildingID) {
					this.curBuildingID = d
				}
				this.buildingArr.map((item,index) => {
					if(item.id == this.curBuildingID){
						this.current = index;
					}
				})
				//console.log(this.current)
				//console.log(this.curBuildingID);
			},
			initBuildingSpans() {
				let buildingLabelView = uni.createSelectorQuery().select(".buildingLabel"),labelW = 90,labelH = 18;
				/* buildingLabelView.boundingClientRect(data => {
					labelW = data.width;
					labelH = data.height;
				}).exec(); */
				//console.log(labelW +' '+labelH)
				let o = this.thumbW,h = this.thumbH,c = {x: labelW / 2,y: labelH};
				for (let i in this.building) {
					let m = this.building[i],
					g = (Number.parseInt(m.left)+c.x)/this.info.shapanW * o,
					q = (Number.parseInt(m.top)+c.y)/this.info.shapanH * h;
					this.building[i].leftRelative = g - c.x;
					this.building[i].topRelative = q - c.y;
					this.buildingSpansLocations.push({
						x: g,
						y: q
					})
				}
				//console.log(this.building)
				this.showBuildingHx(true);
			},
			initStatus(){
				for(let i in this.building){
					let j = this.building[i];
					if(j.saleStr == 'selling') this.sellingCount++;
					else if(j.saleStr == 'presell') this.presellCount++;
					else this.selloutCount++;
				}
				/* console.log(this.sellingCount)
				console.log(this.presellCount)
				console.log(this.selloutCount) */
			},
			getLeftAndTop(f, e) {
				/* console.log(f+' '+e)
				console.log(this.viewW+' '+this.viewH) */
				let g = {};
				g.left = Math.max(Math.min(f, 0), Math.min(this.viewW - this.thumbW, 0));
				g.top = Math.max(Math.min(e, 0), Math.min(this.viewH - this.thumbH, 0));
				//console.log(g)
				return g
			},
			showBuildingHx(d) { //d为布尔值
				if (!this.building[this.curBuildingID]['data'].length && this.building[this.curBuildingID].status !== 'noMore') {
					this.getHxData();
				}
				this.showTheMapByBuildingId(d);
			},
			showTheMapByBuildingId(k){ //k为布尔值
				if (!k && this.isInMapView()) {
					return
				}
				let j = this.building[this.curBuildingID],c = this.thumbW,h = this.thumbH,
				shapanPicW = this.thumbW,shapanPicH = this.thumbH,
				g = this.getLeftAndTop( - (j.left/shapanPicW * c) + this.viewW / 2, -(j.top/shapanPicH * h) + this.viewH / 2);
				//console.log(c+' '+h+' '+shapanPicW+' '+shapanPicH);
				this.thumbLeft = g.left;
				this.thumbTop = g.top;
				//console.log(this.thumbLeft+ ' ' + this.thumbTop)
				/* for (let i in this.building) {
					this.building[i].leftRelative += g.left;
					this.building[i].topRelative += g.top;
				} */
				//console.log(this.thumbLeft+ ' '+this.thumbTop)
			},
			isInMapView() {
				let d = 0,k = 0;
				for(let i in this.building){
					if(i == this.curBuildingID){
						d = this.building[i].leftRelative - this.sOffsetLeft;
						k = this.building[i].topRelative - this.sOffsetTop;
						break;
					}
				}
				//console.log(d+' '+k)
				let l = Math.abs(Number.parseFloat(this.thumbLeft)),
				g = Math.abs(Number.parseFloat(this.thumbTop)),
				f = 80;
				if ((d > l) && d < (l + this.viewW - f) && k > g && k < (g + this.viewH - f / 2)) {
					return true
				}
				return false
			},
			getHxData() {
				let params = { id:this.id,building_id: this.curBuildingID, page: this.building[this.curBuildingID].page,limit:3 };
				this.building[this.curBuildingID]['data'].length && (this.building[this.curBuildingID].status = 'loading');
				this.$http.get(this.$api.siteApi(this.site,'buildingHx'), { data: params }).then(res => {
					if(res.data.code == 0){
						let list = res.data.data.lists;
						this.building[this.curBuildingID]['data'] = this.building[this.curBuildingID]['data'].concat(list);
						if (this.building[this.curBuildingID]['data'].length >= res.data.data.total) this.building[this.curBuildingID].status = 'noMore';
						++this.building[this.curBuildingID].page;
					}else{
						uni.showToast({ title: '加载数据失败',icon:'none'});
					}
				}).catch(error => {
					uni.showToast({ title: '加载数据失败',icon:'none'});
				});
			},
			getData(){
				let params = { id: this.id,shapanId: this.shapanId };
				this.$http.get(this.$api.siteApi(this.site, 'buildingDetail'), { data: params }).then(res => {
					if (res.data.code == 0) {
						if(res.data.data.shapan){
							this.info = res.data.data.shapan;
							uni.getImageInfo({
								src: this.info.thumb,
								success:(image) => {
									this.info.shapanW = image.width;
									this.info.shapanH = image.height;
									this.initShapanSize();
									if(res.data.data.building){
										this.building = res.data.data.building;
										this.buildingArr = Object.values(res.data.data.building);
										for(let i in this.building){
											this.building[i].page = 1;
											this.building[i].status = 'more';
											this.building[i].data = [];
										}
										this.initBuildingId();
										this.initBuildingSpans();
										this.initStatus();
									}
								}
							});
						}
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({ title: '加载数据失败', icon: 'none'});
				});
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.floor{
		background-color: #f9f9f9;
		.banner{
			/* width: 750rpx;
			height: 500rpx; */
			position: relative;
			.movableBox{
				/* width: 750rpx;
				height: 500rpx; */
				position: relative;
				.movableContent{
					/* width: 850rpx;
					height: 600rpx; */
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.label_1,.label_2,.label_3{
				width:180rpx;
				height: 30rpx;
				line-height: 30rpx;
				padding: 5rpx;
				font-size: 12px;
				color: #ffffff;
				z-index: 9;
				text-align: center;
				position: absolute;
				.fzgIcon{
					position: absolute;
					bottom: -15rpx;
					left: 30rpx;
				}
			}
			.label_1{
				top: 80rpx;
				left: 30rpx;
			}
			.label_2{
				top: 35rpx;
				left: 300rpx;
			}
			.label_3{
				top: 30rpx;
				left: 550rpx;
			}
			.iSelected{
				width: 90%;
				background-color:rgba(255,255,255,0.5);
				border-radius: 25rpx;
				height: 50rpx;
				line-height: 50rpx;
				display: flex;
				justify-content: space-between;
				position: absolute;
				left: 50%;
				margin-left: -45%;
				bottom: 20rpx;
				z-index: 9;
				.sectionName1{
					width: 90%;
					display: flex;
					justify-content: space-around;
					&>view{
						font-size: 28rpx;
						color: #3f3f3f;
						display: flex;
						align-items: center;
						.fzgIcon{
							margin-left: 15rpx;
						}
					}
				}
			}
			.iClick{
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				font-size: 28rpx;
				line-height: 72rpx;
				text-align: center;
				position: absolute;
				right: 30rpx;
				bottom: 10rpx;
				z-index: 9;
			}
		}
		.floorInfo{
			background-color: #f9f9f9;
			padding: 30rpx 50rpx;
			.floorInfoContent{
				padding: 20rpx 40rpx;
				background-color: #ffffff;
				&>view{
					display: flex;
					justify-content: space-between;
					&>text{
						display: block;
						width: 50%;
					}
				}
				&>view:nth-child(1){
					margin-bottom: 10rpx;
					&>text:nth-child(1){
						font-size: 32rpx;
						color: #3f3f3f;
						font-weight: bold;
					}
					&>text:nth-child(2){
						font-size: 24rpx;
						color: #3f3f3f;
						position: relative;
						top: 5rpx;
					}
				}
				&>view:nth-child(2){
					border-bottom: 1px solid #E5E5E5;
					padding-bottom: 20rpx;
					&>text{
						font-size: 24rpx;
						color: #3f3f3f;
					}
				}
				&>view:nth-child(3),&>view:nth-child(4){
					margin-top: 10rpx;
					&>text{
						font-size: 28rpx;
						color: #3f3f3f;
					}
				}
			}
		}
		.floorHouseType{
			background-color: #ffffff;
			.floorHouseTypeTitle{
				font-size: 32rpx;
				color: #9e9e9e;
				border-bottom: 1rpx solid #E5E5E5;
				padding: 20rpx;
			}
			.typeHouseList{
				padding: 0 20rpx;
				&>view{
					&>view{
						&>view{
							display: flex;
							border-bottom: 1px solid #E5E5E5;
							padding: 40rpx 0;
							&>view:nth-child(1){
								width: 248rpx;
								height: 178rpx;
								margin-right: 20rpx;
								image{
									width: 100%;
									height: 100%;
									border: 1px solid #E5E5E5;
								}
							}
							&>view:nth-child(2){
								width: 422rpx;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								&>view:nth-child(1){
									display: flex;
									justify-content: space-between;	
									&>text:nth-child(1){
										font-size: 32rpx;
										color: #3f3f3f;
									}
									&>text:nth-child(2){
										font-size: 26rpx;
										color: #9e9e9e;
									}
								}
								&>view:nth-child(2){
									font-size: 28rpx;
									color: #e83836;
								}
								&>view:nth-child(3){
									font-size: 26rpx;
									color: #9e9e9e;
								}
								&>view:nth-child(4){
									width: 60rpx;
									height: 30rpx;
									line-height: 30rpx;
									text-align: center;
									font-size: 22rpx;
									color: #9a9a9a;
									border: 1px solid #9a9a9a;
									border-radius: 5px;
								}
							}
						}
					}
				}
			}
			/* .floorHouseTypeContent{
				padding: 0 20rpx 40rpx 20rpx;
				&>view{
					display: flex;
					border-bottom: 1px solid #E5E5E5;
					padding: 40rpx 0;
					&>view:nth-child(1){
						width: 248rpx;
						height: 178rpx;
						margin-right: 20rpx;
						image{
							width: 100%;
							height: 100%;
							border: 1px solid #E5E5E5;
						}
					}
					&>view:nth-child(2){
						width: 422rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						&>view:nth-child(1){
							display: flex;
							justify-content: space-between;	
							&>text:nth-child(1){
								font-size: 32rpx;
								color: #3f3f3f;
							}
							&>text:nth-child(2){
								font-size: 26rpx;
								color: #9e9e9e;
							}
						}
						&>view:nth-child(2){
							font-size: 28rpx;
							color: #e83836;
						}
						&>view:nth-child(3){
							font-size: 26rpx;
							color: #9e9e9e;
						}
						&>view:nth-child(4){
							width: 60rpx;
							height: 30rpx;
							line-height: 30rpx;
							text-align: center;
							font-size: 22rpx;
							color: #9a9a9a;
							border: 1px solid #9a9a9a;
							border-radius: 5px;
						}
					}
				}
			} */
		}
		.statement{
			background-color: #F0F0F0;
			padding: 35rpx 20rpx;
			&>view{
				line-height: 100%;
				&>text{
					font-size: 18rpx;
					color: #cccccc;
				}
			}
		}
	}
</style>
