<template>
	<view class="dynamic">
		<view class="dynamicHeader">
			<view class="dynamicHeaderTab">
				<view v-for="(item,index) in tabBars" :key="index" :data-current="index" class="dynamicHeaderTabTitle" :class="tabIndex==index ? 'active' : ''" @tap="doTab">{{item.name}}</view>
			</view>
		</view>
		<view class="dynamicContent">
			<swiper class="dynamicContentSwiper" :current="tabIndex" :duration="300" @change="doChange">
				<swiper-item v-for="(tab, index) in tabBars" :key="index">
					<scroll-view class="list" scroll-y  @scrolltolower="loadMore(index)">
						<view class="dynamicTitle" v-if="index == 0">
							<view v-for="(typeItem,typeIndex) in typeArr" :key="typeIndex" :class="{dynamicTitleActive:type == typeIndex}" @tap="selectType(index,typeIndex)">{{typeItem}}</view>
						</view>
						<view class="viewDynamicCont" v-if="index == 0">
							<view v-for="(item, iindex) in tab.data" :key="iindex">
								<view v-if="iindex == type && item.data.length">
								<house-dynamic v-if="iindex == type" v-for="(iitem,iiidex) in item.data" :key="iiidex" :item="iitem"></house-dynamic>
								<uni-load-more v-if="iindex == type" :status="tabIndexArr[index]['data'][type].status" :content-text="contentText" />
								</view>
								<no-content v-else-if="iindex == type && !item.data.length"></no-content>
							</view>
							
						</view>
						<view class="viewShoppingCont" v-else>
							<view v-if="tab.data.length">
							<house-shopping v-for="(item, iindex) in tab.data" :key="iindex" :item="item" :site="site"></house-shopping>
							<uni-load-more :status="tabIndexArr[index].status" :content-text="contentText" />
							</view>
							<no-content v-else></no-content>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<share-popup :show="show" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui';
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import sharePopup from "../../components/sharePopup.vue";
	import houseDynamic from "../../components/houseDynamic.vue";
	import houseShopping from "../../components/houseShopping.vue";
	import noContent from '../../components/noContent.vue'
	export default{
		data(){
			return{
				show:false,
				tabBars:[{name:"楼盘动态"},{name:"楼盘导购"}],
				tabIndex:0,
				tabContentIndex:0,
				id:'',
				listData: [], //列表数据
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				typeArr:[], //分类数组
				type: 0, //加载类型
				tabIndexArr: [],
				shareParams:{},//分享对象
				site:''
			}
		},
		components:{
			fzgIcon,
			sharePopup,
			houseDynamic,
			houseShopping,
			uniLoadMore,
			noContent
		},
		onLoad(option){
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			this.site = option.site ? option.site : this.$city; //根据广告通栏的链接所在站点
			for (let i = 0; i < this.tabBars.length; i++) {
				this.tabIndexArr.push(i == 0 ? {data: []} : { page: 1, status: 'more', reload: false });
				let aryItem = {
					//id:this.tabBars[i].id,
					name: this.tabBars[i].name,
					data: []
				};
				this.listData.push(aryItem);
			}
			
			for(let i = 0; i < this.tabIndexArr.length; i++){
				if(i == 0){
					for(let j = 0; j < 5; j++){
						this.tabIndexArr[i]['data'].push({ page: 1, status: 'more', reload: false });
						this.listData[i]['data'].push({data:[]});
					}
					break;
				}
			}
			this.tabBars = this.listData;
			this.getData(0);
		},
		methods:{
			closePoP(){
				this.show = false;
			},
			doPop(){
				this.show=true;
			},
			doTab(e){
				let tabIndex = e.target.dataset.current;
				this.tabIndex=tabIndex;
			},
			doChange(e){
				this.tabIndex=e.target.current;
				if(this.tabIndex){
					if (!this.listData[this.tabIndex]['data'].length && this.tabIndexArr[this.tabIndex].status !== 'noMore') {
						this.getData(this.tabIndex);
					}
				}				
			},
			loadMore(tabIndex) {
				if(tabIndex){
					if (this.tabIndexArr[tabIndex].status == 'noMore') return;
					this.tabIndexArr[tabIndex].status = 'more';
				}else{
					if (this.tabIndexArr[tabIndex]['data'][this.type].status == 'noMore') return;
					this.tabIndexArr[tabIndex]['data'][this.type].status = 'more';
				}
				this.getData(tabIndex);
			},
			selectType(tabIndex,index){
				this.type = index;
				if(this.listData[tabIndex]['data'][index]['data'].length) return;
				this.getData(tabIndex);
			},
			getData(tabIndex) {
				let params = { id:this.id, page: tabIndex == 0 ? this.tabIndexArr[tabIndex]['data'][this.type].page : this.tabIndexArr[tabIndex].page };
				if(tabIndex == 0){
					params['type'] = this.type;
					this.listData[tabIndex]['data'][this.type]['data'].length && (this.tabIndexArr[tabIndex]['data'][this.type].status = 'loading');
				}else{
					this.listData[tabIndex]['data'].length && (this.tabIndexArr[tabIndex].status = 'loading');
				}
				this.$http.get(this.$api.siteApi(this.site,tabIndex == 0 ? 'dynamicList': 'houseNewsList'), { data: params }).then(res => {
					if(res.data.code == 0){
						if(res.data.data.shareParams){
							this.shareParams = {
								title:res.data.data.shareParams.title,
								desc:res.data.data.shareParams.abstract,
								img: res.data.data.shareParams.thumb,
								link:res.data.data.shareParams.weburl
							};
							// #ifdef H5
							if (this.$wechat && this.$wechat.isWeixin()) {
								this.shareParams.link = window.location.href;
								this.$wechat.share(this.shareParams);
							}
							// #endif
						}
						let list = res.data.data.lists;
						if(tabIndex){
							this.tabIndexArr[tabIndex].reload && uni.stopPullDownRefresh();
							this.listData[tabIndex]['data'] = this.tabIndexArr[tabIndex].reload ? list : this.listData[tabIndex]['data'].concat(list);
							this.tabBars = this.listData;
							//console.log(this.tabBars)
							if (this.listData[tabIndex].data.length >= res.data.data.total) this.tabIndexArr[tabIndex].status = 'noMore';
							++this.tabIndexArr[tabIndex].page;
							this.tabIndexArr[tabIndex].reload = false;
						}else{
							if(res.data.data.type) this.typeArr = res.data.data.type;
							this.tabIndexArr[tabIndex]['data'][this.type].reload && uni.stopPullDownRefresh();
							this.listData[tabIndex]['data'][this.type]['data'] = this.tabIndexArr[tabIndex]['data'][this.type].reload ? list : this.listData[tabIndex]['data'][this.type]['data'].concat(list);
							this.tabBars = this.listData;
							if (this.listData[tabIndex]['data'][this.type]['data'].length >= res.data.data.total) this.tabIndexArr[tabIndex]['data'][this.type].status = 'noMore';
							++this.tabIndexArr[tabIndex]['data'][this.type].page;
							this.tabIndexArr[tabIndex]['data'][this.type].reload = false;
						}
					}else{
						uni.showToast({ title: '加载数据失败',icon:'none'});
					}
				})
				.catch(error => {
					uni.showToast({ title: '加载数据失败',icon:'none'});
				});
			}
		},
		// #ifdef APP-PLUS || H5
		onNavigationBarButtonTap(e){
			if(e.index == 0){
				// #ifdef H5
				uni.showToast({ title: '请在手机浏览器中进行分享', icon: 'none' });
				// #endif
				// #ifdef APP-PLUS
				this.show = true;
				// #endif
			}
		},
		// #endif
		// #ifdef MP
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自右上角分享按钮
				uni.showToast({ title: '分享成功', icon: 'none' });
			}
			return {
				title: this.shareParams.title,
				path: '/pages/house/dynamic?id='+this.id+(this.site != this.$city ? '&site='+this.site : ''),
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		},
		// #endif
	}
</script>

<style lang="less">
	page{
		height: 100%;
	}
	.dynamic{
		overflow: hidden;
		height: 100%;
		.dynamicHeader{
			border-bottom: 1px solid #e5e5e5;
			padding: 20rpx;
			.dynamicHeaderTab{
				display: flex;
				width: 300rpx;
				margin: 0 auto;
				height: 50rpx;
				line-height: 45rpx;
				border: 1px solid #333333;
				border-radius: 40rpx;
				box-sizing: border-box;
				.dynamicHeaderTabTitle{
					width: 150rpx;
					font-size: 24rpx;
					border-radius: 40rpx;
					text-align: center;
				}
				.active{
					background-color: #333333;
					color: #ffffff;
				}
			}
		}
		.dynamicContent{
			height: 100vh;
			.dynamicContentSwiper{
				height: 100vh;
				.list{
					width: 100%;
					height: 100%;
				}
				.dynamicTitle{
					padding: 20rpx;
					display: flex;
					border-bottom: 1px solid #e5e5e5;
					&>view{
						margin-right: 10rpx;
						font-size: 24rpx;
						border: 1px solid #e5e5e5;
						border-radius: 5px;
						display: inline-block;
						padding: 5rpx 10rpx;
					}
					.dynamicTitleActive{
						border: 1px solid #f00;
						color: #f00;
					}
				}
				.viewDynamicCont{
					padding: 0 20rpx 130rpx;
					
				}
				.viewShoppingCont{
					padding: 0 20rpx 130rpx;
				}
			}
		}
	}
</style>
