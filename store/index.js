import Vue from 'vue'
import Vuex from 'vuex'
import {msgSend,userInit} from '@/pages/msg/funcs'

Vue.use(Vuex)

//const socketPrefix = 'SOCKET_'

const store = new Vuex.Store({
	state: {
		userInfo: {},
		hasLogin: false,
        chats:{ // 聊天相关
            //sid: '', // 会话seesion-id
            conn: 0, // 连接情况:0-断开, 1-连接
            touid: 0, // 当前正在和谁对话,断开后重连使用
            unread: 0, // 未读消息数量
            online:0 ,// 在线人数
            // cnow :{uid, uname, thumb, touid, toname, topic, optop, opuid}
            // message:{}, // 最后信息
            f3msg:{} // 楼盘房源信息
        }
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider ? provider : {};
			uni.setStorageSync('userInfo',provider);
            if(state.chats.conn){ // 初始化聊天用户
                userInit(state.userInfo, state.chats)
            }
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {}
			uni.removeStorage({
				key: 'userInfo'
			});
		},
        setChats(state, data) {
            state.chats[data.key] = data.val
            if(data.key!='sid') return
            /* uni.setStorage({
            	key: 'chats_'+data.key,
            	data: data.val
            }) */
			uni.setStorageSync('chats_'+data.key,data.val);
        },
        getMessage(state, data){
            console.log('store: ', data)
            state.chats.message = data;
        }
	}
})

export default store
