<template>
	<view class="findContainer" v-if="show">
		<view id="tab-bar" class="topTab">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="topTapList" :class="tabIndex==index ? 'active' : ''" :id="tab.id"
			 :data-current="index">
				<text :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</text>
			</view>
		</view>
		<swiper :current="tabIndex" class="swiperBox" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab, index) in tabBars" :key="index">
				<scroll-view class="list" scroll-y @scrolltolower="loadMore(index)">
					<view v-if="tab.data.length">
					<question-lists v-for="(item, iindex) in tab.data" :key="iindex" :item="item"></question-lists>
					<uni-load-more :status="tabIndexArr[index].status" :content-text="contentText" />
					</view>
					<no-content v-else></no-content>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>

</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import questionLists from '../../components/questionLists.vue'
	import noContent from '../../components/noContent.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			questionLists,
			uniLoadMore,
			noContent
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',

				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [{
					name: '我的提问',
					id: 'myQuestion',
				}, {
					name: '我的回答',
					id: 'myAnswers'
				}],
				show:false,
				listData: [], //列表数据
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				type: '', //加载类型
				tabIndexArr: []
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad() {
			uni.$once('login',() => { //监听登录事件
				this.setTabBar();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/user/myqa');
				return;
			}
			this.setTabBar();
		},
		onPullDownRefresh() {
			this.tabIndexArr[this.tabIndex].reload = true;
			this.tabIndexArr[this.tabIndex].page = 1;
			this.getData(this.tabIndex);
		},
		onReachBottom() {
			if (this.tabIndexArr[this.tabIndex].status == 'noMore') return;
			this.tabIndexArr[this.tabIndex].status = 'more';
			this.getData(this.tabIndex);
		},
		methods: {
			setTabBar(){
				this.tabBars.forEach(item => {
					this.tabIndexArr.push({ page: 1, status: 'more', reload: false });
					let aryItem = {
						id:item.id,
						name: item.name,
						data: []
					};
					this.listData.push(aryItem);
				})
				this.tabBars = this.listData;
				this.getData(0);
			},
			loadMore(tabIndex) {
				if (this.tabIndexArr[tabIndex].status == 'noMore') return;
				this.tabIndexArr[tabIndex].status = 'more';
				this.getData(tabIndex);
			},
			async changeTab(e) {
				let index = e.target.current;
				if (!this.listData[index]['data'].length && this.tabIndexArr[index].status !== 'noMore') {
					this.getData(index);
				}
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				/* if (this.newsitems[tabIndex].data.length === 0) {
					this.addData(tabIndex)
				} */
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			getData(tabIndex) {
				let params = {type: tabIndex, page: this.tabIndexArr[tabIndex].page };
				this.listData[tabIndex]['data'].length && (this.tabIndexArr[tabIndex].status = 'loading');
				this.$http.get(this.$api.userApi('userQatitleList'), { data: params }).then(res => {
					if(res.data.status){
						//console.log(this.tabIndexArr[tabIndex].page)
						this.tabIndexArr[tabIndex].reload && uni.stopPullDownRefresh();
						let list = res.data.info;
						this.listData[tabIndex]['data'] = this.tabIndexArr[tabIndex].reload ? list : this.listData[tabIndex]['data'].concat(list);
						this.tabBars = this.listData;
						//console.log(this.tabBars)
						this.show = true;
						if (this.listData[tabIndex].data.length >= res.data.total) this.tabIndexArr[tabIndex].status = 'noMore';
						++this.tabIndexArr[tabIndex].page;
						this.tabIndexArr[tabIndex].reload = false;
					}else{
						uni.showToast({ title: '加载数据失败',icon:'none'});
					}
				})
				.catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			}
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
		padding: 0 20rpx;
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
	.font-gray{
		color: #9e9e9e;
	}
	.findContainer {
		.uniColumn();
		flex: 1;
		overflow: hidden;
		height: 100%;
		.list {
		 	width: 100%;
		 	height: 100%;
		 }

		.topTab {
			width: 100%;
			height: 80rpx;
			.boder();
			border-top-color: #e5e5e5;
			border-bottom-color: #e5e5e5;
			.bg-gray();
			.uniRow();
			.fontGray();
			padding: 7px 0;
			box-sizing: border-box;

			.topTapList {
				text-align: center;
				flex-grow: 1;
				border-right: solid 1px #e5e5e5;
				font-size: 28rpx;
				height: 52rpx;
				line-height: 52rpx;
				

				&:last-child {
					border-right: none;
				}
			}
		}

		.swiperBox {
			flex: 1;
			width: 100%;
			/* height: calc(100% - 100rpx); 
			height: 100vh;*/
		}

		.active {
			color: #3f3f3f;
			font-weight: bold;

			text {
				position: relative;

				&:after {
					content: '';
					position: absolute;
					left: 0;
					width: 100%;
					height: 5rpx;
					.bg-red();
					border-radius: 20rpx;
					-webkit-border-radius: 20rpx;
					bottom: -9px;
				}
			}
		}

		.charts {
			width:375rpx;
			height:500rpx;
			background-color: #FFFFFF;
		}

		.qiun-title-dot-light {
			border-bottom: solid 1px #e5e5e5;
			font-size: 32rpx;
			color: #000000;
			padding-bottom:20rpx;
			padding-top:10rpx;
		}

		.qiun-title-bar {
			width: 96%;
			padding: 10rpx 2%;
			flex-wrap: nowrap;
		}
		.taxesDetailed{
			.bg-white();
			.pad10();
			font-size:28rpx;
			padding: 20rpx;
			view{
				width: 400rpx;
				margin: 20rpx auto;
				padding-left: 40rpx;
				box-sizing: border-box;
			}
			.titel{
				.font-gray();
			}
			.dian1{
				position: relative;
				&::before{
					content: "";
					width: 20rpx;
					height: 20rpx;
					position:absolute;
					background-color: #1890ff;
					left: 0;
					top: 50%;
					margin-top: -10rpx;
					border-radius: 50%;
				}
			}
			.dian2{
				.dian1();
				&::before{
					background-color: #2fc25b;	
				}
			}
			.dian3{
				.dian1();
				&::before{
					background-color: #facc14;
				}
			}
		}
	}
</style>
