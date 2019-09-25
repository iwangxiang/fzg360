<template>
	<view @tap="goPath(type, item)">
		<!--资讯或专题-->
		<template v-if="item.large_thumb">
			<!-- 大图资讯 -->
			<view class="newsContent newsContent3">
				<view class="newsContent-tit">
					<text>{{ item.title }}</text>
				</view>
				<view class="newsContent3-img">
					<image :src="item.large_thumb ? item.large_thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
				</view>
				<view class="newsContent-txt">
					<view class="newsContent-txt1">
						<view v-if="item.fzgSource"><text>{{item.fzgSource}}</text></view>
						<view v-else>
							<fzg-icon class="browse-icon" type="yuedushu-"></fzg-icon>
							<text>{{ item.hits }}</text>
						</view>
						<!-- <view v-if="item.compoint">
							<fzg-icon class="coin-icon" type="coin"></fzg-icon>
							<text>{{ item.compoint }}积分</text>
						</view> -->
						<text>{{ item.createdate }}</text>
					</view>
					<!-- <view class="newsContent-txt2">
						<text>{{ item.createdate }}</text>
					</view> -->
				</view>
			</view>
		</template>
		<template v-else>
			<!-- 小图资讯 -->
			<view class="newsContent newsContent2" v-if="item.imgs">
				<view class="newsContent-tit">
					<text>{{ item.title }}</text>
				</view>
				<view class="newsContent2-img">
					<view v-for="(img, iiindex) in item.imgs" :key="iiindex" v-if="iiindex < 3">
						<image :src="img ? img : 'https://static.fzg360.com/images/app/nopic.gif'"
						></image>
					</view>
				</view>
				<view class="newsContent-txt">
					<view class="newsContent-txt1">
						<view v-if="item.fzgSource"><text>{{item.fzgSource}}</text></view>
						<view v-else>
							<fzg-icon class="browse-icon" type="yuedushu-"></fzg-icon>
							<text>{{ item.hits }}</text>
						</view>
						<!-- <view v-if="item.compoint">
							<fzg-icon class="coin-icon" type="coin"></fzg-icon>
							<text>{{ item.compoint }}积分</text>
						</view> -->
						<text>{{ item.createdate }}</text>
					</view>
					<!-- <view class="newsContent-txt2">
						<text>{{ item.createdate }}</text>
					</view> -->
				</view>
			</view>
			<view class="newsContent newsContent1" v-else>
				<view class="newsContent1-box">
					<view class="newsContent-tit">
						<text>{{ item.title }}</text>
					</view>
					<view class="newsContent-txt">
						<view class="newsContent-txt1">
							<view v-if="item.fzgSource"><text>{{item.fzgSource}}</text></view>
							<view v-else>
								<fzg-icon class="browse-icon" type="yuedushu-"></fzg-icon>
								<text>{{ item.hits }}</text>
							</view>
							<!-- <view v-if="item.compoint">
								<fzg-icon class="coin-icon" type="coin"></fzg-icon>
								<text>{{ item.compoint }}积分</text>
							</view> -->
							<text>{{ item.createdate }}</text>
						</view>
						<!-- <view class="newsContent-txt2">
							<text>{{ item.createdate }}</text>
						</view> -->
					</view>
				</view>
				<view class="newsContent1-img"><image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image></view>
			</view>
		</template>
	</view>
</template>

<script>
	import fzgIcon from './fzg-icon/index';
	export default {
		components: {
			fzgIcon
		},
		props: ['item','type'],
		methods: {
			goPath(type, item) {
				let params = {type:type,id:item.id};
				if(type == 'appnews' || type == 'topic'){
					if(item.sid) params['sid'] = item.sid;
					params['title'] = item.title;
					params['url'] = item.jumpurl;
				}
				this.$emit('click', params);
			}
		},
	}
</script>

<style lang="less">
	.diflex {
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-content: center;
	}
	.newsContent1 {
		.diflex();
		width: 100%;
		& .newsContent1-box {
			width: 70%;
			display: flex;
			diplay: -webkit-flex;
			flex-direction: column;
			justify-content: space-between;
		}
		& .newsContent1-img {
			width: 26%;
			height: 138upx;
			overflow: hidden;
			& > image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.newsContent {
		width: 94%;
		margin: 0 auto;
		padding: 30upx 0;
		border-bottom: 1px solid #e5e5e5;
		& .newsContent-tit {
			font-size: 34upx;
			line-height: 1.5;
			color: #3f3f3f;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		& .newsContent-txt {
			font-size: 24upx;
			color: #999;
			.diflex();
			& .newsContent-txt1 > view {
				display: inline-block;
				.browse-icon,
				.coin-icon {
					color: #999 !important;
					font-size: 26upx !important;
					vertical-align: 2upx;
					margin-right: 10upx;
				}
				& text {
					margin-right: 20upx;
				}
			}
		}
	}
	.newsContent2 {
		& .newsContent2-img {
			.diflex();
			padding: 20upx 0;
			& > view {
				width: 32%;
				height: 165upx;
				overflow: hidden;
				& > image {
					width: 100%;
					height: 100%;
				}
			}
			& > view:nth-of-type(2) {
				margin: 0 2%;
			}
		}
	}
	.newsContent3 {
		& .newsContent3-img {
			width: 100%;
			height: 360upx;
			padding: 20upx 0;
			position: relative;
			& > image {
				width: 100%;
				height: 100%;
			}
			& .video-play-btn {
				position: absolute;
				top: 50%;
				margin-top: -54upx;
				left: 50%;
				margin-left: -54upx;
				width: 108upx;
				height: 108upx;
				& > image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
