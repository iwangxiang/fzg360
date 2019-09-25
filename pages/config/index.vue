<template>
	<view class="setBox">
		<view class="setList">
			<view class="setCon" v-for="(item,index) in setList" :key=index @tap="goPath(item)">
				<view class="setListLeft">
					<fzg-icon class="fzgIconSelect" :type="item.type" size="18" color="#f65a56"></fzg-icon>
					<text>{{item.text}}</text>
				</view>
				<!-- #ifdef APP-PLUS -->
				<uni-icon v-if="index!=3&&index!=4" type="arrowright" color="#9e9e9e" size="18" class="arrowRight"></uni-icon>
				<view v-else-if="index==3" class="textRight">{{cacheSize ? cacheSize : ''}}</view>
				<view v-else></view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import {mapState,mapMutations} from 'vuex'
	export default {
		components: {
			uniIcon ,
			fzgIcon,
		},
		data() {
			return {
				setList:[
					{text:"推送设置",type:"news",path:"/pages/config/push"},
					{text:"关于房掌柜",type:"question",path:"/pages/config/about"},
					{text:"意见反馈",type:"feedback",path:"/pages/config/feedback"},
					{text:"清除缓存",type:"delete",},
					{text:"退出登录",type:"backout",},
				],
				cacheSize:'', //缓存大小
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.cache.calculate((size) => {
				console.log( "Application cache size: " + size + " byte!" );
				this.cacheSize = Math.round(size/1024/1024*100)/100+'MB';
			});
			// #endif
			// #ifndef APP-PLUS
			this.setList.splice(3, 1);
			/* try {
				const res = uni.getStorageInfoSync();
			    console.log(res.keys);
			    console.log(res.currentSize);
			    console.log(res.limitSize);
				this.cacheSize = Math.round(res.currentSize/1024*100)/100+'MB';
			} catch (e) {
			    // error
			} */
			// #endif
		},
		computed: mapState(['hasLogin']),
		methods: {
			...mapMutations(['logout']),
			goPath(item){
				//console.log(item.type)
				if(item.type == 'delete'){
					// #ifdef APP-PLUS
					plus.cache.clear(() => { //Can't find variable: window;
						console.log( "Clear application cache successful!" );
						this.cacheSize = 0;
					});
					// #endif
					// #ifdef APP-PLUS
					/* uni.getStorageInfo({
						success: function (res) {
							for(let i = 0; i < res.keys.length; i++){
								if(res.keys[i] !== 'userInfo') uni.removeStorageSync(res.keys[i]);
							}
						}
					}); */
					// #endif
					//uni.clearStorage();
					uni.showToast({title:'清理缓存成功',icon:'none'});
					return;
				}
				if(item.type == 'backout'){
					if (this.hasLogin) {
						this.logout();
						uni.showToast({title:'退出登录成功',icon:'none'});
						uni.$emit('logout');
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/user/index'
							});
						},500)
					} else {
						uni.redirectTo({
							url: '../user/login'
						});
					}
					return;
				}
				uni.navigateTo({
					url:item.path
				})
			}
		}
	}
</script>

<style lang="less">
page{background-color: #F7F7F7;}
.setBox{
	.boder{border: solid 1px transparent;}
	.bg-gray{ background-color: #f7f7f7;}
	.bg-red{background-color: #e83836;}
	.bg-white{ background-color: #fff;}
	.bg-red1{ background-color: #cd0402;}
	.fontGray{color: #9e9e9e;}
	.uniRow{
		display: flex;	
		flex-direction:row;
		}
	.uniColumn{
		display: flex;
		flex-direction: column;
		}
	.setList{
		padding: 0 14px;
		.bg-white();
		.setCon{
			height: 80rpx;
			line-height: 80rpx;
			.uniRow();
			position: relative;
			justify-content: space-between;
			align-items: center;
			&:after{
			position: absolute;
			z-index:9;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(.5);
			-ms-transform: scaleY(.5);
					transform: scaleY(.5);
			background-color: #e5e5e5;
			}
			&:last-child:after{
				 background-color: transparent;
			}
			.setListLeft{
				font-size: 28rpx;
				text{ margin-left:10px;}
			}
		}
		.textRight{ color: #9e9e9e; font-size: 28rpx;}
	}
}
</style>