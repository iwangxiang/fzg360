<template>
	<view class="container">
		<!-- #ifdef MP -->
		<view class="header">
			<view class="viewText" @tap="$tool.nav('index/city')">
				<text>{{city}}</text>
				<fzg-icon class="fzgIcon" size="20" type="unfold" color="white"></fzg-icon>
			</view>
			<view @tap="$tool.nav('index/search?type=1')"><input type="text" vlaue=" " class="headerInput" placeholder="请输入楼盘关键字"
				 disabled="false" /></view>
		</view>
		<!-- #endif -->
		<view class="banner">
			<image mode="widthFix" src="https://static.fzg360.com/images/app/zf_banner.jpg" class="banner"></image>
		</view>
		<view class="iContent">
			<view class="iSelect">
				<view class="iSelectWrap" v-for="(item,index) in iSelect" :key=index @tap="goPath(item)">
					<view :style="'background-color:'+item.color">
						<fzg-icon class="fzgIconSelect" :type="item.type" size="25" color="white"></fzg-icon>
					</view>
					<text>{{item.text}}</text>
				</view>
			</view>
			<view class="headline">
				<view>
					<image src="../../static/headline.png"></image>
				</view>
				<view>
					<swiper vertical="true" autoplay="true" circular="true" interval="5000">
						<swiper-item v-for="(item, index) in hotnews" :key="index">
							<navigator v-for="(list,index) in item" :key="index" :url="'/pages/news/detail?id='+list.id">
								{{list.title}}
							</navigator>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="mContent" v-if="deal.date && deal.exf1">
			<view @tap="modalTips">
				<text>掌柜播报</text>
				<fzg-icon type="question" color="#9e9e9e"></fzg-icon>
			</view>
			<view data-type="news" :data-id="deal.sid" @tap="goDetail">
				<view>
					<view>
						<text>{{deal.date}}成交</text>
						<!-- <fzg-icon type="question" color="#9e9e9e"></fzg-icon> -->
					</view>
					<view>
						<text>{{deal.exf1}}</text>
						<text>套</text>
					</view>
					<view v-if="deal.numsRate">
						<text>环比</text>
						<text :class="deal.numsRateMark >= 0 ? 'iFlag' : ''">{{deal.numsRate + '%' + (deal.numsRateMark >= 0 ? '↑' : '↓')}}</text>
					</view>
				</view>
				<view v-if="deal.exf2 !== ''">
					<view>
						<text>{{deal.date}}成交均价</text>
						<!-- <fzg-icon type="question" color="#9e9e9e"></fzg-icon> -->
					</view>
					<view>
						<text class="iFlag">{{deal.exf2}}</text>
						<text>元/㎡</text>
					</view>
					<view v-if="deal.pricesRate">
						<text>环比</text>
						<text :class="deal.pricesRateMark >= 0 ? 'iFlag' : ''">{{deal.pricesRate + '%' + (deal.pricesRateMark >= 0 ? '↑' : '↓')}}</text>
					</view>
				</view>
				<view v-if="deal.exf2 == '' && deal.exf3 !== ''">
					<view>
						<text>{{deal.date}}成交面积</text>
						<!-- <fzg-icon type="question" color="#9e9e9e"></fzg-icon> -->
					</view>
					<view>
						<text class="iFlag">{{deal.exf3}}</text>
						<text>㎡</text>
					</view>
					<view v-if="deal.areasRate">
						<text>环比</text>
						<text :class="deal.areasRateMark >= 0 ? 'iFlag' : ''">{{deal.areasRate + '%' + (deal.areasRateMark >= 0 ? '↑' : '↓')}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="houseShowImage" v-if="ztnews.length">
			<view>
				<view v-for="item in ztnews" :key="item.id" @tap="goWebView(item.title,item.jumpurl)">
					<view>
						<text>{{item.subject}}</text>
					</view>
					<view>
						<text>{{item.abstract}}</text>
					</view>
					<view>
						<image mode="widthFix" :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="map" v-if="mapHouse.length">
			<view>
				<view>
					<view>
						<text>附近地图</text>
					</view>
					<view>
						<text>{{address}}</text>
						<fzg-icon type="circle" color="#9e9e9e" size="12"></fzg-icon>
					</view>
				</view>
			</view>
			<view @tap="$tool.nav('house/somap?lat='+lat+'&lon='+lon)">
				<view>
					<view>
						<swiper style="width: 400rpx;height: 150rpx; margin-top: 20rpx;" autoplay="true" circular="true" interval="5000">
							<swiper-item v-for="item in mapHouse" :key="item.id">
								<view class="mapViewSwiperItem">
									<view>
										<text>{{item.title}}</text>
									</view>
									<view>
										<text>{{item.price}}·{{item.score}}分</text>
									</view>
									<view>
										<text>距您{{item.distance}}米</text>
									</view>
								</view>
							</swiper-item>
						</swiper>
						<view>
							<view>
								<image src="../../static/radar.png"></image>
							</view>
							<view>
								<text>地图搜索周边</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="excellent" v-if="zthouse.length">
			<view>
				<text>楼盘优选</text>
			</view>
			<view>
				<view>
					<view v-for="item in zthouse" :key="item.id" data-type="news" :data-id="item.sid" @tap="goDetail">
						<view>
							<text>{{item.subject}}</text>
						</view>
						<view>
							<text>{{item.abstract}}</text>
						</view>
						<view>
							<image mode="widthFix" :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="newHouseHot" v-if="hotHouse.length">
			<view>
				<text>新房热卖</text>
			</view>
			<view>
				<!-- #ifndef MP-ALIPAY -->
				<swiper class="newHouseHotSwiper" autoplay="true" circular="true" interval="5000" display-multiple-items="2"
				 next-margin="30px">
					<swiper-item class="iSwiperItem" v-for="item in hotHouse" :key="item.id">
						<view class="iViewSwiper" data-type="house" :data-id="item.id" @tap="goDetail">
							<view>
								<view>
									<image mode="widthFix" :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
								</view>
								<view>
									<text>{{item.area_id}}</text>
								</view>
							</view>
							<view>
								<view>
									<text>{{item.title}}</text>
								</view>
								<view>
									<text>{{item.mj}}</text>
									<text>{{item.price}}</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<scroll-view scroll-x="true">
					<view class="iScrollViewAlipy">
						<view class="isAlipay" v-for="item in hotHouse" :key="item.id">
							<view class="isAlipayScroll" data-type="house" :data-id="item.id" @tap="goDetail">
								<view>
									<view>
										<image mode="widthFix" :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
									</view>
									<view>
										<text>{{item.area_id}}</text>
									</view>
								</view>
								<view>
									<view>
										<text>{{item.title}}</text>
									</view>
									<view>
										<text>{{item.mj}}</text>
										<text>{{item.price}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- #endif -->
			</view>
		</view>

		<view class="like">
			<view>
				<view>
					<view>
						<text>猜你喜欢</text>
					</view>
					<view>
						<view @tap="doNewHouse">
							<text :class="{active:newHouseClass}">新房</text>
						</view>
						<view @tap="doOldHouse">
							<text :class="{active:oldHouseClass}">二手房</text>
						</view>
						<view @tap="doRentHouse">
							<text :class="{active:rentHouseClass}">租房</text>
						</view>
					</view>
				</view>
			</view>
			<view>
				<!-- tab切换第一个 -->
				<view v-if="newHouse">
					<view class="iHouseList" v-if="newHouseItems.length">
						<view v-for="(item,index) in newHouseItems" :key="index">
							<house-lists v-if="item.price" :item="item"></house-lists>
							<!--横幅广告-->
							<view class="column-adv" v-else @tap="goAdDetail(item.link)">
								<image :src="item.thumb"></image>
								<view class="close-adv" @tap.stop="closeAd(index)">关闭</view>
							</view>
						</view>
					</view>
					<no-content v-else></no-content>
				</view>
				<!--  -->
				<!-- tab切换第二个 -->
				<view v-if="oldHouse">
					<view class="iHouseList" v-if="saleItems.length">
						<sale-lists v-for="item in saleItems" :key="item.ID" :item="item"></sale-lists>
					</view>
					<no-content v-else></no-content>
				</view>
				<!--  -->
				<!-- tab切换第三个 -->
				<view v-if="rentHouse">
					<view class="iHouseList" v-if="rentItems.length">
						<rent-lists v-for="item in rentItems" :key="item.ID" :item="item"></rent-lists>
					</view>
					<no-content v-else></no-content>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import houseLists from '@/components/houseLists.vue'
	import saleLists from '@/components/saleLists.vue'
	import rentLists from '@/components/rentLists.vue'
	import noContent from '../../components/noContent.vue'
	import {
		mapState
	} from 'vuex'
	// #ifdef APP-PLUS || MP-WEIXIN
	import amap from '@/common/amap-wx.js'
	import {
		aMapWxKey
	} from '@/common/cfgs'
	// #endif
	export default {
		components: {
			uniIcon,
			fzgIcon,
			houseLists,
			saleLists,
			rentLists,
			noContent
		},
		data() {
			return {
				city: '城市',
				address: '',
				lon: '', //经度
				lat: '', //纬度
				amapPlugin: null,
				iSelect: [{
						text: "新房",
						type: "newhouse",
						color: "#02cf80",
						path: "/pages/house/index"
					},
					{
						text: "二手房",
						type: "jyhome",
						color: "#ff8652",
						path: "/pages/sale/index"
					},
					{
						text: "租房",
						type: "jyrent",
						color: "#8ecd46",
						path: "/pages/rent/index"
					},
					{
						text: "海外房产",
						type: "sea",
						color: "#f7b94b",
						path: "/pages/world/index"
					},
					{
						text: "家居装修",
						type: "house",
						color: "#2993ff",
						path: "/pages/news/jiaju"
					},
					{
						text: "楼盘导购",
						type: "bguide",
						color: "#fb5d53",
						path: "/pages/news/daogou"
					},
					{
						text: "全景看房",
						type: "vr",
						color: "#6b76f8",
						path: "/pages/news/panoramic"
					},
					{
						text: "掌柜财经",
						type: "caijing-",
						color: "#4caf50",
						path: ""
					}
				],
				hotnews: {}, //掌柜头条
				deal: {}, //掌柜指数
				ztnews: [], //专题
				mapHouse: [], //附近楼盘
				zthouse: [], //楼盘优选
				hotHouse: [], //新房热卖
				newHouseItems: [], //猜你喜欢(新房)
				saleItems: [], //猜你喜欢(二手房)
				rentItems: [], //猜你喜欢(租房)
				newHouse: true,
				oldHouse: false,
				rentHouse: false,
				newHouseClass: true,
				oldHouseClass: false,
				rentHouseClass: false
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			uni.removeStorageSync('brecords_' + this.$city);
			// #ifndef APP-PLUS || H5 || MP-ALIPAY
			uni.authorize({
				scope: 'scope.userLocation',
				success() {
					uni.getLocation()
				}
			})
			// #endif
			// #ifdef APP-PLUS || MP-WEIXIN
			this.amapPlugin = new amap.AMapWX({
				key: aMapWxKey
			});
			// #endif
			uni.$once('login', () => { //监听登录事件
				this.reflogin();
				this.initCollect();
				this.initConcerns();
			})
			this.reflogin();
			// #ifndef H5
			setTimeout(() => {
				this.getData()
			}, 300);
			// #endif
			// #ifdef H5
			this.getData();
			// #endif
		},
		// #ifdef APP-PLUS || H5
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				uni.navigateTo({
					url: '/pages/index/city'
				});
			}
		},
		// #endif
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '/pages/index/search?type=1'
			})
		},
		methods: {
			doNewHouse() {
				this.newHouse = true;
				this.oldHouse = false;
				this.rentHouse = false;

				this.newHouseClass = true;
				this.oldHouseClass = false;
				this.rentHouseClass = false;
			},
			doOldHouse() {
				this.newHouse = false;
				this.oldHouse = true;
				this.rentHouse = false;

				this.newHouseClass = false;
				this.oldHouseClass = true;
				this.rentHouseClass = false;
			},
			doRentHouse() {
				this.newHouse = false;
				this.oldHouse = false;
				this.rentHouse = true;

				this.newHouseClass = false;
				this.oldHouseClass = false;
				this.rentHouseClass = true;
			},
			goDetail(e) {
				let id = e.currentTarget.dataset.id,
					type = e.currentTarget.dataset.type;
				uni.navigateTo({
					url: (type == 'news' ? '../news/pcDetail?id=' + id : '../house/home?id=' + id)
				})
			},
			goAdDetail(link) {
				this.$util.openAdDetail(link);
			},
			closeAd(index) {
				uni.showModal({
					content: '是否关闭本条广告？',
					success: (res) => {
						if (res.confirm) {
							this.newHouseItems.splice(index, 1);
						}
					}
				})
			},
			goWebView(title, url) {
				uni.navigateTo({
					url: "/pages/index/webView?title=" + title + "&url=" + encodeURIComponent(url)
				});
			},
			goPath(item) {
				if (item.type == 'caijing-') {
					//uni.$emit('financeIndex');
					uni.setStorageSync('financeIndex', true);
					let path;
					// #ifndef APP-PLUS
					path = '/pages/news/index1';
					// #endif
					// #ifdef APP-PLUS
					path = '/pages/news/index';
					// #endif
					uni.reLaunch({
						url: path
					});
				} else if (item.type == 'jyhome' || item.type == 'jyrent') {
					let salesCity = uni.getStorageSync('salesCity'),
						leasesCity = uni.getStorageSync('leasesCity');
					if (item.type == 'jyhome') {
						if (!salesCity.includes(this.$city)) {
							uni.showToast({
								title: '敬请期待',
								icon: 'none'
							});
							return;
						}
					} else {
						if (!leasesCity.includes(this.$city)) {
							uni.showToast({
								title: '敬请期待',
								icon: 'none'
							});
							return;
						}
					}
					uni.navigateTo({
						url: item.path
					})
				} else {
					uni.navigateTo({
						url: item.path
					})
				}
			},
			setCity(name) {
				// #ifdef APP-PLUS
				var webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text: name
				});
				// #endif
				// #ifdef H5
				// h5 临时方案
				document.getElementsByClassName('uni-btn-icon')[1].innerText = name;
				// #endif
				// #ifdef MP
				this.city = name;
				// #endif
			},
			modalTips() {
				uni.showModal({
					title: "数据说明",
					content: "本APP成交数据由市场信息综合汇总，旨在为用户提供更多信息的无偿服务，仅供参考。实际数据以房管局等权威发布的数据为准，请谨慎核查。",
					showCancel: false,
					confirmText: "我已了解"
				})
			},
			saveCity(city, cityName) {
				uni.setStorageSync('city', city);
				uni.setStorageSync('cityName', cityName);
				uni.setStorageSync('locateCity', city); //定位城市拼音缩写
				uni.setStorageSync('locateCityName', cityName); //定位城市名
			},
			initCity(cityName) {
				let cityStorage = uni.getStorageSync('cityName');
				if (cityStorage) this.setCity(cityStorage);
				if (uni.getStorageSync('city')) return;
				this.$http.get(this.$api.siteApi(this.$city, 'cityData')).then(res => {
					let cityData = res.data.data.citys;
					for (var i in cityData) {
						if (~cityName.indexOf(cityData[i].city)) {
							this.saveCity(cityData[i].site, cityData[i].city);
							this.setCity(cityData[i].city);
							break;
						}
					}
				}).catch(error => {
					//console.log('request fail', error);
					this.saveCity('gz', '广州');
					this.setCity('广州');
				})
			},
			reflogin() { //每日登录
				if (!this.hasLogin || !this.userInfo.hash) return;
				if (uni.getStorageSync('nextlogin')) {
					let nextlogin = parseInt(uni.getStorageSync('nextlogin')),
						d = new Date();
					if (d.getTime() < nextlogin) return;
				}
				this.$http.get(this.$api.userApi('reflogin')).then(res => {
					if (res.data.status) {
						uni.showToast({
							title: '每日登录，积分+' + res.data.info,
							icon: 'none'
						});
					}
					let d = new Date();
					let dd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0);
					uni.setStorageSync('nextlogin', dd.getTime());
				}).catch(error => {
					console.error('error:', error);
				});
			},
			initCollect() { //获取用户收藏
				//console.log(uni.getStorageSync('collect_lpids_dg'));
				//console.log(uni.getStorageSync('collect_nids'));
				if (!this.hasLogin || !this.userInfo.hash) return;
				let params = {
					city: this.$city
				};
				this.$http.get(this.$api.userApi('collectData'), {
					data: params
				}).then(res => {
					if (res.data.status) {
						var row = res.data.info,
							collectData = [];
						for (let i in row) {
							if (row[i].length) {
								for (let j = 0; j < row[i].length; j++) {
									collectData.push(row[i][j].aid);
								}
							}
							if (i == 'v' || i == 'lp' || i == 'pc') uni.setStorageSync('collect_' + i + 'ids_' + this.$city, collectData);
							else uni.setStorageSync('collect_' + i + 'ids', collectData);
							collectData = [];
						}
					}
				}).catch(error => {
					console.error('error:', error);
				});
			},
			initConcerns() { //关注的掌柜号id
				//console.log(uni.getStorageSync('fzgids_'+this.$city));
				if (!this.hasLogin || !this.userInfo.hash) return;
				if (uni.getStorageSync('fzgids_' + this.$city) && uni.getStorageSync('fzgids_' + this.$city).length) {
					return;
				}
				let params = {
					city: this.$city
				};
				this.$http.get(this.$api.userApi('concernsData'), {
					data: params
				}).then(res => {
					if (res.data.status) {
						let row = res.data.info,
							concernsData = [];
						if (row.length) {
							for (let i = 0; i < row.length; i++) {
								concernsData.push(row[i].fzgid);
							}
							uni.setStorageSync('fzgids_' + this.$city, concernsData);
						}
					}
				}).catch(error => {
					console.error('error:', error);
				});
			},
			initSaleCity() { //获取有二手房和租房的城市
				this.$http.get(this.$api.fuberApi('esfCity')).then(res => {
					if (res.data.status) {
						uni.setStorageSync('salesCity', res.data.salesCity);
						uni.setStorageSync('leasesCity', res.data.leasesCity);
					}
				}).catch(error => {
					console.error('error:', error);
				});
			},
			getAddress() {
				/* this.$http.get(this.$api.getAddress(), {data: 
				{ak: '32ffbd3cda79c766beb1d04770f234d4',
				location:this.lat +','+this.lon,
				output:'json',
				pois:0}}).then(res => {
					console.log(res.data.result)
					this.address = res.data.result.formatted_address;
					this.initCity(res.data.result.addressComponent.city);
				}).catch(error => {
					console.error('error:',error);
				}); */
				this.$http.get(this.$api.siteApi(this.$city, 'getAddress'), {
					data: {
						longitude: this.lon,
						latitude: this.lat
					}
				}).then(res => {
					console.log(res.data.data.result)
					this.address = res.data.data.result.formatted_address;
					this.initCity(res.data.data.result.addressComponent.city);
				}).catch(error => {
					console.error('error:', error);
				});
			},
			getIndexData() {
				/* console.log('当前位置的经度：' + this.lon);
				console.log('当前位置的纬度：' + this.lat); */
				this.$http.get(this.$api.siteApi(this.$city, 'home'), {
					data: {
						lon: this.lon,
						lat: this.lat
					}
				}).then(res => {
					this.hotnews = res.data.data.hotnews;
					this.deal = res.data.data.deal;
					this.ztnews = res.data.data.ztnews;
					this.mapHouse = res.data.data.mapHouse;
					this.zthouse = res.data.data.zthouse;
					this.hotHouse = res.data.data.hotHouse;
				}).catch(error => {
					console.error('error:', error);
				});
			},
			async getData() {
				// #ifdef APP-PLUS || MP-WEIXIN
				await this.amapPlugin.getRegeo({
					success: (res) => {
						//console.log(JSON.stringify(res))
						this.lon = res[0].longitude;
						this.lat = res[0].latitude;
						/* console.log(this.lon)
						console.log(this.lat) */
						uni.setStorageSync('lon', res[0].longitude);
						uni.setStorageSync('lat', res[0].latitude);
						this.address = res[0].name;
						this.initCity(res[0].regeocodeData.addressComponent.city);
						this.getIndexData();
					},
					error: (err) => {
						this.getAddress();
						this.getIndexData();
					}
				});
				// #endif
				// #ifndef APP-PLUS || MP-WEIXIN
				await uni.getLocation({ //h5端在本地获取不到？
					//type: 'wgs84',
					success: (res) => {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						console.log('当前位置的：' + res.address);
						this.lon = res.longitude;
						this.lat = res.latitude;
						uni.setStorageSync('lon', res.longitude);
						uni.setStorageSync('lat', res.latitude);
						this.getAddress();
						this.getIndexData();
					},
					fail: (res) => {
						console.log(res)
						this.getAddress();
						this.getIndexData();
					}
				})
				// #endif
				let broswerRecords = uni.getStorageSync('brecords_' + this.$city) || {}; //浏览记录
				let params = {},
					saleParams = {
						city: this.$city
					},
					rentParams = {
						city: this.$city,
						type: 2
					},
					ids = [],
					saleIds = [],
					rentIds = [];
				if (Object.keys(broswerRecords).length) {
					for (let i in broswerRecords) {
						if (broswerRecords[i].type == 'house') ids.push(broswerRecords[i].id);
						else if (broswerRecords[i].type == 'sale') saleIds.push(broswerRecords[i].id);
						else rentIds.push(broswerRecords[i].id);
					}
					ids.length && (params['ids'] = ids.join(','));
					saleIds.length && (saleParams['ids'] = saleIds.join(','));
					rentIds.length && (rentParams['ids'] = rentIds.join(','));
				}
				try {
					let res = await this.$http.get(this.$api.siteApi(this.$city, 'guessLike'), {
						data: params
					});
					this.newHouseItems = res.data.data;
					let saleRes = await this.$http.get(this.$api.fuberApi('index'), {
						data: saleParams
					});
					this.saleItems = saleRes.data;
					let rentRes = await this.$http.get(this.$api.fuberApi('index'), {
						data: rentParams
					});
					this.rentItems = rentRes.data;
					await this.initCollect();
					await this.initConcerns();
					await this.initSaleCity();
				} catch (error) {
					console.error('error:', error);
				}
			}
		}
	}
</script>

<style lang="less">
	.container {
		background-color: #f9f9f9;

		/* #ifdef MP-WEIXIN */
		.header {
			width: 100%;
			display: flex;
			position: absolute;
			left: 0;
			top: 30rpx;
			padding: 0 20rpx;

			.viewText {
				display: flex;
				width: 120rpx;
				font-size: 32rpx;
				color: #ffffff;

				.fzgIcon {
					color: #ffffff;
					margin: 2px 0 0 5px;
				}
			}

			.headerInput {
				width: 590rpx;
				height: 30rpx;
				border-radius: 20px;
				background: rgba(255, 255, 255, .6);
				margin-left: 5px;
				font-size: 16px;
				text-align: center;
			}
		}
		/* #endif */
		/* #ifdef MP-ALIPAY */
		.header {
			width: 100%;
			display: flex;
			position: absolute;
			left: 0;
			top: 30rpx;
			.viewText {
				display: flex;
				width: 120rpx;
				font-size: 32rpx;
				color: #ffffff;
				margin: 10rpx 0 0 20rpx;

				.fzgIcon {
					color: #ffffff;
					margin: 2px 0 0 5px;
				}
			}

			.headerInput {
				width: 570rpx;
				height: 50rpx;
				border-radius: 25rpx;
				opacity: .6;
				margin-left: 5px;
				font-size: 16px;
				text-align: center;
			}
		}
		/* #endif */
		
		/* #ifdef MP-TOUTIAO */
		.header {
			width: 100%;
			display: flex;
			position: absolute;
			left: 0;
			top: 30rpx;
			padding: 0 20rpx;
		
			.viewText {
				display: flex;
				width: 120rpx;
				font-size: 32rpx;
				color: #ffffff;
		
				.fzgIcon {
					color: #ffffff;
					margin: 2px 0 0 5px;
				}
			}
		
			.headerInput {
				width: 590rpx;
				height: 30rpx;
				border-radius: 20px;
				background: rgba(255, 255, 255, .6);
				margin-left: 5px;
				font-size: 16px;
				text-align: center;
			}
		}
		/* #endif */
		
		.banner {
			image {
				vertical-align: text-top;
				width: 100%;
			}
		}

		.iContent {
			background-color: #ffffff;

			.iSelect {
				padding: 44rpx 0 0 0;
				display: flex;
				flex-wrap: wrap;

				.iSelectWrap {
					box-sizing: border-box;
					width: 25%;
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					text-align: center;
					margin-bottom: 44rpx;

					&>view {
						width: 91rpx;
						height: 91rpx;
						border-radius: 50%;
						text-align: center;
						line-height: 91rpx;
						/* #ifdef MP-ALIPAY */
						line-height: 110rpx;
						/* #endif */
						margin-bottom: 10rpx;
					}

					&>text {
						width: 100%;
						font-size: 26rpx;
						color: #6e6e6e;
					}
				}
			}

			.headline {
				height: 70rpx;
				padding: 0 20rpx 40rpx 50rpx;
				display: flex;
				justify-content: space-between;
				overflow: hidden;

				&>view:nth-child(1) {
					width: 69rpx;
					height: 61rpx;
					margin: 5rpx 15rpx 0 0;

					image {
						width: 100%;
						height: 100%;
					}
				}

				&>view:nth-child(2) {
					height: 70rpx;
					padding-left: 15rpx;
					border-left: 1px solid #e5e5e5;
					flex: 1;

					navigator {
						font-size: 26rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}

		.mContent {
			background-color: #ffffff;
			margin-top: 20rpx;
			padding: 0 20rpx;

			&>view:nth-child(1) {
				padding: 40rpx 0;
				border-bottom: 1px solid #e5e5e5;
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					color: #3f3f3f;
					font-size: 42rpx;
				}
			}

			&>view:nth-child(2) {
				margin: 40rpx auto 0;
				padding-bottom: 40rpx;
				display: flex;
				justify-content: space-between;

				&>view:nth-child(1),
				&>view:nth-child(2) {
					&>view:nth-child(1) {
						text {
							font-size: 28rpx;
							color: #9e9e9e;
						}
					}

					&>view:nth-child(2) {
						text-align: center;
						margin-top: 30rpx;

						&>text:nth-child(1) {
							font-size: 46rpx;
							color: #cd413a;
						}

						&>text:nth-child(1).iFlag {
							color: #f3ad63;
						}

						&>text:nth-child(2) {
							font-size: 26rpx;
							color: #9e9e9e;
						}
					}

					&>view:nth-child(3) {
						margin-top: 30rpx;
						text-align: center;

						&>text:nth-child(1) {
							color: #9e9e9e;
							font-size: 24rpx;
							margin-right: 12rpx;
						}

						&>text:nth-child(2) {
							color: #5ba75f;
							font-size: 26rpx;
						}

						&>text:nth-child(2).iFlag {
							color: #cd413a;
						}
					}
				}
			}
		}

		.houseShowImage {
			padding: 0 20rpx;

			&>view:nth-child(1) {
				display: flex;
				justify-content: space-between;
				padding: 30rpx 0;

				&>view {
					width: 31%;
					padding-bottom: 12rpx;
					background-color: #ffffff;
					border-radius: 20rpx;
					box-shadow: 0px 0px 10px #eeeeee;
					text-align: center;

					&>view:nth-child(1) {
						padding-top: 30rpx;

						text {
							font-size: 32rpx;
							color: #3F3F3F;
						}
					}

					&>view:nth-child(2) {
						/* #ifdef MP-ALIPAY */
						padding-top: 20rpx;

						/* #endif */
						text {
							font-size: 24rpx;
							color: #3F3F3F;
						}
					}

					&>view:nth-child(3) {
						padding: 0 10rpx;
						margin-top: 10rpx;

						image {
							width: 100%;
							display: block;
						}
					}
				}
			}
		}

		.map {
			&>view:nth-child(1) {
				height: 127rpx;
				line-height: 127rpx;
				background-color: #ffffff;

				&>view:nth-child(1) {
					display: flex;
					justify-content: space-between;
					padding: 0 20rpx;

					&>view:nth-child(1) {
						text {
							color: #3f3f3f;
							font-size: 42rpx;
						}
					}

					&>view:nth-child(2) {
						text {
							color: #9e9e9e;
							font-size: 24rpx;
							margin-right: 12rpx;
						}
					}
				}
			}

			&>view:nth-child(2) {
				height: 280rpx;
				background: url(../../static/mapBackground.jpg) no-repeat;
				background-size: 100%;
				padding: 0 40rpx;

				&>view:nth-child(1) {
					height: 200rpx;
					background-color: #fff;
					border-radius: 20rpx;
					margin: 0 auto;
					position: relative;
					top: 40rpx;

					&>view:nth-child(1) {
						padding: 0 20rpx;
						display: flex;
						justify-content: space-between;

						.mapViewSwiperItem {
							height: 150rpx;

							/* #ifdef MP-ALIPAY */
							&>view {
								margin-top: 15rpx;
							}

							/* #endif */
							&>view:nth-child(1) {
								text {
									font-size: 32rpx;
									color: #3f3f3f;
								}
							}

							&>view:nth-child(2) {
								text {
									font-size: 28rpx;
									color: #3f3f3f;
								}
							}

							&>view:nth-child(3) {
								text {
									font-size: 28rpx;
									color: #9e9e9e;
								}
							}
						}

						&>view:nth-child(2) {
							width: 168rpx;
							height: 130rpx;
							margin-top: 30rpx;
							border-left: 1px solid #E5E5E5;
							padding-left: 32rpx;

							&>view:nth-child(1) {
								width: 67rpx;
								height: 67rpx;
								margin: 11rpx auto 0;

								image {
									width: 100%;
									height: 100%;
								}
							}

							&>view:nth-child(2) {
								text {
									font-size: 28rpx;
									color: #9e9e9e;
								}
							}
						}
					}
				}
			}
		}

		.excellent {
			&>view:nth-child(1) {
				height: 124rpx;
				line-height: 124rpx;
				background-color: #fff;

				text {
					font-size: 42rpx;
					color: #3f3f3f;
					margin-left: 21rpx;
				}
			}

			&>view:nth-child(2) {
				padding: 0 20rpx;

				&>view:nth-child(1) {
					display: flex;
					justify-content: space-between;
					margin: 0 auto;
					padding: 30rpx 0;

					&>view:nth-child(1) {
						margin-left: 0;
					}

					&>view {
						width: 31%;
						padding-bottom: 12rpx;
						background-color: #ffffff;
						border-radius: 20rpx;
						margin-left: 20rpx;
						box-shadow: 0px 0px 10px #eeeeee;
						text-align: center;

						&>view:nth-child(1) {
							margin-top: 37rpx;

							text {
								font-size: 32rpx;
								color: #3F3F3F;
							}
						}

						&>view:nth-child(2) {
							/* #ifdef MP-ALIPAY */
							padding: 10rpx;
							/* #endif */
							margin-top: -10rpx;

							text {
								font-size: 24rpx;
								color: #3F3F3F;
							}
						}

						&>view:nth-child(3) {
							padding: 0 10rpx;
							margin-top: 10rpx;

							image {
								width: 100%;
								display: block;
							}
						}
					}
				}
			}
		}

		.newHouseHot {
			background-color: #ffffff;
			&>view:nth-child(1) {
				height: 125rpx;
				line-height: 125rpx;
				text {
					font-size: 42rpx;
					color: #3f3f3f;
					margin-left: 21rpx;
				}
			}
			&>view:nth-child(2) {
				padding: 0 20rpx;
				.newHouseHotSwiper {
					height: 350rpx;
					.iSwiperItem {
						.iViewSwiper {
							&>view:nth-child(1) {
								position: relative;
								&>view:nth-child(1) {
									height: 210rpx;
									margin-right: 20rpx;
									image {
										width: 100%;
										vertical-align: top;
									}
								}
								&>view:nth-child(2) {
									width: 100rpx;
									height: 40rpx;
									padding: 0 10rpx;
									line-height: 30rpx;
									text-align: center;
									background-color: #ffffff;
									border-radius: 20rpx;
									position: absolute;
									left: 20rpx;
									bottom: 20rpx;
									overflow: hidden;
									/*内容超出宽度时隐藏超出部分的内容 */
									text-overflow: ellipsis;
									/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
									white-space: nowrap;
									/*不换行 */
									text {
										font-size: 22rpx;
										color: #3f3f3f;
									}
								}
							}
							&>view:nth-child(2) {
								width: 315rpx;
								margin-top: 20rpx;
								&>view:nth-child(1) {
									text {
										font-size: 32rpx;
										color: #3f3f3f;
									}
								}
								&>view:nth-child(2) {
									display: flex;
									justify-content: space-between;
									margin-top: 15rpx;
									&>text:nth-child(1) {
										font-size: 26rpx;
										color: #3f3f3f;
									}
									&>text:nth-child(2) {
										color: #e83836;
										font-size: 26rpx;
									}
								}
							}
						}
					}
				}
				.iScrollViewAlipy{
					display: flex;
					padding-bottom: 20rpx;
					.isAlipay{
						.isAlipayScroll{
							width: 315rpx;
							margin-right: 20rpx;
							&>view:nth-child(1) {
								position: relative;
								&>view:nth-child(1) {
									height: 210rpx;
									image {
										width: 100%;
										vertical-align: top;
									}
								}
								&>view:nth-child(2) {
									width: 100rpx;
									height: 40rpx;
									padding: 0 10rpx;
									line-height: 30rpx;
									text-align: center;
									background-color: #ffffff;
									border-radius: 20rpx;
									position: absolute;
									left: 20rpx;
									bottom: 20rpx;
									overflow: hidden;
									/*内容超出宽度时隐藏超出部分的内容 */
									text-overflow: ellipsis;
									/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
									white-space: nowrap;
									/*不换行 */
									text {
										font-size: 22rpx;
										color: #3f3f3f;
									}
								}
							}
							&>view:nth-child(2) {
								margin-top: 20rpx;
								&>view:nth-child(1) {
									text {
										font-size: 32rpx;
										color: #3f3f3f;
									}
								}
								&>view:nth-child(2) {
									display: flex;
									justify-content: space-between;
									margin-top: 15rpx;
									&>text:nth-child(1) {
										font-size: 26rpx;
										color: #3f3f3f;
									}
									&>text:nth-child(2) {
										color: #e83836;
										font-size: 26rpx;
									}
								}
							}
						}
					}
				}
			}
		}

		.like {
			margin-top: 20rpx;
			background-color: #ffffff;

			&>view:nth-child(1) {
				height: 127upx;
				line-height: 127rpx;

				&>view:nth-child(1) {
					height: 127rpx;
					padding: 0 20rpx;
					border-bottom: 1px solid #E5E5E5;
					display: flex;
					justify-content: space-between;

					&>view:nth-child(1) {
						&>text {
							color: #3f3f3f;
							font-size: 42rpx;
						}
					}

					&>view:nth-child(2) {
						display: flex;

						& view {
							margin-left: 20rpx;
						}

						& text {
							font-size: 24rpx;
							color: #9E9E9E;
						}

						& text.active {
							color: #f00;
						}
					}
				}
			}
		}

		.column-adv {
			padding: 16upx 0;
			background: #f7f7f7;
			width: 100%;
			height: 120upx;
			position: relative;

			&>image {
				width: 100%;
				height: 100%;
			}

			&>.close-adv {
				position: absolute;
				top: 30upx;
				right: 3%;
				color: #fff;
				border: 1px solid #fff;
				padding: 5upx 10upx;
				border-radius: 6upx;
				-webkit-border-radius: 6upx;
				font-size: 24upx;
				line-height: 1;
			}
		}
	}
</style>
