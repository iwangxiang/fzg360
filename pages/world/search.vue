<template>
<view class="search">
    <view class="searchHeader">
        <view class="searchHeaderCont">
            <view @tap="goBack" class="sectionName1">
                <fzg-icon size="20" type="back"></fzg-icon>
            </view>
            <view class="sectionName2"><input type="text" class="headerInput" placeholder="请输入关键字" confirm-type="search" @input="changeRS" /></view>
            <view class="sectionName3">
                <template v-if="cancelOrQuery">
                    <view @tap="goCancel">取消</view>
                </template>
                <template v-else>
                    <view @tap="goSearch">确定</view>
                </template>
            </view>
        </view>
    </view>
    <view v-if="infHouseStatus" class="hotHouse">
        <view class="sectionName1"><text>热门搜索</text></view>
        <view class="sectionName2">
            <view v-for="(item, index) in infHouse" :key="index" @tap="goHouse(item.aid)">{{ item.subject }}</view>
        </view>
    </view>
    <view v-if="searchHisoryStatus" class="searchHistory">
        <view class="sectionName1"><text>历史搜索</text></view>
        <view class="sectionName2">
            <view v-for="(item, index) in searchHisory" :key="index" @tap="goSearchHistory(item)">
                <text>{{ item }}</text>
                <uni-icon class="iUniIcon" type="forward" color="#9e9e9e" size="20"></uni-icon>
            </view>
        </view>
        <view class="sectionName3" @tap="cleanHistory">清空搜索历史</view>
    </view>
    <view class="noSearchHistory">
        <template v-if="dataStatus">
            <view class="yesHistory">
                <view v-for="(item, index) in listData" :key="index" @tap="goPath(item.aid)">
                    {{ format(item.subject) }}
                </view>
            </view>
            <uni-load-more :status="status" :content-text="contentText" />
        </template>
        <template v-else>
            <view class="noHistory">
                没有搜索记录
            </view>
        </template>
    </view>
</view>
</template>

<script>
import {
    uniLoadMore,
    uniIcon
} from '@dcloudio/uni-ui';
import fzgIcon from '@/components/fzg-icon/index.vue';
export default {
    data() {
        return {
            model: '',
            dataStatus: false,
            infHouse: [],
            listData: [],
            keyword: '',
            cancelOrQuery: true,
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
            duration: 500,
            searchHisory: [],
            searchHisoryStatus: true,
            infHouseStatus: true
        };
    },
    components: {
        fzgIcon,
        uniLoadMore,
        uniIcon
    },
    onLoad(e) {
        this.model = e.model;
        this.getInfHouse();
        this.searchHisory = uni.getStorageSync(this.model + 'SearchHisory');
        if (this.searchHisory === '') {
            this.searchHisory = [];
            this.searchHisoryStatus = false;
        }
        if (e.keyword != '' && e.keyword != undefined) {
            console.log(21)
            this.searchHisoryStatus = false;
            this.infHouseStatus = false;
            this.keyword = e.keyword;
            this.goSearch();
        }
        console.log(this.searchHisory);
    },
    onReachBottom() {
        this.status = 'more';
        this.goSearch();
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        goCancel() {
            uni.navigateBack();
        },
        cleanHistory() {
            uni.setStorageSync(this.model + 'SearchHisory', '');
            this.searchHisory = [];
            this.searchHisoryStatus = false;
        },
        getInfHouse() {
            let params = {
                type: 'house'
            };
            this.$http
                .get(this.$api.worldApi('soList'), {
                    data: params
                })
                .then(res => {
                    this.infHouse = res.data.info
                    console.log(res);
                    console.log('--soList--');
                })
                .catch(error => {
                    console.error('error:', error);
                });
        },
        format(val) {
            return val.length > 25 ? val.slice(0, 25) + '...' : val;
        },
        changeRS(event) {
            if (event.target.value != '') {
                this.cancelOrQuery = false;
                this.keyword = event.target.value;
            } else {
                this.cancelOrQuery = true;
            }
        },
        cleanText(event) {
            event.target.value = '';
        },
        goSearchHistory(keyword) {
            this.keyword = keyword;
            this.goSearch();
        },
        goSearch() {
            this.searchHisory.push(this.keyword);
            this.searchHisory = Array.from(new Set(this.searchHisory));
            uni.setStorageSync(this.model + 'SearchHisory', this.searchHisory);
            let params = {
                type: this.model,
                keyword: this.keyword,
                page: this.page
            };
            this.listData.length && (this.status = 'loading');
            this.$http
                .get(this.$api.worldApi('soList'), {
                    data: params
                })
                .then(res => {
                    if (this.page == 1) {
                        uni.showToast({
                            title: '请求成功',
                            icon: 'success',
                            // #ifndef MP-ALIPAY
                            duration:500,
                            mask: true
                            // #endif
                        })
                        this.listData = res.data.info
                    } else {
                        let list = res.data.info;
                        this.listData = this.reload ? list : this.listData.concat(list);
                    }
                    this.reload && uni.stopPullDownRefresh();
                    this.status = 'more';
                    if (this.listData.length >= res.data.total) this.status = 'noMore';
                    ++this.page;
                    this.reload = false;
                    if (this.listData != '') {
                        this.reload = false;
                        this.searchHisoryStatus = false;
                        this.infHouseStatus = false;
                        this.dataStatus = true;
                    } else {
                        this.searchHisoryStatus = true;
                        this.infHouseStatus = true;
                        this.dataStatus = false;
                    }
                })
                .catch(error => {
                    uni.showToast({
                        title: '加载数据失败'
                    });
                });
        },
        goPath(aid) {
            let active = '';
            switch (this.model) {
                case 'news':
                    active = 'newsView';
                    break;
                case 'vdo':
                    active = 'videoView';
                    break;
                case 'faq':
                    active = 'faqView';
                    break;
                case 'house':
                    active = 'houseView';
                    break;
                default:
                    break;
            }
            uni.navigateTo({
                url: '/pages/world/' + active + '?aid=' + aid
            });
        },
        goHouse(aid) {
            uni.navigateTo({
                url: "/pages/world/houseView?aid=" + aid
            })
        }
    }
};
</script>

<style lang="less" scoped>
.search {
    overflow-y: hidden;
    min-height: 100vh;
    background-color: #f9f9f9;

    .searchHeader {
        width: 100%;
        height: 118rpx;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        background-color: #f9f9f9;

        .searchHeaderCont {
            height: 118rpx;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
            padding: 0 20rpx;

            .sectionName2 {
                flex: 1;
                margin-left: 20rpx;

                input {
                    height: 30rpx;
                    background-color: #f1f1f1;
                    font-size: 24rpx;
                    padding-left: 20rpx;
                    box-sizing: border-box;
                    border-radius: 10rpx;
                }
            }

            .sectionName3 {
                margin-left: 20rpx;
                font-size: 26rpx;
                color: #666666;
            }
        }
    }

    .hotHouse {
        margin-top: 118rpx;

        .sectionName1 {
            font-size: 28rpx;
            color: #3f3f3f;
            padding-bottom: 20rpx;
            border-bottom: 1px solid #e5e5e5;

            &>text {
                padding: 0 20rpx;
            }
        }

        .sectionName2 {
            background-color: #ffffff;

            &>view {
                padding: 20rpx;
                border-bottom: 1px solid #e5e5e5;
                font-size: 28rpx;
                color: #3f3f3f;
            }
        }
    }

    .searchHistory {
        .sectionName1 {
            font-size: 28rpx;
            color: #3f3f3f;
            padding: 20rpx 0;
            border-bottom: 1px solid #e5e5e5;

            &>text {
                padding: 0 20rpx;
            }
        }

        .sectionName2 {
            background-color: #ffffff;

            &>view {
                padding: 20rpx;
                border-bottom: 1px solid #e5e5e5;
                font-size: 28rpx;
                color: #3f3f3f;
                display: flex;
                justify-content: space-between;
            }
        }

        .sectionName3 {
            text-align: center;
            font-size: 28rpx;
            color: #3f3f3f;
            margin-top: 100rpx;
        }
    }

    .noSearchHistory {
        .yesHistory {
            font-size: 28rpx;
            color: #3f3f3f;
            margin-top: 118rpx;
            background-color: #ffffff;

            &>view {
                padding: 20rpx;
                border-bottom: 1px solid #e5e5e5;
                font-size: 28rpx;
                color: #3f3f3f;
            }
        }

        .noHistory {
            text-align: center;
            font-size: 28rpx;
            color: #3f3f3f;
            margin-top: 100rpx;
        }
    }
}
</style>
