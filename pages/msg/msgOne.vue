<template>
    <view class="row">
        <!-- 系统消息 -->
        <block v-if="''+row.ufrom=='0'">
            <view class="system">
                <!-- 文字消息 -->
                <view v-if="row.type=='text'" class="text">
                    {{row.cjson.text}}
                </view>
            </view>
        </block>
        <!--发送楼盘信息-->
        <view v-else-if="row.type=='f3msg'" class="chat-lp-bg">
        	<image :src="row.cjson.thumb"></image>
        	<view class="chat-lp-right">
        		<view class="infoBox">
        			<view class="lpName">{{row.cjson.title}}</view>
        			<view class="lpMj">{{row.cjson.sale}}</view> 
        			<view class="lpMj">{{row.cjson.wylx_id}}<text>|</text>{{row.cjson.sale}}</view>
        			<view class="lpPrice">{{row.cjson.price}}</view>
        		</view>
        		<view class="ljBnt" @tap="sendLink(index)">发送链接</view>
        	</view>
        </view>
        <!-- 用户消息(my+other) -->
        <block v-else>
            <view :class="''+row.ufrom==''+cnow.uid ? 'my' : 'other'">
                <!-- 左-头像 -->
                <view v-if="row.ufrom!=cnow.uid" class="left">
                    <image :src="cnow.topic"></image>
                </view>
                <!-- 右-用户名称-时间-消息 -->
                <view :class="row.ufrom==cnow.uid ? 'left' : 'right'">
                    <view v-if="row.ufrom!=cnow.uid" class="username">
                        <view class="name">{{cnow.toname}}</view>
                        <view class="time">{{vtime(row)}} :{{row.id}}</view>
                    </view>
                    <!-- 文字消息 -->
                    <view v-if="row.type=='text'" class="bubble">
                        <view style="display:flex; align-items:center; word-wrap:break-word;">
                            <!-- #ifdef MP-ALIPAY -->
                            {{row.cjson.text}}
                            <!-- #endif -->
                            <!-- #ifndef MP-ALIPAY -->
                            <rich-text :nodes="vtext(row)"></rich-text>
                            <!-- #endif -->
                        </view>
                    </view>
                    <!-- 语音消息 -->
                    <view v-if="row.type=='voice'" class="bubble voice" 
                        @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
                        <view v-if="row.ufrom!=cnow.uid" class="icon other-voice"></view>
                        <view class="length">{{row.cjson.length}}</view>
                        <view v-if="row.ufrom==cnow.uid" class="icon my-voice"></view>
                    </view>
                    <!-- 图片消息 -->
                    <view v-if="row.type=='img'" class="bubble img" @tap="showPic(row)">
                        <image :src="row.cjson.url"
                            :style="{'width': row.cjson.w+'px','height': row.cjson.h+'px'}"></image>
                    </view>
                    <!-- 楼盘消息 -->
                    <view v-if="row.type=='house'" class="lp-bubble lp-box" >
                        <view class="lpinfo-l">
                            <view class="lpName">{{row.cjson.title}}</view>
                            <view class="lpMj">{{row.cjson.area_id}}</view>
                            <view class="lpMj">{{row.cjson.wylx_id}}<text>|</text>{{row.cjson.sale}}</view>
                            <view class="lpPrice">{{row.cjson.price}}</view>
                        </view>
                        <image :src="row.cjson.thumb"></image>
                    </view>  
                </view>
                <!-- 右-头像 -->
                <view v-if="row.ufrom==cnow.uid" class="right">
                    <image :src="cnow.thumb"></image>
                </view>
            </view>
        </block>
    </view>  
</template>
	
<script>

    import {mapState,mapMutations} from 'vuex'
    import {msgSend,fmtStamp,emitMessage,replaceEmoji} from './funcs.js'
    //import uParse from '@/components/gaoyia-parse/parse.vue';

	export default {
        props: ['row','imgList','cnow','msgList','index'], // 'myuid','thumb','logo'
        components: {  }, // uParse
		data() {
			return {
				//播放语音相关参数 
                // #ifndef H5 || MP-ALIPAY
				AUDIO:uni.createInnerAudioContext(),
                // #endif
				playMsgid:null,
				VoiceTimer:null,
			};
		},
		onLoad(option) {
            //语音自然播放结束
            if(!this.RECORDER){return}
            this.AUDIO.onEnded((res)=>{
            	this.playMsgid=null;
            });
		},
		
		methods:{
            ...mapMutations(['setChats']),
            vtext(row){
                let ali = 0; //row.cjson.text ? row.cjson.text : '(null)'
                // #ifdef MP-ALIPAY
                ali = 1;
                // #endif
                let res = replaceEmoji(row.cjson.text, ali) //;console.log(res)
                return res
            },
            vtime(row){
                if(row.time){
                    return row.time
                }
                if(row.atime){
                    return fmtStamp(row.atime)
                }
            },
            sendLink(index){
                let type = 'house' // this.msgList[index].cjson.type
                let row = emitMessage(this.cnow, type, this.msgList[index].cjson)
                this.msgList.push(row) 
                this.msgList.splice(index,1)
                this.setChats({key:'f3msg', val:0})
            },
			// 播放语音
			playVoice(row){
                if(!this.RECORDER){return}
				this.playMsgid = row.id;
				this.AUDIO.src = row.cjson.url;
				this.$nextTick(function() {
					this.AUDIO.play();
                    let tmp = row.cjson.length.split(':'),
                        sec = parseInt(tmp[0]) *60 + parseInt(tmp[1])
                    setTimeout(()=>{ //this.AUDIO.stop();
                        this.playMsgid = '';
                    }, sec*1000)
				});
			},
            showPic(row){ 
            	uni.previewImage({
            		indicator:"none",
            		current:row.cjson.url,
            		urls: this.imgList
            	});
            },
            fend(){
                //
            }
		}
	}
</script>


<style lang="scss">
    
	@import "@/static/chat/chats.scss"; 
  
	.lp-bubble{
					max-width: 70%;
					min-height: 50upx;
					border-radius: 10upx;
					padding: 15upx 20upx;
					display: flex;
					align-items: center;
					font-size: 32upx;
					word-break: break-word;
					background-color: #fff;
					}
	.lp-box{
		display: flex;	
		flex-direction:row;
		justify-content: space-between;
		align-content: center;
		align-items:center;
		.lpinfo-l{
			flex: 1;
			.lpName{
				font-size: 30rpx;
				color: #383838;
			}
			.lpPrice{
				font-size: 24rpx;
				color: #e83836;
			}
			.lpMj{
				font-size: 24rpx;
				text{
				 margin: 0 5px;
				}
			}
			.ljBnt{
				font-size: 26rpx;
				color: #e83836;
				border: 1px #e83836 solid;
				border-radius: 5px;
				padding: 3px 10px;
			}
		}
		image{
			width: 128rpx;
			height: 128rpx;
			margin-left: 20px;
		}
	}
 
	.chat-lp-bg{ 
		background-color: #fff; 
		padding:10px;
		display: flex;	
		flex-direction:row;
		/* position: fixed;
		top:60px;
		left: 0; */
		width: 100%;
		box-sizing: border-box;
		z-index: 9999;
		border-radius: 5px;
		image{
			width: 232rpx;
			height: 155rpx;
			margin-right: 10px;
		}
		.chat-lp-right{
			flex: 1;
			display: flex;	
			flex-direction:row;
			justify-content: space-between;
			align-content: center;
			align-items:center;
			.infoBox{
				display: flex;	
				flex-direction: column;
				justify-content: space-between;
				flex: 1;
				
			}
			.lpName{
				font-size: 30rpx;
				color: #383838;
			}
			.lpPrice{
				font-size: 24rpx;
				color: #e83836;
			}
			.lpMj{
				font-size: 24rpx;
				text{
				 margin: 0 5px;
				}
			}
			.ljBnt{
				font-size: 26rpx;
				color: #e83836;
				border: 1px #e83836 solid;
				border-radius: 5px;
				padding: 3px 10px;
			}
		}
	}
    
    
</style>
