<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" 
                :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop"
                :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="0">
				<!-- 加载历史数据waitingUI -->
				<view v-if="loading" class="loading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
                <view v-if="!hasmore" class="nomore">
                    <text>没有更多信息!</text>
                </view>
                <view v-for="(row,index) in msgList" :key="index" :id="'msg_no'+row.id">
                    <msg-one :row="row" :imgList="imgList" :cnow="cnow" 
                        :msgList="msgList" :index="index"></msg-one> 
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="iSwiper emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'https://static.fzg360.com/images/app/chat/img/emoji/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon tupian2"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
					
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 || MP-ALIPAY -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<view class="textbox">
                <!-- #ifndef H5 || MP-ALIPAY -->
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" 
                    @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" 
                    @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
                <!-- #endif -->
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		
	</view>
</template>

<script>
    
    import msgOne from '@/pages/msg/msgOne.vue'
    import {mapState,mapMutations} from 'vuex'
    import {msgSend,msgFormat,setPicSize,emitMessage,fmtStamp,
        emojiList, replaceEmoji, upapi} from './funcs' 
  
	export default {
        components: {
        	msgOne
        },
		data() {
			return {
                option:{},
				//文字消息
                hasmore:1,
				textMsg:'',
				//消息列表
                loading:0,
				isHistoryLoading:true,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				imgList:[],
                
				cnow: {
                    touid: '',
                    toThumb: '/static/zl_head.jpg',
                    logo: '/static/logo.png'
                }, // 当前用户 
				//录音相关参数
				// #ifndef H5 || MP-ALIPAY
				//H5不能录音
				RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
				// 抽屉参数
				popupLayerClass:'',
				// more参数
				hideMore:true,
				//表情定义
				hideEmoji:true,
				emojiList:[],
				//红包相关参数
				windowsState:'',
				redenvelopeData:{
					rid:null,	//红包ID
					from:null,
					face:null,
					blessing:null,
					money:null
				},
                site:''
			};
		},
		onLoad(option) {
            this.site = option.site ? option.site : this.$city;
            this.option = option
            this.emojiList = emojiList
            this.initUser()
            uni.onSocketClose((res) => {
                uni.showToast({ title:'会话中断,1分钟后自动重连！'});
                this.initReset() // '会话中断,1分钟后自动重连！' 
            }) 
            this.initList()
            this.initRecord()
		},
        onBackPress() { // 监听页面返回
            this.cnow['touid'] = '';
            msgSend('setNowConversation', this.cnow)
            this.setChats({key:'touid', val:''})
        },
		computed: mapState(['hasLogin','userInfo','chats']),
		methods:{
            ...mapMutations(['setChats']),
            // init-聊天用户
            initUser(){ 
                let option = this.option,
                    item = this.userInfo
                if(!option.id || !option.name){
                    this.$tool.nav('msg/list', '请选择聊天对象！')
                }
                if(option.id==item.mid){
                    this.$tool.nav('msg/list', '不能跟自己聊天！')
                }
                if(!this.hasLogin || !item.mid){
                    this.$tool.tab('user/index', '请登录聊天！')
                } 
                if(!this.chats.conn){
                    this.$tool.tab('user/index', '会话未连接,点击重新进入！')
                }
                uni.setNavigationBarTitle({title:option.name})
                this.cnow = {uid:item.mid, uname:item.mname, thumb:item.thumb,
                    touid:option.id, toname:option.name}
                msgSend('setNowConversation', this.cnow)
                this.setChats({key:'touid', val:option.id})
                if(option.topic){ this.cnow.topic = option.topic; }
                uni.onSocketMessage((mobj) => {
                    this.getMsg(mobj)
                })
            },
            initReset(){
                console.log('会话中断,等待重连！')
                setTimeout(()=>{ 
                    if(this.chats.conn){
                        this.initUser()
                    }else{
                        this.initReset()
                    }
                }, 30000)  
            },
            
			// 加载初始页面消息
			initList(){
                // 拉取消息
                this.cnow.last = 0; // 第一次拉取
                this.loading = 1
                msgSend('pullHistoryMessages', this.cnow)
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					})
				})
			},
            // getMsg
            getMsg(mobj){
                let mget = msgFormat(mobj)
                if(mget.key=='getMessage'){ 
                    this.showMsg(mget.val)
                    if(''+mget.val.ufrom!=''+this.cnow.uid){
                        //console.log('振动');
                        //uni.vibrateLong();
                    } 
                }
                if(mget.key=='getHistoryMessages'){ 
                    let arr = mget.val.data; //.reverse(),
                    if(arr.length<=0){ 
                        this.hasmore = 0
                        this.loading = 0
                        this.scrollAnimation = true; //恢复滚动动画
                        return
                    }
                    let f3msg = (!this.cnow.last && this.chats.f3msg) ? this.chats.f3msg : null
                    let vmin = '', vmax = '', f3tab = ';' // ;hosue123;sale:456;rent789;
                    for(let i=0;i<arr.length;i++) {
                        arr[i]['cjson'] = JSON.parse(arr[i]['cjson'])
                        if(i==arr.length-1){
                            this.cnow.last = arr[i].id // 记住第一个信息ID,下次拉取使用
                            vmin = arr[i].id
                        }
                        if(i==0){ vmax = arr[i].id } // 记住滚动位置id
                        this.showMsg(arr[i], 1)
                        if('(house,rent,sale)'.indexOf(arr[i].type)>0){
                            f3tab += arr[i].type+arr[i]['cjson'].id+';'
                        }
                    }
                    if(f3msg && f3msg.title){
                        let xrow = {id:f3msg.id, type:'f3msg', uinfo:this.cnow, cjson:f3msg}
                        if(f3tab.indexOf(f3msg.type+f3msg.id+';')<0){
                            this.showMsg(xrow, 0)
                        }else{
                            this.setChats({key:'f3msg', val:0})
                        } // 历史记录中有这个楼盘/房源信息,就不再显示`发送`了
                    }
                    //这段代码很重要，不然每次加载历史数据都会跳到顶部
					this.$nextTick(function() {
                        // 跳转上次的第一行信息位置
						this.scrollToView = 'msg_no'+vmax //(this.pfirst ? vmax : vmin);
                        this.pfirst = 0;
						this.$nextTick(function() {
							this.scrollAnimation = true; //恢复滚动动画
						});
					});
                    this.isHistoryLoading = false;
                    this.loading = 0;
                }   
            },
			// 接受消息(筛选处理)
			showMsg(row, his){ 
				if(''+row.ufrom=='0'){ // 系统消息
					switch (row.type){
						//case 'redEnvelope':
                        default: // text
						    his ? this.msgList.unshift(row) : this.msgList.push(row);
					}
				}else{ // 用户消息
					switch (row.type){
						case 'img':
                            row.cjson = setPicSize(row.cjson);
                            this.imgList.push(row.cjson.url);
                            his ? this.msgList.unshift(row) : this.msgList.push(row);
							break;
                        default: // text,img,voice,lpInfor
                            his ? this.msgList.unshift(row) : this.msgList.push(row);
					}
				}
                if(!his){
                    this.$nextTick(function() { // 滚动到底
                        this.scrollToView = 'msg_no'+row.id
                    });
                }
			},
			
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){ 
				if(this.isHistoryLoading || !this.hasmore){ return; } 
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
                this.loading = 1;
                msgSend('pullHistoryMessages', this.cnow)
			},
			//更多功能(点击+弹出) 
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				if(this.hideMore){
					this.hideMore = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
				// uni.navigateTo({
				// 	url:'HM-hand/HM-hand'
				// });
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type){
				this.hideDrawer();
				uni.chooseImage({
					sourceType:[type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=>{
						for(let i=0; i<res.tempFilePaths.length; i++){
                            let turl = res.tempFilePaths[i]; 
                            let size = 1; // 随便写一个哄支付宝(它更不支持size)...
                            // #ifndef MP-ALIPAY
                            size = res.tempFiles[i].size
                            // #endif
							uni.getImageInfo({
								src: turl,
								success: (img)=>{
                                    let stamp = (new Date()).getTime()/1000,
                                        sk = this.userInfo.mtel +'^'+ this.userInfo.hash +'^'+ stamp,
                                        info = {w:img.width, h:img.height, size, turl, sk}
                                    const uploadTask = uni.uploadFile({
                                        url:upapi(), filePath:turl, name:'file', formData:info,
                                        fileType:'image', // 仅支付宝小程序需要此参数
                                        success: (ures) => {
                                            let res = JSON.parse(ures.data), mid = this.userInfo.mid,
                                                row = {url:res.data.url, w:img.width, h:img.height, mid}
                                            if(res.code || !res.data.url){
                                                uni.showToast({title:'图片上传错误!'})
                                            }else{
                                                this.sendMsg(row,'img')
                                            } //console.log('flag:', res, row)
                                        }
                                    });
								}
							});
						}
					}
				});
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em){
				this.textMsg+=em.alt;
			},
			
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText(){
				this.hideDrawer();//隐藏抽屉
				if(!this.textMsg){
					return;
				}
				//let html = replaceEmoji(this.textMsg); 
				let cjson = {text:this.textMsg} // this.textMsg
				this.sendMsg(cjson,'text');
				this.textMsg = '';//清空输入框
			},
			
			// 发送消息
			sendMsg(cjson,type){
                let row = emitMessage(this.cnow, type, cjson)
				this.showMsg(row);
			},
            
            initRecord(){
                // #ifndef H5 || MP-ALIPAY
                //录音开始事件
                this.RECORDER.onStart((e)=>{
                    this.recordBegin(e);
                })
                //录音结束事件
                this.RECORDER.onStop((e)=>{
                    this.recordEnd(e);
                })
                // #endif
            },
            // #ifndef H5 || MP-ALIPAY
			// 录音开始
			voiceBegin(e){
                if(!this.RECORDER){return}
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
                if(!this.RECORDER){return}
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(res){
                if(!this.RECORDER){return}
				clearInterval(this.recordTimer);
				if(!this.willStop){
					let min = parseInt(this.recordLength/60); min = min<10?'0'+min : min
					let sec = this.recordLength%60; sec = sec<10?'0'+sec : sec
                    // row = {length:min+':'+sec, turl}
                    let stamp = (new Date()).getTime()/1000,
                        sk = this.userInfo.mtel +'^'+ this.userInfo.hash +'^'+ stamp,
                        row = {length:min+':'+sec, sk}
                    const uploadTask = uni.uploadFile({
                        url:upapi()+'?type=file', filePath:res.tempFilePath, name:'file', formData:row,
                        success: (ures) => {
                            let res = JSON.parse(ures.data)
                            if(res.code || !res.data.url){
                                uni.showToast({title:'语音上传错误!'})
                            }else{
                                row.url = res.data.url
                                row.mid = this.userInfo.mid
                                this.sendMsg(row, 'voice')
                            } //console.log('flag:', res, row)
                        }
                    })
				}else{
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
            // 切换语音/文字输入 
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
            // #endif
			discard(){
				return;
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/chat/chats.scss"; 
    .nomore{ margin:auto; text-align:center; margin:0.5rem; }
    .nomore text{ color:#FFF; background:#CCC; font-size:0.7rem; padding:0.1rem 0.5rem; border-radius:10px; }
	.iSwiper{
		height: 300rpx !important;
	}
</style>
