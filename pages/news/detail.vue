<template>
	<view class="newsDetail-container" v-if="detailShow">
		<view @tap="isHide">
			<view class="detail-adv" v-if="adTops" v-for="(item, index) in adTops" :key="index" @tap="openAdDetail(item)">
				<image :src="item.thumb"></image>
			</view>
			<view class="widthMargin detailTit">{{ info.title }}</view>
			<view class="widthMargin detailContact" v-if="info.fzgSource">
				<view @tap="goPath(info.fzgid)">
					<view class="detailContact-head">
						<image :src="info.fzgThumb ? info.fzgThumb : '../../static/logo.png'"></image>
					</view>
					<view class="detailContact-head-mess">
						<text>{{ info.fzgSource }}</text>
						<view>
							<text>{{ info.createdate }}</text>
							<text>{{ info.fzgDescription }}</text>
						</view>
					</view>
				</view>
				<view class="detailContact-btn" @tap="doConcern(info.fzgid)">{{isConcerned ? '取消关注' : '关 注'}}</view>
			</view>
			<view class="widthMargin detail-origin" v-else>
				<text>{{ info.createdate }}</text>
				<text>来源&nbsp;:&nbsp;{{ info.source ? info.source + ' ' : '' }}{{ info.author }}</text>
			</view>
			<view class="widthMargin detailContent">
				<!-- <rich-text :nodes="info.content"></rich-text> -->
				<u-parse class="uParse" v-if="info.content" :content="info.content" @preview="preview" @navigate="navigate" />
			</view>
			<view class="widthMargin readShare-box">
				<view class="readShare1">
					<view class="zanSum" :class="{ 'zanSum-active': newsLikes || zanSumActive }" @click="doAddLikes">
						<view class="zan-icon-box">
							<fzg-icon class="zan-icon" type="dianzan-"></fzg-icon>
						</view>
						<text>{{ info.likes }}</text>
					</view>
					<view class="readSum">
						<text>阅读</text>
						<text>{{ info.hits }}</text>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="readShare2">
					<view>分享到：</view>
					<view class="wechatIcon" @tap="weixinShare('WXSceneSession')">
						<fzg-icon class="shareIconf" type="wechat"></fzg-icon>
					</view>
					<view class="friendIcon" @tap="weixinShare('WXSenceTimeline')">
						<fzg-icon class="shareIconf" type="friends"></fzg-icon>
					</view>
					<view class="qqIcon" @tap="qqShare">
						<fzg-icon class="shareIconf" type="qq"></fzg-icon>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="detail-adv" v-if="adListTop" @tap="openAdDetail(adListTop)">
				<image :src="adListTop.thumb"></image>
			</view>
			<view class="newsDetail-zgrd-box" v-if="list.length">
				<view class="zgrd-tit"><text>掌柜热读</text></view>
				<view class="zgrd-content">
					<view v-for="item in list" :key="item.id" @tap="goView(item.id)">
						<text>{{ item.title }}</text>
					</view>
				</view>
				<view class="checkMore" @tap="openMore">查看更多</view>
			</view>
		</view>

		<view class="newsDetail-comment-box">
			<view class="comment-tit"><text>网友点评</text></view>
			<view class="commentContent-box" v-if="commentList.length">
				<view v-for="(item, index) in commentList" :key="index">
					<view class="detail-adv" v-if="item.link" @tap="openAdDetail(item)">
						<image :src="item.thumb"></image>
					</view>
					<view class="comment" v-else>
						<view class="commentFlex">
							<view class="comment-head-mess">
								<view class="comment-head-image">
									<image :src="item.thumb ? item.thumb : '/static/logo.png'"></image>
								</view>
								<view class="comment-mess">
									<view class="commenterName">{{ item.mname }}</view>
									<view class="commentTime">{{ item.createdate }}</view>
								</view>
							</view>
							<view class="comment-btn">
								<view :class="{ 'commentBtn-active': item.commentlikes || likeCommentIds.includes(item.id) }" @tap="commentlikes(item.id)">
									<fzg-icon class="comment-zan" type="dianzan-"></fzg-icon>
									<text>{{ item.likes }}</text>
								</view>
								<view @tap="reply(item.id, item.mname)">
									<fzg-icon class="comment-zan" type="weiliao"></fzg-icon>
									<text>{{ item.replys ? item.replys : 0 }}</text>
								</view>
							</view>
						</view>
						<view class="commentContent">
							<view class="commentTxt">
								<template v-if="item.comments">
									<text>回复</text>
									<text>{{ item.comments.mname }}：</text>
									<text>{{ item.content }}</text>
								</template>
								<text v-else>{{ item.content }}</text>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="status" :content-text="contentText" />
			</view>
			<view class="notComment" v-else @tap="onInput"><text>暂无评论,点击抢沙发</text></view>
		</view>
		<view class="commentInput-box" :class="[isShow1 ? 'hideNot' : 'hide']">
			<view class="commentInput">
				<view class="commentInput-input" @tap="onInput">
					<fzg-icon class="inputIcon" type="feedback"></fzg-icon>
					<input type="text" placeholder="写评论,得积分,换礼品" placeholder-style="color:#7c7c7c" />
				</view>
				<view class="commentInput-btn">
					<view class="weiliaoSum" @tap="pageScroll">
						<fzg-icon class="inputBtn" type="weiliao"></fzg-icon>
						<uni-badge class="weiliaosum" v-if="commentsCount > 0" :text="commentsCount" type="error" />
					</view>
					<view :class="{ 'shoucang-active': shoucangActive }" @tap="doCollect">
						<fzg-icon class="inputBtn shoucangBtn" type="jushoucang-copy"></fzg-icon>
					</view>
					<view @tap="sharePo">
						<fzg-icon class="inputBtn" type="fenxiang"></fzg-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="commentInput-box" :class="[isShow2 ? 'hideNot' : 'hide']">
			<view class="commentInput2">
				<view><input type="text" v-model="content" :placeholder="placeholder1" placeholder-style="color:#7c7c7c" /></view>
				<button hover-class="button-hover" type="mytype" @tap="doComment">发送</button>
			</view>
		</view>

		<share-popup :show="show" :shareParams="shareParams" isCallback="1" @hidePopup="closePoP"></share-popup>
		<view class="shareLinkBox" v-if="shareStatus">
			<view class="shareLinkTit">
				<fzg-icon class="shareLinkTitIcon" type="ok"></fzg-icon>
				<text>分享成功</text>
			</view>
			<view class="shareLinkMess">
				<view class="shareLinkMessTit">相关推荐</view>
				<view class="linkMessBox">
					<view class="LinkMess" v-for="item in list" :key="item.id" @tap="goView(item.id)">
						<fzg-icon class="dotIcon" type="yuan"></fzg-icon>
						<text>{{ item.title }}</text>
					</view>
				</view>
				<view class="moreLink" @tap="openMore">查看更多</view>
				<view class="shareCloseIcon" @tap="closeShare">
					<fzg-icon class="closeIcon" type="close1"></fzg-icon>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { uniIcon, uniBadge, uniLoadMore } from '@dcloudio/uni-ui';
	import fzgIcon from '@/components/fzg-icon/index';
	import sharePopup from '@/components/sharePopup.vue';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	import { mapState } from 'vuex';
	export default {
		components: {
			uniIcon,
			fzgIcon,
			uniBadge,
			sharePopup,
			uParse,
			uniLoadMore
		},
		data() {
			return {
				zanSumActive: false,
				commentBtnActive: false,
				show: false,
				detailShow:false,
				isShow1: true,
				isShow2: false,
				shoucangActive: false,
				id: '',
				info: {}, //内容
				shareParams:{},//分享对象
				list: [], //掌柜热读
				adTops: '', //标题上面的广告位
				adListTop: '', //掌柜热读上面的广告位
				adComTop: '', //评论上面的广告位
				adComments: '', //评论里的广告位
				status: 'more', //加载的状态
				contentText: {
					//加载的内容
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				page: 1, //页数
				commentList: [], //评论数据
				content: '', //评论内容
				commentsCount: 0, //评论总数
				likeCommentIds: [],
				pid: 0,
				placeholder1: '我来说几句',
				newsLikes: 0,
				collectNewsIds:[],
				isConcerned:false,
				concernFzgids:[],
				opt:'',
				shareStatus:false,
				commentTop:0
			};
		},
		onLoad(option) {
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			if(option.opt) this.opt = option.opt;
			if (this.hasLogin && this.userInfo.hash) {
				if(uni.getStorageSync('collect_nids')){
					this.collectNewsIds = uni.getStorageSync('collect_nids');
					if(this.collectNewsIds.includes(this.id)){
						this.shoucangActive = true;
					}
				}
				if(uni.getStorageSync('fzgids_'+this.$city)){
					this.concernFzgids = uni.getStorageSync('fzgids_'+this.$city);
				}
			}
			uni.$once('login',() => { //监听登录事件
				if (this.hasLogin && this.userInfo.hash) {
					if(uni.getStorageSync('collect_nids')){
						this.collectNewsIds = uni.getStorageSync('collect_nids');
						if(this.collectNewsIds.includes(this.id)){
							this.shoucangActive = true;
						}
					}
					if(uni.getStorageSync('fzgids_'+this.$city)){
						this.concernFzgids = uni.getStorageSync('fzgids_'+this.$city);
					}
				}
			})
			uni.$on('shareYes',(data) => { //监听分享成功事件
				this.shareNews(data.type);
			})
			if (uni.getStorageSync('likeCommentIds')) {
				this.likeCommentIds = uni.getStorageSync('likeCommentIds');
			}
			this.getData();
		},
		onReady(){
			setTimeout(() => {
				let view = uni.createSelectorQuery().select(".newsDetail-comment-box");
				view.boundingClientRect(data => {
					//console.log("得到布局位置信息" + JSON.stringify(data));
					//console.log("节点离页面顶部的距离为" + data.top);
					this.commentTop = data.top;
				}).exec();
			},1000)
		},
		onReachBottom() {
			if (this.status == 'noMore') return;
			this.status = 'more';
			this.getComData();
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			pageScroll(){
				uni.pageScrollTo({
					scrollTop: this.commentTop
				});
			},
			goPath(fzgid){
				uni.navigateTo({
					url: './zgHao?id='+fzgid
				})
			},
			goView(id){
				uni.navigateTo({
					url:'/pages/news/detail?id='+id
				});
			},
			openAdDetail(item){
				this.$util.openAdDetail(item.link);
			},
			closePoP() {
				this.show = false;
			},
			closeShare(){
				this.shareStatus = false;
			},
			sharePo() {
				// #ifndef APP-PLUS
				uni.showToast({ title: '请在手机浏览器中进行分享', icon: 'none' });
				// #endif
				// #ifdef APP-PLUS
				this.show = true;
				// #endif
			},
			isShow() {
				this.isShow1 = false;
				this.isShow2 = true;
			},
			isHide() {
				this.isShow1 = true;
				this.isShow2 = false;
			},
			doCollect() {
				if(!this.hasLogin || !this.userInfo.hash){
					this.$util.ckLogin('/pages/news/detail?id='+this.id,'doCollect');
					return;
				}
				let params = {aid: this.id, city: this.$city };
				this.$http
					.get(this.$api.userApi('collect'), { data: params })
					.then(res => {
						if (res.data.status) {
							if(this.shoucangActive){
								if(this.collectNewsIds.includes(this.id)){
									this.collectNewsIds.splice(this.collectNewsIds.findIndex(item => item === this.id), 1);
									uni.setStorageSync('collect_nids',this.collectNewsIds);
								}
							}else{
								if(this.collectNewsIds.includes(this.id)) return;
								this.collectNewsIds.push(this.id);
								uni.setStorageSync('collect_nids',this.collectNewsIds);
							}
							this.shoucangActive = !this.shoucangActive;
							uni.showToast({ title: res.data.info, icon: 'none'});
						}
					})
					.catch(error => {
						uni.showToast({title:'该用户无效',icon:'none'});
					});
			},
			doConcern(fzgid) {
				if(!this.hasLogin || !this.userInfo.hash){
					this.$util.ckLogin('/pages/news/detail?id='+this.id);
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
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			},
			openMore() {
				uni.switchTab({
					url: '/pages/news/index'
				});
			},
			onInput() {
				this.pid = 0;
				this.placeholder1 = '我来说几句';
				this.isShow();
			},
			reply(id, mname) {
				this.pid = id;
				this.placeholder1 = '回复 ' + mname;
				this.isShow();
			},
			getData() {
				let params = { id: this.id };
				this.$http
					.get(this.$api.siteApi(this.$city, 'newsView'), { data: params })
					.then(res => {
						if (res.data.code == 0) {
							this.shareParams = {
								title:res.data.data.info.title,
								desc:res.data.data.info.abstract,
								img: res.data.data.info.thumb,
								link:res.data.data.info.url
							};
							// #ifdef H5
							if (this.$wechat && this.$wechat.isWeixin()) {
								this.shareParams.link = window.location.href;
								this.$wechat.share(this.shareParams);
							}
							// #endif
							this.info = res.data.data.info;
							this.list = res.data.data.list;
							this.adTops = res.data.data.adTops;
							this.adListTop = res.data.data.adListTop;
							this.adComTop = res.data.data.adComTop;
							this.adComments = res.data.data.adComments;
							this.getComData(); //获取评论数据
							this.detailShow = true;
							if (this.userInfo.hash) {
								if(this.concernFzgids.length){
									if(this.concernFzgids.includes(this.info.fzgid)) this.isConcerned = true;
								}
								this.getUserPoint(); //阅读新闻加积分
							}
							if(this.hasLogin && this.userInfo.hash && this.opt){
								setTimeout(() => {
									this.doCollect();
								},1000)
							}
						} else {
							uni.showToast({ title: res.data.msg, icon: 'none'});
						}
					})
					.catch(error => {
						console.log(error)
					});
			},
			getComData() {
				let params = { aid: this.id, page: this.page };
				this.commentList.length && (this.status = 'loading');
				this.$http
					.get(this.$api.userApi('commentList'), { data: params })
					.then(res => {
						let list = res.data.info;
						if (this.page == 1) {
							this.commentsCount = res.data.total;
							this.commentList = list;
							if (this.commentList.length) {
								if (this.commentList.length > 3) {
									for (let i = 0; i < this.commentList.length; i++) {
										if (!this.adComments.length) break;
										if (i > 0 && i % 3 == 0) this.commentList.splice(i, 0, this.adComments.shift());
									}
								} else {
									if (this.adComments.length) this.commentList.push(this.adComments.shift());
								}
							}
						} else this.commentList = this.commentList.concat(list);
						if (this.commentList.length >= res.data.total) this.status = 'noMore';
						++this.page;
					})
					.catch(error => {
						console.log(error)
					});
			},
			getUserPoint() {
				let params = {title: this.info.title };
				this.$http
					.get(this.$api.userApi('getUserPoint'), { data: params })
					.then(res => {
						if (res.data.status && res.data.info) {
							res.data.newsLikes && (this.newsLikes = 1);
							uni.showToast({ title: res.data.info, icon: 'none' });
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			doComment() {
				if (this.info.commclose == 1) {
					uni.showToast({ title: '评论功能已关闭', icon: 'none' });
					return;
				}
				if (!this.content) {
					uni.showToast({ title: '请输入评论内容', icon: 'none' });
					return false;
				}
				let params = {aid: this.id, title: this.info.title, content: this.content };
				this.pid && (params['pid'] = this.pid);
				this.$http
					.post(this.$api.userApi('doComment'), {
						data: params})
					.then(res => {
						if (res.data.status) {
							uni.showToast({ title: res.data.info, icon: 'none' });
							this.content = '';
							this.isHide();
							this.page = 1;
							this.status = 'more';
							this.getComData();
							this.upCommentnum();
						} else {
							uni.showToast({ title: res.data.info, icon: 'none' });
						}
					})
					.catch(error => {
						uni.showToast({title:'该用户无效',icon:'none'});
					});
			},
			upCommentnum() {
				let params = { id: this.id };
				this.$http
					.get(this.$api.siteApi(this.$city, 'upCommentnum'), { data: params })
					.then(res => {})
					.catch(error => {
						uni.showToast({ title: '更新评论失败', icon: 'none' });
					});
			},
			doAddLikes() {
				let likeAppnewsIds = uni.getStorageSync('likeAppnewsIds') || [];
				if (likeAppnewsIds.includes(this.id)) {
					uni.showToast({ title: '文章已赞', icon: 'none' });
					return;
				}
				let params = { id: this.id };
				this.$http
					.get(this.$api.siteApi(this.$city, 'newsAddlikes'), { data: params })
					.then(res => {
						if (res.data.code == 0) {
							uni.showToast({ title: res.data.msg, icon: 'none' });
							this.zanSumActive = true;
							this.info.likes++;
							likeAppnewsIds.push(this.id);
							uni.setStorageSync('likeAppnewsIds', likeAppnewsIds);
							this.userInfo.hash && this.addPoint();
						} else {
							uni.showToast({ title: res.data.msg, icon: 'none' });
						}
					})
					.catch(error => {
						uni.showToast({ title: '点赞失败', icon: 'none' });
					});
			},
			addPoint() {
				let params = {title: this.info.title };
				this.$http
					.get(this.$api.userApi('addPoint'), { data: params })
					.then(res => {
						uni.showToast({ title: res.data.info, icon: 'none' });
					})
					.catch(error => {
						console.log(error)
					});
			},
			commentlikes(cid) {
				let likeCommentIds = uni.getStorageSync('likeCommentIds') || [];
				if (likeCommentIds.includes(cid)) {
					uni.showToast({ title: '点评已赞', icon: 'none' });
					return;
				}
				let params = { id: cid };
				this.$http
					.get(this.$api.userApi('commentLikes'), { data: params })
					.then(res => {
						if (res.data.status) {
							uni.showToast({ title: res.data.info, icon: 'none' });
							this.commentBtnActive = true;
							this.commentList.map(item => {
								// item为数组的元素
								if (item.id == cid) return item.likes++;
							});
							likeCommentIds.push(cid);
							this.likeCommentIds = likeCommentIds;
							uni.setStorageSync('likeCommentIds', likeCommentIds);
						} else {
							uni.showToast({ title: res.data.info, icon: 'none' });
						}
					})
					.catch(error => {
						uni.showToast({title:'该用户无效',icon:'none'});
					});
			},
			shareNews(type){
				let params = {aid: this.id,title:this.info.title,type:type == 'weixin' ? 1 : (type == 'qq' ? 3 : 2)};
				this.$http.get(this.$api.userApi('shareNews'), { data: params }).then(res => {
					if (res.data.status) {
						this.$http.get(this.$api.siteApi(this.$city,'shareNews'), { data: {id:this.id} }).then(res => {
							uni.showToast({ title: res.data.msg, icon: 'none' });
						}).catch(error => {
							uni.showToast({ title: '分享出错', icon: 'none' });
						});
					} else {
						uni.showToast({ title: res.data.info, icon: 'none' });
					}
					this.shareStatus = true;
				}).catch(error => {
					console.log(error)
				});
			},
			// #ifdef APP-PLUS
			weixinShare(scene){ //微信分享
			    uni.share({
					provider: "weixin",
					scene: scene,
					type: 0,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: this.shareParams.img,
					success: (res) => {
						//console.log("success:" + JSON.stringify(res));
						this.shareNews('weixin');
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
			},
			qqShare(){ //qq分享
			    uni.share({
					provider: "qq",
					type: 2,
					href: this.shareParams.link,
					title: this.shareParams.title,
					summary: this.shareParams.desc,
					imageUrl: this.shareParams.img,
					success: (res) => {
						//console.log("success:" + JSON.stringify(res));
						this.shareNews('qq');
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						//uni.showToast({title:'分享失败',icon:'none'});
					}
				});
			}
			// #endif
		},
		// #ifdef APP-PLUS || H5
		onNavigationBarButtonTap() {
			// #ifdef H5
			uni.showToast({ title: '请在手机浏览器中进行分享', icon: 'none' });
			// #endif
			// #ifdef APP-PLUS
			this.show = true;
			// #endif
		},
		// #endif
		// #ifdef MP
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自右上角分享按钮
				this.shareNews('weixin');
			}
			return {
				title: this.shareParams.title,
				path: '/pages/news/detail?id='+this.id,
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		}
		// #endif
	};
</script>

<style lang="less">
	.newsDetail-container {
		padding-bottom: 116upx;
	}

	.diflex {
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-content: center;
	}

	.widthMargin {
		width: 94%;
		margin: 0 auto;
	}

	.detailTit {
		font-size: 36upx;
		font-weight: bold;
		line-height: 1.4;
		margin-top: 50upx;
	}

	.detail-origin text {
		font-size: 26upx;
		color: #919191;
		margin-right: 25upx;
		line-height: 1;
	}

	.detailContact {
		margin-top: 30upx;
		.diflex();
		align-items: center;

		&>view:nth-of-type(1) {
			.diflex();
			justify-content: flex-start;
			align-items: center;
		}
	}

	.detailContact-head {
		width: 85upx;
		height: 85upx;
		border-radius: 50%;
		margin-right: 30upx;

		& image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.detailContact-head-mess {
		font-size: 28upx;
		color: #888;
		line-height: 1.5;

		&>view {
			&>text:nth-of-type(1) {
				margin-right: 10upx;
			}
		}
	}

	.detailContact-btn {
		font-size: 28upx;
		display: inline-block;
		padding: 10upx 20upx;
		background: #e83836;
		border-radius: 10upx;
		-webkit-border-radius: 10upx;
		color: #fff;
	}

	.detailContent {
		&>view {
			width: 100%;
			font-size: 32upx;
			color: #333;
			line-height: 1.8;
			margin-top: 30upx;

			&>image {
				width: 100%;
			}
		}
	}

	.readShare-box {
		.diflex();
		margin: 30upx auto;

		& .readShare1 view {
			display: inline-block;
		}

		& .readShare2 {
			&>view {
				display: inline-block;
			}

			&>view:nth-of-type(3) {
				margin: 0 10upx;
			}
		}
	}

	.shareIconf {
		font-size: 36upx !important;
		color: #fff !important;
	}

	.shareIcons {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		line-height: 66upx;
		text-align: center;
	}

	.wechatIcon {
		background: #29d150;
		.shareIcons();
	}

	.friendIcon {
		background: #4eb575;
		.shareIcons();
	}

	.qqIcon {
		background: #20b1ec;
		.shareIcons();
	}

	.zanSum {
		color: #e83836;
		font-size: 28upx;

		& .zan-icon-box {
			background: #e83836;
			width: 55upx;
			height: 55upx;
			line-height: 49upx;
			text-align: center;
			border-radius: 50%;
			-webkit-border-radius: 50%;
			margin-right: 10upx;

			.zan-icon {
				color: #fff !important;
				font-size: 28upx !important;
			}
		}
	}

	.zanSum-active {
		& .zan-icon:before {
			content: '\e6bf';
		}
	}

	.readSum {
		margin-left: 20upx;

		text {
			font-size: 30upx;
			color: #a7a7a7;
			margin: 0 5upx;
		}
	}

	.readShare2 {
		font-size: 28upx;
		line-height: 60upx;
	}

	.detail-adv {
		width: 100%;
		height: 120upx;

		&>image {
			width: 100%;
			height: 100%;
		}
	}

	.zgrd-tit {
		background: #f7f7f7;
		padding: 20upx 0;

		text {
			display: block;
			width: 94%;
			margin: 0 auto;
			font-size: 32upx;
			font-weight: bold;
		}
	}

	.zgrd-content {
		&>view {
			border-bottom: 1px solid #e1e1e1;
			padding: 30upx 0;
		}

		& text {
			display: block;
			width: 94%;
			margin: 0 auto;
			font-size: 30upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}

	.checkMore {
		font-size: 28upx;
		text-align: center;
		color: #919191;
		padding: 20upx 0;
	}

	.comment-tit {
		.zgrd-tit();
	}

	.comment {
		padding: 20upx 0;
		border-bottom: 1px solid #e1e1e1;

		& .commentFlex {
			width: 94%;
			margin: 0 auto;
			.diflex();
		}
	}

	.comment-head-mess {
		&>view {
			display: inline-block;

			&.comment-head-image {
				width: 70upx;
				height: 70upx;
				margin-right: 30upx;
				border-radius: 50%;
				-webkit-border-radius: 50%;

				&>image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					-webkit-border-radius: 50%;
				}
			}

			&.comment-mess {
				color: #a7a7a7;

				& .commenterName {
					font-size: 28upx;
				}

				& .commentTime {
					font-size: 24upx;
					margin-top: 8upx;
				}
			}
		}
	}

	.comment-btn {
		&>view:nth-of-type(1) {
			margin-right: 20upx;
		}

		&>view {
			display: inline-block;
			font-size: 30upx;
			color: #979797;
		}
	}

	.comment-zan {
		font-size: 32upx !important;
		margin-right: 10upx;
		color: #979797 !important;
	}

	.commentBtn-active {
		color: #e83836 !important;

		& .comment-zan {
			color: #e83836 !important;
		}

		& .comment-zan:before {
			content: '\e6bf';
		}
	}

	.commentContent {
		width: 94%;
		margin: 0 auto;

		& text {
			font-size: 28upx;
			line-height: 1.5;
		}

		& .commentTxt {
			padding-left: 100upx;

			&>text:nth-of-type(2) {
				margin: 0 10upx 0 30upx;
			}
		}
	}

	.notComment {
		background: #fff;
		font-size: 28upx;
		color: #0046d4;
		text-align: center;
		height: 100upx;
		line-height: 100upx;
	}

	.commentInput-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 20upx 0;
		background: #f9f9f9;

		& .commentInput {
			.diflex();
			width: 94%;
			margin: 0 auto;

			& .commentInput-input {
				.diflex();
				width: 100%;
				box-sizing: border-box;
				padding: 0 10upx;
				background: #fff;
				margin-right: 10upx;
				border-radius: 10upx;
				-webkit-border-radius: 5upx;

				& .inputIcon {
					font-size: 28upx !important;
					color: #7c7c7c !important;
					margin: 25upx 10upx 0 0;
				}

				& input {
					width: 100%;
					font-size: 28upx;
					background: #fff;
					padding: 12upx 0;
				}
			}
		}
	}

	.commentInput-btn {
		display: flex;
		-webkit-display: flex;
		flex-direction: row;

		&>view {
			width: 50upx;
			height: 50upx;
			text-align: center;
			line-height: 80upx;

			& .inputBtn {
				font-size: 40upx !important;
			}
		}

		&>view:nth-of-type(2) {
			margin: 0 60upx;
		}
	}

	.weiliaoSum {
		position: relative;

		& .weiliaosum {
			position: absolute;
			top: -5upx;
			right: -10upx;
		}
	}

	.commentInput2 {
		.diflex();
		width: 94%;
		margin: 0 auto;

		& view {
			width: 100%;
			padding: 0 10upx;
			box-sizing: border-box;
			margin-right: 20upx;
			border: 1px solid #ccc;
			border-radius: 10upx;
			-webkit-border-radius: 10upx;
			background: #fff;

			& input {
				width: 100%;
				font-size: 28upx;
				background: #fff;
				padding: 10upx 0;
			}
		}

		& button {
			display: inline-block;
			font-size: 28upx;
			width: 150upx;
			background: linear-gradient(#c7d4f9, #6d80b4);
			background: -webkit-linear-gradient(#c7d4f9, #6d80b4);
			color: #fff;
		}

		& button::after {
			outline: none !important;
			border: none !important;
		}

		& .button-hover[type='mytype'] {
			background: linear-gradient(#b0c4fa, #5e76b5);
			background: -webkit-linear-gradient(#b0c4fa, #5e76b5);
		}
	}

	.hideNot {
		display: block;
	}

	.hide {
		display: none;
	}

	.shoucang-active {
		& .shoucangBtn {
			color: #e83836 !important;
		}

		& .shoucangBtn:before {
			content: '\e6c6';
		}
	}

	.uParse {
		font-size: 16px;
		color: #333;
		line-height: 1.8;
		margin-top: 15px;
	}

	.shareLinkBox {
		width: 600rpx;
		position: fixed;
		z-index:999;
		top: 300rpx;
		left: 50%;
		margin-left: -300rpx;
		background: #fff;
		border-radius: 30rpx;
		border: 1px solid #f8f8f8;
		padding-bottom: 30rpx;
		& .shareLinkTit {
			padding: 15rpx 0;
			background: #f7f7f7;
			text-align: center;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			& text {
				font-size: 32rpx;
				color: #de2020;
			}
		}
		& .shareLinkMess {
			width: 94%;
			margin: 0 auto;
			& .shareLinkMessTit {
				font-size: 32rpx;
				color: #9e9e9e;
				border-bottom: 1px solid #e4e4e4;
				padding: 10rpx 0;
			}
			& .linkMessBox {
				padding: 10rpx 0 20rpx;
			}
		}
		& .LinkMess {
			font-size: 28rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			padding: 10rpx 0;
		}
		& .moreLink {
			background: #e83836;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			padding: 10rpx 0;
			border-radius: 10rpx;
		}
	}

	.shareLinkTitIcon {
		font-size: 28rpx !important;
		color: #de2020 !important;
		margin-right: 10rpx;
	}

	.dotIcon {
		color: #000 !important;
		font-size: 32rpx !important;
	}

	.shareCloseIcon {
		position: absolute;
		top: -20rpx;
		right: -20rpx;
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		& .closeIcon {
			font-size: 60rpx !important;
			line-height: 80rpx;
		}
	}
</style>
