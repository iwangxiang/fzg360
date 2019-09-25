<template>
	<view class="search">
		
		<view class="header">
			<view class="back">
				<fzg-icon size="20" type="back" color="#3F3F3F" @tap="goBack"></fzg-icon>
			</view>
			<view class="input">
				<view class="inputMenu">
					<view class="inputMenuText" @tap="goPopupLayer">
						{{inputMenuText}}
						<fzg-icon class="inputMenuIconOpen" size="10" type="open" color="#848484"></fzg-icon>
						<view class="popupLayer" v-if="popupLayerFlag">
							<view class="top"></view>
							<view class="popupLayerText" v-for="(item,index) in textList" :key="index" @tap.stop="goMenu(item)" :style="{color:item.red}">
								{{item.text}}
							</view>
						</view>
					</view>
					<fzg-icon class="inputMenuIconBsearch" size="15" type="bsearch" color="#848484"></fzg-icon>
				</view>
				<input type="text" :placeholder="placeHolderArr[type]" v-model="keyword" @input="onKeyInput" @blur="onKeyBlur" @confirm="doSearch(keyword,type)">
			</view>
			<view class="cancel" @tap="goBack">
				取消
			</view>
		</view>
		
		<!-- 如果：有搜索结果 -->
		<view class="yesSearch" v-if="listData.length">
			<news-lists v-if="type == 0" v-for="(item,index) in listData" :key="index" :item="item" @click="goPath"></news-lists>
			<house-lists v-if="type == 1" v-for="(item,index) in listData" :key="index" :item="item"></house-lists>
			<sale-lists v-if="type == 2" v-for="(item,index) in listData" :key="index" :item="item"></sale-lists>
			<broker v-if="type == 3" v-for="(item,index) in listData" :key="index" :item="item"></broker>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		
		<!-- 搜索历史 -->
		<view class="historySearch" v-if="showHistory">
			<view class="hsQuestion" v-if="emptyResult">
				<fzg-icon size="15" type="question" color="#3F3F3F"></fzg-icon>
				<view class="hsQuestionText">暂时没有找到相关信息</view>
			</view>
			<view v-if="searchHistory.length">
				<view class="hsTitle">
					<view class="hsTitleText">搜索历史</view>
					<fzg-icon size="15" type="delete" color="#3F3F3F" @tap="clearSearchHistory"></fzg-icon>
				</view>
				<view class="hsContLists" v-for="(item,index) in searchHistory" :key="index">
					<view class="hsContListsCont" @tap="doSearch(item.keyword,item.type)">
						<view class="hsContListsText">{{item.keyword}}</view>
						<uni-icon class="iUniIcon" color="#9E9E9E" size="20" type="forward"></uni-icon>
					</view>
				</view>
			</view>
			<!-- 没有任何搜索历史 -->
			<view class="noSearch" v-else>
				<view class="noSearchImage">
					<image src="../../static/noSearch.jpg"></image>
				</view>
				<view class="noSearchText">没有任何搜索历史</view>
			</view>
		</view>
		<view class="mask" @tap="goMask" v-if="maskFlag"></view>
	</view>
</template>

<script>
	import fzgIcon from '@/components/fzg-icon/index.vue';
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui';
	import newsLists from '@/components/newsLists.vue';
	import houseLists from '@/components/houseLists.vue';
	import saleLists from '@/components/saleLists.vue';
	import broker from "../../components/broker.vue";
	export default{
		components:{
			fzgIcon,
			uniIcon,
			uniLoadMore,
			newsLists,
			houseLists,
			saleLists,
			broker,
		},
		data(){
			return{
				newHouseItems:[],
				// 模拟变量
				search:false,
				popupLayerFlag:false,
				maskFlag:false,
				inputMenuText:"新闻",
				textList:[
					{type:0,text:"新闻"},
					{type:1,text:"新房"},
					{type:2,text:"二手房"},
					{type:3,text:"经纪人"},
					{type:4,text:"帮办"},
				],
				type:1,//默认是新房搜索
				placeHolderArr:['请输入新闻标题','请输入楼盘名或地段名','请输入二手房','请输入经纪人','请输入掌柜帮办标题'],
				searchHistory:[], //搜索历史记录
				showHistory: true, // 是否显示搜索历史记录
                emptyResult: false, // 搜索结果为空时显示
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
			}
		},
		// 模拟有搜索结果数据
		onLoad(option) {
			if(!option.type){
				this.textList[1].red = 'red';
				this.inputMenuText = this.textList[1].text;
			}else{
				this.type = option.type;
				this.textList[option.type].red = 'red';
				this.inputMenuText = this.textList[option.type].text;
			}
			this.searchHistory = uni.getStorageSync('searchHistory') || [];
			//console.log(this.searchHistory)
		},
		onPullDownRefresh() {
			if(!this.keyword){
				uni.stopPullDownRefresh();
			}
			this.reload = true;
			this.page = 1;
			this.getData();
		},
		onReachBottom() {
			if(this.status == 'noMore') return;
			this.status = 'more';
			this.getData();
		},
		methods:{
			goPath(e) {
				uni.navigateTo({
					url: '/pages/news/detail?id=' + e.id
				});
			},
			goMenu(i){
				this.popupLayerFlag = false;
				this.maskFlag = false;
				this.inputMenuText = i.text;
				this.textList.forEach((item,index) => {
					delete this.textList[index]['red'];
				});
				this.textList[i.type].red = 'red';
				this.type = i.type;
                this.doSearch(this.keyword,this.type);
			},
			goMask(){
				this.popupLayerFlag = false;
				this.maskFlag = false;
			},
			goPopupLayer(){
				this.popupLayerFlag = this.popupLayerFlag ? false : true;
				this.maskFlag = this.maskFlag ? false : true;
			},
			goBack(){
				uni.navigateBack();
			},
			clearSearchHistory(){
				this.searchHistory = [];
				uni.removeStorageSync('searchHistory');
			},
			//搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
			onKeyInput: function(event) {
				this.keyword = event.target.value;
				if (!this.keyword) {
				    this.page = 1;
				    this.showHistory = true; //显示历史记录
				    this.listData = []; //清空搜索结果
				    this.emptyResult = false; //隐藏搜索为空提示
				}
			},
			onKeyBlur(){
				if(this.listData.length) return;
				this.doSearch(this.keyword,this.type);
			},
			doSearch(kw,type){
				if (kw) {
                    this.keyword = kw;
					this.type = type;
					this.inputMenuText = this.textList[type].text;
					this.textList.forEach((item,index) => {
						delete this.textList[index]['red'];
					});
					this.textList[type].red = 'red';
                }else if (!this.keyword) {
                    return 
                }
				if(this.searchHistory.length){
					let checkRepeat = false;
					this.searchHistory.map(item => {
						if(item.keyword == this.keyword){
							checkRepeat = true;
						}
					})
					if (!checkRepeat) {
						this.searchHistory.push({keyword:this.keyword,type:this.type});
					}
				}else{
					this.searchHistory.push({keyword:this.keyword,type:this.type});
				}
				uni.setStorageSync('searchHistory',this.searchHistory);
				this.showHistory = false;//隐藏历史记录
				this.listData = [];
				this.status = 'more';
				this.reload = true;
				this.page = 1;
				this.getData();
			},
			getData() {
				if(!this.keyword){
					return;
				}
				let requestUrl = '',params = {keyword:this.keyword,page:this.page};
				switch(Number.parseInt(this.type)){
					case 0://新闻搜索
						requestUrl = this.$api.siteApi(this.$city,'newsCatidList');
						break;
					case 1://新房搜索
						requestUrl = this.$api.siteApi(this.$city,'houseList');
						break;
					case 2://二手房搜索
						requestUrl = this.$api.fuberApi('saleList');
						params['city'] = this.$city;
						break;
					case 3://经纪人搜索
						requestUrl = this.$api.fuberApi('userList');
						params['city'] = this.$city;
						break;
					case 4://掌柜帮办搜索
						requestUrl = this.$api.siteApi(this.$city,'qatitleSearch');
						break;
				}
				this.listData.length && (this.status = 'loading');
				this.$http.get(requestUrl, {data: params}).then(res => {
					if(res.data.code == 0 || res.data.status){
						if(this.page == 1){
							uni.showToast({
								title: '请求成功',
								icon: 'success',
								// #ifndef MP-ALIPAY
								duration:500,
								mask: true
								// #endif
							});
						}
						this.reload && uni.stopPullDownRefresh();
						if(this.type == 2 || this.type == 3){
							let list = res.data.info;
							this.listData = this.reload ? list : this.listData.concat(list);
							if(this.listData.length >= res.data.total) this.status = 'noMore';
						}else{
							let list = res.data.data.lists;
							this.listData = this.reload ? list : this.listData.concat(list);
							if(this.listData.length >= res.data.data.total) this.status = 'noMore';
						}
						++this.page;
						this.reload = false;
						this.emptyResult = !this.listData.length;
						if(this.emptyResult){
							this.showHistory = !this.showHistory;
						}
					}else{
						this.emptyResult = !this.listData.length;
						if(this.emptyResult){
							this.showHistory = !this.showHistory;
						}
					}
				}).catch(error => {
					console.error('error:',error);
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.search{
		.header{
			width: 100%;
			height: 44px;
			background-color: #f8f8f8;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9;
			display: flex;
			align-items: center;
			.back{
				padding: 0 10px;
			}
			.input{
				flex: 1;
				width: 562rpx;
				height: 30px;
				display: flex;
				background-color: #e9e9e9;
				border-radius: 4px;
				.inputMenu{
					width: 213rpx;
					height: 30px;
					padding: 0 10rpx 0 20rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.inputMenuText{
						font-size: 14px;
						position: relative;
						.inputMenuIconOpen{
							margin-left: 10rpx;
						}
						.popupLayer{
							width: 200rpx;
							background-color: #ffffff;
							border-radius: 10px;
							border: 1px solid #E5E5E5;
							position: absolute;
							top: 90rpx;
							left: -25rpx;
							z-index: 9;
							.top{
								position: absolute;
								left: 50%;
								margin-left: -10px;
								top: -20px;
							}
							.top:before,.top:after{
								 position: absolute;
								 content: '';
								 border-top: 10px transparent dashed;
								 border-left: 10px transparent dashed;
								 border-right: 10px transparent dashed;
								 border-bottom: 10px #fff solid;
							}
							.top:before{
								border-bottom: 10px #E5E5E5 solid;
							}
							.top:after{
								 top: 1px; 
								 border-bottom: 10px #fff solid;
							}
							.popupLayerText{
								height: 75rpx;
								line-height: 75rpx;
								border-bottom: 1px solid #E5E5E5;
								text-align: center;
								font-size: 16px;
							}
							.popupLayerText:last-child{
								border: none;
							}
						}
					}
				}
				input{
					/* #ifdef MP-TOUTIAO */
					width: 320rpx;
					/* #endif */
					/* #ifndef MP-TOUTIAO */
					width: 349rpx;
					/* #endif */
					height: 30px;
					/* #ifdef MP-ALIPAY */
					height: 26px;
					/* #endif*/
					font-size: 12px;
					background-color: #e9e9e9;
				}
			}
			.cancel{
				font-size: 14px;
				margin: 0 20rpx;
			}
		}
		.yesSearch{
			margin-top: 44px;
		}
		.noSearch{
			width: 270rpx;
			height: 244rpx;
			position: absolute;
			top: 257rpx;
			left: 50%;
			text-align: center;
			margin-left: -108rpx;
			.noSearchImage{
				width: 216rpx;
				height: 198rpx;
				margin: 0 auto;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.noSearchText{
				margin-top: 20rpx;
				font-size: 16px;
			}
		}
		.historySearch{
			margin-top: 44px;
			.hsQuestion{
				height: 100rpx;
				background-color: #F8C3C3;
				display: flex;
				align-items: center;
				justify-content: center;
				.hsQuestionText{
					font-size: 16px;
					margin-left: 10rpx;
				}
			}
			.hsTitle{
				padding: 0 20rpx;
				background-color: #f8f8f8;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 70rpx;
				border-top: 1px solid #E2E2E1;
				border-bottom: 1px solid #E2E2E1;
				.hsTitleText{
					font-size: 16px;
				}
			}
			.hsContLists{	
				border-bottom: 1px solid #E2E2E1;
				.hsContListsCont{
					height: 87rpx;
					padding: 0 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.hsContListsText{
						font-size: 16px;
					}
				}
			}
		}
		.mask{
			width: 100%;
			height: 100%;
			background-color: #000000;
			opacity: .3;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 8;
		}
	}
</style>
