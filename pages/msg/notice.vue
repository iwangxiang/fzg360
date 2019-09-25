<template>
	<view class="noticeCon" v-if="show">
		<view>
			<fzg-icon @tap="goBack" type="back" size="20"></fzg-icon>
			<view>消息</view>
			<view class="rightTxt" @tap="mesEdit">{{iFlag}}</view>
		</view>
		<view>
			<scroll-view scroll-y style="height: 100vh;">
				<view v-if="listData.length">
				<view class="noticeListCon" v-for="(item,index) in listData" :key="index">
					<view class="noticeLeft" :class="{ uhide:selecActive}"  @tap="mesSelect(index,item.id)">
						<view class="selectionPiont" :class="{on:item.val}"></view>
					</view>
					<view class="noticeList">
						<view class="stateBox">
							<view>{{item.statusStr}}</view>
							<view>{{item.createdate}}</view>
						</view>
						<view class="messsge">{{item.content}}</view>
					</view>
				</view>
				<uni-load-more :status="status" :content-text="contentText" />
				</view>
				<no-content v-else></no-content>
			</scroll-view>
		</view>
		<view  v-show="bottomBox">
			<view @tap="mesSelect(-2)">全部</view>
			<view @tap="remove()">删除</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue"
	import {uniLoadMore} from '@dcloudio/uni-ui' // uniIcon,
	import noContent from '../../components/noContent.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			fzgIcon,
			uniLoadMore,
			noContent
		},
		data() {
			return {
				selecActive:true,
				mesSelecOn:false,
				tabIndex:null,
				iFlag:"编辑",
				bottomBox:false,
				show:false,
				listData: [], //列表数据
				reload: false, //重新加载标志
				status: 'more', //加载的状态
				contentText: { //加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				page:1 ,//页数
				selectIds:[],
				selectAll: false,
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad(){
			uni.$once('login',() => { //监听登录事件
				this.page = 1;
				this.status = 'more';
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/msg/notice');
				return;
			}
			this.getData();
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
			goBack() {
				uni.navigateBack();
			},
			mesEdit(){
				this.selecActive=!this.selecActive;
				this.iFlag=this.selecActive?"编辑":"完成";
				this.bottomBox=!this.bottomBox;
			},
			mesSelect(index,id){
				if(index>=0){
					this.mesSelecOn=true;
					this.listData[index].val=!this.listData[index].val;
					if(!this.selectIds.includes(id)){
						this.selectIds.push(id);
					}else{
						this.selectIds.splice(this.selectIds.findIndex(item => item === id), 1);
					}
					console.log(this.selectIds)
				}else{
					this.listData.forEach((item,index)=>{
						if(!this.selectAll){
							this.listData[index].val = true;
							if(!this.selectIds.includes(item.id)){
								this.selectIds.push(item.id);
							}
						}else{
							this.listData[index].val = false;
							this.selectIds = [];
						}
					})
					this.selectAll = !this.selectAll;
					console.log(this.selectIds)
				}
			},
			remove(){
				if(!this.selectIds.length){
					uni.showToast({icon: 'none',title: '请至少选择1条消息'});
					return;
				}
				let params = {ids:this.selectIds.join(',')};
				this.$http.post(this.$api.userApi('doMesDel'), {data: params}).then(res => {
					if(res.data.status){
						this.selectIds = [];
						uni.showToast({title:res.data.info,icon:'none'});
						for(let i=this.listData.length-1; i>=0; i--){
							if(this.listData[i].val){
								this.listData.splice(i,1);
							}
						}
						this.reload = true;
						this.status = 'more';
						this.page = 1;
						this.getData();
						this.mesEdit();
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			getData(){
				let params = {page:this.page};
				this.page > 1 && (this.status = 'loading');
				this.$http.get(this.$api.userApi('messageList'), {data: params}).then(res => {
					if(res.data.status){
						if(this.page == 1 && !this.reload){
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
						let list = res.data.info;
						this.listData = this.reload ? list : this.listData.concat(list);
						this.show = true;
						if(this.listData.length >= res.data.total) this.status = 'noMore';
						++this.page;
						this.reload = false;
					}else{
						uni.showToast({title: '加载数据失败',icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				})
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
	.uhide{display: none;}
	.noticeCon {
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
				color: #383838;
				font-size: 32rpx;
			}

			&>view:nth-child(3) {
				margin-right: 20rpx;
				font-size: 28rpx;
			}
		}

		&>view:nth-child(2) {
			margin-top: 138rpx;
			flex: 1;
			padding-bottom: 90rpx;

			.noticeListCon {
				width: 94.67%;
				margin: 0 auto 20rpx auto;
				.uniRow();
				justify-content: space-between;
				align-items: cente;

				.noticeList {
					flex: 1;
					.bg-white();
					font-size: 24rpx;
					position: relative;
					border-radius: 10rpx;
					.pad10();

					&:after {
						content: " ";
						width: 200%;
						height: 200%;
						position: absolute;
						top: 0;
						left: 0;
						border: 1px solid rgba(0, 0, 0, .2);
						-webkit-transform: scale(.5);
						transform: scale(.5);
						-webkit-transform-origin: 0 0;
						transform-origin: 0 0;
						box-sizing: border-box;
						border-radius: 10px;
					}

					.stateBox {
						font-size: 24rpx;
						.font-gray();
						.uniRow();
						padding-bottom: 20rpx;
						justify-content: space-between;
						position: relative;

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
					}

					.messsge {
						font-size: 24rpx;
						padding-top: 10rpx;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						word-wrap: break-word;
						word-break: break-all;
						white-space: normal !important;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					& .on {
						.font-gray();
					}

				}

				.noticeLeft {
					padding-right: 20rpx;
					.uniRow();
					align-items: center;
					justify-content: center;

					.selectionPiont {
						width: 32rpx;
						height: 32rpx;
						border-radius: 50%;
						.bg-white();
						.boder();
						border-color: #9e9e9e;
					}

					& .on {
						.bg-red();
						border-color: #e83836;
						position: relative;

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
					}

				}
				& .uhide{display: none;}
			}
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
	}
</style>
