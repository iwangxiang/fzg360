<script>
    
    import {mapState,mapMutations} from 'vuex'
    //import {cfgc} from '@/common/cfgs.js'
    import {connInit} from './pages/msg/funcs'
    
	export default {
		onLaunch: function() {
			//console.log('App Launch')
			/* uni.getStorage({
				key: 'userInfo',
				success:(res) => {
					this.login(res.data);
				}
			}); */
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo) this.login(userInfo);
            // 初始化聊天，暂时支付宝小程序不连接websocket,如果服务端未开启会造成不断重连导致非常卡
			// // #ifndef MP-ALIPAY
			// this.chatInit()
			// // #endif
			this.chatInit()
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		},
        mounted:function(){
            
        },
        computed: mapState(['hasLogin','userInfo','chats']),
		methods: {
			...mapMutations(['login','setChats']),
            chatInit() {
                let user = this.userInfo,
                    chatsInfo = this.chats
                connInit(this.setChats, user, chatsInfo)
            }
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	@import url("/components/gaoyia-parse/parse.css");
	/* #endif */
</style>