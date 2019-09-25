
//import {http as cfgs} from './cfgs'

// 常用方法,免得页面的`methods`里写很多重复方法
export default {
     
   // 路由与页面跳转方法, @tap="$tool.nav('news/view?id='+row.id)"
   
    nav:(path, msg='') => {
        if(msg) uni.showToast({title:msg})
        let tick = msg ? 1000 : 97
        setTimeout(()=> {
            uni.hideToast()
        	uni.navigateTo({
        	    url: '/pages/' + path
        	});
        }, tick);
    },
    back:(opt={}) => {
        uni.navigateBack();
    },
    tab:(path, msg='') => {
        if(msg) uni.showToast({title:msg})
        let tick = msg ? 1000 : 97
        setTimeout(()=> {
            uni.hideToast()
        	uni.switchTab({
        	    url: '/pages/' + path
        	});
        }, tick);
    }

}

/*

*/
