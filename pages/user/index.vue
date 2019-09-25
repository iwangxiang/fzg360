<template>
	<view class="myContainer">
		<view class="bgWhite">
			<view class="pad_20">
				<navigator class="mySetTxt" url="../config/index"  hover-class="none" >
					设置
				</navigator>
				<view class="loginStatus" hover-class="none" v-if="!hasLogin">
					<view class="myHeadBox">
						<view class="myHeadImgBox">
							<image src="/static/logo.png"></image>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<button class="loginStatus" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
						<view class="loginStatus" @tap="$tool.nav('user/login')">手机登录/注册</view>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<view class="loginStatus" @tap="$tool.nav('user/login')">点击登录/注册</view>
						<!-- #endif -->
					</view>
				</view>
				<navigator class="loginStatus" url="../user/uinfo" hover-class="none" v-else>
					<view class="myHeadBox">
						<view class="myHeadImgBox">
							<image :src="userInfo.thumb ? userInfo.thumb : '/static/logo.png'"></image>
						</view>
						<view class="loginStatus" >{{userInfo.mname}}</view>
						<view class="loginStatus" >邀请码:{{userInfo.invitecode ? userInfo.invitecode : '暂无'}}</view>
					</view>
				</navigator>
			</view>
			<view class="myTools">
				<navigator class="myToolBox" url="../calcu/loan" hover-class="none">
					<image src="../../static/my_d.png"></image>
					<text>房贷计算器</text>
				</navigator>
				<navigator class="myToolBox" url="../calcu/tax" hover-class="none">
					<image src="../../static/my_s.png"></image>
					<text>税费计算器</text>
				</navigator>
				<navigator class="myToolBox" url="../user/find" hover-class="none">
					<image src="../../static/my_search.png"></image>
					<text>帮你找房</text>
				</navigator>
			</view>
		</view>
        <!--view>
            <text @tap="testRedDot(1)">setRed</text>
            #
            <text @tap="testRedDot(0)">cancel</text>
        </view-->
		<view class="bgWhite mart10">
			<view class="icoBox">
				<view v-for="(item,index) in tabIcons" :key=index @tap="goPage(item)">
					<image :src="item.ThumbUrl"></image>
					<text>{{item.text}}</text>
					<uni-badge :text="vCounts(item)" type="error" size="small" class="badgeBox"></uni-badge>
				</view>
			</view>
		</view>
		<view class="bgWhite mart10">
			<text class="fyTitle">房源推荐</text>
			<swiper class="swiper fyBox"  :autoplay="autoplay" :duration="duration"  display-multiple-items="3" next-margin="30px">
                <swiper-item class="fyList" v-for="(item,index) in houseListItems" :key="index">
					<view v-if="item.id" @tap="goDetail('house',item.id)">
						<image :src="item.thumb"></image>
						<text class="fyName">{{item.title}}</text>
						<text class="fyArea">{{item.area_id}}</text>
						<text class="fyPrice">{{item.price}}</text>
						<text class="fyTab">新房</text> <!-- 这里的值如果是二手房时文字显示二手房 -->
					</view>
					<view v-else @tap="goDetail('sale',item.ID)">
						<image :src="item.THUMB_URL"></image>
						<text class="fyName">{{item.SALE_SUBJECT}}</text>
						<text class="fyArea">{{item.SALE_HX}}&nbsp;&nbsp;{{item.SALE_AREA}}</text>
						<text class="fyPrice">{{item.SALE_TOTAL_PRICE}}</text>
						<text class="fyTab">二手房</text> <!-- 这里的值如果是二手房时文字显示二手房 -->
					</view>
                </swiper-item>
            </swiper>
        </view>
		</view>
	</view>
</template>

<script>
    
	import {uniBadge} from '@dcloudio/uni-ui'
	import {mapState,mapMutations} from 'vuex'
    import {msgSend,msgFormat,setTabarRedot} from '@/pages/msg/funcs'
     
	export default {
		components: {uniBadge},
		data() {
			return {
				indicatorDots: false,
				autoplay: false,
				duration: 500,
                unread: 0,
				tabIcons:[
					{text:"掌聊",name:'list',Total:"chats",ThumbUrl:"../../static/myico_0.png",path:"/pages/msg/list"},
					{text:"通知",name:'notice',Total:"",ThumbUrl:"../../static/myico_1.png",path:"/pages/msg/notice"},
					{text:"浏览记录",name:'vlogs',Total:"",ThumbUrl:"../../static/myico_2.png",path:"/pages/user/vlogs?tabIndex=1"},
					{text:"委托卖房",name:'weitou',Total:"",ThumbUrl:"../../static/myico_3.png",path:"/pages/sale/weitou"},
					{text:"我的收藏",name:'collections',Total:"",ThumbUrl:"../../static/myico_4.png",path:"/pages/user/vlogs"},
					{text:"我的关注",name:'favor',Total:"",ThumbUrl:"../../static/myico_5.png",path:"/pages/user/favor"},
					{text:"我的预约",name:'appointment',Total:"",ThumbUrl:"../../static/myico_6.png",path:"/pages/user/appointment"},
					{text:"我的积分",name:'jifen',Total:"",ThumbUrl:"../../static/myico_7.png",path:"/pages/jifen/index"},
					{text:"我的问答",name:'myqa',Total:"",ThumbUrl:"../../static/myico_8.png",path:"/pages/user/myqa"},
				],
				houseListItems:[]
			}
		},
        onLoad() {
			// #ifndef APP-PLUS || H5 || MP-ALIPAY
			uni.authorize({
				scope: 'scope.userInfo',
				success() {
					//uni.getUserInfo()
				}
			})
			// #endif
			// #ifdef MP-WEIXIN
			uni.checkSession({
				success:(res)=> {
					//console.log(res)
				},
				fail: (res) => {
					this.logout();
				}
			})
			// #endif
			uni.$on('login',() => {
				this.getMesTotal();
			})
			uni.$on('logout',() => {
				this.tabIcons[1].Total = '';
			})
			if(this.hasLogin && this.userInfo.hash){
				this.getMesTotal();
			}
			setTimeout(()=>{
                this.getData()
            }, 321)
		},
        onShow() {
            this.resetReddot()
        },
		computed: mapState(['hasLogin','userInfo','chats']),
		methods: {
			...mapMutations(['login','logout']),
			getUserInfo(e){
				//console.log(e.detail)
				if(e.detail.errMsg == "getUserInfo:ok"){
					uni.login({
						provider: 'weixin',
						success: (loginRes) => {
							//console.log(loginRes);
							let params = {
								code:loginRes.code,
								rawData:e.detail.rawData,
								signature:e.detail.signature,
								encryptedData:e.detail.encryptedData,
								iv:e.detail.iv
							};
							this.wxProLogin(params);
						}
					});
				}
			},
			wxProLogin(params){
				this.$http.post(this.$api.userApi('wxProLogin'), {data: params}).then(res => {
					if(res.data.status){
						uni.showToast({title:'登录成功',icon:'none'});
						this.login(res.data.info);
						uni.$emit('login');
					}else{
						uni.showToast({title:res.data.info,icon:'none'});
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
            /*testRedDot(unread) {
                if(unread){ 
                    uni.showTabBarRedDot({index:2})
                }else{ 
                    uni.hideTabBarRedDot({index:2})
                } 
            },*/
            resetReddot() {
                setTabarRedot(this.chats)
            },
            vCounts(item) {
                // 取:this.xxxx.unread的vuex值
                if('(chats,xxx)'.indexOf(item.Total)>0){
                    return this[item.Total]['unread']
                }else if(item.Total){
                    return item.Total
                }else{
                    return 0
                }
            },
			goPage(item){
				let arrs = ['list','notice','collections','favor','appointment','jifen','myqa'];
				// #ifdef MP
				if(!this.hasLogin && !this.userInfo.hash && arrs.includes(item.name)){
					uni.showToast({icon: 'none',title: '请先登录'});
					return;
				}
				// #endif
				// #ifndef MP
				if(!this.hasLogin && !this.userInfo.hash && arrs.includes(item.name)){
					//uni.showToast({icon: 'none',title: '请先登录'});
					this.$util.ckLogin(item.path);
					return;
				}
				// #endif
				uni.navigateTo({
					url:item.path
				})
			},
			goDetail(type,id){
				uni.navigateTo({
					url: '/pages/'+type+'/'+(type == 'house' ? 'home' : 'detail')+'?id='+id
				})
			},
			shuffle(array) {
				var tmp, current, top = array.length;
				if(top){
					while(--top){
						current = Math.floor(Math.random() * (top + 1));
						tmp = array[current];
						array[current] = array[top];
						array[top] = tmp;
					}
				}
				return array;
			},
			getMesTotal() {
				this.$http.get(this.$api.userApi('getMesTotal')).then(res => {
					if(res.data.status){
						this.tabIcons[1].Total = res.data.info;
					}
				}).catch(error => {
					console.error('error:',error);
				});
			},
		    async getData() {
				let broswerRecords = uni.getStorageSync('brecords_'+this.$city) || {}; //浏览记录
				let params = {},saleParams = {city: this.$city},
					ids = [],saleIds = [];
				if(Object.keys(broswerRecords).length){
					for(let i in broswerRecords){
						if(broswerRecords[i].type == 'house') ids.push(broswerRecords[i].id);
						else if(broswerRecords[i].type == 'sale') saleIds.push(broswerRecords[i].id);
					}
					ids.length && (params['ids'] = ids.join(','));
					saleIds.length && (saleParams['ids'] = saleIds.join(','));
				}
				try{
					let res = await this.$http.get(this.$api.siteApi(this.$city,'houseRecommend'), {data: params});
					this.houseListItems = res.data.data.newHouse;
					let res2 = await this.$http.get(this.$api.fuberApi('saleRecommend'), {data: saleParams});
					if(res2.data.esHouse.length){
						let saleListItems = res2.data.esHouse;
						this.houseListItems = this.houseListItems.concat(saleListItems);
						this.shuffle(this.houseListItems);
					}
				} catch (error) {
					console.error('error:',error);
				}
			}
		}
	}
</script>

<style lang="less">
page{ background: #f7f7f7;}
.myContainer{
	@font-size: 26rpx;
	.bgWhite{
		background: #ffffff;
	}
	.pad_20{
		padding: 20px;
	}
	.radius{
	border-radius: 50%;
	-webkit-border-radius: 50%;	
	}
	.mart10{ margin-top: 10px;}
	.fontRed{ color: #e83836;}
	.fontGray{color: #9e9e9e;}
	.mySetTxt{
		font-size:@font-size+2rpx;
		line-height: 22px; 
		text-align:right;
		outline:none;
		background-color: transparent;
		float: right;
		border:none;
		position: inherit;
		}
	.myHeadBox{
		width: 100%;
		display: -webkit-flex; 
		display: flex;
		flex-direction: column;
		-webkit-flex-direction:column;
		align-items:center;
		-webkit-align-items:center;
		.myHeadImgBox{
			width: 120rpx;
			height: 120rpx;
			.radius();
			background: #ccc;
			image{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				-webkit-border-radius: 50%;
			}
		}
		.loginStatus{
			 margin-top: 10rpx;
			 font-size:@font-size+4rpx;
		}
	}
	.myTools{
		display: flex;
		flex-wrap: wrap;
		flex-direction:row;
		padding: 30rpx 0;
	}
	.myToolBox{
		display: flex;
		flex-wrap:wrap;
		flex-direction: column;
		justify-items: center;
		border-right:solid 1px #eee; 
		width: 33.33%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		&{flex-grow: 1;}
		&:last-child{ border-right: none;}
		text{
			font-size:@font-size;
			text-align: center;
			margin-top:10px;
		}
		image{
			margin: 0 auto;
			width: 48rpx;
			height: 48rpx;
		}
	}
	.icoBox{
		display: flex;
		flex-wrap: wrap;
		flex-direction:row;
		padding:0 0;
		view{
			.myToolBox();
			 padding: 20px 0;
			 border-bottom:solid 1px #eee;
			 position: relative;
			 }
			.badgeBox{
			 	position: absolute; 
			 	right:85rpx; 
			 	top:5rpx;
			}
	}
	.fyTitle{
		font-size:@font-size+6rpx;
		line-height:96rpx;
		padding: 0 10px;
	}
	.fyBox{
		display: flex;
		flex-wrap: nowrap;
		flex-direction:row; 
		margin-bottom: 10px;
		.fyList{	
				display: flex;
				flex-wrap: nowrap;
				flex-direction:column;
				width: 216rpx;
				height: auto;
				padding-bottom:10px;
				margin-left:10px;
				position: relative;
				image{
					width:216rpx;
					height:126rpx;
				}
				.txtHide{
					overflow: hidden; 
					text-overflow: ellipsis;
					white-space: nowrap; 
					display: block;
				}
				.fyName{
					font-size:@font-size+6rpx;	
					margin-top: 5px;
					height: 48rpx;
					line-height:48rpx;
					.txtHide();
				}
				.fyArea{
					.fontGray();
					font-size: 24rpx;
					height:36rpx;
					line-height:36rpx;
					.txtHide();
				}
				.fyPrice{
					.fontRed();
					font-size:@font-size;
					height:39rpx;
					line-height:39rpx;
					.txtHide();
				}
				.fyTab{
					font-size: 20rpx;
					color: #fff;
					padding:2px 5px;
					background:rgba(0,0,0,0.6);
					position: absolute;
					top:0;
					left:0;
				}
			}
	}
}
</style>
