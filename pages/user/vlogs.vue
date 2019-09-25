<template>
	<view class="recordsCon">
		<view>
			<fzg-icon @tap="goBack" type="back" size="20"></fzg-icon>
			<view>
				<view :class="{on:tabIndex == 0 ? true : false}" @tap="showTab(0)">收藏</view>
				<view :class="{on:tabIndex == 1 ? true : false}" @tap="showTab(1)">浏览</view>
			</view>
			<view class="rightTxt" @tap="mesEdit">{{iFlag}}</view>
		</view>
		<view>
			<view v-for="(tab, index) in tabBars" :key="index">
				<!--收藏列表-->
				<template v-if="tabIndex == 0 && tabIndex == index">
					<view v-for="(ttab, iindex) in tab.data" :key="iindex">
						<uni-swipe-action v-if="type == iindex && ttab.data.length" v-for="(item,iiidex) in ttab.data" :key="iiidex" :options="options1" :disabled="disabled" :data-id="item.aid" @tap="bindClick(item.aid)">
							<view class="houseList" v-if="type == 0" @tap.stop="goPath(item.aid,'house',iiidex)">
								<image :src="item['param'].thumb ? item['param'].thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
								<text class="imgLab">新房</text>
								<view class="cooectLeftBox">
									<view>{{item['param'].subject}}</view>
									<view v-if="item['param'].ccid1title">{{item['param'].ccid1title}}</view>
									<view class="labBox">
										<view v-for="(ccid12title,cindex) in item.ccid12title" :key="cindex">{{ccid12title}}</view>
									</view>
									<view>{{item['param'].dj && item['param'].dj > 0 ? (item['param'].dj + (item['param'].djunit == 0 ? '元/㎡' : item['param'].djunit)) : '价格待定'}}</view>
								</view>
								<view class="recordSelecBox" :class="{ uhide:selecActive}">
									<view class="checkBox" :class="{on:selectIds.includes(item.aid)}"></view>
									<!--选中时增加样式on-->
								</view>
							</view>
							
							<view class="houseList" v-else-if="type == 1" @tap.stop="goPath(item.aid,'sale',iiidex)">
								<image :src="item['param'].THUMB_URL ? item['param'].THUMB_URL : 'https://static.fzg360.com/images/app/esf_nopic.jpg'"></image>
								<text class="imgLab">二手房</text>
								<view class="cooectLeftBox">
									<view class="esfTitel">{{item['param'].SALE_SUBJECT}}</view>
									<view class="esfSecond">
										<view>{{item['param'].SALE_AREA > 0 ? item['param'].SALE_AREA + '㎡' : '面积待定'}} | {{item['param'].SALE_ROOM > 0 ? item['param'].SALE_ROOM + '室' : '居室暂无'}} | {{item['param'].SALE_DIRECT != 0 ? item['param'].SALE_DIRECT : '朝向暂无'}}</view>
										<view>{{item['param'].SALE_TOTAL_PRICE > 0 ? item['param'].SALE_TOTAL_PRICE + '万/套' : '总价待定'}}</view>
									</view>
									<view class="infoBox">
										<view>{{item['param'].BUILD_NAME}}</view>
										<view>{{item['param'].SALE_UNIT_PRICE > 0 ? item['param'].SALE_UNIT_PRICE + '元/平' : '单价待定'}}</view>
									</view>
									<view class="esflabBox">
										<view v-for="(TAG,tindex) in item.TAGS" :key="tindex">{{TAG}}</view>
									</view>
								</view>
								<view class="recordSelecBox" :class="{ uhide:selecActive}">
									<view class="checkBox" :class="{on:selectIds.includes(item.aid)}"></view><!--选中增加样式on-->
								</view>
							</view>
							
							<view class="newsList" v-else @tap.stop="goPath(item.aid,'news',iiidex)">
								<view class="newsLeft">
									<view class="newsTitel">{{item['param'].title}}</view>
									<view class="uniRow">
										<view>
											<fzg-icon class="browse-icon" type="browse" size="22rpx" color="#e9e9e9;"></fzg-icon>{{item['param'].hits}}
										</view>
										<view>{{item['param'].createdate ? item['param'].createdate : ''}}</view>
									</view>
								</view>
								<image :src="item['param'].thumb ? item['param'].thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
								<text class="imgLab">资讯</text>
								<view class="recordSelecBox" :class="{ uhide:selecActive}">
									<view class="checkBox" :class="{on:selectIds.includes(item.aid)}"></view>
								</view>
							</view>
						</uni-swipe-action>
						<uni-load-more v-if="type == iindex && ttab.data.length" :status="tabIndexArr[tabIndex]['data'][type].status" :content-text="contentText" />
						<no-content v-else-if="iindex == type && !ttab.data.length"></no-content>
					</view>
					<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction" @trigger="trigger" />
				</template>
				<!--浏览列表-->
				<template v-else>
					<uni-swipe-action v-if="tabIndex == index && tab.data.length" v-for="(item, iindex) in tab.data" :key="iindex" :options="options1" :disabled="disabled" @tap="bindClick(item.id,item.type)">
						<view class="houseList" @tap.stop="goPath(item.id,item.type,iindex)">
							<image :src="item.thumb ? item.thumb : (item.type == 'house' ? 'https://static.fzg360.com/images/app/nopic.gif' : 'https://static.fzg360.com/images/app/esf_nopic.jpg')"></image>
							<text class="imgLab">{{item.type == 'house' ? '新房' : (item.type == 'sale' ? '二手房' : '租房')}}</text>
							<view class="cooectLeftBox" v-if="item.type == 'house'">
								<view>{{item.title}}</view>
								<view>{{item.area_id}}</view>
								<view class="labBox">
									<view v-for="(wylx,windex) in item.wylxArr" :key="windex">{{wylx}}</view>
								</view>
								<view>{{item.price}}</view>
							</view>
							<view class="cooectLeftBox" v-else-if="item.type == 'sale'">
								<view class="esfTitel">{{item.sale_subject}}</view>
								<view class="esfSecond">
									<view>{{item.sale_area}}｜{{item.sale_room}}｜{{item.sale_direct}}</view>
									<view>{{item.sale_total_price}}</view>
								</view>
								<view class="infoBox">
									<view>{{item.build_name}}</view>
									<view>{{item.sale_unit_price}}</view>
								</view>
								<view class="esflabBox">
									<view v-for="(tag,tindex) in item.tags" :key="tindex">{{tag}}</view>
								</view>
							</view>
							<view class="cooectLeftBox" v-else>
								<view class="esfTitel">{{item.lease_subject}}</view>
								<view class="esfSecond">
									<view>{{item.lease_area}}｜{{item.lease_room}}｜{{item.lease_direct}}</view>
									<view>{{item.lease_total_price}}</view>
								</view>
								<view class="infoBox">
									<view>{{item.region_name}}{{item.section_name}}</view>
								</view>
								<view class="esflabBox">
									<view v-for="(tag,tindex) in item.tags" :key="tindex">{{tag}}</view>
								</view>
							</view>
							<view class="recordSelecBox" :class="{ uhide:selecActive}">
								<view class="checkBox" :class="{on:selectRidsArr.includes(item.id)}"></view>
							</view>
						</view>
					</uni-swipe-action>
					<uni-load-more v-if="tabIndex == index && tab.data.length" :status="tabIndexArr[index].status" :content-text="contentText" />
					<no-content v-else-if="index == tabIndex && !tab.data.length"></no-content>
				</template>
			</view>
		</view>

		<view v-if="bottomBox">
			<view @tap="mesSelect(-2)">全部</view>
			<view @tap="remove()">删除</view>
		</view>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from "../../components/fzg-icon/index.vue"
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import noContent from '../../components/noContent.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			fzgIcon,
			uniSwipeAction,
			uniFab,
			uniLoadMore,
			noContent
		},
		data() {
			return {
				iFlag: "编辑",
				bottomBox: false,
				selecActive: true,
				disabled:false,
				options1: [{
					text: '删除',
					style: {
						backgroundColor: '#e83836'
					}
				}],
				title: 'uni-fab',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				pattern: {
					color: '#e83836',
					backgroundColor: '#fff',
					selectedColor: '#e83836',
					buttonColor: '#e83836'
				},
				content: [{
						iconPath: '/static/newshouse.png',
						selectedIconPath: '/static/newshouseHL.png',
						text: '新房',
						active: false
					},
					{
						iconPath: '/static/esf.png',
						selectedIconPath: '/static/esfHL.png',
						text: '二手房',
						active: false
					},
					{
						iconPath: '/static/taotiao.png',
						selectedIconPath: '/static/taotiaoHL.png',
						text: '头条',
						active: false
					}
				],
				tabBars:[{name:"收藏"},{name:"浏览"}],
				tabIndex:0,
				listData: [], //列表数据
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				typeArr:[], //分类数组
				type: 0, //加载类型,默认是新房
				tabIndexArr: [],
				broswerRecords:{},
				records:[],
				selectIds:[],
				selectRids:{},
				selectRidsArr:[],
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad(option){
			this.tabBars.map((item,index) => {
				this.tabIndexArr.push(index == 0 ? {data: []} : { page: 1, status: 'more', reload: false });
				let aryItem = {
					name: item.name,
					data: []
				};
				this.listData.push(aryItem);
			})
			for(let i = 0; i < this.tabIndexArr.length; i++){
				if(i == 0){
					for(let j = 0; j < this.content.length; j++){
						this.tabIndexArr[i]['data'].push({ page: 1, status: 'more', reload: false });
						this.listData[i]['data'].push({data:[]});
					}
					break;
				}
			}
			this.tabBars = this.listData;
			/* console.log(this.tabIndexArr)
			console.log(this.listData) */
			/* this.broswerRecords = uni.getStorageSync('brecords_'+this.$city) || {}; //浏览记录
			//console.log(this.broswerRecords)
			if(Object.keys(this.broswerRecords).length){
				for(let i in this.broswerRecords){
					this.records.push(this.broswerRecords[i]);
				}
				this.records.reverse();
			}
			console.log(this.records) */
			if(!Object.keys(option).length){
				uni.$once('login',() => { //监听登录事件
					this.tabIndexArr[this.tabIndex]['data'][this.type].reload = true;
					this.tabIndexArr[this.tabIndex]['data'][this.type].page = 1;
					this.getData(this.tabIndex);
				})
				if(!this.hasLogin || !this.userInfo.hash){
					// #ifdef MP
					uni.switchTab({
						url:'/pages/user/index'
					});
					// #endif
					// #ifndef MP
					this.$util.ckLogin('/pages/user/vlogs');
					// #endif
					return;
				}
			}
			if(option && option.tabIndex){
				this.showTab(option.tabIndex);
			}else{
				this.getData(this.tabIndex);
			}
		},
		onPullDownRefresh() {
			if(this.tabIndex){
				this.tabIndexArr[this.tabIndex].reload = true;
				this.tabIndexArr[this.tabIndex].page = 1;
				this.tabIndexArr[this.tabIndex].status = 'more';
				this.listData[this.tabIndex].data = [];
			}else{
				this.tabIndexArr[this.tabIndex]['data'][this.type].reload = true;
				this.tabIndexArr[this.tabIndex]['data'][this.type].page = 1;
			}
			this.getData(this.tabIndex);
		},
		onReachBottom() {
			if(this.tabIndex){
				if (this.tabIndexArr[this.tabIndex].status == 'noMore') return;
				this.tabIndexArr[this.tabIndex].status = 'more';
			}else{
				if (this.tabIndexArr[this.tabIndex]['data'][this.type].status == 'noMore') return;
				this.tabIndexArr[this.tabIndex]['data'][this.type].status = 'more';
			}
			this.getData(this.tabIndex);
		},
		methods: {
			bindClick(id,type) {
				if(this.tabIndex){
					this.selectRids = {};
					if(!this.selectRids[this.$city+id+'_'+type]){
						this.selectRids[this.$city+id+'_'+type] = id;
					}
					this.selectRidsArr = Object.values(this.selectRids)
				}else{
					this.selectIds = [];
					if(!this.selectIds.includes(id)){
						this.selectIds.push(id);
					}
				}
				this.remove();
				this.mesEdit();
			},
			goBack(){
				uni.navigateBack();
			},
			goPath(id,type,index) {
				if(!this.selecActive){
					this.mesSelect(index,id,type);
					return;
				}
				uni.navigateTo({
					url: '../'+type+'/'+(type == 'house' ? 'home' : 'detail')+'?id='+id
				})
			},
			mesEdit() {
				this.selecActive = !this.selecActive;
				this.iFlag=this.selecActive?"编辑":"完成";
				this.bottomBox = !this.bottomBox;
				//this.disabled=true;
			},
			showTab(index){
				this.tabIndex = index;
				if(this.tabIndex){
					this.broswerRecords = uni.getStorageSync('brecords_'+this.$city) || {}; //浏览记录
					this.records = [];
					if(Object.keys(this.broswerRecords).length){
						for(let i in this.broswerRecords){
							this.records.push(this.broswerRecords[i]);
						}
						this.records.reverse();
					}
					if (!this.listData[this.tabIndex]['data'].length && this.tabIndexArr[this.tabIndex].status !== 'noMore') {
						this.getData(this.tabIndex);
					}
				}else{
					if(!this.hasLogin || !this.userInfo.hash){
						// #ifdef MP
						uni.switchTab({
							url:'/pages/user/index'
						});
						// #endif
						// #ifndef MP
						this.$util.ckLogin('/pages/user/vlogs');
						// #endif
						return;
					}
					if (!this.listData[this.tabIndex]['data'][this.type]['data'].length && this.tabIndexArr[this.tabIndex]['data'][this.type].status !== 'noMore') {
						this.getData(this.tabIndex);
					}
				}
			},
			trigger(e) {
				this.content[e.index].active = !e.item.active
				this.type = e.index;
				if(this.listData[this.tabIndex]['data'][this.type]['data'].length || this.tabIndexArr[this.tabIndex]['data'][this.type].status == 'noMore') return;
				this.getData(this.tabIndex);
				/* uni.showModal({
					title: '提示',
					content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				}) */
			},
			mesSelect(index,id,type) {
				//console.log(index)
				//console.log(id)
				if(this.tabIndex){
					if (index >= 0) {
						//console.log(this.selectRids)
						this.mesSelecOn = true;
						if(!this.selectRids[this.$city+id+'_'+type]){
							this.selectRids[this.$city+id+'_'+type] = id;
						}else{
							delete this.selectRids[this.$city+id+'_'+type];
						}
					} else {
						this.listData[this.tabIndex]['data'].map((item, index) => {
							if(!this.selectRids[this.$city+item.id+'_'+item.type]){
								this.selectRids[this.$city+item.id+'_'+item.type] = item.id;
							}
						})
					}
					this.selectRidsArr = Object.values(this.selectRids)
					//console.log(this.selectRidsArr)
				}else{
					if (index >= 0) {
						this.mesSelecOn = true;
						if(!this.selectIds.includes(id)){
							this.selectIds.push(id);
						}else{
							this.selectIds.splice(this.selectIds.findIndex(item => item === id), 1);
						}
					} else {
						this.listData[this.tabIndex]['data'][this.type]['data'].map((item, index) => {
							if(!this.selectIds.includes(item.aid)){
								this.selectIds.push(item.aid);
							}
						})
					}
				}
			},
			remove() {
				if(this.tabIndex){
					if(!this.selectRidsArr.length){
						uni.showToast({icon: 'none',title: '请至少选择1条浏览记录删除'});
						return;
					}
					for(let i in this.selectRids){
						delete this.broswerRecords[i];
					}
					uni.setStorageSync('brecords_'+this.$city,this.broswerRecords);
					this.selectRids = {};
					this.selectRidsArr = [];
					this.tabIndexArr[this.tabIndex].reload = true;
					this.tabIndexArr[this.tabIndex].status = 'more';
					this.tabIndexArr[this.tabIndex].page = 1;
					this.listData[this.tabIndex].data = [];
					this.broswerRecords = uni.getStorageSync('brecords_'+this.$city);
					this.records = [];
					if(Object.keys(this.broswerRecords).length){
						for(let i in this.broswerRecords){
							this.records.push(this.broswerRecords[i]);
						}
						this.records.reverse();
					}
					this.getData(this.tabIndex);
					this.mesEdit();
				}else{
					if(!this.selectIds.length){
						uni.showToast({icon: 'none',title: '请至少选择1条收藏记录删除'});
						return;
					}
					let params = {aids:this.selectIds.join(','),type:this.type == 0 ? 3 : (this.type == 1 ? 21 : 1),city:this.$city};
					this.$http.post(this.$api.userApi('delMultiCollect'), {data: params}).then(res => {
						if(res.data.status){
							if(this.type == 0){
								let collectHouseIds = uni.getStorageSync('collect_lpids_'+this.$city);
								this.selectIds.forEach((id) => {
									if(collectHouseIds.includes(id)){
										collectHouseIds.splice(collectHouseIds.findIndex(item => item === id), 1);
									}
								})
								uni.setStorageSync('collect_lpids_'+this.$city,collectHouseIds);
							}else if(this.type == 1){
								let collectHouseIds = uni.getStorageSync('collect_esfids');
								this.selectIds.forEach((id) => {
									if(collectHouseIds.includes(id)){
										collectHouseIds.splice(collectHouseIds.findIndex(item => item === id), 1);
									}
								})
								uni.setStorageSync('collect_esfids',collectHouseIds);
							}else{
								let collectNewsIds = uni.getStorageSync('collect_nids');
								this.selectIds.forEach((id) => {
									if(collectNewsIds.includes(id)){
										collectNewsIds.splice(collectNewsIds.findIndex(item => item === id), 1);
									}
								})
								uni.setStorageSync('collect_nids',collectNewsIds);
							}
							this.selectIds = [];
							uni.showToast({title:res.data.info,icon:'none'});
							this.tabIndexArr[this.tabIndex]['data'][this.type].reload = true;
							this.tabIndexArr[this.tabIndex]['data'][this.type].status = 'more';
							this.tabIndexArr[this.tabIndex]['data'][this.type].page = 1;
							this.getData(this.tabIndex);
							this.mesEdit();
						}else{
							uni.showToast({title:res.data.info,icon:'none'});
						}
					}).catch(error => {
						uni.showToast({title:'该用户无效',icon:'none'});
					});
				}
			},
			getData(tabIndex) {
				//console.log(tabIndex)
				if(tabIndex == 0){
					let params = {city:this.$city, page:this.tabIndexArr[tabIndex]['data'][this.type].page};
					params['type'] = this.type == 0 ? 3 : (this.type == 1 ? 21 : 1);
					this.listData[tabIndex]['data'][this.type]['data'].length && (this.tabIndexArr[tabIndex]['data'][this.type].status = 'loading');
					this.$http.get(this.$api.userApi('collectionList'), { data: params }).then(res => {
						if(res.data.status){
							let list = res.data.info;
							this.tabIndexArr[tabIndex]['data'][this.type].reload && uni.stopPullDownRefresh();
							this.listData[tabIndex]['data'][this.type]['data'] = this.tabIndexArr[tabIndex]['data'][this.type].reload ? list : this.listData[tabIndex]['data'][this.type]['data'].concat(list);
							this.tabBars = this.listData;
							//console.log(this.tabBars)
							if (this.listData[tabIndex]['data'][this.type]['data'].length >= res.data.total) this.tabIndexArr[tabIndex]['data'][this.type].status = 'noMore';
							++this.tabIndexArr[tabIndex]['data'][this.type].page;
							this.tabIndexArr[tabIndex]['data'][this.type].reload = false;
						}else{
							uni.showToast({ title: '加载数据失败',icon:'none'});
						}
					}).catch(error => {
						uni.showToast({title:'该用户无效',icon:'none'});
					});
				}else{
					let recordsTotal = this.records.length;
					if(recordsTotal){
						this.listData[tabIndex]['data'].length && (this.tabIndexArr[tabIndex].status = 'loading');
						this.tabIndexArr[tabIndex].reload && uni.stopPullDownRefresh();
						this.records.map((item,index) => {
							//if(index < 10) this.listData[tabIndex]['data'].push(this.records[index]);
							if(this.tabIndexArr[tabIndex].page == 1){
								if(index < 10) this.listData[tabIndex]['data'].push(this.records[index]);
							}else{
								if(index >= this.tabIndexArr[tabIndex].page*10 - 10 && index < this.listData[tabIndex]['data'].length+10){
									if(this.records[index]){
										this.listData[tabIndex]['data'].push(this.records[index]);
									}
								}
							}
						})
						this.tabBars = this.listData;
						if (this.listData[tabIndex].data.length >= recordsTotal) this.tabIndexArr[tabIndex].status = 'noMore';
						++this.tabIndexArr[tabIndex].page;
						this.tabIndexArr[tabIndex].reload = false;
						//console.log(this.listData[tabIndex]['data'])
					}else{
						this.tabIndexArr[tabIndex].reload && uni.stopPullDownRefresh();
						uni.showToast({ title: '暂无浏览记录',icon:'none'});
					}
				}
			}
		}
	}
</script>
<style lang="less">
	page {
		background: #F7F7F7;
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

	.uhide {
		display: none;
	}

	.recordsCon {
		&>view:nth-child(1) {
			width: 100%;
			height: 118rpx;
			margin: 0 auto;
			.uniRow();
			justify-content: space-between;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
			border-bottom: 1px solid #e5e5e5;
			background-color: #f7f7f7;

			&>view:nth-child(1) {
				margin-left: 10rpx;
			}

			&>view:nth-child(2) {
				width: 260rpx;
				height: 60rpx;
				.boder();
				border-color: #3f3f3f;
				font-size: 28rpx;
				border-radius: 60rpx;
				overflow: hidden;
				.uniRow();

				view {
					color: #3f3f3f;
					text-align: center;
					line-height: 60rpx;
					flex: 1;

					&.on {
						background-color: #3f3f3f;
						color: #fff;
					}
				}

			}

			&>view:nth-child(3) {
				margin-right: 20rpx;
				font-size: 28rpx;
			}
		}

		&>view:nth-child(2) {
			margin-top: 118rpx;
			flex: 1;
			padding-bottom: 90rpx;

		}

		&>view:nth-child(3) {
			width: 100%;
			height: 90rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			background-color: #f7f7f7;
			.boder();
			border-top-color: #e5e5e5;
			position: fixed;
			z-index: 7;
			bottom: 0;
			left: 0;
			.uniRow();
			justify-content: space-between;
			align-items: center;
		}

		.imgLab {
			padding: 2px 5px;
			background: rgba(0, 0, 0, 0.6);
			font-size: 20rpx;
			color: #fff;
			/* position: absolute;
			top: 20rpx;
			left: 20rpx; */
		}

		.recordSelecBox {
			position: absolute;
			top: 156rpx;
			left: 30rpx;

			.checkBox {
				border-radius: 50%;
				width: 32rpx;
				height: 32rpx;
				background-color: transparent;
				border: solid 1px #fff;

				&:after {
					content: '';
					width: 16rpx;
					height: 8rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					margin-left: -10rpx;
					margin-top: -8rpx;
					background: transparent;
					border: 2px solid #ffffff;
					border-top: none;
					border-right: none;
					z-index: 2;
					-webkit-transform: rotate(-45deg);
					transform: rotate(-45deg);
				}

				&.on {
					background-color: #e83836;
				}
			}
		}

		.houseList {
			.bg-white();
			.pad10();
			.uniRow();
			position: relative;

			.imgLab {
				position: absolute;
				top: 20rpx;
				left: 20rpx;

			}

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

			image {
				width: 250rpx;
				height: 180rpx;
				margin-right: 40rpx;
			}

			.cooectLeftBox {
				flex: 1;
				.uniColumn();
				justify-content: space-between;

				&>view:nth-child(1) {
					color: #3f3f3f;
					font-size: 32rpx;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					word-wrap: break-word;
					word-break: break-all;
					white-space: normal !important;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;

					&.esfTitel {
						font-size: 30rpx;
						margin-top: -4rpx;
					}
				}

				&>view:nth-child(2) {
					color: #3f3f3f;
					font-size: 22rpx;

					&.esfSecond {
						.fontGray();
						.uniRow();
						justify-content: space-between;
						align-items: center;

						&>view:nth-child(2) {
							color: #e83836;
							font-size: 30rpx;
						}
					}
				}

				&>view:last-child {
					color: #e83836;
					font-size: 30rpx;

					&.esflabBox {
						display: flex;
						flex-flow: row wrap;

						view {
							background-color: transparent;
							font-size: 22rpx;
							color: #5990d3;
							padding: 0 5px 2px 5px;
							margin: 2px 5px 2px 0;
							position: relative;

							&:after {
								content: " ";
								width: 200%;
								height: 200%;
								position: absolute;
								top: 0;
								left: 0;
								border: 1px solid #b2daff;
								-webkit-transform: scale(.5);
								transform: scale(.5);
								-webkit-transform-origin: 0 0;
								transform-origin: 0 0;
								box-sizing: border-box;
								border-radius: 6px;
							}
						}

						&>view:nth-child(2n+1) {
							color: #5990d3;

							&:after {
								border: 1px solid #b2daff;
							}
						}

						&>view:nth-child(2n) {
							color: #6bc193;

							&:after {
								border: 1px solid #8ffdc2;
							}
						}
					}
				}

				.labBox {
					display: flex;
					flex-flow: row wrap;

					view {
						background-color: #f6f6f6;
						font-size: 22rpx;
						.fontGray();
						border-radius: 3px;
						padding: 0 5px 1px 5px;
						margin: 2px 5px 2px 0;
					}

					&>view:nth-child(1) {
						background-color: #ffeeee;
						color: #e83836;
					}
				}

				.infoBox {
					.fontGray();
					font-size: 22rpx;
					.uniRow();
					justify-content: space-between;
					align-items: center;
				}

			}

		}

		.newsList {
			.uniRow();
			padding: 20rpx;
			position: relative;

			.imgLab {
				right: 20rpx;
				top: 20rpx;
				position: absolute;
			}

			

			image {
				width: 230rpx;
				height: 165rpx;
				margin-left: 40rpx;
			}

			.newsLeft {
				flex: 1;
				.uniColumn();
				justify-content: space-between;

				.newsTitel {
					color: #3f3f3f;
					font-size: 30rpx;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					word-wrap: break-word;
					word-break: break-all;
					white-space: normal !important;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.uniRow {
					font-size: 22rpx;
					.fontGray();

					&>view:nth-child(1) {
						margin-right: 20rpx;
					}
				}

			}
		}




	}
</style>
