<template>
	<view class="pswCon">
		<view class="pswList">
			<view class="pwsLeft">中国+86</view>
			<view class="pwsRight">
				<input class="" type="number" v-model="tel" placeholder="请输入手机号码" maxlength="11" @input="changeActive" placeholder-style="color:#9e9e9e;"/>
			</view>
		</view>
		<button type="primary" class="pwsButtom" :class="{active: pwsButtom}" hover-class="" @click="doSubmit">下一步</button><!--输入电话时增加样式active-->
	</view>
</template>
<script>
	export default {
    data() {
        return {
			tel:'', //手机号
			pwsButtom:false,
		}
    },
    methods: {
		changeActive(){
			this.pwsButtom=true;
		},
		doSubmit(){
			if(!this.pwsButtom) return;
			if(!this.tel || this.tel.length !== 11 || !/^1[345678]\d{9}$/.test(this.tel)){
				uni.showToast({icon: 'none',title: '手机号不正确'});
				return false;
			}
			let params = {tel:this.tel};
			this.$http.post(this.$api.userApi('pwGetCode'), {data: params}).then(res => {
				if(res.data.status){
					uni.setStorageSync('code',res.data.info);
					uni.setStorageSync('tel',this.tel);
					uni.navigateTo({
						url: './getpwRes'
					});
				}else{
					uni.showToast({title:res.data.info,icon:'none'});
				}
			}).catch(error => {
				console.error('error:',error);
			});
		}
    }
}
</script>

<style lang="less">
page{
	 background-color: #f7f7f7;
	}
.uniRow{
	display: flex;	
	flex-direction:row;
	}
.bg-gray{background-color: #666;}
.bg-red{background-color: #e83836;}
.pswCon{
	.pswList{
		position: relative;
		background-color: #fff;
		padding: 15rpx 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		.uniRow();
		justify-items: center;
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
		.pwsLeft{
			border-right:solid 1px #e5e5e5;
			font-size: 28rpx;
			padding-right:20rpx;
			line-height: 52rpx;
		}
		.pwsRight{
			flex: 1;
			padding: 0 20rpx;
		}
	}
	.pwsButtom{
		width:42.6%;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 32rpx;
		margin: 100rpx auto;
		background-color: #666666;
		.bg-gray()
	}
	& .active{
		.bg-red();
	}
} 
</style>
