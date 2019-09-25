<template>
	<view class="msgBox">
		
        <view class="pad flex">
            <div class='p50 gray' v-if="!hasLogin">左拉登录</div>
            <div class='p50' v-else @tap="userClear()">登出:{{userInfo.mname}}</div>
        
            <div class='p25 gray'>点击会话{{chats.online}}</div>
            <div class='p25' @tap="$tool.nav('msg/list')">返回列表</div>

        </view>
        
		<view class="chat-list"> 
			<uni-swipe-action :options="acts" :disabled="disabled" 
                @click="bindClick(no,$event)" v-for="(row,no) in lists" :key="no">
				<view class="chat">
					<view class="chatpad">
						<view class="row" @tap="toChat(row)">
							<view class="left">
								<image :src="row.thumb"></image>
								<view v-if="row.role" class="tis">纪</view>
							</view>
							<view class="right">
								<view class="top">
									<view class="username">{{row.mname}} : {{row.mid}}</view>
									<view class="time">00:00</view>
								</view>
								<view class="bottom">
									<view class="msgvt">{{row.thumb}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-swipe-action>
		</view>

        <view class="pad flex">
            <div class='p25' @tap="conn()">conn</div>
            <div class='p25' @tap="send()">send(null)</div>
            <div class='p25' @tap="send('_flag-re_')">send(flag)</div>
            <div class='p25' @tap="close()">close</div>
        </view>
        
        <view class="pad flex">
            <div class='p25' @tap="uinit()">uinit</div>
            <div class='p25' @tap="utest('testClients')">testClients</div>
            <div class='p25' @tap="utest('statClient')">statClient</div>
        </view>
        
        <view class="pad flex">
            <div class='p25' @tap="sendSysmsg('0')">sys:广播</div>
            <div class='p25' @tap="sendSysmsg('31493')">to:31493</div>
            <div class='p25' @tap="sendMedia('img')">img</div>
            <div class='p25' @tap="sendMedia('voice')">voice</div>
            <div class='p25' @tap="sendMedia('house')">house</div>
        </view>
        
        <view class="pad">
            conn=`{{chats.conn}}` : {{hasLogin}} : {{userInfo}}
        </view>
  
	</view>
</template>

<script>
    
	import {mapState,mapMutations} from 'vuex'
    import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
    import {msgSend,msgFormat,userInit,guid2} from './funcs'
    
	export default {
		components: {
			uniSwipeAction,
		},
		data() {
			return {
				lists: [],
                disabled: false,
                acts: [
                    {text:'登录', style:{backgroundColor:'#008080'}}, 
                    {text:'测试', style:{backgroundColor:'#808000'}}
                ]
			}
		},
		onPullDownRefresh() {
			//
		},
		onLoad() {
            //if(this.chats.conn){
                msgSend('pullUserLists', '')
            //}
            uni.onSocketMessage((mobj) => {
                let res = msgFormat(mobj, 'getUserLists')
                if(res.rows){
                    this.lists = res.rows
                } 
            })
		},
        computed: mapState(['hasLogin','userInfo','chats']),
		methods: {
            ...mapMutations(['login','logout']),
            uinit() {
                userInit(this.userInfo)
            },
            utest(act) {
                msgSend(act, {})
            },
            conn() {
                uni.connectSocket({  
                    url: 'ws://192.168.1.228:8830/'
                })
                uni.onSocketOpen(function (res) {
                    console.log('WebSocket连接已打开-b1！');
                });  
            },
            send(msg) {
                msg = msg ? 'aaa:'+msg+':bbb' : "{key:'mykey', xdata22:{'mydata'}" 
                uni.sendSocketMessage({  
                    data: msg,
                    success: function() {  
                        console.log("数据发送成功，数据为：" + msg);  
                    }
                });  
            },
            close() {
                uni.closeSocket()
            },
            toChat(row) { 
				uni.navigateTo({
					url: "./chat?id="+row.mid+"&name="+row.mname
				})
			},
			bindClick(no, e) {
                let row = this.lists[no]
                if(e.text=='登录'){ 
                    this.login(row);
                }else{ 
                    console.log(no, e, row)
                }
			},
            userClear(){
                this.logout();
            },
            sendSysmsg(touid='0'){//var nowDate = new Date(),
                let id = 'msg_'+new Date().getTime(),
                    cjson = {text:"系统消息:某ren("+touid+")退群了!"},
                    cnow = {uid:'0', uname:'系统机器人', touid},
                    row = {id, time:'00:00', ufrom:'0', type:'text', uinfo:cnow, cjson}
                msgSend('sysMessage', row)
            },
            sendMedia(type){
                let mtab = {
                        img: {"url":"http://img.fzg360.com/share/chats/demo-200x200.jpg","w":200,"h":200},
                        voice: {"url":"http://img.fzg360.com/share/voice/demo2.mp3","length":"00:06"},
                        house: {"title":"某某广场中心","area_id":"某城区","sale":"在售","wylxArr":["写字楼","商铺"],"price":"16500元/㎡","wylx_id":"写字楼,商铺","thumb":"http://img.fzg360.com/sz/userfiles/image/20190505/bf1313f2dcd1cce04c021f6db514b78f_209_140.jpg"}
                    },
                    id = guid2('msg_'), 
                    cjson = mtab[type],
                    cnow = {uid:'36557', uname:'掌柜经纪人', touid:'31493'},
                    xrow = {id:f3msg.id, time:'', ufrom:'', type:'f3msg', uinfo:this.cnow, cjson:f3msg}
                msgSend('sendMessage', xrow)
            }
		}
	}
</script>

<style lang="less">
    
    .flex{ display:flex }
    .p25{ text-align:center; width:25% }
    .p33{ text-align:center; width:33% }
    .p50{ text-align:center; width:50% }
    .pad{ font-size:small; color:#336699; padding:1rem; }
    .pad .gray{ color:#999; }
    
	page {
		background-color: rgba(0, 0, 0, 0);
		width: 100%;
		height: 100%;
	}

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
