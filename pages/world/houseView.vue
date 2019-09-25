<template>
	<view class="houseView">
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="(item,index) in pics" :key="index">
							<view class="swiper-item uni-bg-red">
								<image :src="item.thumb" @tap="goPic()"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view>
			<view>{{info.subject}}</view>
			<view>{{info.zjloc}} | {{info.zjrmb}}万</view>
			<view>物业类型：{{info.ccid12title}}</view>
			<view>产权：{{info.chanquan}}</view>
			<view v-show="baseOpen">
				<view>主力户型：{{info.zhulihx}}</view>
                <view v-if="info.jgsm">价格说明：{{info.jgsm}}</view>
                <view v-if="info.zjfirst">首付：{{info.zjfirst}}</view>
                <view v-if="info.syhs>'0'">剩余套数：{{info.syhs}}</view>
				<view v-if="info.kaipanshijian">开盘时间：{{info.kaipanshijian}}</view>
                <view v-if="info.ruzhushiqi">交房时间：{{info.ruzhushiqi}}</view>
                <view>所在城市：{{info.ccid1title}} - {{info.ccid2title}}</view>
				<!--view>土地面积：8813（㎡）</view-->
				<!--view>建筑面积：74.25（㎡）</view-->
				<!--view>开发商：鑫苑置业</view-->
				<!--view>户数：100户</view-->
				<!--view>容积率：76%</view-->
				<!--view>停车位描述：各户型均带车位</view-->
			</view>
			<view class="iActive" @tap="baseAct()">
				{{baseName}}
				<uni-icon class="iUniIcon" :type="baseIcon" size="20" color="#919191"></uni-icon>
			</view>
		</view>
		<view>
			<view><text>地理位置</text></view>
			<view>地址：{{info.address}}</view>
			<view @tap="goMap()"><image :src="mapUrl(info)"></image></view>  
		</view>
		<view>
			<view><text>配套信息</text></view>
			<view class="details">
				<text :class="{closed:!equipOpen}">
                    {{info.zhoubianjieshao}}<!--\n第一行\n第二行
                    第3行-->
				</text>
				<view class="iActive" @tap="equipAct">
					{{equipName}}
					<uni-icon class="iUniIcon" :type="equipIcon" size="20" color="#919191"></uni-icon>
				</view>
			</view>
		</view>
		<view>
			<view><text>{{info.ccid1title}}购房费用</text></view>
			<view class="details">
				<text :class="{closed:!feeOpen}">
                    {{feelists}}
				</text>
				<view class="iActive" @tap="feeAct">
					{{feeName}}
					<uni-icon class="iUniIcon" :type="feeIcon" size="20" color="#919191" style="display:inline;"></uni-icon>
				</view>
			</view>
		</view>
		<view>
			<view><text>{{info.ccid2title}}综合概述</text></view>
			<view class="details">
				<text :class="{closed:!cityOpen}">
                    {{cities}}<!--\n第0a行\n第0b行
                    第03行-->
				</text>
				<view class="iActive" @tap="cityAct">
					{{cityName}}
					<uni-icon class="iUniIcon" :type="cityIcon" size="20" color="#919191"></uni-icon>
				</view>
			</view>
		</view>
		<view>
			<view>
				<text><!--{{info.ccid1title}}热门房产-->推荐房源</text>
				<view @tap="$tool.nav('world/houseList')">
					更多
					<uni-icon class="iUniIcon" type="forward" size="20" color="#919191"></uni-icon>
				</view>
			</view>
            <view class="worldList">
                <world-house v-for="item in house" :key="item.aid" :row="item"></world-house>
            </view>
		</view>
		<share-popup :show="show" :shareParams="shareParams" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import sharePopup from "../../components/sharePopup.vue";
	import uniIcon from '../../components/uni-icon/uni-icon.vue'
	import worldHouse from '../../components/worldHouse.vue'
	export default{
		data(){
			return{
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				
				baseOpen:false,
				baseName:"展开",
				baseIcon:"arrowdown",
				
				equipOpen:false,
				equipName:"展开",
				equipIcon:"arrowdown",
				
				feeOpen:false,
				feeName:"展开",
				feeIcon:"arrowdown",
				
				cityOpen:false,
				cityName:"展开",
				cityIcon:"arrowdown",
				
				show:false,
                aid:0,
                info:{},
                pics:[],
                house:[],
                feelists:'',
                cities:'',
				shareParams:''
			}
		},
		components:{
			sharePopup,
			uniIcon,
			worldHouse
		},
        onLoad(option) { 
			if (!option || !option.aid) {
				uni.navigateBack();
				return;
			}
            this.aid = option.aid;
        	this.getData();
        },
		methods:{
            getData(){ 
                let params = {aid:this.aid};
            	this.$http.get(this.$api.worldApi('houseDetail'), {data: params}).then(res => {
                    //console.log(res.data)
					this.shareParams = {
						title:res.data.info.subject,
						desc:res.data.info.abstract,
						img: res.data.info.thumb,
						link:res.data.info.moburl
					};
					// #ifdef H5
					if (this.$wechat && this.$wechat.isWeixin()) {
						this.shareParams.link = window.location.href;
						this.$wechat.share(this.shareParams);
					}
					// #endif
                    this.info = res.data.info;
                    this.pics = res.data.pics;
                    this.house = res.data.house;
                    this.feelists = res.data.feelists;
                    this.cities = res.data.cities;
                    uni.setNavigationBarTitle({title:this.info.subject})
            	}).catch(error => {
            		uni.showToast({title:'加载数据失败'});
            	})
            },
			closePoP(){
				this.show = false;
			},
			baseAct(){ // 基本信息
				this.baseOpen=!this.baseOpen;
				this.baseIcon=this.baseOpen?"arrowup":"arrowdown";
				this.baseName=this.baseOpen?"收起":"展开";
			},
			equipAct(){ // 配套信息
				this.equipOpen=!this.equipOpen;
				this.equipIcon=this.equipOpen?"arrowup":"arrowdown";
				this.equipName=this.equipOpen?"收起":"展开";
			},
			feeAct(){ // 费用信息
				this.feeOpen=!this.feeOpen;
				this.feeIcon=this.feeOpen?"arrowup":"arrowdown";
				this.feeName=this.feeOpen?"收起":"展开";
			},
			cityAct(){ // 城市介绍
				this.cityOpen=!this.cityOpen;
				this.cityIcon=this.cityOpen?"arrowup":"arrowdown";
				this.cityName=this.cityOpen?"收起":"展开";
			},
            mapUrl(info){ // 这里保留`upx2px`方法
                let pos = info.dt_1+','+info.dt_0, title = info.subject ? encodeURI(info.subject) : ''; 
                let baseUrl = 'http://api.map.baidu.com/staticimage?zoom=12'
                let param = '&width='+uni.upx2px(716)+'&height='+uni.upx2px(320)+'&center='+pos+'&markers=0|'+pos+'' // '+title+'
                return baseUrl + param
            },
			goPic(){
                let row = this.info;
				uni.navigateTo({
					url:"/pages/world/housePics"+'?aid='+row.aid
				})
			},
            goMap(){
                let row = this.info;
                let url = this.$api.apiTab().worldUrl + 'etools/mapos.html'
                let title = row.subject;
                let point = row.dt_1+','+row.dt_0;
                url += '?point='+point+'&title='+title+'&conv=1&';
                let param = "?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(title)
                uni.navigateTo({
                	url:"/pages/index/webView" + param
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
				title: this.shareParams.subject,
				path: '/pages/world/houseView?aid='+this.aid,
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		},
		// #endif
	}
</script>

<style lang="less" scoped>
    .worldList{
		padding: 0 20rpx;
    	display: flex;
    	flex-wrap: wrap;
    	justify-content: space-between;
    }
    .details{ font-size:small; line-height:200%; color:#585858; padding:0.3rem 1rem; }
    .closed{ /*收缩为3行*/
    	word-break:break-all;
    	display:-webkit-box;
    	-webkit-line-clamp:5;
    	-webkit-box-orient:vertical;
    	overflow:hidden; 
    }
	.houseView{
		.uni-padding-wrap{
			.swiper {
				height: 382rpx;
			}
			.swiper-item {
				height: 382rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.swiper-list {
				margin-top: 40rpx;
				margin-bottom: 0;
			}
			.uni-common-mt{
				margin-top:60rpx;
				position:relative;
			}
			.info {
				position: absolute;
				right:20rpx;
			}
		}
		&>view:nth-child(2){
			padding: 0 20rpx;
			box-sizing: border-box;
			& view{
				margin-top: 20rpx;
				font-size: 30rpx;
			}
			.iActive{
				text-align: center;
				color: #919191;
				font-size: 26rpx;
				.iUniIcon{
					position: relative;
					bottom: 13rpx;
				}
			}
		}
		&>view:nth-child(3){
			margin-top: 20rpx;
			&>view:nth-child(1){
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;
				&>text{
					margin-left: 40rpx;
				}
			}
			&>view:nth-child(2){
				font-size: 24rpx;
				color: #333333;
				margin: 20rpx;
			}
			&>view:nth-child(3){
				padding: 0 20rpx;
				height: 320rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		&>view:nth-child(4){
			margin-top: 20rpx;
			&>view:nth-child(1){
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;
				&>text{
					margin-left: 40rpx;
				}
			}
			&>view:nth-child(2){
				.iOpen{
					height: 220rpx;
					overflow: hidden;
				}
				.iActive{
					text-align: center;
					color: #919191;
					font-size: 26rpx;
					margin-top: 20rpx;
				}
			}
		}
		&>view:nth-child(5){
			margin-top: 20rpx;
			&>view:nth-child(1){
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;
				&>text{
					margin-left: 40rpx;
				}
			}
			&>view:nth-child(2){
				padding: 0 20rpx;
				&>view:nth-child(1),&>view:nth-child(2){
					font-size: 30rpx;
					&>view{
						display: flex;
						justify-content: space-between;
						margin-top: 20rpx;
						&>text:nth-child(1){
							width: 150rpx;
							color: #919191;
							display: block;
						}
						&>text:nth-child(2){
							width: 560rpx;
							color: #333333;
							display: block;
						}
					}
				}
				.iActive{
					text-align: center;
					color: #919191;
					font-size: 26rpx;
					margin-top: 20rpx;
				}
			}
		}
		&>view:nth-child(6){
			margin-top: 20rpx;
			&>view:nth-child(1){
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;
				&>text{
					margin-left: 40rpx;
				}
			}
			&>view:nth-child(2){
				&>view{
					font-size: 30rpx;
					color: #919191;
					padding: 0 20rpx;
					margin-top: 20rpx;
					line-height: 170%;
					overflow: hidden;
					display: block;
					text-align: justify;
					line-height: 170%;
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
					color: #919191;
					font-size: 26rpx;
					.iUniIcon{
						position: relative;
						bottom: 5rpx;
					}
				}
			}
		}
		&>view:nth-child(7){
			margin-top: 20rpx;
			&>view:nth-child(1){
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #383838;
				background: #f7f7f7 url(../../static/iconArticle.jpg) 20rpx 15rpx no-repeat;
				background-size: 6rpx 36rpx;
				display: flex;
				justify-content: space-between;
				&>text{
					margin-left: 40rpx;
				}
				&>view{
					margin-right: 10rpx;
				}
			}
		}
	}
</style>
