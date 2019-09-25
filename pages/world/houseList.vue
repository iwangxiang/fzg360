<template>
<view class="houseList">
    <view class="content">
        <view>
            <view v-for="(item,index) in menuTop" :key="index" :class="item.class" @tap="doTab(index)">
                <text>{{item.name}}</text>
                <fzg-icon :type="item.type" size="10"></fzg-icon>
            </view>
        </view>
        <view>
            <view>
                <view v-for="(item,no1) in subList" :key="no1" v-if="tabIndex==no1">
                    <view :class="[ctab[no1]['val']=='0' ? 'active' : '']" @tap.stop="setOption(no1,'0')">
                        不限
                    </view>
                    <view v-for="(item,no2) in item.subs" :key="no2" :class="[ctab[no1]['val']==no2 ? 'active' : '']" @tap.stop="setOption(no1,no2)">
                        {{item}}
                    </view>
                </view>
            </view>
        </view>
        <view @tap.stop="doTab(-1)" v-show="show"></view>
    </view>
    <view class="worldList">
        <world-house v-for="item in listData" :key="item.aid" :row="item"></world-house>
    </view>
    <uni-load-more :status="status" :content-text="contentText" />
</view>
</template>

<script>
import fzgIcon from "../../components/fzg-icon/index.vue"
import {
    uniLoadMore
} from '@dcloudio/uni-ui' // uniIcon,
import worldHouse from "../../components/worldHouse.vue"
export default {
    data() {
        return {
            listData: [],
            ctab: {
                '0': {
                    key: 'ccid1',
                    val: '0'
                },
                '1': {
                    key: 'ccid12',
                    val: '0'
                },
                '2': {
                    key: 'ccid17',
                    val: '0'
                }
            },
            tabIndex: -1,
            show: false,
            menuTop: [{
                    name: "国家",
                    type: "open",
                    class: ""
                },
                {
                    name: "类型",
                    type: "open",
                    class: ""
                },
                {
                    name: "价格",
                    type: "open",
                    class: ""
                }
            ],
            subList: [{}, {}, {}],
            page: 1, //页数
            keyword: '', //关键字
            reload: false, //重新加载标志
            status: 'more', //加载的状态
            contentText: { //加载的内容
                contentdown: '上拉加载更多',
                contentrefresh: '加载中',
                contentnomore: '没有更多'
            }
        }
    },
    components: {
        fzgIcon,
        worldHouse,
        uniLoadMore
    },
    onLoad() {
        this.getData();
    },
    onPullDownRefresh() {
        this.reload = true;
        this.page = 1;
        this.getData();
    },
    onReachBottom() {
        this.status = 'more';
        this.getData();
    },
    onNavigationBarButtonTap() {
        uni.navigateTo({
            url: '/pages/world/search?model=house'
        });
    },
    methods: {
        getData() {
            let params = {
                page: this.page
            };
            if (this.keyword) params['keyword'] = this.keyword
            if (this.ctab['0']['val'] > '0') params['ccid1'] = this.ctab['0']['val']
            if (this.ctab['1']['val'] > '0') params['ccid12'] = this.ctab['1']['val']
            if (this.ctab['2']['val'] > '0') params['ccid17'] = this.ctab['2']['val']
            this.listData.length && (this.status = 'loading');
            this.$http.get(this.$api.worldApi('houseList'), {
                data: params
            }).then(res => {
                this.show = false;
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
                    this.subList[0].subs = res.data[1]
                    this.subList[1].subs = res.data[12]
                    this.subList[2].subs = res.data[17]
                } else {
                    let list = res.data.info;
                    this.listData = this.reload ? list : this.listData.concat(list);
                }
                this.reload && uni.stopPullDownRefresh();
                this.status = 'more';
                if (this.listData.length >= res.data.total) this.status = 'noMore';
                ++this.page;
                this.reload = false;
            }).catch(error => {
                uni.showToast({
                    title: '加载数据失败'
                });
            })
        },
        onPageScroll(e) {
            let tmpY = 150;
            e.scrollTop = e.scrollTop > tmpY ? 150 : e.scrollTop;
            this.colorFlag = e.scrollTop * (1 / tmpY);
            if (this.colorFlag < 0.5) {
                this.fzgIconColor = "#FFF";
                this.inputBackgroundColor = "#FFF";
                this.lxlocationIcon = "#FFF";
                this.talknewsIcon = "#FFF";
            } else {
                this.fzgIconColor = "#333";
                this.inputBackgroundColor = "#efefef";
                this.lxlocationIcon = "#333";
                this.talknewsIcon = "#333";
            }
        },
        doTab(index) { // 0,1,2,-1
            this.menuTop.forEach((item, index) => {
                item["type"] = "open";
                item["class"] = "";
            })
            if (index == -1 || this.tabIndex == index) {
                this.tabIndex = -1;
                this.show = false;
                return;
            }
            this.tabIndex = index;
            this.show = true;
            this.menuTop[index]["class"] = "active";
            this.menuTop[index]["type"] = "xiangshang";
        },
        setOption(pid, val) {
            this.ctab[pid]['val'] = val
            this.doTab(-1)
            this.page = 1
            this.getData()
        }
    }
}
</script>

<style lang="less" scoped>
.worldList {
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.houseList {
    .content {
        position: relative;

        &>view:nth-child(1) {
            width: 100%;
            height: 44px;
            line-height: 44px;
            border-top: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            position: fixed;
            top: 0;
            /* #ifdef !MP */
            top: 44px;
            /* #endif */
            z-index: 9;
            background-color: #ffffff;

            &>view {
                width: 33.3333333333%;
                text-align: center;
                border-right: 1px solid #e5e5e5;
                border-bottom: 1px solid #e5e5e5;
                box-sizing: border-box;

                &>text {
                    font-size: 28rpx;
                    color: #333333;
                    margin-right: 10rpx;
                }
            }

            &>view:nth-child(3) {
                border-right: none;
            }

            .active {
                border-bottom: none;

                &>text {
                    color: red;
                }
            }
        }

        &>view:nth-child(2) {
            &>view {
                width: 100%;
                background-color: #ffffff;
                position: fixed;
                top: 45px;
                /* #ifdef !MP */
                top: 89px;
                /* #endif */
                z-index: 9;

                &>view {
                    padding: 20rpx;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;

                    &>view {
                        width: 30%;
                        height: 60rpx;
                        line-height: 60rpx;
                        text-align: center;
                        color: #3f3f3f;
                        border-radius: 10rpx;
                        border: 1px solid #e5e5e5;
                        font-size: 28rpx;
                        margin-top: 20rpx;
                    }

                    &>view.active {
                        background-color: #E83836;
                        color: #ffffff;
                        border: none;
                    }
                }
            }
        }

        &>view:nth-child(3) {
            width: 100%;
            height: 100%;
            background-color: #000000;
            opacity: .3;
            position: fixed;
            z-index: 7;
        }
    }

    .worldList {
        margin-top: 65px;
    }
}
</style>
