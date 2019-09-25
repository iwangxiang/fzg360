<template>
	<view class="findContainer">
		<view id="tab-bar" class="topTab">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="topTapList" :class="tabIndex==index ? 'active' : ''" :id="tab.id"
			 :data-current="index" @click="tapTab">
				<text :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</text>
			</view>
		</view>
		<swiper :current="tabIndex" class="swiperBox" :duration="300" @change="changeTab">
			<!--公积金-->
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<provident-loan></provident-loan>
				</scroll-view>
			</swiper-item>
			<!--商业-->
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<business-loan></business-loan>
				</scroll-view>
			</swiper-item>
			<!--组合-->
			<swiper-item>
				<scroll-view class="list" scroll-y>
					<combination-loan></combination-loan>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>

</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui'
	import providentLoan from '../../components/calculator/providentLoan.vue'
	import businessLoan from '../../components/calculator/businessLoan.vue'
	import combinationLoan from '../../components/calculator/combinationLoan.vue'
	export default {
		components: {
			uniIcon,
			providentLoan,
			businessLoan,
			combinationLoan
		},
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [{
						name: '公积金贷款',
						id: 'gongjijin'
					}, {
						name: '商业贷款',
						id: 'shangye'
					},
					{
						name: '组合贷款',
						id: 'zuhe'
					}
				],
			}
		},
		onLoad() {},
		methods: {
			async changeTab(e) {
				let index = e.target.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #F7F7F7;
		display: block;
		width: 100%;
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

	.pad10 {
		padding: 0 20rpx;
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

	.findContainer {
		.uniColumn();
		flex: 1;
		overflow: hidden;
		height: 100%;

		.list {
			width: 100%;
			height: 100%;
		}

		.topTab {
			width: 100%;
			height: 80rpx;
			.boder();
			border-top-color: #e5e5e5;
			border-bottom-color: #e5e5e5;
			.bg-gray();
			.uniRow();
			.fontGray();
			padding: 7px 0;
			box-sizing: border-box;

			.topTapList {
				text-align: center;
				flex-grow: 1;
				border-right: solid 1px #e5e5e5;
				font-size: 28rpx;
				height: 52rpx;
				line-height: 52rpx;

				&:last-child {
					border-right: none;
				}
			}
		}

		.swiperBox {
			flex: 1;
			width: 100%;
			/* height: calc(100% - 100rpx); 
			height: 100vh;*/
		}

		.active {
			color: #3f3f3f;
			font-weight: bold;

			text {
				position: relative;

				&:after {
					content: '';
					position: absolute;
					left: 0;
					width: 100%;
					height: 5rpx;
					.bg-red();
					border-radius: 20rpx;
					-webkit-border-radius: 20rpx;
					bottom: -9px;
				}
			}
		}
	}
</style>
