<template>
	<view class="city" @tap="closeExpand">
		<view class="search">
			<input type="text" @input="onKeyInput" @confirm="doSearch" @blur="doSearch" placeholder="请输入城市中文或拼音首字母">
			<view class="expand" v-if="expand">
				<view v-if="searchList.length" v-for="(item,index) in searchList" :key="index" @tap="bindClick({site:item.shortname,name:item.cnname})">{{item.cnname}}</view>
				<view v-if="!searchList.length">暂无搜索结果</view>
			</view>
		</view>
		<view class="address">
			<view>
				<text>当前城市定位：</text>
				<text @tap="bindClick({site:city,name:cityName})">{{cityName}}</text>
				<text>GPS定位</text>
			</view>
			<uni-icon class="uniIconLoop" type="loop" size="20" color="#666666" @tap="getData(0)"></uni-icon>
		</view>
		<view class="access" v-if="visitedCitys.length">
			<view>
				<text>最近访问城市</text>
			</view>
			<view>
				<view v-for="(item,index) in visitedCitys" :key="index">
					<text @tap="bindClick(item)">{{item.name}}</text>
				</view>
			</view>
		</view>
		<uni-indexed-list :showSelect="false" @click="bindClick" />
	</view>
</template>

<script>
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import {uniIcon} from '@dcloudio/uni-ui'
	// #ifdef APP-PLUS || MP-WEIXIN
	import amap from '@/common/amap-wx.js'
	import {aMapWxKey} from '@/common/cfgs'
	// #endif
	export default {
		components: {
			uniIndexedList,
			fzgIcon,
			uniIcon
		},
		data() {
			return {
				expand:false,
				city:'',
				cityName:'定位中',
				address:'',
				amapPlugin: null,
				visitedCitys:[], //访问过的城市
				keyword:'', //关键字
				cityList:[], //所有城市
				searchList:[], //搜索城市结果
				type:'',
			}
		},
		onLoad(option){
			/*uni.removeStorage({
				key: 'locateCityName',
			})*/
			// #ifdef APP-PLUS || MP-WEIXIN
			this.amapPlugin = new amap.AMapWX({  
				key: aMapWxKey
			});
			// #endif
			if(option) this.type = option.type;
			let locateCity = uni.getStorageSync('locateCity'),locateCityName = uni.getStorageSync('locateCityName');
			this.city = locateCity ? locateCity : '';
			this.cityName = locateCityName ? locateCityName : '定位中';
			if(this.cityName == '定位中'){
				this.getData(1);
			}
			if(uni.getStorageSync('visitedCitys')){
				this.visitedCitys = uni.getStorageSync('visitedCitys').reverse() || [];
			}
			this.getCity();
		},
		methods: {
			back(){
				uni.navigateBack();
			},
			closeExpand(){
				this.expand=false;
			},
			goExpand(){
				this.expand=true;
			},
			onKeyInput: function(event) {
				this.searchList = [];
				this.keyword = event.target.value;
				this.doSearch();
			},
			doSearch(){ //关键字搜索
				if(!this.keyword){
					this.expand = false;
					return;
				}
				this.expand = true;
				let count = 0;
				for(let i in this.cityList){
					if(this.cityList[i].searchValue.indexOf(this.keyword.toLowerCase()) >= 0){
						this.searchList[count++] = this.cityList[i];
					}
				}
				//console.log(this.searchList)
			},
			saveCity(city,cityName){
				uni.setStorageSync('city',city);
				uni.setStorageSync('cityName',cityName)
			},
			bindClick(e) {
				if(this.visitedCitys.length){
					for(let i = 0; i < this.visitedCitys.length; i++){
						if(e.site == this.visitedCitys[i].site){
							this.visitedCitys.splice(this.visitedCitys.findIndex(item => item.site === e.site), 1);
							break;
						}
					}
					if(this.visitedCitys.length >= 6){
						this.visitedCitys.shift();
					}
				}				
				this.visitedCitys.push({'site':e.site,'name':e.name});
				uni.setStorageSync('visitedCitys',this.visitedCitys);
				let storageCity = uni.getStorageSync('city') || '';
				if(e.site == storageCity){
					uni.navigateBack();
					return;
				}
				this.saveCity(e.site,e.name);
				uni.$emit('changeCity',{city:e.site,cityName:e.name});
				let path;
				// #ifndef APP-PLUS
				path = this.type ? '/pages/news/index1' : '/pages/index/index';
				// #endif
				// #ifdef APP-PLUS
				path = this.type ? '/pages/news/index' : '/pages/index/index';
				// #endif
				uni.reLaunch({url: path});
			},
			getData(status){
				if(this.address){
					uni.showToast({title: this.address,icon:'none'});
					return;
				}
				// #ifdef APP-PLUS || MP-WEIXIN
				this.amapPlugin.getRegeo({  
					success: (res) => {
						this.address = res[0].name;
						if(!status) uni.showToast({title: this.address,icon:'none'});
						this.initCity(res[0].regeocodeData.addressComponent.city);
					}
				});
				// #endif
				// #ifndef APP-PLUS || MP-WEIXIN
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						//console.log('当前位置的经度：' + res.longitude);
						//console.log('当前位置的纬度：' + res.latitude);
						//console.log('当前位置的：' + res.address);
						let params = {longitude:res.longitude,latitude:res.latitude};
						this.$http.get(this.$api.siteApi(this.$city,'getAddress'), {data: params}).then(res => {
							/*console.log(res.data.result)
							console.log(res.data.result.formatted_address)
							console.log(res.data.result.addressComponent.city)*/
							this.address = res.data.data.result.formatted_address;
							if(!status) uni.showToast({title: this.address,icon:'none'});
							this.initCity(res.data.data.result.addressComponent.city);
						}).catch(error => {
							console.error('error:',error);
						});
					}
				})
				// #endif
			},
			getCity(){
				this.$http.get(this.$api.siteApi(this.$city,'cityList')).then(res => {
					let cityList = res.data.data.cityList;
					cityList.forEach((item,index) => {
						item.searchValue = item.cnname+'|'+item.shortname.toLowerCase()+'|'+item.pinyin.toLowerCase();
					})
					this.cityList = cityList;
					//console.log(this.cityList)
				}).catch(error => {
					console.error('error:',error);
				})
			},
			initCity(cityName){
				this.$http.get(this.$api.siteApi(this.$city,'cityData')).then(res => {
					let cityData = res.data.data.citys;
					for(var i in cityData){
						if(~cityName.indexOf(cityData[i].city)){
							this.city = cityData[i].site;
							this.cityName = cityData[i].city;
							uni.setStorageSync('locateCity',cityData[i].site);//定位城市拼音缩写
							uni.setStorageSync('locateCityName',cityData[i].city);//定位城市名
							break;
						}
					}
				}).catch(error => {
					this.city = 'gz';
					this.cityName = '广州';
					uni.setStorageSync('locateCity',this.city);//定位城市拼音缩写
					uni.setStorageSync('locateCityName',this.cityName);//定位城市名
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.example {
		padding: 0 30rpx 30rpx
	}
	.example-title {
		font-size: 32rpx;
		line-height: 32rpx;
		color: #777;
		margin: 40rpx 25rpx;
		position: relative
	}
	.example .example-title {
		margin: 40rpx 0
	}
	.example-body {
		padding: 0 40rpx
	}
	.city{
		.search{
			position: relative;
			input{
				width: 96%;
				background-color: #eeeeee;
				border-radius: 5px;
				margin: 10rpx auto;
				text-align: center;
				font-size: 28rpx;
			}
			.expand{
				width: 92%;
				border: 1px solid #e5e5e5;
				border-top: none;
				position: absolute;
				top: 50rpx;
				left: 4%;
				background-color: #f9f9f9;
				z-index: 999;
				&>view{
					font-size: 30rpx;
					border-bottom: 1px solid #e5e5e5;
					padding: 15rpx 0 15rpx 30rpx;
					box-sizing: border-box;
				}
			}
		}
		.address{
			width: 95%;
			height: 50rpx;
			line-height: 35rpx;
			margin: 0 auto;
			border-top: 1px solid #eaeaea;
			border-bottom: 1px solid #eaeaea;
			margin-bottom: 10rpx;
			display: flex;
			justify-content: space-between;
			&>view:nth-child(1){
				& text{
					font-size: 24rpx;
					color: #666666;
					margin-right: 20rpx;
				}
				&>text:nth-child(3){
					color:#c0c0c0;
				}
			}
			.uniIconLoop{
				margin-top: 5rpx;
			}
		}
		.access{
			width: 95%;
			margin: 0 auto;
			&>view:nth-child(1){
				text{
					font-size: 24rpx;
					color: #666666;
				}
			}
			&>view:nth-child(2){
				display: flex;
				height: 80rpx;
				&>view{
					width: 80rpx;
					height: 50rpx;
					line-height: 35rpx;
					text-align: center;
					background-color: #f0f0f0;
					border-radius: 5px;
					margin: 10rpx 10rpx 0 0;
					text{
						font-size: 24rpx;
						color: #666666;
					}
				}
			}
		}
	}
</style>