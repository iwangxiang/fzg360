<template>
	<view class="type">
		<view class="typeTab">
			<view>
				<view v-for="(item,index) in shiArr" :key="index" :class="{active:tabIndex==index}" @tap="doDisplay(index,item.shi)">
					{{item.shiText}}({{item.shi_counts}})
				</view>
			</view>
		</view>
		<view class="typeInfo">
			<view>
				本页提及面积，无特殊说明均指建筑面积
			</view>
		</view>
		<view class="typeHouseList">
			<view v-for="(tab,index) in listData" :key="index">
				<view v-if="tabIndex == index && tab.data.length" v-for="(item,iindex) in tab.data" :key="iindex" @tap="goPath(item.outsid,item.id)">
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
							<view v-if="item.sale">{{item.sale}}</view>
						</view>
					</view>
				</view>
				<uni-load-more v-if="tabIndex == index && tab.data.length" :status="tabIndexArr[tabIndex].status" :content-text="contentText" />
				<no-content v-else-if="tabIndex == index && !tab.data.length"></no-content>
			</view>
		</view>
		
		<share-popup :show="show" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	import sharePopup from "../../components/sharePopup.vue";
	import fzgIcon from '../../components/fzg-icon/index.vue'
	import noContent from '../../components/noContent.vue'
	export default{
		data(){
			return{
				show:false,
				tabIndex:0,
				id:'',
				shiArr:[],//居室数组
				listData: [], //列表数据
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				shi: 0, //几室
				tabIndexArr: [],
				site:''
			}
		},
		components:{
			sharePopup,
			fzgIcon,
			uniLoadMore,
			noContent
		},
		onLoad(option) {
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			this.site = option.site ? option.site : this.$city;
			this.getRoom();
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
		methods:{
			pop(){
				this.show=true;
			},
			closePoP(){
				this.show = false;
			},
			doDisplay(index,shi){
				this.tabIndex = index;
				this.shi = shi;
				//console.log(this.shi)
				if (!this.listData[index]['data'].length && this.tabIndexArr[index].status !== 'noMore') {
					this.getData(index);
				}
			},
			goPath(outsid,id){
				uni.navigateTo({
					url:'/pages/house/hxView?id='+id+(outsid ? '&outsid='+outsid : '')+(this.site != this.$city ? '&site='+this.site : '')
				})
			},
			getRoom() {
				let params = {id:this.id};
				this.$http.get(this.$api.siteApi(this.site,'hxRoom'), { data: params }).then(res => {
					if(res.data.code == 0){
						res.data.data.hx && (this.shiArr = Object.values(res.data.data.hx));
						this.shiArr.map((item,index) => {
							this.tabIndexArr.push({page: 1, status: 'more', reload: false});
							this.listData.push({data:[]});
						})
						this.getData();
					}else{
						uni.showToast({ title: '加载数据失败',icon:'none'});
					}
				}).catch(error => {
					uni.showToast({ title: '加载数据失败',icon:'none'});
				});
			},
			getData() {
				let params = { id:this.id,shi: this.shi, page: this.tabIndexArr[this.tabIndex].page };
				this.listData[this.tabIndex]['data'].length && (this.tabIndexArr[this.tabIndex].status = 'loading');
				this.$http.get(this.$api.siteApi(this.site,'hxList'), { data: params }).then(res => {
					if(res.data.code == 0){
						this.tabIndexArr[this.tabIndex].reload && uni.stopPullDownRefresh();
						let list = res.data.data.lists;
						this.listData[this.tabIndex]['data'] = this.tabIndexArr[this.tabIndex].reload ? list : this.listData[this.tabIndex]['data'].concat(list);
						if (this.listData[this.tabIndex].data.length >= res.data.data.total) this.tabIndexArr[this.tabIndex].status = 'noMore';
						++this.tabIndexArr[this.tabIndex].page;
						this.tabIndexArr[this.tabIndex].reload = false;
					}else{
						uni.showToast({ title: '加载数据失败',icon:'none'});
					}
				}).catch(error => {
					uni.showToast({ title: '加载数据失败',icon:'none'});
				});
			}
		},
		onNavigationBarButtonTap(e){
			if(e.index==0){	
				this.show=true;
			}
		}
	}
</script>

<style lang="less" scoped>
	.type{
		.typeTab{
			height: 68rpx;
			line-height: 68rpx;
			background-color: #F9F9F9;
			border-top: 1px solid #E5E5E5;
			border-bottom: 1px solid #E5E5E5;
			&>view{
				padding: 0 20rpx;
				display: flex;
				&>view{
					margin-right: 44rpx;
					font-size: 26rpx;
				}
				.active{
					color: #e83836;
				}
			}
		}
		.typeInfo{
			padding: 0 20rpx;
			border-bottom: 1px solid #E5E5E5;
			&>view{
				font-size: 18rpx;
				color: #9a9a9a;
				height: 51rpx;
				line-height: 51rpx;
			}
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
	}
</style>
