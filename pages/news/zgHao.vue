<template>
	<view class="newsContentBox">
		<view class="zgHao-head-box">
			<view class="zgHao-head">
				<view class="zgHao-head-img"><image :src="info.thumb ? info.thumb : '../../static/agenthead.png'"></image></view>
				<view class="zgHao-headContent">
					<view class="zgHaoInfo">
						<view>
							<text>{{info.createNum}}</text>
							<text>原创</text>
						</view>
						<view>
							<text>{{info.concernNum}}</text>
							<text>粉丝</text>
						</view>
						<view>
							<text>{{info.likesNum}}</text>
							<text>获赞</text>
						</view>
					</view>
					<view class="zgHaoContact">
						<view @tap="toChat(info)">私信</view>
						<view @tap="doConcern(info.id)">{{isConcerned ? '取消关注' : '关 注'}}</view>
					</view>
				</view>
			</view>
			<view class="zgHao-head-explain-box">
				<view class="zgHao-head-explain">
					<view>
						<image src="../../static/zgHao1.png"></image>
						<text>认证：</text>
					</view>
					<view>{{info.author}}</view>
				</view>
				<view class="zgHao-head-explain">
					<view>
						<image src="../../static/zgHao2.png"></image>
						<text>简介：</text>
					</view>
					<view>{{info.description}}</view>
				</view>
			</view>
		</view>
		<view v-if="listData.length">
		<navigator v-for="item in listData" :key="item.id" :url="'./detail?id='+item.id">
			<view class="zgHaoContent">
				<view class="newsContent newsContent1">
					<view class="newsContent1-box">
						<view class="newsContent-tit"><text>{{item.title}}</text></view>
						<view class="newsContent-txt">
							<view class="newsContent-txt1">
								<view v-if="item.fzgSource"><text>{{item.fzgSource}}</text></view>
							</view>
							<view class="newsContent-txt2"><text>{{item.createdate}}</text></view>
						</view>
					</view>
					<view class="newsContent1-img"><image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image></view>
				</view>
				<view class="zgHaoBtn-box">
					<view>
						<fzg-icon class="zgHaoBtn" type="return"></fzg-icon>
						<text>{{item.share}}</text>
					</view>
					<view>
						<fzg-icon class="zgHaoBtn" type="talknews"></fzg-icon>
						<text>{{item.commentnum}}</text>
					</view>
					<view>
						<fzg-icon class="zgHaoBtn" type="dianzan-"></fzg-icon>
						<text>{{item.likes}}</text>
					</view>
				</view>
			</view>
		</navigator>
		<uni-load-more :status="status" :content-text="contentText" />
		</view>
		<no-content v-else></no-content>
		<share-popup :show="show" @hidePopup="closePoP"></share-popup>
	</view>
</template>
<script>
import { uniIcon,uniLoadMore } from '@dcloudio/uni-ui';
import fzgIcon from '@/components/fzg-icon/index';
import sharePopup from "@/components/sharePopup.vue";
import noContent from '../../components/noContent.vue'
import {mapState} from 'vuex'
export default {
	components: {
		uniIcon,
		fzgIcon,
		sharePopup,
		uniLoadMore,
		noContent
	},
	data() {
		return {
			show:false,
			id:'',
			info:{},
			concernFzgids:[],
			isConcerned:false,
			listData: [], //列表数据
			reload: false, //重新加载标志
			status: 'more', //加载的状态
			contentText: { //加载的内容
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			},
			page:1 ,//页数
		};
	},
	onLoad(option) {
		if(!option || !option.id){
			uni.navigateBack();
			return;
		}
		uni.$once('login',() => { //监听登录事件
			this.id = option.id;
			if (this.hasLogin && this.userInfo.hash) {
				if(uni.getStorageSync('fzgids_'+this.$city)){
					this.concernFzgids = uni.getStorageSync('fzgids_'+this.$city);
				}
			}
		})
		if(!this.hasLogin || !this.userInfo.hash){
			this.$util.ckLogin('/pages/news/zgHao?id='+option.id);
			return;
		}
		this.id = option.id;
		if (this.hasLogin && this.userInfo.hash) {
			if(uni.getStorageSync('fzgids_'+this.$city)){
				this.concernFzgids = uni.getStorageSync('fzgids_'+this.$city);
			}
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
	computed: {
		...mapState(['hasLogin','userInfo'])
	},
	methods: {
		closePoP(){
			this.show = false;
		},
		toChat(row) { 
			uni.navigateTo({
				url: "../msg/chat?id="+row.mid+"&name="+row.author+"&topic="+row.thumb
			})
		},
		doConcern(fzgid) {
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/news/zgHao?id='+this.id);
				return;
			}
			let params = {fzgid: fzgid, city: this.$city };
			this.$http
				.get(this.$api.userApi('concern'), { data: params })
				.then(res => {
					if (res.data.status) {
						if(this.isConcerned){
							if(this.concernFzgids.includes(fzgid)){
								this.concernFzgids.splice(this.concernFzgids.findIndex(item => item === fzgid), 1);
								uni.setStorageSync('fzgids_'+this.$city,this.concernFzgids);
							}
						}else{
							if(this.concernFzgids.includes(fzgid)) return;
							this.concernFzgids.push(fzgid);
							uni.setStorageSync('fzgids_'+this.$city,this.concernFzgids);
						}
						this.isConcerned = !this.isConcerned;
						uni.showToast({ title: res.data.info, icon: 'none'});
					}else{
						uni.showToast({ title: res.data.info, icon: 'none'});
					}
				})
				.catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
		},
		getData(){
			let params = {id:this.id,page:this.page};
			this.listData.length && (this.status = 'loading');
			this.$http.get(this.$api.siteApi(this.$city,'fzgidList'), {data: params}).then(res => {
				if(res.data.code == 0){
					if(this.page == 1){
						uni.showToast({
							title: '请求成功',
							icon: 'success',
							// #ifndef MP-ALIPAY
							duration:500,
							mask: true
							// #endif
						});
						this.info = res.data.data.fzgid;
						uni.setNavigationBarTitle({
							title: this.info.source
						})
						if(this.userInfo.hash){
							if(this.concernFzgids.length){
								if(this.concernFzgids.includes(this.id)) this.isConcerned = true;
							}
						}
					}
					this.reload && uni.stopPullDownRefresh();
					let list = res.data.data.lists;
					this.listData = this.reload ? list : this.listData.concat(list);
					if(this.listData.length >= res.data.data.total) this.status = 'noMore';
					++this.page;
					this.reload = false;
				}else{
					uni.showToast({title: '加载数据失败',icon:'none'});
				}
			}).catch(error => {
				uni.showToast({title: '加载数据失败',icon:'none'});
			})
		}
	},
	onNavigationBarButtonTap(){
		this.show=true;
	}
};
</script>

<style lang="less">
page {
	height: 100%;
	font-size: 28upx;
}
.diflex {
	display: flex;
	diplay: -webkit-flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-content: center;
}
.zgHao-head-box{
	padding:40upx 0;
	border-bottom:20upx solid #f9f9f9;
}
.zgHao-head {
	padding: 0 70upx 0 40upx;
	box-sizing: border-box;
	.diflex();
	align-items: center;
	justify-content: center;
}
.zgHao-head-img {
	width: 120upx;
	height: 120upx;
	border-radius: 50%;
	& > image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
.zgHao-headContent {
	margin-left: 74upx;
}
.zgHaoInfo {
	.diflex();
	width: 100%;
	padding: 0 10upx;
	box-sizing: border-box;
	font-size: 28upx;
	& > view {
		& text {
			display: block;
			text-align: center;
		}
		& text:nth-of-type(2) {
			margin: 30upx 0;
		}
	}
}
.zgHaoContact {
	.diflex();
	& view {
		font-size: 28upx;
		color: #fff;
		width: 190upx;
		height: 48upx;
		text-align: center;
		line-height: 48upx;
		border-radius: 10upx;
	}
	& view:nth-of-type(1) {
		background: #f95856;
		margin-right: 60upx;
	}
	& view:nth-of-type(2) {
		background: #9e9e9e;
	}
}
.zgHao-head-explain-box {
	padding: 0 40upx;
	box-sizing: border-box;
	margin-top: 30upx;
	& .zgHao-head-explain {
		.diflex();
		justify-content: flex-start;
		& > view {
			font-size: 28upx;
			line-height: 1.8;
		}
		& > view:nth-of-type(1) {
			white-space: nowrap;
			& image {
				display: inline-block;
				width: 30upx;
				height: 30upx;
				vertical-align: -6upx;
				margin-right: 20upx;
			}
		}
		& > view:nth-of-type(2) {
			margin-left: 20upx;
			color: #9e9e9e;
		}
	}
}
.zgHaoContent {
	width: 94%;
	margin: 0 auto;
	padding: 30upx 0;
	border-bottom: 1px solid #e5e5e5;
}

.newsContent1 {
	.diflex();
	& .newsContent1-img {
		width: 240upx;
		height: 138upx;
		margin-left: 30upx;
		& > image {
			width: 100%;
			height: 100%;
		}
	}
}
.newsContent {
	& .newsContent-tit {
		font-size: 34upx;
		line-height: 1.5;
		color: #3f3f3f;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	& .newsContent-txt {
		font-size: 24upx;
		color: #999;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-content: center;
		& .newsContent-txt1 > view {
			display: inline-block;
			.browse-icon,
			.coin-icon {
				color: #999 !important;
				font-size: 26upx !important;
				vertical-align: 2upx;
				margin-right: 10upx;
			}
			& text {
				margin-right: 20upx;
			}
		}
	}
}
.zgHaoBtn-box {
	width: 94%;
	margin: 0 auto;
	margin-top: 30upx;
	.diflex();
	& text {
		font-size: 28upx;
		color: #9e9e9e;
	}
	& .zgHaoBtn {
		color: #9e9e9e !important;
		font-size: 32upx !important;
		margin-right: 15upx;
	}
}
</style>
