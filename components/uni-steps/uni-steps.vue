<template>
	<view class="stepsBox">
		<view v-for="(item,index) in options" :key="index" :class="{'stepsProcess':index === active,'stepsFinish':index < active}"
		 class="stepsItems">
			<view  class="stepsItemIitle">
				<fzg-icon :color="index === active ? activeColor : ''" :type="item.type"  size="20"></fzg-icon>
			</view>
			<view class="stepsChild">
				<view v-if="index !== active" :style="{backgroundColor:index < active ? activeColor : ''}" class="circle"></view>
				<uni-icon v-else :color="activeColor" type="checkbox-filled" size="14" />
			</view>
			<view v-if="index !== options.length-1" :style="{backgroundColor:index < active ? activeColor : ''}" class="line"></view>
			<view :style="{color:index === active ? activeColor : ''}" class="stepsItemIitle">
				<view class="title">{{item.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '../uni-icon/uni-icon.vue'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	export default {
		name: 'UniSteps',
		components: {
			uniIcon,
			fzgIcon
		},
		props: {
			activeColor: {
				// 激活状态颜色
				type: String,
				default: '#e83836'
			},
			active: { // 当前步骤
				type: Number,
				default: 0
			},
			options: {
				type: Array,
				default () {
					return []
				}
			} // 数据
		},
		data() {
			return {}
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
		display: block;
		width: 100%;
		height: 100%;
	}

	.uniRow {
		display: flex;
		flex-direction: row;
	}

	.uniColumn {
		display: flex;
		flex-direction: column;
	}

	.bg-gray {
		background-color: #9e9e9e;
	}

	.stepsBox {
		box-sizing: border-box;
		.uniRow();
		overflow: hidden;
		position: relative;
		margin: 10px;

		.stepsItems {
			flex: 1;
			.uniColumn();
			position: relative;
			height:60px;
			justify-content: space-between;

			.title {
				font-size: 12px;
				text-align: center;
			}

			.line {
				.bg-gray();
				position: absolute;
				bottom: 50%;
				margin-bottom: -4px;
				left: 0;
				width: 100%;
				height: 1px
			}

			.stepsItemIitle {
				text-align: center;
				margin-left: 3px;
				display: inline-block;
				transform: translateX(-50%);
				color: #999;
			}

			.stepsChild {
				position: absolute;
				bottom: 50%;
				left: -8px;
				margin-bottom: -6px;
				padding: 0 8px;
				background-color: #fff;
				z-index: 1;
				line-height: normal !important;

				.circle {
					width: 5px;
					height: 5px;
					.bg-gray();
					border-radius: 50%;

				}
			}

			&:last-child {
				position: absolute;
				right: 0;

				.stepsItemIitle {
					text-align: right;
					transform: none;
					text-align: right;

					.title {
						text-align: right;
					}
				}

				.stepsChild {
					left: auto;
					right: -8px;
				}
			}

			&:first-child {
				.stepsItemIitle {
					transform: none;
					margin-left: 0;
					text-align: left;

					.title {
						text-align: left;
					}
				}
			}
		}

		.stepsFinish {
			.stepsItemIitle {
				color: #333;
			}
		}

		.stepsProcess {
			.stepsChild {
				bottom: 50%;
				margin-bottom: -10px;
				display: flex;
			}
		}
	}
</style>
