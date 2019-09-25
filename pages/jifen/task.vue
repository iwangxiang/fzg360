<template>
	<view class="taskContainer">
		<view class="taskList" v-for="(item,index) in info" :key="index" v-if="item.showtimes_state">
			<view>{{item.name}} {{item.maxtime}} {{item.operate_unit}}</view>
			<view v-if="index == 'bindaccount'" :class="{complete:bindNum}"><text>{{bindNum}}</text>/{{item.maxtime}}</view>
			<view v-else :class="{complete:item.vilid_time}"><text>{{item.vilid_time}}</text>/{{item.maxtime}}</view>
		</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			uniIcon,
			fzgIcon,
		},
		data() {
			return {
				info:{},
				bindNum:0,
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad(option) {
			uni.$once('login',() => { //监听登录事件
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/jifen/task');
				return;
			}
			this.getData();
		},
		methods: {
			getData() {
				this.$http.get(this.$api.userApi('userpointinfo')).then(res => {
					if (res.data.status) {
						this.bindNum = res.data.info.bindnum;
						this.info = res.data.info;
					} else {
						uni.showToast({ title: res.data.info, icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
		}
	}
</script>
<style lang="less">
	page {
		background: #F7F7F7;
		height: 100%;
	}

	.boder {
		border: solid 1px transparent;
	}

	.bg-gray {
		background-color: #f7f7f7;
	}

	.bg-red {
		background-color: #e83836;
	}

	.bg-red1 {
		background-color: #cd0402;
	}

	.bg-white {
		background-color: #fff;
	}

	.pad10 {
		padding: 20rpx;
	}

	.fontGray {
		color: #9e9e9e;
	}

	.uniRow {
		display: flex;
		flex-direction: row;
	}

	.uniColumn {
		display: flex;
		flex-direction: column;
	}

	.font-gray {
		color: #9e9e9e;
	}

	.font-red {
		color: #e83836;
	}

	.taskContainer {
		.taskList {
			position: relative;
			padding: 12px 10px;
			.bg-white();
			.uniRow();
			justify-content: space-between;
			align-content: center;
			font-size: 30rpx;
			&:after {
				position: absolute;
				z-index: 9;
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
			.complete{
				text{
					.font-red();
				}
			}
		}
	}
</style>
