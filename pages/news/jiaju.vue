<template>
	<view class="newHouse">
		<view class="newHouseBanner">
			<image src="https://static.fzg360.com/images/app/zf_banner.jpg"></image>
		</view>
		<view v-if="listData.length">
			<news-lists v-for="(item, index) in listData" :key="index" :item="item" type="furniture" @click="goPath"></news-lists>
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
	</view>
</template>

<script>
	import {uniIcon,uniLoadMore} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import newsLists from '../../components/newsLists.vue'
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
			newsLists,
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
			goPath(e){
				uni.navigateTo({
					url: './jiajuDetail?id=' + e.id
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
				this.$http.get(this.$api.siteApi(this.$city,'furnitureList'), {data: params}).then(res => {
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
	}
</script>

<style lang="less" scoped>
	.newHouse {
		.newHouseBanner {
			height: 420rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
