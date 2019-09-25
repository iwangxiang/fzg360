<template>
<view class="newHouse">
    <view class="newHouseBanner">
        <view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
                        <swiper-item v-for="(item, index) in advs" :key="index">
                            <view class="swiper-item uni-bg-red">
                                <image :src="item.image" @tap="goPath"></image>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>
    </view>
    <view class="overseasHouseSelect">
        <view class="iSelect">
            <view class="iSelectWrap" v-for="(item, index) in wordMenu" @tap="nav(item.mod+'List')" :key="index">
				<view class="iSelectWrapBackground" :style="'background-color:' + item.color">
					<fzg-icon class="fzgIconSelect" :type="item.type" size="25" color="white" ></fzg-icon>
				</view>
                <text>{{ item.text }}</text>
            </view>
        </view>
    </view>
    <view class="news">
        <view>
            <text>推荐资讯</text>
            <view @tap="$tool.nav('world/newsList')">
                <text>更多</text>
                <uni-icon type="arrowright" size="16" color="#9e9e9e"></uni-icon>
            </view>
        </view>
        <view>
            <view v-for="row in news" :key="row.aid">
                <view @tap="nav('newsView?aid='+row.aid)">
                    <view>
                        <text>{{ row.subject }}</text>
                        <text>{{ row.abstract }}</text>
                    </view>
                    <view>
                        <image lazy-load :src="row.thumb ? row.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view class="like">
        <view @tap="$tool.nav('world/houseList')">
            <text>猜你喜欢</text>
            <view>
                <text>更多</text>
                <uni-icon type="arrowright" size="16" color="#9e9e9e"></uni-icon>
            </view>
        </view>
        <view class="worldList">
            <world-house v-for="item in house" :key="item.aid" :row="item"></world-house>
        </view>
    </view>
</view>
</template>

<script>
import {
    uniIcon
} from '@dcloudio/uni-ui';
import fzgIcon from '@/components/fzg-icon/index.vue';
import worldHouse from '../../components/worldHouse.vue';
export default {
    data() {
        return {
            indicatorDots: true,
            autoplay: true,
            interval: 2000,
            duration: 500,

            advs: [],
            news: {},
            house: {},
            faqs: {}, // 不用
            colorFlag: 0,
            fzgIconColor: '#fff',
            inputBackgroundColor: 'white',
            wordMenu: [{
                    text: '海外房源',
                    color: '#2993FF',
                    type: 'overseas',
                    mod: 'house'
                },
                {
                    text: '海外资讯',
                    color: '#FB5D54',
                    type: 'info',
                    mod: 'news'
                },
                {
                    text: '掌柜视野',
                    color: '#6C76F9',
                    type: 'view',
                    mod: 'video'
                },
                {
                    text: '掌柜问答',
                    color: '#4CB050',
                    type: 'wenda',
                    mod: 'faq'
                }
            ],
            keyword: ''
        };
    },
    components: {
        uniIcon,
        fzgIcon,
        worldHouse
    },
    onLoad() {
        this.loadData();
    },
    onNavigationBarSearchInputClicked(e) {
        uni.navigateTo({
            url: '/pages/world/search?model=house'
        })
    },
    methods: {
        loadData() {
            this.$http
                .get(this.$api.worldApi('index'))
                .then(res => {
                    this.advs = res.data.advs;
                    this.news = res.data.news;
                    this.house = res.data.house;
                    console.log(res.data);
                })
                .catch(error => {
                    console.error('error:', error);
                });
        },
        nav(path) {
            uni.navigateTo({
                url: '/pages/world/' + path
            })
        },
        getKeyword(event) {
            this.keyword = event.target.value;
        }
    }
};
</script>

<style lang="less" scoped>
.worldList {
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.newHouse {
    background-color: #f5f5f5;

    .newHouseBanner {
        height: 420rpx;

        image {
            width: 100%;
            height: 100%;
        }
    }

    .uni-padding-wrap {
        .swiper {
            height: 382rpx;
        }

        .swiper-item {
            height: 382rpx;

            image {
                width: 100%;
                height: 100%;
            }
        }

        .swiper-list {
            margin-top: 40rpx;
            margin-bottom: 0;
        }

        .uni-common-mt {
            margin-top: 60rpx;
            position: relative;
        }

        .info {
            position: absolute;
            right: 20rpx;
        }
    }

    .overseasHouseSelect {
        background-color: #ffffff;

        .iSelect {
            display: flex;
            justify-content: space-between;
            padding: 0 45rpx;
            .iSelectWrap {
                width: 110rpx;
                margin: 41rpx 0 0 75rpx;
                box-sizing: border-box;
                text-align: center;
                padding-bottom: 41rpx;
				.iSelectWrapBackground{
					width: 91rpx;
					height: 91rpx;
					text-align: center;
					line-height: 91rpx;
					border-radius: 50%;
					margin: 0 auto;
					/* #ifdef MP-ALIPAY */
					line-height: 105rpx;
					margin: 0 auto 15rpx;
					/* #endif */
				}
                text {
                    font-size: 26rpx;
                }
            }
            & view:nth-child(1) {
                margin-left: 0;
            }
        }
    }

    .news {
        margin-top: 20rpx;
        background-color: #ffffff;
        padding-bottom: 40rpx;

        &>view:nth-child(1) {
            height: 112rpx;
            padding: 0 20rpx;
            line-height: 112rpx;
            display: flex;
            justify-content: space-between;

            text {
                color: #3f3f3f;
                font-size: 32rpx;
            }

            &>view {
                text {
                    font-size: 24rpx;
                    color: #9e9e9e;
                }
            }
        }

        &>view:nth-child(2) {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 20rpx;

            &>view:nth-child(1),
            &>view:nth-child(2) {
                margin-bottom: 4rpx;
            }

            &>view {
                width: calc(50% - 1px);
                height: 130rpx;
                background-color: #fafafa;

                &>view {
                    display: flex;
                    justify-content: space-between;
                    padding: 20rpx;

                    &>view:nth-child(1) {
                        width: 200rpx;
                        display: flex;
                        flex: 1;
                        margin-right: 20rpx;
                        flex-direction: column;
                        justify-content: space-between;

                        &>text {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        &>text:nth-child(1) {
                            font-size: 28rpx;
                            color: #3f3f3f;
                        }

                        &>text:nth-child(2) {
                            font-size: 24rpx;
                            color: #9e9e9e;
                        }
                    }

                    &>view:nth-child(2) {
                        width: 80rpx;
                        height: 80rpx;

                        image {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }

    .like {
        margin-top: 20rpx;
        background-color: #ffffff;

        &>view:nth-child(1) {
            height: 112rpx;
            padding: 0 20rpx;
            line-height: 112rpx;
            display: flex;
            justify-content: space-between;

            text {
                color: #3f3f3f;
                font-size: 32rpx;
            }

            &>view {
                text {
                    font-size: 24rpx;
                    color: #9e9e9e;
                }
            }

        }
    }
}
</style>
