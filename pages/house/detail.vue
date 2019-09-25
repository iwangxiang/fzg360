<template>
	<view class="details">
		<view class="baseInfo">
			<view>
				{{info.title}}基本信息
			</view>
			<view>
				<view>
					<text>价格：</text>
					<text>均价{{info.price}}</text>
				</view>
				<view>
					<text>物业类型：</text>
					<text>{{info.wylx_id ? info.wylx_id : '待定'}}</text>
				</view>
				<view>
					<text>项目特色：</text>
					<text>{{info.xmts ? info.xmts : '待定'}}</text>
				</view>
				<view>
					<text>建筑类别：</text>
					<text>{{info.type_id ? info.type_id : '待定'}}</text>
				</view>
				<view>
					<text>装修状况：</text>
					<text>{{info.zxzk ? info.zxzk : '待定'}}</text>
				</view>
				<view>
					<text>产权年限：</text>
					<text>{{info.limit ? info.limit : '待定'}}</text>
				</view>
				<view>
					<text>环线位置：</text>
					<text>{{info.position ? info.position : '待定'}}</text>
				</view>
				<view>
					<text>开发商：</text>
					<text>{{info.developer ? info.developer : '待定'}}</text>
				</view>
				<view class="viewAddress" @tap="goMap">
					<view class="sectionName1">楼盘地址：</view>
					<view class="sectionName2">{{info.address ? info.address : '待定'}}</view>
					<uni-icon class="iUniIcon" type="forward" size="20" color="#9E9E9E"></uni-icon>
				</view>
			</view>
		</view>
		
		<view class="baseInfo salesInfo">
			<view>
				{{info.title}}销售信息
			</view>
			<view>
				<view>
					<text>销售状态：</text>
					<text>{{info.sale ? info.sale : '待定'}}</text>
				</view>
				<view>
					<text>开盘时间：</text>
					<text>{{info.kpsj ? info.kpsj : '待定'}}</text>
				</view>
				<view>
					<text>交房时间：</text>
					<text>{{info.rzsj ? info.rzsj : '待定'}}</text>
				</view>
				<view>
					<text>咨询电话：</text>
					<text>{{info.tel ? info.tel : '待定'}}</text>
				</view>
				<template v-if="info.building && info.building.length">
				<view>
					<text>许可证：</text>
				</view>
				<view class="iTable">
					<view class="iTbaleTitle">
						<view>预售许可证</view>
						<view>发证时间</view>
						<view>对应楼栋</view>
					</view>
					<view class="iTbaleContent" v-for="(item,index) in info.building" :key="index" :class="{iTbaleContentFlag:!item.show}">
						<view>{{item.license}}</view>
						<view>{{item.issue_date}}</view>
						<view>{{item.title}}</view>
					</view>
				</view>
				<view class="iArrow" @tap="license">
					{{iArrowFlag}}
					<uni-icon class="iArrowIcon" :type="uniIsconArrowFlag" size="20" color="#6e94b6"></uni-icon>
				</view>
				</template>
			</view>
		</view>
		
		<view class="baseInfo salesInfo surrounding">
			<view>
				{{info.title}}周边设施
			</view>
			<view>
				<view>
					<text>交通：</text>
				</view>
				<view>
					<u-parse v-if="info.jtzk" class="uParse" :content="info.jtzk" />
					<text v-else>待定</text>
				</view>
				
				<view>
					<text>周边配套：</text>
				</view>
				<view>
					<u-parse v-if="info.zbpt" class="uParse" :content="info.zbpt" />
					<text v-else>待定</text>
				</view>
			</view>
		</view>
		
		<view class="baseInfo salesInfo planning">
			<view>
				{{info.title}}小区规划
			</view>
			<view>
				<view>
					<text>占地面积：</text>
					<text>{{info.zdmj ? info.zdmj : '待定'}}</text>
				</view>
				<view>
					<text>建筑面积：</text>
					<text>{{info.jzmj ? info.jzmj : '待定'}}</text>
				</view>
				<view>
					<text>容积率：</text>
					<text>{{info.rjl ? info.rjl : '待定'}}</text>
				</view>
				<view>
					<text>绿化率：</text>
					<text>{{info.lhl ? info.lhl : '待定'}}</text>
				</view>
				<view>
					<text>停车位：</text>
					<text>{{info.park ? info.park : '待定'}}</text>
				</view>
				<view>
					<text>总户数：</text>
					<text>{{info.hs ? info.hs : '待定'}}</text>
				</view>
				<view>
					<text>物业公司：</text>
					<text>{{info.company ? info.company : '待定'}}</text>
				</view>
				<view>
					<text>物业管理费：</text>
					<text>{{info.wyf ? info.wyf : '待定'}}</text>
				</view>
			</view>
		</view>
		
		<view class="baseInfo salesInfo introduction">
			<view>
				{{info.title}}项目简介
			</view>
			<view>
				<view :class="{active:falg}">
						<u-parse class="uParse" v-if="info.xmjs" :content="this.falg ? info.shortXmjs : info.xmjs" />
					<text v-else>
						暂无简介
					</text>
					<view class="iActive" @tap="goActive" v-if="info.isLongXmjs">
						<text>{{activeItem}}</text>
						<uni-icon :type="iUniIcon" size="20" color="#6e94b6"></uni-icon>
					</view>
				</view>
			</view>
		</view>
		
		<view class="statement">
			<view>
				<text>
					免责声明：本站楼盘信息旨在为用户提供更多信息的无偿服务，信息以政府部门登记备案为准，请谨慎核查。
				</text>
			</view>
		</view>
		
		<share-popup :show="show" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import sharePopup from "../../components/sharePopup.vue";
	import fzgIcon from '../../components/fzg-icon/index.vue'
	import uniIcon from '../../components/uni-icon/uni-icon.vue'
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default{
		data(){
			return{
				show:false,
				falg:true,
				activeItem:"展开",
				iUniIcon:"arrowdown",
				id:'',
				info:'',
				iTbaleContentFlag:false,
				iArrowFlag:"展开",
				uniIsconArrowFlag:"arrowdown",
				site:''
			}
		},
		components:{
			sharePopup,
			fzgIcon,
			uniIcon,
			uParse
		},
		onLoad(option) {
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			// #ifdef H5
			this.site = option.site ? option.site : this.$city;
			this.getData();
			// #endif
			// #ifndef H5
			if(uni.getStorageSync('houseDetails')){
				this.info = uni.getStorageSync('houseDetails');
				this.shareParams = {
					title:this.info.title,
					desc:this.info.abstract,
					img: this.info.thumb,
					link:this.info.weburl
				};
			}
			// #endif
		},
		methods:{
			license(){
				if(!this.iTbaleContentFlag){
					this.info.building.map((item,index) => {
						index > 2 && (item.show = 1);
					})
				}else{
					this.info.building.map((item,index) => {
						index > 2 && (item.show = 0);
					})
				}
				this.iTbaleContentFlag = !this.iTbaleContentFlag;
				this.iArrowFlag = this.iTbaleContentFlag ? "收起" : "展开";
				this.uniIsconArrowFlag = this.iTbaleContentFlag ? "arrowup" : "arrowdown";
			},
			pop(){
				this.show=true;
			},
			closePoP(){
				this.show = false;
			},
			goActive(){
				this.falg=!this.falg;
				this.iUniIcon=this.falg?"arrowdown":"arrowup"
				this.activeItem=this.falg?"展开":"收起";
			},
			goMap(){
				let data = {
					id:this.id,
					title:this.info.title,
					address:this.info.address,
					price:this.info.price,
					thumb:this.info.thumb,
					lng:this.info.dt_lng,
					lat:this.info.dt_lat,
					zbpt:this.info.zbpt,
					jtzk:this.info.jtzk
				};
				uni.navigateTo({
					url:`/pages/house/map?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
			// #ifdef H5
			getData(){
				let params = { id: this.id };
				this.$http.get(this.$api.siteApi(this.site, 'houseView'), { data: params }).then(res => {
					if (res.data.code == 0) {
						this.shareParams = {
							title:res.data.data.title,
							desc:res.data.data.abstract,
							img: res.data.data.thumb,
							link:res.data.data.weburl
						};
						// #ifdef H5
						if (this.$wechat && this.$wechat.isWeixin()) {
							this.shareParams.link = window.location.href;
							this.$wechat.share(this.shareParams);
						}
						// #endif
						this.info = res.data.data;
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none'});
					}
				})
				.catch(error => {
					uni.showToast({ title: '加载数据失败', icon: 'none'});
				});
			},
			// #endif
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
				path: '/pages/house/detail',
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		},
		// #endif
	}
</script>
<style lang="less" scoped>
	.details{
		background-color: #F9F9F9;
		.baseInfo{
			background-color: #ffffff;
			padding: 0 20rpx 30rpx;
			&>view:nth-child(1){
				height: 111rpx;
				line-height: 111rpx;
				color: #3f3f3f;
				font-size: 32rpx;
				border-bottom: 1px solid #E5E5E5;
				font-weight: bold;
			}
			&>view:nth-child(2){
				&>view{
					margin-top: 30rpx;
					&>text{
						font-size: 32rpx;
						color: #3f3f3f;
					}
				}
				.viewAddress{
					color: #3f3f3f;
					font-size: 32rpx;
					display: flex;
					justify-content: space-between;
					.sectionName2{
						flex: 1;
					}
					.iUniIcon{
						margin-left: 10rpx;
						display: flex;
						align-items: center;
					}
				}
			}
		}
		.salesInfo{
			margin-top: 24rpx;
			.iTable{
				border: 1px solid #E5E5E5;
				box-sizing: border-box;
				.iTbaleTitle{
					display: flex;
					justify-content: space-around;
					font-size: 28rpx;
					color: #000000;
					height: 71rpx;
					border-bottom: 1px solid #e5e5e5;
					box-sizing: border-box;
					&>view{
						width: calc(100%/3);
						border-right: 1px solid #E5E5E5;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					&>view:last-child{
						border-right: none;
					}
				}
				.iTbaleContent{
					box-sizing: border-box;
					display: flex;
					justify-content: space-around;
					font-size: 24rpx;
					color: #9e9e9e;
					height: 97rpx;
					border-bottom: 1px solid #e5e5e5;
					&>view{
						width: calc(100%/3);
						border-right: 1px solid #E5E5E5;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;
						text-align: center;
					}
					&>view:first-child{
						padding: 0 20rpx;
					}
					&>view:last-child{
						border-right: none;
					}
				}
				.iTbaleContentFlag{
					display: none;
				}
				.iTbaleContent:last-child{
					border:none;
				}
			}
			.iArrow{
				font-size: 28rpx;
				color: #6e94b6;
				text-align: center;
			}
		}
		.surrounding{
			&>view:nth-child(2){
				&>view:nth-child(2){
					&>text{
						overflow: hidden;
						display: block;
						text-align: justify;
						line-height: 170%;
					}
				}
			}
		}
		.introduction{
			&>view:nth-child(2){
				&>view{
					&>.uParse{
						overflow: hidden;
						display: block;
						text-align: justify;
						line-height: 170%;
					}
					&>text{
						overflow: hidden;
						display: block;
						text-align: justify;
						line-height: 170%;
					}
				}
				.active{
					word-break:break-all;
					display:-webkit-box;
					-webkit-line-clamp:3;
					-webkit-box-orient:vertical;
					overflow:hidden; 
				}
				.iActive{
					text-align: center;
					&>text{
						color: #6e94b6;
						font-size: 28rpx;
						margin-right: 5rpx;
					}
					.iFzgIcon{
						position: relative;
						top: 5rpx;
					}
				}
			}
		}
		.statement{
			background-color: #F0F0F0;
			padding: 35rpx 20rpx;
			&>view{
				line-height: 100%;
				&>text{
					font-size: 26rpx;
					color: #cccccc;
				}
			}
		}
	}
	
	.uParse {
		font-size: 16px;
		color: #333;

	}
</style>
