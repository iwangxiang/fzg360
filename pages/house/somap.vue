<template>
	<view>
		<map id="houseMap" style="width: 100%;" :style="{height:viewH + 'px'}" :latitude="latitude" :longitude="longitude" :markers="covers" show-location="true" @regionchange="regionChange" @markertap="markerTap" @callouttap="calloutTap"></map>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				viewH:0,
				latitude: 23.054725,
				longitude: 113.761382,
				locationCovers:[],
				covers: [],
				houseMap:null,
			}
		},
		components:{
			
		},
		onLoad(option){
			const res = uni.getSystemInfoSync();
			this.viewW = res.windowWidth;
			this.viewH = res.windowHeight;
			this.houseMap = uni.createMapContext('houseMap'); //创建地图实例
			if(option.lat && option.lon){
				this.latitude = option.lat;
				this.longitude = option.lon;
				this.locationCovers.push({latitude:this.latitude,longitude:this.longitude});
				this.getMapInfo(this.latitude,this.longitude);
			}else{
				this.getData();
			}
		},
		methods:{
			regionChange(){ //支付宝小程序没作用？
				this.houseMap.getCenterLocation({
					success:(res) => {
						this.covers = [];
						this.getMapInfo(res.latitude,res.longitude);
					}
				})
			},
			markerTap(e){
				//console.log(e)
				/* let id = '';
				// #ifdef MP
				id = e.markerId;
				// #endif
				// #ifndef MP
				id = e.detail.markerId;
				// #endif
				uni.navigateTo({
					url:'/pages/house/home?id='+id
				}) */
			},
			calloutTap(e){
				//console.log(e)
				let id = '';
				// #ifdef MP
				id = e.markerId;
				// #endif
				// #ifndef MP
				id = e.detail.markerId;
				// #endif
				uni.navigateTo({
					url:'/pages/house/home?id='+id
				})
			},
			getData(){
				this.$http.get(this.$api.siteApi(this.$city,'getCenterPoint')).then(res => {
					if(res.data.code == 0){
						this.latitude = res.data.data.dt_lat;
						this.longitude = res.data.data.dt_lng;
						this.locationCovers.push({latitude:this.latitude,longitude:this.longitude});
						//console.log(this.covers)
						this.getMapInfo(this.latitude,this.longitude);
					}else{
						uni.showToast({title: '加载数据失败',icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title: '加载数据失败',icon:'none'});
				})
			},
			getMapInfo(lat,lng){
				let params = {latitude:lat,longitude:lng};
				this.$http.get(this.$api.siteApi(this.$city,'getMapInfo'), {data: params}).then(res => {
					if(res.data.code == 0){
						let arrays = res.data.data,num = 0;
						this.covers = this.locationCovers;
						arrays.map((item,index) => {
							this.covers = this.covers.concat({
								id:item.id,
								latitude:item.dt_lat,
								longitude:item.dt_lng,
								iconPath:'../../static/location_point.png',
								callout:{
									content:item.title,
									display:'ALWAYS'
								}
							})
							num++;
						})
						let content = num ? '共获取到'+num+'个楼盘' : '没有获取到楼盘';
						uni.showToast({title: content,icon:'none'});
						//console.log(this.covers)
					}else{
						uni.showToast({title: '加载数据失败',icon:'none'});
					}
				}).catch(error => {
					uni.showToast({title: '加载数据失败',icon:'none'});
				})
			}
		}
	}
</script>

<style>
</style>
