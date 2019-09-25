<template>
	<view class="msgBox">
        
        <view style="text-align:center;">
            <text class='p25' @tap="$tool.nav('msg/user')">Go-User</text>
            #
            <text class='p25' @tap="$tool.nav('msg/chat0?title=Demo')">对比页</text>
        </view>
        
		<!--没有内容时显示-->
        <view v-if="loading" class="msgEmpty">
            <view class="msgNoInfo">加载中...</view>
        </view>
		<view v-else-if="!lists.length" class="msgEmpty">
			<view class="msgNoInfo">暂时没有沟通记录</view>
			<view class="zhaoFang" @tap="$tool.nav('newHouse/index')">去找房</view>
		</view>

		<view v-else class="chat-list">
			<view v-for="(row,no) in lists" :key="no">
                <uni-swipe-action :options="row.top==300?act2:act1" :disabled="disabled" @click="bindClick(no,$event)" >
                    <view class="chat">
                        <view class="chatpad">
                            <view class="row" @tap="toChat(row)">
                                <view class="left">
                                    <image :src="row.thumb ? row.thumb : 'https://static.fzg360.com/images/app/chat/face/face_1.png'"></image>
                                    <view class="tis" v-if="cnts[row.ufrom]">{{cnts[row.ufrom]}}</view>
                                </view>
                                <view class="right">
                                    <view class="top">
                                        <view class="username">{{row.uname}}</view>
                                        <view class="time">{{row.fmtTime}}</view>
                                    </view>
                                    <view class="bottom">
                                        <view class="msgvt">{{vtext(row)}}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </uni-swipe-action>
            </view>
		</view>
	</view>
</template>

<script>
    
	import {mapState,mapMutations} from 'vuex'
    import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
    import {msgSend,msgFormat,userInit} from './funcs'
    
	export default {
		components: {
			uniSwipeAction,
		},
		data() {
			return {
                cnts: [],
                lists: [],
                cnow: {}, // 当前用户 
                loading: '1',
				disabled: false,
                act1: [
                    {text:'置顶', style:{backgroundColor:'#3333FF'}}, 
                    {text:'删除', style:{backgroundColor:'#e83836' }}
                ],
				act2: [
                    {text:'取消', style:{backgroundColor:'#FF33FF'}}, 
                    {text:'删除', style:{backgroundColor:'#e83836' }}
                ]
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
            msgSend('pullConversationList', this.cnow)
		},
		onLoad() {
            this.setChats({key:'f3msg', val:0})
            if(!this.hasLogin || !this.userInfo.mid){
                //this.$tool.tab('user/index', '请登录聊天')
            }else{
                this.initUser()
            }
            uni.onSocketMessage((mobj) => {
                let mget = msgFormat(mobj),
                    row = mget.val
                if(mget.key=='getMessage'){
                    let flag = 0 // 标记是否要增加到列表
                    for(let i=0;i<this.lists.length;i++) {
                        let irow = this.lists[i]
                        if(irow.ufrom==row.ufrom){
                            flag = 1; irow.type = row.type
                            irow.cjson = JSON.stringify(row.cjson)
                            if(!row.show){ // 未读处理列表数据
                                if(this.cnts[row.ufrom]){
                                    this.cnts[row.ufrom]++
                                }else{
                                    this.cnts[row.ufrom] = 1
                                }
                            }
                        }
                    } 
                    if(!flag){ // 增加到列表
                        this.cnts[row.ufrom] = 1
                        let urow = {id:row.id, ufrom:row.ufrom, uname:row.uinfo.uname, uto:row.uto, type:row.type, 
                            fmtTime:row.time, cjson:JSON.stringify(row.cjson), thumb:row.uinfo.thumb}
                        this.lists.unshift(urow)
                    }
                }
                if(mget.key=='getConversationList'){ 
                    this.cnts = row.cnts
                    this.lists = row.list
                    if(!this.lists || this.lists.length==0){
                        uni.showToast({title:'没有聊天会话列表。'})
                    }
                    this.loading = 0
                    uni.stopPullDownRefresh()
                }
            })
		},
        computed: mapState(['hasLogin','userInfo','chats']),
		methods: {
            ...mapMutations(['setChats']),
            initUser() { // 登录完用户时执行
                let item = this.userInfo
                this.cnow = {uid:item.mid, uname:item.mname, thumb:item.thumb}
                userInit(item) 
                msgSend('pullConversationList', this.cnow)
            },
            toChat(row) { 
                if(this.cnts[row.ufrom]){
                    this.chats.unread -= parseInt(this.cnts[row.ufrom])
                    this.setChats({key:'unread', val:this.chats.unread})
                    this.cnts[row.ufrom] = 0
                }
            	uni.navigateTo({
            		url: "./chat?id="+row.ufrom+"&name="+row.uname+"&topic="+row.thumb
            	})
            },
			bindClick(no, e) {
                let row = this.lists[no],
                    opuid = row.ufrom, optop = 0,
                    op = 'setTopConversation'
                if(e.text=='置顶'){
                    optop = 300
                }else if(e.text=='取消'){
                    optop = 500
                }else{ 
                    op = 'delConversation'
                    this.lists.splice(this.index, 1)
                } 
                this.cnow.optop = optop
                this.cnow.opuid = opuid
                msgSend(op, this.cnow)
                msgSend('pullConversationList', this.cnow)
                if(!optop){ msgSend('clearUnreadStatus', this.cnow) }
			},
            vcnts(row){
                return this.cnts[row.ufrom]
            },
            vtext(row) {
                let res = JSON.parse(row.cjson)
                if(row.type=='text'){
                    // text = text.substr(0,24)+'...'
                    return res.text
                }else if(row.type=='img'){
                    let arr = res.url.split('/')
                    return "[图片]" + arr[arr.length-1] 
                }else if(row.type=='voice'){
                    let arr = res.url.split('/')
                    return "[语音]" + arr[arr.length-1] 
                }else if(row.type=='house'){
                    return "[楼盘]" + res.title
                }
            }
		}
	}
</script>

<style lang="less">
	page {
		background-color: rgba(0, 0, 0, 0);
		width: 100%;
		height: 100%;
	}
    .p25{ margin:1rem; }
	.msgBox {
		width: 100%;
		height: 100%;
		.msgEmpty{
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.msgNoInfo {
			font-size: 32rpx;
			text-align: center;
			color: #999;
		}

		.zhaoFang {
			margin-top: 30px;
			width: 260rpx;
			height: 60rpx;
			background-color: #e83836;
			border-radius: 10rpx;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			line-height: 60rpx;
		}

		.chat-list {
			width: 100%;
			.chat {
				width: 94%;
				padding: 0 3%;

				.chatpad {
					width: 100%;
					height: 100rpx;
					padding: 20rpx 0;
					border-bottom: solid 1rpx #e5e5e5;

					.row {
						display: flex;
						justify-content: flex-start;
						.left {
							flex-shrink: 0;
							width: 100rpx;
							height: 100rpx;
							position: relative;

							image {
								width: 100rpx;
								height: 100rpx;
								border-radius: 20rpx;
							}

							.tis {
								width: 35rpx;
								height: 35rpx;
								line-height: 35rpx;
								font-size: 11px;
								display: flex;
								justify-content: center;
								align-items: center;
								position: absolute;
								left: 78rpx;
								top: -10rpx;
								background-color: #e83836;
								color: #fff;
								border-radius: 100%;
							}
						}

						.right {
							flex-shrink: 1;
							width: 98%;
							padding-left: 2%;

							.top {
								width: 100%;
								display: flex;
								justify-content: space-between;
								align-items: flex-end;

								.usernam {
									font-size: 28rpx;
								}

								.time {
									font-size: 24rpx;
									color: #bebebe;
								}
							}

							.bottom {
								width: 100%;
								height: 40rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								.msgvt {
									font-size: 12px;
									color: #666;
                                    width: 480rpx;
                                    overflow: hidden;
                                    text-overflow: ellipsis; 
                                    white-space: nowrap;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
