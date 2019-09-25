<template>
	<view class="ruleContainer">
		<view class="ruleList" v-for="(item,index) in info" :key="index">
			<view class="list" @tap="doExpand(index)">
				<view style="display: none;">{{bntClass}}</view>
				<view class="boxLeft">
					<view>{{item.name}}</view>
					<view class="right">
						<text>＋{{item.point}}</text>
						<fzg-icon type="coin" size="14" color="#E83836"></fzg-icon>
					</view>
				</view>
				<view :class="item.show?'shut':'open'"></view>
			</view>
			<view class="detailCon" :class="{ uhide:!item.show}">
				<view class="detailList">
					<view><u-parse v-if="item.rule_desc" :content="item.rule_desc" /></view>
				</view>
				<view class="upperLimit">
					{{index == 'bindaccount' ? '合计' : '每日'}}上限：<text>{{Number.parseInt(item.point)*item.maxtime}}</text>
					<fzg-icon type="coin" size="14" color="#E83836"></fzg-icon>
				</view>	
			</view>
		</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import uParse from '@/components/gaoyia-parse/parse.vue';
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				bntClass:true,
				info:{},
			}
		},
		components: {
			uniIcon,
			fzgIcon,
			uParse
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
		},
		onLoad(option) {
			uni.$once('login',() => { //监听登录事件
				this.getData();
			})
			if(!this.hasLogin || !this.userInfo.hash){
				this.$util.ckLogin('/pages/jifen/rule');
				return;
			}
			this.getData();
		},
		methods: {
			doExpand(index){
				for(let i in this.info){
					if(i == index){
						this.info[i].show = !this.info[i].show;
						this.bntClass = !this.bntClass;
						break;
					}
				}
			},
			getData() {
				this.$http.get(this.$api.userApi('pointrule')).then(res => {
					if (res.data.status) {
						this.info = res.data.info;
						for(let i in this.info){
							this.info[i].show = true;
						}
					} else {
						uni.showToast({ title: res.data.info, icon: 'none'});
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			}
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

	.ruleContainer {
		.ruleList {
			.list {
				padding: 12px 10px;
				.bg-white();
				position: relative;
				.uniRow();
				justify-content: space-between;
				align-items: center;
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

				.boxLeft {
					.uniRow();
					margin-right: 10px;
					align-items: center;

					&>view:last-child {
						color: #e83836;
						font-size: 28rpx;
					}
					.right{
						.uniRow();
						align-items: center;
						text{
							margin-right: 5px;
						}
					}

				}

				.shut {
					display: inline-block;
					width: 0;
					height: 0;
					border-right: 6px solid transparent;
					border-left: 6px solid transparent;
					border-bottom: 6px solid #616161;
				}
				.open{
					display: inline-block;
					width: 0;
					height: 0;
					border-right: 6px solid transparent;
					border-left: 6px solid transparent;
					border-top: 6px solid #616161;
				}
			}

			.detailList {
				padding: 10px;

				view {
					font-size: 28rpx;
					.fontGray();
					line-height: 48rpx;
				}
			}
			.upperLimit{
				text-align: right;
				font-size: 24rpx;
				.fontGray();
				position: relative;
				.bg-white();
				padding:8px 10px;
				align-items: center;
				text{
					color: #e83836;
					margin-right: 5px;
				}
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
			}
			.uhide{
				display: none;
			}
		}
	}
</style>
