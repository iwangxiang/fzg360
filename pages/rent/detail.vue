<template>
	<view class="oldHouseDetails">
		<view class="swiper">
			<swiper class="iSwiperContent" indicator-dots="true" autoplay="true" interval="2000" duration="500" v-if="topImgs.length">
				<swiper-item v-for="(item,index) in topImgs" :key="index">
					<image :src="item.img" @tap="goPhoto(item)"></image>
				</swiper-item>
			</swiper>
			<view class="iSwiperContent" v-else>
				<image src="https://static.fzg360.com/images/app/esf_nopic.jpg"></image>
			</view>
		</view>
		<view class="detailsInfo">
			<view>
				<view>
					{{houseData.LEASE_SUBJECT}}
				</view>
				<view @tap="doCollect">
					<fzg-icon class="pop" color="#919191" :type="loveFlag ? 'yishoucang-' : 'jushoucang-copy'" size="20"></fzg-icon>
					<view>{{loveFlagText}}</view>
				</view>
			</view>
			<view v-if="houseData.TAGS">
				<view v-for="(TAG,index) in houseData.TAGS" :key="index">
					<text>{{TAG}}</text>
				</view>
			</view>
			<view>
				{{houseData.address}}
			</view>
		</view>
		<view class="introduction">
			<view>
				<text>租金</text>
				<text v-if="houseData.LEASE_TOTAL_PRICE > 0">{{houseData.LEASE_TOTAL_PRICE}}{{houseData.PRICE_UNIT}}</text>
				<text v-else>待定</text>
			</view>
			<view>
				<text>户型</text>
				<text>{{houseData.hx3}}</text>
			</view>
			<view>
				<text>面积</text>
				<text>{{houseData.LEASE_AREA > 0 ? houseData.LEASE_AREA + '㎡' : '待定'}}</text>
			</view>
		</view>
		<view class="list">
			<view>
				<view>
					<view>
						<text>装修：</text>
						<text>{{houseData.LEASE_FITMENT ? houseData.LEASE_FITMENT : '待定'}}</text>
					</view>
					<view>
						<text>楼层：</text>
						<text>{{houseData.LEASE_FLOOR}}层/{{houseData.LEASE_FLOORS}}层</text>
					</view>
				</view>
				<view>
					<view>
						<text>年份：</text>
						<text>{{houseData.LEASE_YEAR ? houseData.LEASE_YEAR + '年' : '待定'}}</text>
					</view>
					<view>
						<text>朝向：</text>
						<text>{{houseData.LEASE_DIRECT != 0 ? houseData.LEASE_DIRECT : '待定'}}</text>
					</view>
				</view>
				<view>
					<view>
						<text>付款：</text>
						<text>{{houseData.LEASE_ACCOUNT && houseData.LEASE_ACCOUNT != 0 ? houseData.LEASE_ACCOUNT : '待定'}}</text>
					</view>
					<view>
						<text>押金：</text>
						<text>{{houseData.LEASE_DEPOSIT && houseData.LEASE_DEPOSIT != 0 ? houseData.LEASE_DEPOSIT : '待定'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="description">
			<view><text>房源描述</text></view>
			<view :class="{hidden:hidden}">
				<u-parse v-if="houseData.RICH_TEXT" :content="houseData.RICH_TEXT" @preview="preview" @navigate="navigate" />
				<text v-else>暂无</text>
			</view>
			<view class="iActive" @tap="baseAct()">
				{{baseName}}
				<uni-icon class="iUniIcon" :type="baseIcon" size="20" color="#919191"></uni-icon>
			</view>
		</view>
		<view class="houseName">
			<view>
				<text>{{houseData.BUILD_NAME}}</text>
				<view @tap="goPath(houseData.BUILD_NAME)">
					查看小区房源
					<uni-icon class="iUniIcon" type="forward" size="20" color="#919191"></uni-icon>
				</view>
			</view>
			<view>
				<view>
					<view>
						<text>物业类型：</text>
						<text>{{houseData.LEASE_USEAGE ? houseData.LEASE_USEAGE : '待定'}}</text>
					</view>
					<view>
						<text>建筑类型：</text>
						<text>{{houseData.LEASE_TYPE && houseData.LEASE_TYPE != 0 ? houseData.LEASE_TYPE : '待定'}}</text>
					</view>
				</view>
				<view>
					<view>
						<text>权属类型：</text>
						<text>{{houseData.OWNER_TYPE ? houseData.OWNER_TYPE : '待定'}}</text>
					</view>
					<view>
						<text>物业费：</text>
						<text>{{houseData.LEASE_PROPERTY != 0 ? houseData.LEASE_PROPERTY + '元/平' : '待定'}}</text>
					</view>
				</view>
				<view>
					<view>
						<text>竣工时间：</text>
						<text>{{houseData.LEASE_LEAVE_TIME ? houseData.LEASE_LEAVE_TIME : '待定'}}</text>
					</view>
				</view>
			</view>
			<!-- <view :class="{hidden:feeHidden}">
				<text>小区概况：</text>
				<text>东泰花园位于鸿福路中心地段，地理位置东泰花园位于鸿福路中心地段，地理位置东泰花园位于鸿福路中心地段，地理位置优越，周边社区发展成熟，居住氛围浓厚。03、04年连续两届荣获南城区商品房销售冠军。随着东泰花园最后一期-第六期的正式交付使用，东泰花园以南城区成熟生活小区的尊崇面貌，完美为大家呈现。东泰花园丰富多彩的社区文化活动，使得东泰花园成为了东莞南城区高尚社区，凝聚着中西文化神韵的亚热带风情，阳光地下车库，以及通过ISO9000质量管理认证的物业管理体系和六重安全保卫系统。</text>
			</view>
			<view class="iActive" @tap="feeAct">
				{{feeName}}
				<uni-icon class="iUniIcon" :type="feeIcon" size="20" color="#919191"></uni-icon>
			</view> -->
		</view>
		<!-- <view class="related">
			<view><text>相关楼盘</text></view>
			<sale-lists v-for="item in relates" :key="item.ID" :item="item"></sale-lists>
		</view> -->
		<view class="footer">
			<view>
				<view>
					<image :src="user.USER_PHOTO_MIN"></image>
				</view>
				<view>
					<view>{{user.USER_NAME}}</view>
					<view>{{user.USER_MOBILE}}</view>
				</view>
			</view>
			<view @tap="$util.doCall(user.USER_NAME,user.USER_MOBILE)">
				<fzg-icon class="fuwurexian" @tap="pop" type="fuwurexian" size="20" color="#ffffff"></fzg-icon>
				<text>联系经纪人</text>
			</view>
		</view>
		<share-popup :show="show" @hidePopup="closePoP"></share-popup>
		<view class="goLoveView" v-if="loveViewFlag">
			<view>
				<view>温馨提醒</view>
				<view>收藏成功</view>
			</view>
			<view>
				<text @tap="goCollection">查看我的收藏</text>
				<text @tap="goCloseMask">继续看房</text>
			</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import sharePopup from "../../components/sharePopup.vue";
	import uniIcon from '../../components/uni-icon/uni-icon.vue'
	import rentLists from '@/components/rentLists.vue';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		onLoad(e) {
			if (!e || !e.id) {
				uni.navigateBack();
				return;
			}
			this.id = e.id;
			if(e.opt) this.opt = e.opt;
			if (this.hasLogin && this.userInfo.mtel) {
				this.phone = this.userInfo.mtel;
				if (uni.getStorageSync('collect_zfids')) {
					this.collectHouseIds = uni.getStorageSync('collect_zfids');
					if (this.collectHouseIds.includes(this.id)) {
						this.loveFlag = true;
						this.loveFlagText = '已收藏';
					}
				}
			}
			uni.$once('login', () => { //监听登录事件
				if (this.hasLogin && this.userInfo.hash) {
					if (uni.getStorageSync('collect_zfids')) {
						this.collectHouseIds = uni.getStorageSync('collect_zfids');
						if (this.collectHouseIds.includes(this.id)) {
							this.loveFlag = true;
							this.loveFlagText = '已收藏';
						}
					}
				}
			})
			this.getData();

		},
		data() {
			return {
				show: false,
				hidden: true,
				baseName: '展开',
				baseIcon: "arrowdown",
				feeHidden: true,
				feeName: '展开',
				feeIcon: 'arrowdown',
				houseData: [],
				topImgs:[],
				loveFlag: false,
				loveFlagText: "收藏",
				loveViewFlag: false,
				id: '',
				user: '',
				relates: [],
				collectHouseIds: [],
				opt:''
			}
		},
		components: {
			fzgIcon,
			sharePopup,
			uniIcon,
			rentLists,
			uParse
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			},
			goPhoto(item){
				let data = {
					key:item.key,
					imgs:this.houseData.topimgs
				};
				uni.navigateTo({
					url:`/pages/sale/pics?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
			closePoP() {
				this.show = false;
			},
			baseAct() {
				this.hidden = !this.hidden;
				this.baseName = this.hidden ? '展开' : '收起';
				this.baseIcon = this.hidden ? 'arrowdown' : 'arrowup';
			},
			feeAct() {
				this.feeHidden = !this.feeHidden;
				this.feeName = this.feeHidden ? '展开' : '收起';
				this.feeIcon = this.feeHidden ? 'arrowdown' : 'arrowup';
			},
			goPath(name) {
				uni.navigateTo({
					url: "/pages/rent/xiaoqu?keyword=" + name
				})
			},
			goCollection(){
				uni.navigateTo({
					url:'../user/vlogs'
				});
				this.goCloseMask();
			},
			goCloseMask() {
				setTimeout(() => {
					this.popupViewFlag = false;
					this.popupMaskFlag = false;
					this.loveViewFlag = false;
				}, 150);
			},
			doCollect() {
				if(!this.hasLogin || !this.userInfo.hash){
					this.$util.ckLogin('/pages/rent/detail?id='+this.id,'doCollect');
					return;
				}
				let params = {
					aid: this.id,
					type: 22,
					city: this.$city
				};
				this.$http.get(this.$api.userApi('collect'), {
					data: params
				}).then(res => {
					if (res.data.status) {
						if (this.loveFlag) {
							if (this.collectHouseIds.includes(this.id)) {
								this.collectHouseIds.splice(this.collectHouseIds.findIndex(item => item === this.id), 1);
								uni.setStorageSync('collect_zfids', this.collectHouseIds);
							}
							uni.showToast({
								title: res.data.info,
								icon: 'none'
							});
						} else {
							if (this.collectHouseIds.includes(this.id)) return;
							this.collectHouseIds.push(this.id);
							uni.setStorageSync('collect_zfids', this.collectHouseIds);
						}
						this.loveFlag = !this.loveFlag;
						this.popupMaskFlag = this.loveViewFlag = this.loveFlag ? true : false;
						this.loveFlagText = this.loveFlag ? '已收藏' : '收藏';
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			getData() {
				let params = {
					city: this.$city
				};
				if (this.id) params['id'] = this.id;
				this.$http.get(this.$api.fuberApi('leaseDetail'), {
					data: params
				}).then(res => {
					this.shareParams = {
						title:res.data.info.LEASE_SUBJECT,
						desc:res.data.info.abstract,
						img: res.data.info.THUMB_URL,
						link:res.data.info.url
					};
					// #ifdef H5
					if (this.$wechat && this.$wechat.isWeixin()) {
						this.shareParams.link = window.location.href;
						this.$wechat.share(this.shareParams);
					}
					// #endif
					let broswerRecords = uni.getStorageSync('brecords_'+this.$city) || {}; //浏览记录
					if(Object.keys(broswerRecords).length >= 30){
						for(let i in broswerRecords){
							delete broswerRecords[i];
							break;
						} 
					}
					broswerRecords[this.$city+res.data.info.ID+'_rent'] = { //以城市+楼盘id+_类型
						id:res.data.info.ID,
						lease_id:res.data.info.LEASE_ID,
						lease_subject:res.data.info.LEASE_SUBJECT,
						thumb:res.data.info.THUMB_URL ? res.data.info.THUMB_URL : 'https://static.fzg360.com/images/app/esf_nopic.jpg',
						lease_room:res.data.info.LEASE_ROOM != 0 ? res.data.info.LEASE_ROOM+'室' : '居室暂无',
						lease_area:res.data.info.LEASE_AREA != 0 ? res.data.info.LEASE_AREA+'㎡' : '面积待定',
						lease_direct:res.data.info.LEASE_DIRECT != 0 ? res.data.info.LEASE_DIRECT : '朝向暂无',
						lease_total_price:res.data.info.LEASE_TOTAL_PRICE > 0 ? res.data.info.LEASE_TOTAL_PRICE + res.data.info.PRICE_UNIT : '租金待定',
						build_name:res.data.info.BUILD_NAME,
						region_name:res.data.info.REGION_NAME,
						section_name:res.data.info.SECTION_NAME,
						tags:res.data.info.TAGS ? res.data.info.TAGS : '',
						type:'rent'
					};
					uni.setStorageSync('brecords_'+this.$city,broswerRecords);
					//console.log(uni.getStorageSync('brecords_'+this.$city))
					this.houseData = res.data.info;
					this.topImgs = this.houseData.topimgs;
					this.user = res.data.info.user;
					this.relates = res.data.info.relates;
					if(this.hasLogin && this.userInfo.hash && this.opt){
						setTimeout(() => {
							this.doCollect();
						},1000)
					}
				}).catch(error => {
					uni.showToast({
						title: '加载数据失败'
					});
				})
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
				path: '/pages/rent/detail?id='+this.id,
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		},
		// #endif
	}
</script>

<style lang="less" scoped>
	.oldHouseDetails {
		background-color: #f7f7f7;
		padding-bottom: 100rpx;

		.swiper {
			height: 382rpx;

			.iSwiperContent {
				height: 382rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.detailsInfo {
			background-color: #ffffff;
			padding: 40rpx 20rpx 20rpx;
			margin-bottom: 16rpx;

			&>view:nth-child(1) {
				display: flex;
				justify-content: space-between;

				&>view:nth-child(1) {
					border-right: 1px solid #e5e5e5;
					font-size: 38rpx;
					color: #383838;
					flex: 1;
				}

				&>view:nth-child(2) {
					width: 90rpx;
					font-size: 20rpx;
					color: #919191;
					text-align: center;
					margin: 10rpx 30rpx 0 0;
					padding-left: 50rpx;
				}
			}

			&>view:nth-child(2) {
				display: flex;
				font-size: 24rpx;
				margin-top: 20rpx;

				&>view {
					padding: 5rpx;
					margin-right: 10rpx;
				}

				&>view:nth-child(1) {
					background-color: #FFD7D7;
					color: #EA4341;
				}

				&>view:nth-child(2) {
					background-color: #D7ECFF;
					color: #3686E8;
				}

				&>view:nth-child(3) {
					background-color: #FDFFD7;
					color: #E89B36;
				}
			}

			&>view:nth-child(3) {
				font-size: 30rpx;
				color: #919191;
				margin-top: 30rpx;
				padding-top: 20rpx;
				border-top: 1px solid #e5e5e5;
			}
		}

		.introduction {
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			padding: 45rpx 0;
			box-sizing: border-box;

			&>view {
				width: 33.33333333%;
				border-right: 1px solid #e5e5e5;

				&>text:nth-child(1) {
					font-size: 30rpx;
					color: #919191;
					display: block;
					text-align: center;
				}

				&>text:nth-child(2) {
					font-size: 30rpx;
					color: #e8373d;
					display: block;
					text-align: center;
					font-weight: bold;
					margin-top: 10rpx;
				}
			}

			&>view:nth-child(3) {
				border: none;
			}
		}

		.list {
			background-color: #ffffff;
			padding-bottom: 50rpx;

			&>view {
				border-top: 1px solid #e5e5e5;

				&>view {
					display: flex;
					justify-content: space-between;
					padding: 0 20rpx;
					margin-top: 40rpx;

					&>view {
						width: 48%;
						font-size: 30rpx;

						&>text:nth-child(1) {
							color: #919191;
						}

						&>text:nth-child(2) {
							color: #333333;
						}
					}
				}
			}
		}

		.description {
			background-color: #ffffff;
			padding-bottom: 20rpx;

			&>view:nth-child(1) {
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #F7F7F7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;

				&>text {
					margin-left: 40rpx;
				}
			}

			&>view:nth-child(2) {
				padding: 30rpx 20rpx 20rpx;
				font-size: 30rpx;
				color: #919191;
				line-height: 50rpx;
			}

			.hidden {
				height: 130rpx;
				overflow: hidden;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}

			.iActive {
				text-align: center;
				color: #919191;
				font-size: 26rpx;
				margin-top: 20rpx;
			}
		}

		.houseName {
			background-color: #ffffff;
			padding-bottom: 20rpx;

			&>view:nth-child(1) {
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;
				display: flex;
				justify-content: space-between;

				&>text {
					margin-left: 40rpx;
				}

				&>view {
					margin-right: 10rpx;
				}
			}

			&>view:nth-child(2) {
				padding: 40rpx 20rpx 0;

				&>view {
					display: flex;
					justify-content: space-between;
					margin-bottom: 40rpx;

					&>view {
						width: 48%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 30rpx;

						&>text:nth-child(1) {
							color: #919191;
						}

						&>text:nth-child(2) {
							color: #333333;
						}
					}
				}
			}

			&>view:nth-child(3) {
				font-size: 30rpx;
				padding: 0 20rpx;
				line-height: 50rpx;

				&>text:nth-child(1) {
					color: #919191;
				}

				&>text:nth-child(2) {
					color: #333333;
				}
			}

			.hidden {
				height: 150rpx;
				overflow: hidden;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}

			.iActive {
				text-align: center;
				color: #919191;
				font-size: 26rpx;
				margin-top: 20rpx;
			}
		}

		.related {
			background-color: #ffffff;

			&>view:nth-child(1) {
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #F7F7F7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;

				&>text {
					margin-left: 40rpx;
				}
			}
		}

		.footer {
			width: 100%;
			height: 100rpx;
			border-top: 1px solid #e5e5e5;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: space-between;
			background-color: #ffffff;

			&>view {
				width: 50%;
			}

			&>view:nth-child(1) {
				display: flex;
				align-items: center;

				&>view:nth-child(1) {
					width: 70rpx;
					height: 78rpx;
					margin-left: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				&>view:nth-child(2) {
					font-size: 26rpx;
					color: #333333;
					margin-left: 30rpx;
				}
			}

			&>view:nth-child(2) {
				background-color: #e83836;
				text-align: center;
				line-height: 100rpx;

				.fuwurexian {
					margin-right: 15rpx;
				}

				&>text:nth-child(2) {
					color: #ffffff;
				}
			}
		}

		.goLoveView {
			width: 540rpx;
			height: 218rpx;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -270rpx;
			margin-top: -109rpx;
			z-index: 20;
			background-color: #ffffff;
			border-radius: 20rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			align-content: space-around;

			&>view:nth-child(1) {
				padding: 30rpx 0;

				&>view:nth-child(1) {
					font-size: 34rpx;
					color: #3f3f3f;
				}

				&>view:nth-child(2) {
					font-size: 28rpx;
					color: #3f3f3f;
					margin-top: 5rpx;
				}
			}

			&>view:nth-child(2) {
				width: 100%;
				display: flex;
				justify-content: space-between;
				height: 60rpx;
				line-height: 60rpx;
				border-top: 1px solid #e5e5e5;

				&>text {
					flex: 1;
					display: block;
				}

				&>text:nth-child(1) {
					border-right: 1px solid #e5e5e5;
				}

				&>text:nth-child(1),
				&>text:nth-child(2) {
					font-size: 28rpx;
					color: #3379F4;
				}
			}
		}
	}
</style>
