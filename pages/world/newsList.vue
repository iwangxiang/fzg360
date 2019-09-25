<template>
<view class="newsList">
    <view class="uni-padding-wrap">
        <view class="page-section swiper">
            <view class="page-section-spacing">
                <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
                    <swiper-item v-for="(item, index) in sliderList" :key="index">
                        <view class="swiper-item uni-bg-red">
                            <image :src="item.thumb"></image>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
        </view>
    </view>

    <view class="tab">
        <scroll-view class="uni-swiper-tab" scroll-x>
            <view v-for="(tab, index) in tabBars" :key="index" class="swiper-tab-list">
                <text :class="tabIndex == index ? 'active' : ''" @tap="tapTab" :data-current="index" :data-ccid1="tab.ccid1">{{ tab.name }}</text>
            </view>
        </scroll-view>
        <view class="tabContent">
            <view v-for="item in listData" :key="item.aid" :row="item">
                <view @tap="goPath(item.aid)">
                    <view>
                        <image :src="item.thumb"></image>
                    </view>
                    <view>
                        <view>{{ item.subject }}</view>
                        <view>{{ item.abstract }}</view>
                        <view>
                            <fzg-icon color="#333333" type="browse"></fzg-icon>
                            <text>{{ item.clicks }}</text>
                            <fzg-icon type="time"></fzg-icon>
                            <text>{{ item.ctime }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <uni-load-more :status="status" :content-text="contentText" />
</view>
</template>

<script>
import {
    uniIcon,
    uniLoadMore
} from '@dcloudio/uni-ui';
import fzgIcon from '@/components/fzg-icon/index';
export default {
    data() {
        return {
            scrollLeft: 0,
            isClickChange: false,
            tabBars: [{
                name: '全部',
                ccid1: 0
            }], //分类导航
            sliderList: [], //幻灯片 swiperList
            listData: [], //列表数据
            reload: false, //重新加载标志
            status: 'more', //加载的状态
            contentText: {
                //加载的内容
                contentdown: '上拉加载更多',
                contentrefresh: '加载中',
                contentnomore: '没有更多'
            },
            page: 1, //页数
            // type: '', //加载类型
            ccid1: '', //类型id
            tabIndex: 0,
            indicatorDots: true,
            autoplay: true,
            interval: 2000,
            duration: 500
        };
    },
    components: {
        uniIcon,
        fzgIcon,
        uniLoadMore
    },
    onLoad() {
        this.getNewsCatalog();
    },
    onPullDownRefresh() {
        this.reload = true;
        this.page = 1;
        this.getData(this.ccid1);
    },
    onReachBottom() {
        this.status = 'more';
        this.getData(this.ccid1);
    },
    onNavigationBarButtonTap() {
        uni.navigateTo({
            url: '/pages/world/search?model=news'
        });
    },
    methods: {
        async changeTab(e) {
            //swiper滑块
            let index = e.target.current;
            // this.type = this.tabBars[index].type;
            this.ccid1 = this.tabBars[index].ccid1;
            this.listData = [];
            this.reload = true;
            this.page = 1;
            this.getData(this.type, this.ccid1);
            if (this.isClickChange) {
                this.tabIndex = index;
                this.isClickChange = false;
                return;
            }
            let tabBar = await this.getElSize('tab-bar'),
                tabBarScrollLeft = tabBar.scrollLeft;
            let width = 0;
            for (let i = 0; i < index; i++) {
                let result = await this.getElSize('news_' + this.tabBars[i].id);
                width += result.width;
            }
            let winWidth = uni.getSystemInfoSync().windowWidth,
                nowElement = await this.getElSize('news_' + this.tabBars[index].id),
                nowWidth = nowElement.width;
            if (width + nowWidth - tabBarScrollLeft > winWidth) {
                this.scrollLeft = width + nowWidth - winWidth;
            }
            if (width < tabBarScrollLeft) {
                this.scrollLeft = width;
            }
            this.isClickChange = false;
            this.tabIndex = index;
        },
        getElSize(id) {
            return new Promise((res, rej) => {
                uni.createSelectorQuery()
                    .select('#' + id)
                    .fields({
                            size: true,
                            scrollOffset: true
                        },
                        data => {
                            res(data);
                        }
                    )
                    .exec();
            });
        },
        async tapTab(e) {
            //点击顶部分类切换
            // this.type = e.target.dataset.type;
            this.ccid1 = e.target.dataset.ccid1;
            let tabIndex = e.target.dataset.current;
            this.listData = [];
            this.reload = true;
            this.page = 1;
            this.getData(this.ccid1);
            if (this.tabIndex === tabIndex) {
                return false;
            } else {
                this.scrollLeft = (tabIndex - 1) * 75;
                this.isClickChange = true;
                this.tabIndex = tabIndex;
            }
        },
        getNewsCatalog() {
            this.$http
                .get(this.$api.worldApi('newsList'))
                .then(res => {
                    for (let i in res.data['1']) {
                        this.tabBars.push({
                            name: res.data['1'][i],
                            ccid1: [i]
                        });
                    }
                    this.getData(0);

                    // console.log(this.tabBars);
                })
                .catch(error => {
                    console.error('error:', error);
                });
        },
        getData(ccid1) {
            // let requestObj = { appnews: 'newsccid1List', video: 'videoList', live: 'liveList', topic: 'topicList', pcnews: 'newsPcList', finance: 'financeList' };
            let params = {
                ccid1: ccid1,
                page: this.page
            };
            this.listData.length && (this.status = 'loading');
            this.$http
                .get(this.$api.worldApi('newsList'), {
                    data: params
                })
                .then(res => {
                    if (this.page == 1 && res.data.pics) {
                        this.sliderList = res.data.pics;
                        // console.log('sliderList loaded');
                    }
                    this.reload && uni.stopPullDownRefresh();
                    let list = res.data.info;
                    this.listData = this.reload ? list : this.listData.concat(list);
                    // console.log(this.listData);
                    if (this.listData.length >= res.data.total) this.status = 'noMore';
                    ++this.page;
                    this.reload = false;
                })
                .catch(error => {
                    uni.showToast({
                        title: '加载数据失败'
                    });
                });
        },
        goBack() {
            uni.navigateBack();
        },
        goPath(aid) {
            // console.log(aid);
            uni.navigateTo({
                url: '/pages/world/newsView?aid=' + aid
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../common/uni.css';

.newsList {
    .uni-padding-wrap {
        height: 380rpx;
        padding: 0;

        .swiper {
            height: 380rpx;
        }

        .swiper-item {
            height: 380rpx;

            image {
                width: 100%;
                height: 100%;
            }
        }
    }

    .tab {
        .uni-swiper-tab {
            height: 67rpx;
            line-height: 67rpx;

            .swiper-tab-list {
                border-right: 1px solid #c8c7cc;
                width: 187rpx;
                height: 67rpx;
                line-height: 67rpx;
                font-size: 28rpx;
            }

            .active {
                color: #e83836;
                border-bottom: 2px solid #e83836;
            }
        }

        .tabContent {
            &>view {
                padding: 0 20rpx;

                &>view {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #e5e5e5;
                    padding: 20rpx 0;

                    &>view:nth-child(1) {
                        width: 250rpx;
                        height: 180rpx;

                        image {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    &>view:nth-child(2) {
                        width: 417rpx;
                        display: flex;
                        flex: 1;
                        margin-left: 20rpx;
                        flex-direction: column;
                        justify-content: space-between;

                        &>view {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        &>view:nth-child(1) {
                            font-size: 30rpx;
                            color: #383838;
                        }

                        &>view:nth-child(2) {
                            font-size: 24rpx;
                            color: #919191;
                        }

                        &>view:nth-child(3) {

                            &>text:nth-child(2),
                            &>text:nth-child(4) {
                                font-size: 26rpx;
                                color: #999999;
                                margin: 0 20rpx 0 10rpx;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
