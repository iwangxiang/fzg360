<template>
	<view class="newHouse">
		<view class="newHouseBanner">
			<image src="https://static.fzg360.com/images/app/zf_banner.jpg"></image>
		</view>
		<view class="menuSelect">
			<view class="menuSelectContent" :style="'position:'+fixed+';top:'+top+'px'">
				<view class="menuSelectContentTitle">
					<view @tap.stop="iPosition" :class="{ active: positionFlag }">
						<text>{{positionTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!positionFlag"></fzg-icon>
						<fzg-icon type="xiangshang" size="10" color="red" v-else></fzg-icon>
					</view>
					<view @tap.stop="iPrice" :class="{ active: priceFlag }">
						<text>{{priceTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!priceFlag"></fzg-icon>
						<fzg-icon type="xiangshang" size="10" color="red" v-else></fzg-icon>
					</view>
					<view @tap.stop="iType" :class="{ active: typeFlag }">
						<text>{{roomTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!typeFlag"></fzg-icon>
						<fzg-icon type="xiangshang" size="10" color="red" v-else></fzg-icon>
					</view>
					<view @tap.stop="iMore" :class="{ active: moreFlag }">
						<text>{{moreTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!moreFlag"></fzg-icon>
						<fzg-icon type="xiangshang" size="10" color="red" v-else></fzg-icon>
					</view>
				</view>
				<view class="menuContent">
					<view v-if="positionFlag" class="iPosition">
						<view>
							<view :class="[areaTitle=='区域' ? 'iSelectActive' : '']" @tap.stop="selectPosition(0)">
								<text>区域</text>
							</view>
							<view v-if="isSubway" :class="[areaTitle=='地铁' ? 'iSelectActive' : '']" @tap.stop="selectPosition(1)">
								<text>地铁</text>
							</view>
						</view>
						<view v-if="positionType == 0">
							<scroll-view scroll-y="true" class="scroll-Y">
								<view class="scrollViewItemMenuNewHouse">
									<view :class="[selectAreaTitle=='区域' ? 'iSelectActive' : '']" @tap="setArea(0,'区域')">
										<text>不限</text>
									</view>
									<view v-for="(item,index) in areas" :key="index" :class="[selectAreaTitle==item ? 'iSelectActive' : '']" @tap="setArea(index,item)">
										<text>{{item}}</text>
									</view>								
								</view>
							</scroll-view>
						</view>
						<template v-else>
						<view>
							<view class="scrollViewItemMenuNewHouse">
								<view :class="[selectSubwayTitle=='地铁' ? 'iSelectActive' : '']" @tap="setSubway(0,'地铁')">
									<text>不限</text>
								</view>
								<view v-for="(item,index) in subways" :key="index" :class="[selectSubwayTitle==item ? 'iSelectActive' : '']" @tap.stop="setSubway(index,item)">
									<text>{{item}}</text>
								</view>								
							</view>
						</view>
						<view v-if="site">
							<scroll-view scroll-y="true" class="scroll-Y">
								<view class="scrollViewItemMenuNewHouse">
									<view v-for="(item,index) in subwayNames" :key="index" v-if="index == site">
										<view :class="[!selectSiteNameTitle && subways[index] == subways[site] ? 'iSelectActive' : '']" @tap="setSiteName(0,subways[index])">
											<text>不限</text>
										</view>
										<view v-for="iitem in item" :key="iitem.ccid" :class="[selectSiteNameTitle == iitem.title ? 'iSelectActive' : '']" @tap="setSiteName(iitem.ccid,iitem.title)">
											<text>{{iitem.title}}</text>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
						</template>
					</view>
					<view v-if="priceFlag" class="iPrice">
						<view :class="[!price ? 'iSelectActive' : '']" @tap="setPrice(0,'价格')">
							<text>不限</text>
						</view>
						<view v-for="(item,index) in prices" :key="index" :class="[price==index ? 'iSelectActive' : '']" @tap="setPrice(index,item)">
							<text>{{item}}</text>
						</view>
					</view>
					<view v-if="typeFlag" class="iType">
						<view :class="[!room ? 'iSelectActive' : '']" @tap="setRoom(0,'户型')">
							<text>不限</text>
						</view>
						<view v-for="(item,index) in rooms" :key="index" :class="[room==index ? 'iSelectActive' : '']" @tap="setRoom(index,item)">
							<text>{{item}}</text>
						</view>					
					</view>
					<view v-if="moreFlag" class="iMore">
						<view>
							<view>
								<text>类型</text>
							</view>
							<view>
								<view v-for="(item,index) in types" :key="index" :class="[wylx==index ? 'iSelectActive' : '']" @tap.stop="setType(index)">
									<text>{{item}}</text>
								</view>							
							</view>
						</view>
						<view>
							<view>
								<text>销售状态</text>
							</view>
							<view>
								<view v-for="(item,index) in sales" :key="index" :class="[sale==index ? 'iSelectActive' : '']" @tap.stop="setSale(index)">
									<text>{{item}}</text>
								</view>
							</view>
						</view>
						<view @tap="btnSure">
							<button type="warn">确定</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="iHouseList" v-if="listData.length">
			<house-lists v-for="item in listData" :key="item.id" :item="item"></house-lists>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
		<view class="mask" v-show="mask" @touchstart.stop="doClearMask"></view>
	</view>
</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import houseLists from '@/components/houseLists.vue'
	import noContent from '../../components/noContent.vue'
	export default {
		data() {
			return {
				positionFlag:false, //位置开关
				priceFlag:false, //价格开关
				typeFlag:false, //户型开关
				moreFlag:false, //更多开关
				colorFlag:0,
				fzgIconColor:"#fff",
				inputBackgroundColor:"white",
				lxlocationIcon:"white",
				talknewsIcon:"white",
				viewIcon:true,
				areas:{}, //区域数据
				isSubway:0,//是否有地铁筛选
				subways:{}, //地铁线路数据
				subwayNames:{}, //地铁站点数据
				prices:{}, //价格数据
				rooms:{}, //居室数据
				types:{}, //物业类型数据
				sales:{}, //销售状态数据
				positionType:0, //位置类型，默认区域
				positionTitle:'位置',//位置标题
				areaTitle: '区域', //筛选位置标题
				selectAreaTitle: '区域',//筛选位置选中标题
				selectSubwayTitle:'地铁',//筛选地铁选中标题
				selectSiteNameTitle:'',//筛选地铁线路选中标题
				priceTitle: '价格', //筛选价格标题
				roomTitle: '户型', //筛选户型标题
				moreTitle: '更多', //更多标题
				area:'', //区域筛选参数
				subway:'', //地铁线路不限筛选参数
				site:'', //地铁线路筛选参数
				sitename:'', //地铁站点筛选参数
				price:'', //价格筛选参数
				room:'', //居室筛选参数
				wylx:'', //物业类型筛选参数
				sale:'', //销售状态筛选参数
				filterNum: 0, // 所选中的更多的集合
				keyword:'', //关键字
				listData: [], //列表数据
				reload: false, //重新加载标志
				status: 'more', //加载的状态
				contentText: { //加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				page:1 ,//页数
				selectTop:'', //筛选栏到顶部高度
				mask:false,
				fixed:'',
				top:0
			}
		},
		components: {
			uniIcon,
			fzgIcon,
			uniLoadMore,
			houseLists,
			noContent
		},
		onLoad(){
			this.getData();
		},
		onReady(){
			let menuSelectView = uni.createSelectorQuery().select(".menuSelect");
			menuSelectView.boundingClientRect(data => {
				//console.log("得到布局位置信息" + JSON.stringify(data));
				//console.log("节点离页面顶部的距离为" + data.top);
				this.selectTop = data.top;
			}).exec();
		},
		onPullDownRefresh() {
			this.reload = true;
			this.page = 1;
			this.getData();
		},
		onReachBottom() {
			if(this.status == 'noMore') return;
			this.status = 'more';
			this.getData();
		},
		methods: {
			doClearMask(){
				setTimeout(()=>{
					this.mask=false;
					this.positionFlag=false;
					this.priceFlag=false;
					this.typeFlag=false;
					this.moreFlag=false;					
				},150)
			},
			selectFixed(){
				let flag=0;
				// #ifdef H5
					flag=44;
				// #endif
				// #ifdef APP-PLUS
				const res = uni.getSystemInfoSync();
				flag = 44+Number(res.statusBarHeight); //app端有状态栏的高度
				// #endif
				uni.pageScrollTo({
					scrollTop: this.selectTop - flag,
					// #ifndef MP-ALIPAY
					duration: 0
					// #endif
				});
			},
			iPosition() {
				this.positionFlag = this.positionFlag ? false : true;
				this.mask=this.positionFlag?true:false;
				this.priceFlag=false;
				this.typeFlag=false;
				this.moreFlag=false;
				this.selectFixed();
			},
			iPrice() {
				this.priceFlag = this.priceFlag ? false: true;
				this.mask=this.priceFlag?true:false;
				this.positionFlag=false;
				this.typeFlag=false;
				this.moreFlag=false;
				this.selectFixed();
			},
			iType() {
				this.typeFlag = this.typeFlag ? false : true;
				this.mask=this.typeFlag?true:false;
				this.positionFlag=false;
				this.priceFlag=false;
				this.moreFlag=false;
				this.selectFixed();
			},
			iMore() {
				this.moreFlag = this.moreFlag ? false : true;
				this.mask=this.moreFlag?true:false;
				this.positionFlag=false;
				this.priceFlag=false;
				this.typeFlag=false;
				this.selectFixed();
			},
			menuSelectHide(){
				this.positionFlag=false;
				this.priceFlag=false;
				this.typeFlag=false;
				this.moreFlag=false;
			},
			goBack(){
				uni.navigateBack();
			},
			selectPosition(type){ //显示区域或地铁
				this.positionType = type;
				this.areaTitle = type ? '地铁' : '区域';
			},
			setArea(id,name) { //区域设置
				this.subway = this.site = this.sitename = 0;
				this.area = id;
				this.positionTitle = this.selectAreaTitle = name;
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setSubway(id,name){ //地铁线路设置
				this.area = 0;
				if(id == 0){ //地铁线路不限
					this.positionTitle = this.selectSubwayTitle = '地铁';					
					this.subway = 1;
					this.site = this.sitename = 0;
					this.reload = true;
					this.page = 1;
					this.getData();
					this.doClearMask();
					return;
				}
				this.subway = 0;
				this.site = id;
				this.selectSubwayTitle = name;
			},
			setSiteName(id,name){ //地铁站点设置
				this.positionTitle = name;
				this.sitename = id;
				this.selectSiteNameTitle = id ? name : '';
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setPrice(id,name) { //价格设置
				this.price = id;
				this.priceTitle = name;
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setRoom(id,name) { //居室设置
				this.room = id;
				this.roomTitle = name;
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setType(id){ //物业类型设置				
				//wylx为空时，选中当前项，并且filterNum加一
                if (this.wylx == '') {
                    this.filterNum++;
                    this.wylx = id;
                    //wylx为当前已有值时，清空所选项，并且filterNum减一
                } else if (this.wylx == id) {
                    this.filterNum--;
                    this.wylx = '';
                    //wylx已有值且不等于当前选择值
                } else {
                    this.wylx = id;
                }
			},
			setSale(id){ //销售状态设置
				//sale为空时，选中当前项，并且filterNum加一
				if (this.sale == '') {
				    this.filterNum++;
				    this.sale = id;
				    //sale为当前已有值时，清空所选项，并且filterNum减一
				} else if (this.sale == id) {
				    this.filterNum--;
				    this.sale = '';
				    //sale已有值且不等于当前选择值
				} else {
				    this.sale = id;
				}
			},
            btnSure() { //更多选择确定
                this.moreTitle = this.filterNum > 0 ? '多选(' + this.filterNum + ')' : '更多';
                this.reload = true;
                this.page = 1;
                this.getData();
				this.doClearMask();
            },
			doSearch(){ //关键字搜索
				this.listData = [];
				this.status = 'more';
				this.reload = true;
				this.page = 1;
				this.getData();
			},
			getData(){
				let params = {page:this.page};
				if(this.area) params['area'] = this.area;
				if(this.subway) params['subway'] = this.subway;
				if(this.site) params['site'] = this.site;
				if(this.sitename) params['sitename'] = this.sitename;
				if(this.price) params['price'] = this.price;
				if(this.room) params['room'] = this.room;
				if(this.wylx) params['wylx'] = this.wylx;
				if(this.sale) params['sale'] = this.sale;
				if(this.keyword) params['keyword'] = this.keyword;
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.siteApi(this.$city,'houseList'), {data: params}).then(res => {
					if(this.page == 1){
						uni.showToast({
							title: '请求成功',
							icon: 'success',
							// #ifndef MP-ALIPAY
							duration:500,
							mask: true
							// #endif
						});
						this.areas = res.data.data.areas;
						this.isSubway = res.data.data.isSubway;
						this.subways = res.data.data.subways;
						this.subwayNames = res.data.data.subwayNames;
						this.prices = res.data.data.prices;
						this.rooms = res.data.data.rooms;
						this.types = res.data.data.types;
						this.sales = res.data.data.sales;
					}
					this.reload && uni.stopPullDownRefresh();
					let list = res.data.data.lists;
					this.listData = this.reload ? list : this.listData.concat(list);
					if(this.listData.length >= res.data.data.total) this.status = 'noMore';
					++this.page;
					this.reload = false;
				}).catch(error => {
					uni.showToast({title: '加载数据失败',icon: 'none'});
				})
			}
		},
		//当 searchInput 输入时触发
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text;
			//this.doSearch();
		},
		//点击软键盘搜索按键触发
		onNavigationBarSearchInputConfirmed(e) {
			this.doSearch();
		},
		// #ifdef APP-PLUS || H5
		onNavigationBarButtonTap(e){
			if(e.index == 0){
				uni.navigateTo({
					url: '/pages/msg/list'
				});
			}else{
				uni.navigateTo({
					url: '/pages/house/somap'
				});
			}
		},
		// #endif
		onPageScroll(e) {
			let flag=0;
			// #ifdef H5
				flag=44;
			// #endif
			// #ifdef APP-PLUS
			const res = uni.getSystemInfoSync();
			flag = 44+Number(res.statusBarHeight); //app端有状态栏的高度
			// #endif
			if(e.scrollTop >= this.selectTop - flag){
				this.fixed='fixed';
				this.top=flag;
			}else{
				this.fixed='absolute';
				this.top=0;
			}
		}
	}
</script>

<style lang="less" scoped>
	.newHouse {
		width: 100%;
		background-color: #f5f5f5;
		.newHouseBanner {
			image{
				vertical-align: text-top;
				width: 100%; 
				height: 420rpx;
			}
		}
		.menuSelect{
			width: 100%;
			position: relative;
			padding-top: 86rpx;
			.menuSelectContent {
				width: 100%;
				position: absolute;
				top:0;
				left:0;
				background-color: #f9f9f9;
				z-index:8;
				.menuSelectContentTitle{
					width: 100%;
					height: 86rpx;
					border-bottom: 1px solid #e5e5e5;
					box-sizing: border-box;
					display: flex;
					justify-content: space-around;
					flex-direction: row;
					align-items: center;
					&>view{
						text {
							font-size: 26rpx;
							color: #3f3f3f;
							margin-right: 11rpx;
						}
					}
					.active{
						text{
							color: red;
						}
					}
				}
				.menuContent {
					width: 100%;
					background-color: #f9f9f9;
					.iPosition{
						&>view:nth-child(1){
							display: flex;
							flex-wrap: wrap;
							margin-right: 20rpx;
							padding: 20rpx 0;
							border-bottom: 1px solid #E5E5E5;;
							&>view{
								width: 220rpx;
								height: 50rpx;
								line-height: 40rpx;
								text-align: center;
								background-color: #ffffff;
								border-radius: 3px;
								margin: 0 20rpx 0 12rpx;
								text{
									font-size: 24rpx;
								}
							}
							&>view.iSelectActive{
								background-color: #E83836;
								text{
									color: #ffffff;
								}
							}
						}
						&>view:nth-child(2){
							padding: 20rpx 0 10rpx;
							margin: 0 auto;
							border-bottom: 1px solid #E5E5E5;
							.scroll-Y{
								height: 500rpx;
							}
							.scrollViewItemMenuNewHouse{
								display: flex;
								flex-wrap: wrap;
								justify-content: space-between;
								padding: 0 20rpx;
								&>view{
									width: 220rpx;
									height: 50rpx;
									line-height: 40rpx;
									text-align: center;
									background-color: #ffffff;
									border-radius: 3px;
									margin: 0 0 20rpx 0;
									text{
										font-size: 24rpx;
										padding: 0 5rpx;
									}
								}
								&>view.iSelectActive{
									background-color: #E83836;
									text{
										color: #ffffff;
									}
								}
							}
						}
						&>view:nth-child(3){
							padding: 20rpx 0 10rpx;
							margin: 0 auto;
							border-bottom: 1px solid #E5E5E5;
							.scroll-Y{
								height: 500rpx;
							}
							.scrollViewItemMenuNewHouse{
								&>view{
									display: flex;
									flex-wrap: wrap;
									justify-content: space-between;
									&>view{
										width: 220rpx;
										height: 50rpx;
										line-height: 40rpx;
										text-align: center;
										background-color: #ffffff;
										border-radius: 3px;
										margin: 0 0 20rpx 12rpx;
										text{
											font-size: 24rpx;
											padding: 0 5rpx;
										}
									}
									&>view.iSelectActive{
										background-color: #E83836;
										text{
											color: #ffffff;
										}
									}
								}
							}
						}
					}
					.iPrice,.iType{
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						padding: 0 20rpx;
						&>view{
							width: 220rpx;
							height: 50rpx;
							line-height: 40rpx;
							text-align: center;
							background-color: #ffffff;
							border-radius: 3px;
							margin: 20rpx 0;
							text{
								font-size: 24rpx;
							}
						}
						&>view.iSelectActive{
							background-color: #E83836;
							text{
								color: #ffffff;
							}
						}
					}
					.iMore{
						padding-bottom: 20rpx;
						&>view:nth-child(1),&>view:nth-child(2){
							&>view:nth-child(1){
								height: 50rpx;
								line-height: 40rpx;
								text{
									padding-left: 20rpx;
									font-size: 24rpx;
								}
							}
							&>view:nth-child(2){
								display: flex;
								flex-wrap: wrap;
								justify-content: space-between;
								padding: 0 20rpx;
								&>view{
									width: 220rpx;
									height: 50rpx;
									line-height: 40rpx;
									text-align: center;
									background-color: #ffffff;
									border-radius: 3px;
									margin: 0 0 20rpx 0;
									text{
										font-size: 24rpx;
									}
								}
								&>view.iSelectActive{
									background-color: #E83836;
									text{
										color: #ffffff;
									}
								}
							}
						}
						&>view:nth-child(3){
							margin-top: 20rpx;
							button{
								width: 500rpx;
								height: 70rpx;
								line-height: 70rpx;
								background-color: #E83836;
								font-size: 24rpx;
								margin: 0 auto;
								border-radius: 10rpx;
							}
						}
					}
				}
			}
		}
		.iHouseList{
			background-color: #ffffff;
		}
		
		.mask{
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			background-color: #000;
			opacity: .3;
		}
	}
</style>
