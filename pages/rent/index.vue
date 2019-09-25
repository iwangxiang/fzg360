<template>
	<view class="newHouse">
		<view class="newHouseBanner">
			<image src="https://static.fzg360.com/images/app/zf_banner.jpg"></image>
		</view>
		<view class="menuSelect">
			<view class="menuSelectContent" :style="'position:'+fixed+';top:'+top+'px'">
				<view class="menuSelectContentTitle">
					<view @tap.stop="iPosition" :class="{ active: positionFlag }">
						<text>{{areaTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!positionFlag"></fzg-icon>
						<fzg-icon type="xiangshang" size="10" color="red" v-else></fzg-icon>
					</view>
					<view @tap.stop="iType" :class="{ active: typeFlag }">
						<text>{{roomTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!typeFlag"></fzg-icon>
						<fzg-icon type="xiangshang" size="10" color="red" v-else></fzg-icon>
					</view>
					<view @tap.stop="iPrice" :class="{ active: priceFlag }">
						<text>{{priceTitle}}</text>
						<fzg-icon type="open" size="10" color="#bbbbbb" v-if="!priceFlag"></fzg-icon>
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
						<scroll-view scroll-y="true" class="scroll-Y">
							<view :class="[!area ? 'iViewSelect' : '']" @tap="setArea(0,'区域')">
								<text>不限</text>
							</view>
							<view v-for="(item,index) in areas" :key="index" :class="[area==index ? 'iViewSelect' : '']" @tap.stop="setArea(index,item)">
								<text>{{item}}</text>
							</view>
						</scroll-view>
						<scroll-view v-if="area" scroll-y="true" class="scroll-Y iScrollY">
							<view :class="[area && !district ? 'iViewSelect' : '']" @tap="setDistrict(0,areas[area])">
								<text>不限</text>
							</view>
							<view v-for="item in districts[area]" :key="item.code" :class="[district==item.code ? 'iViewSelect' : '']" @tap="setDistrict(item.code,item.title)">
								<text>{{item.title}}</text>
							</view>
						</scroll-view>
					</view>
					<view v-if="typeFlag" class="iType">
						<view :class="[!room ? 'iSelectActive' : '']" @tap="setRoom(0,'户型')">
							<text>不限</text>
						</view>
						<view v-for="(item,index) in rooms" :key="index" :class="[room==index ? 'iSelectActive' : '']" @tap="setRoom(index,item)">
							<text>{{item}}</text>
						</view>	
					</view>
					<view v-if="priceFlag" class="iPrice">
						<view :class="[!price ? 'iSelectActive' : '']" @tap="setPrice(0,'价格')">
							<text>不限</text>
						</view>
						<view v-for="(item,index) in prices" :key="index" :class="[price==index ? 'iSelectActive' : '']" @tap="setPrice(index,item)">
							<text>{{item}}</text>
						</view>
					</view>				
					<view v-if="moreFlag" class="iMore">
						<scroll-view scroll-y="true" class="scroll-Y">
							<view class="scrollViewItemMenu">
								<view>
									<text>面积</text>
								</view>
								<view>
									<view v-for="(item,index) in mjs" :key="index" :class="[mj==index ? 'iSelectActive' : '']" @tap.stop="setMj(index)">
										<text>{{item}}</text>
									</view>
								</view>
							</view>
							<view class="scrollViewItemMenu">
								<view>
									<text>类型</text>
								</view>
								<view>
									<view v-for="(item,index) in types" :key="index" :class="[type==index ? 'iSelectActive' : '']" @tap.stop="setType(index)">
										<text>{{item}}</text>
									</view>
								</view>
							</view>
							<view class="scrollViewItemMenu">
								<view>
									<text>特色</text>
								</view>
								<view>
									<view v-for="(item,index) in features" :key="index" :class="[feature==index ? 'iSelectActive' : '']" @tap.stop="setFeature(index)">
										<text>{{item}}</text>
									</view>
								</view>
							</view>
							<view class="scrollViewItemMenu" @tap="btnSure">
								<button type="warn">确定</button>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		<view class="iHouseList" v-if="listData.length">
			<rent-lists v-for="item in listData" :key="item.ID" :item="item"></rent-lists>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
		<view class="sort" @tap="actionSheetTap"><image src="../../static/sort.png"></image></view>
		<view class="mask" v-show="mask" @touchstart.stop="doClearMask"></view>
	</view>
</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import rentLists from '@/components/rentLists.vue'
	import noContent from '../../components/noContent.vue'
	export default {
		data() {
			return {
				positionFlag:false,
				priceFlag:false,
				typeFlag:false,
				moreFlag:false,
				colorFlag:0,
				fzgIconColor:"#fff",
				inputBackgroundColor:"white",
				lxlocationIcon:"white",
				talknewsIcon:"white",
				viewIcon:true,
				areas:{}, //区域数据
				districts:{},//商圈数据
				rooms:{}, //居室数据
				prices:{}, //价格数据
				mjs:{}, //面积数据
				types:{}, //类型数据
				features:{}, //特色数据
				areaTitle: '区域', //筛选区域标题
				roomTitle: '户型', //筛选户型标题
				priceTitle: '租金', //筛选价格标题
				moreTitle: '更多', //更多标题
				area:'', //区域筛选参数
				district:'', //商圈筛选参数
				room:'', //居室筛选参数
				price:'', //价格筛选参数
				mj:'', //面积筛选参数
				type:'', //类型筛选参数
				feature:'', //特色筛选参数
				sort:0, //排序
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
				page:1, //页数
				selectTop:'', //筛选栏到顶部高度
				menuSelectFixedFlag:false,
				iAbsolute:'absolute',
				iHouseListMTFlag:false,
				mask:false,
				fixed:'',
				top:0
			}
		},
		components: {
			uniIcon,
			fzgIcon,
			uniLoadMore,
			rentLists,
			noContent
		},
		onLoad(){
			this.getData();
		},
		onReady(){
			let menuSelectView = uni.createSelectorQuery().select(".menuSelect");
			menuSelectView.boundingClientRect(data => {
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
			selectFixed(){
				this.colorFlag = 1;
				this.fzgIconColor="#333";
				this.inputBackgroundColor="#efefef";
				this.lxlocationIcon="#333";
				this.talknewsIcon="#333";
				this.menuSelectFixedFlag = this.iHouseListMTFlag = true;
				this.iAbsolute = '';
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
			doClearMask(){
				setTimeout(()=>{
					this.mask=false;
					this.positionFlag=false;
					this.priceFlag=false;
					this.typeFlag=false;
					this.moreFlag=false;					
				},150)
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
				this.priceFlag = this.priceFlag ? false : true;
				this.mask=this.priceFlag?true:false;
				this.positionFlag=false;
				this.typeFlag=false;
				this.moreFlag=false;
				this.selectFixed();
			},
			iType() {
				this.typeFlag= this.typeFlag ? false : true;
				this.mask=this.typeFlag?true:false;
				this.positionFlag=false;
				this.priceFlag=false;
				this.moreFlag=false;
				this.selectFixed();
			},
			iMore() {
				this.moreFlag= this.moreFlag ? false : true;
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
			actionSheetTap() {
				uni.showActionSheet({
					itemList: ['默认排序','价格从低到高', '价格从高到低', '面积从小到大', '面积从大到小'],
					success: (res) => {
						this.sort = res.tapIndex;
						this.reload = true;
						this.page = 1;
						this.getData();
					}
				})
			},
			setArea(id,name) { //区域设置
				this.district = '';
				this.area = id;
				this.areaTitle = name;
				if(!id){
					this.reload = true;
					this.page = 1;
					this.getData();
					this.doClearMask();
				}
			},
			setDistrict(id,name) { //商圈设置
				this.district = id ? id : '';
				this.areaTitle = name;
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setRoom(id,name) { //户型设置
				this.room = id ? id : '';
				this.roomTitle = name;
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setPrice(id,name) { //价格设置
				this.price = id ? id : '';
				this.priceTitle = name;
				this.reload = true;
				this.page = 1;
				this.getData();
				this.doClearMask();
			},
			setMj(id){ //面积设置
				//mj为空时，选中当前项，并且filterNum加一
				if (this.mj == '') {
					this.filterNum++;
					this.mj = id;
					//mj为当前已有值时，清空所选项，并且filterNum减一
				} else if (this.mj == id) {
					this.filterNum--;
					this.mj = '';
					//mj已有值且不等于当前选择值
				} else {
					this.mj = id;
				}
			},
			setType(id){ //类型设置				
				//type为空时，选中当前项，并且filterNum加一
				if (this.type == '') {
					this.filterNum++;
					this.type = id;
					//type为当前已有值时，清空所选项，并且filterNum减一
				} else if (this.type == id) {
					this.filterNum--;
					this.type = '';
					//type已有值且不等于当前选择值
				} else {
					this.type = id;
				}
			},
			setFeature(id){ //特色设置
				//feature为空时，选中当前项，并且filterNum加一
				if (this.feature == '') {
					this.filterNum++;
					this.feature = id;
					//feature为当前已有值时，清空所选项，并且filterNum减一
				} else if (this.feature == id) {
					this.filterNum--;
					this.feature = '';
					//feature已有值且不等于当前选择值
				} else {
					this.feature = id;
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
				let params = {city:this.$city,page:this.page};
				if(this.area) params['cfg_fa'] = this.area;
				if(this.district) params['cfg_fa'] = this.district;
				if(this.room) params['cfg_fe'] = this.room;
				if(this.price) params['cfg_fc'] = this.price;
				if(this.mj) params['cfg_fd'] = this.mj;
				if(this.type) params['cfg_ff'] = this.type;
				if(this.feature) params['cfg_fk'] = this.feature;
				if(this.sort) params['sort'] = this.sort;
				if(this.keyword) params['keyword'] = this.keyword;
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.fuberApi('leaseList'), {data: params}).then(res => {
					if(this.page == 1){
						uni.showToast({
							title: '请求成功',
							icon: 'success',
							// #ifndef MP-ALIPAY
							duration:500,
							mask: true
							// #endif
						});
						this.areas = res.data.cfg_fa;
						this.districts = res.data.cfg_fb;
						this.rooms = res.data.cfg_fe;
						this.prices = res.data.cfg_fc;
						this.mjs = res.data.cfg_fd;
						this.types = res.data.cfg_ff;
						this.features = res.data.cfg_fk;
					}
					this.reload && uni.stopPullDownRefresh();
					let list = res.data.info;
					this.listData = this.reload ? list : this.listData.concat(list);
					if(this.listData.length >= res.data.total) this.status = 'noMore';
					++this.page;
					this.reload = false;
				}).catch(error => {
					uni.showToast({title: '加载数据失败'});
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
			.menuSelectContent{
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
			}
			.menuContent{
				width: 100%;
				background-color: #f9f9f9;
				.iPosition{
					display: flex;
					.scroll-Y{
						height: 500rpx;
					}
					.iScrollY{
						background-color: #fff;
					}
					& view{
						border-bottom: 1px solid #E5E5E5;
						height: 60rpx;
						line-height: 50rpx;
						padding-left: 20rpx;
						text{
							font-size: 24rpx;
						}
					}
					& view.iViewSelect{
						background-color: #fff;
						color: red;
					}
				}
				.iPrice,.iType{
					&>view{
						height: 70rpx;
						line-height: 70rpx;
						border-bottom: 1px solid #E5E5E5;
						text{
							font-size: 24rpx;
							margin-left: 30rpx;
						}
					}
					&>view.iSelectActive{
						text{
							color: #f00;
						}
					}
				}
				.iMore{
					padding-bottom: 20rpx;
					.scroll-Y{
						height: 500rpx;
					}
					.scrollViewItemMenu{
						&>view:nth-child(1){
							width: 700rpx;
							height: 50rpx;
							line-height: 40rpx;
							margin: 20rpx auto 0;
							text{
								font-size: 24rpx;
							}
						}
						&>view:nth-child(2){
							display: flex;
							flex-wrap: wrap;
							margin-right: 20rpx;
							width: 700rpx;
							padding: 20rpx 0 10rpx;
							margin: 0 auto;
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
					.scrollViewItemMenu{
						margin-top: 20rpx;
						button{
							width: 500rpx;
							height: 70rpx;
							line-height: 70rpx;
							background-color: #E83836;
							font-size: 24rpx;
						}
					}
				}
			}
		}
		.iHouseList{
			background-color: #ffffff;
		}
		.sort{
			width: 80rpx;
			height: 80rpx;
			position: fixed;
			bottom: 100rpx;
			right: 20rpx;
			image{
				width: 100%;
				height: 100%;
			}
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
