<template>
	<view class="panoramic">
		<view class="newHouseBanner">
			<image src="https://static.fzg360.com/images/app/zf_banner.jpg"></image>
		</view>
		<view class="panoramicImageList">
			<view v-if="listData.length">
			<view v-for="(item,index) in listData" :key="index" @tap="goWebView(item.subject,item.url)">
				<view>
					<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
				</view>
				<view>
					<text>{{item.subject}}</text>
				</view>
			</view>
			<uni-load-more :status="status" :content-text="contentText" />
			</view>
			<no-content v-else></no-content>
		</view>
	</view>
</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import noContent from '../../components/noContent.vue'
	export default {
		data() {
			return {
				colorFlag: 0,
				fzgIconColor: "#fff",
				inputBackgroundColor: "white",
				listData: [], //列表数据
				reload: false, //重新加载标志
				status: 'more', //加载的状态
				contentText: { //加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				page:1 ,//页数
				keyword:'',
			}
		},
		components: {
			uniIcon,
			fzgIcon,
			uniLoadMore,
			noContent
		},
		onLoad(){
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
			goWebView(title,url){
				uni.navigateTo({
					url:"/pages/index/webView?title="+title+"&url=" + encodeURIComponent(url)
				});
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
				if(this.keyword) params['keyword'] = this.keyword;
				this.listData.length && (this.status = 'loading');
				this.$http.get(this.$api.siteApi(this.$city,'tiganList'), {data: params}).then(res => {
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
					let list = res.data.data.lists;
					this.listData = this.reload ? list : this.listData.concat(list);
					if(this.listData.length >= res.data.data.total) this.status = 'noMore';
					++this.page;
					this.reload = false;
				}).catch(error => {
					uni.showToast({title: '加载数据失败',icon:'none'});
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
			let tmpY = 150;
			e.scrollTop = e.scrollTop > tmpY ? 150 : e.scrollTop;
			this.colorFlag = e.scrollTop * (1 / tmpY);
			if (this.colorFlag < 0.5) {
				this.fzgIconColor = "#FFF";
				this.inputBackgroundColor = "#FFF";
			} else {
				this.fzgIconColor = "#333";
				this.inputBackgroundColor = "#efefef";
			}
		}
	}
</script>

<style lang="less" scoped>
	.panoramic {
		background-color: #f5f5f5;
		.newHouseBanner {
			height: 420rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.panoramicImageList{
			margin-top: 24rpx;
			background-color: #ffffff;
			padding-top: 40rpx;
			&>view{
				&>view{
					padding: 0 20rpx;
					margin-bottom: 40rpx;
					&>view:nth-child(1){
						height: 307rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					&>view:nth-child(2){
						height: 90rpx;
						line-height: 90rpx;
						background-color: #f5f5f5;
						text{
							margin-left: 15rpx;
							color: #3f3f3f;
							font-size: 32rpx;
						}
					}
				}
			}
		}
	}
</style>
