<template>
	<view class="faqView">
		<view class="content">
			<view>
				<text>{{ info.subject}}</text>
			</view>
			<view>
				<u-parse v-if="info.content" :content="info.content" />
			</view>
		</view>
		<share-popup :show="show" :shareParams="shareParams" @hidePopup="closePoP"></share-popup>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue";
	import sharePopup from "../../components/sharePopup.vue";
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default{
		onLoad(option){
			if (!option || !option.aid) {
				uni.navigateBack();
				return;
			}
			this.aid = option.aid;
			this.getData(option.aid);
		},
		data(){
			return{
				show:false,
				aid:0,
				info:{},
				shareParams:{},//分享对象
			}
		},
		components:{
			fzgIcon,
			sharePopup,
			uParse
		},
		methods:{
			goBack(){
				uni.navigateBack();
			},
			doPop(){
				this.show=true;
			},
			closePoP(){
				this.show = false;
			},
            getData(aid){ 
				let params = {aid:aid};
            	this.$http.get(this.$api.worldApi('faqDetail'), {data: params}).then(res => {
					if(res.data.status == 1){
						// console.log(res.data);
						this.shareParams = {
							title:res.data.info.subject,
							desc:res.data.info.abstract,
							img: 'http://news.fzg360.com/144x144.png',
							link:res.data.info.moburl
						};
						// #ifdef H5
						if (this.$wechat && this.$wechat.isWeixin()) {
							this.shareParams.link = window.location.href;
							this.$wechat.share(this.shareParams);
						}
						// #endif
						this.info = res.data.info;
					}else{
						uni.showToast({title:'加载数据失败'});
					}
            	}).catch(error => {
            		uni.showToast({title:'加载数据失败'});
					uni.navigateBack();
            	})
            },			
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
				uni.showToast({title:'分享成功',icon:'none'});
			}
			return {
				title: this.shareParams.title,
				path: '/pages/world/faqView?aid='+this.aid,
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		}
		// #endif
	}
</script>

<style lang="less" scoped>
	.faqView{
		.content{
			padding: 32rpx 20rpx 0;
			&>view:nth-child(1){
				background: url(../../static/question.png) 0 10rpx no-repeat;
				background-size: 32rpx;
				&>text:nth-child(1){
					margin-left: 40rpx;
					font-size: 38rpx;
					color: #333333;
				}
			}
			&>view:nth-child(2){
				font-size: 28rpx;
				color: #333333;
				margin-top: 40rpx;
				line-height: 170%;
			}
		}
	}
</style>
