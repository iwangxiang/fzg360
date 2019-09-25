<template>
	<view class="map">
		<map style="width: 100%;" :style="{height:viewH + 'px'}" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap="markerTap" @callouttap="calloutTap"></map>
		<view class="mapFixed">
			<view @tap="surrounding">
				<fzg-icon class="mapFixedIcon" type="jylocation" :color="surroundingColor" size="15"></fzg-icon>
				<view :style="{color:surroundingColor}">周边配套</view>
			</view>
			<view @tap="traffic">
				<fzg-icon class="mapFixedIcon" type="lxguide" :color="trafficColor" size="15"></fzg-icon>
				<view :style="{color:trafficColor}">交通状况</view>
			</view>
		</view>
		<view class="mask" v-if="maskFlag" @tap="goMask"></view>
		<view class="maskText" v-if="surroundingMask">
			<u-parse class="uParse" v-if="info.zbpt" :content="info.zbpt" @preview="preview" @navigate="navigate" />
			<view class="uParse" v-else>暂无内容</view>
		</view>
		<view class="maskText" v-if="trafficMask">
			<u-parse class="uParse" v-if="info.jtzk" :content="info.jtzk" @preview="preview" @navigate="navigate" />
			<view class="uParse" v-else>暂无内容</view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default{
		data(){
			return{
				viewH:0,
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../static/location_point.png'
				}],
				id:'',
				info:{},
				maskFlag:false,
				surroundingMask:false,
				trafficMask:false,
				surroundingColor:"#6E6E6E",
				trafficColor:"#6E6E6E",
			}
		},
		components:{
			fzgIcon,
			uParse
		},
		onLoad(option){
			if(!option.data){
				uni.navigateBack();
				return;
			}
			const res = uni.getSystemInfoSync();
			this.viewW = res.windowWidth;
			this.viewH = res.windowHeight;
			let data = JSON.parse(decodeURIComponent(option.data));
			//console.log(data)
			if(Object.keys(data).length){
				this.latitude = data.lat;
				this.longitude = data.lng;
				this.id = data.id;
				this.info = data;
				this.covers.push({id:this.id,latitude:this.latitude,longitude:this.longitude,iconPath: '../../static/location_point.png',callout:{content:data.title,textAlign:'center',display: 'ALWAYS'}});
			}
			//console.log(this.info)
		},
		methods:{
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			},
			markerTap(e){
				//console.log(e)
			},
			calloutTap(e){
				//console.log(e)
				uni.openLocation({
					latitude: Number(this.latitude),
					longitude: Number(this.longitude),
					name:this.info.title,
					address:this.info.address,
					success: function () {
						console.log('success');
					}
				})
			},
			surrounding(){
				this.maskFlag=true;
				this.surroundingMask=true;
				this.surroundingColor="#f00";
			},
			traffic(){
				this.maskFlag=true;
				this.trafficMask=true;
				this.trafficColor="#f00";
			},
			goMask(){
				this.maskFlag=false;
				this.surroundingMask=false;
				this.trafficMask=false;
				this.surroundingColor="#6E6E6E";
				this.trafficColor="#6E6E6E";
			}
		}
	}
</script>

<style lang="less" scoped>
	.map{
		.mapFixed{
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			z-index: 7;
			&>view{
				width: 50%;
				font-size: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #6E6E6E;
				box-sizing: border-box;
				.mapFixedIcon{
					margin-right: 20rpx;
				}
			}
			&>view:first-child{
				border-right: 1px solid #E5E5E5;
			}
		}
		.mask{
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background-color: #000000;
			opacity: .3;
			z-index: 8;
		}
		.maskText{
			width: 100%;
			background: rgba(0,0,0,.7);
			position: absolute;
			left: 0;
			bottom: 100rpx;
			z-index: 9;
			padding: 30rpx 0 10rpx 0;
			.uParse{
				font-size: 14px;
				color: #ffffff;
				padding: 0 20rpx;
				/* margin-bottom: 20rpx; */
				width:95%;
			}
		}
	}
</style>
