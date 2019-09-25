import util from '@/common/util'
import {curver} from '@/common/cfgs'
/* let city = util.getCity(); 
let siteUrl = 'https://'+city+'.fzg360.com/'; //这样写城市切换没有修改为切换的城市
console.log(siteUrl) */
let fuberUrl = 'https://fuber.fzg360.com/';
let worldUrl = 'http://192.168.1.228/worldfzg/'; // /192.168.1.228/worldfzg/ , /world.fzg360.com/
let userUrl = 'https://user.fzg360.com/';

export default {
    siteApi:(city,action) => { //站点请求接口
        return 'https://'+city+'.fzg360.com/api.php/Api8_1_5/'+action;
    },
	/* getAddress:() => { //百度定位获取地址信息
		return 'https://api.map.baidu.com/geocoder/v2/';
	}, */
	fuberApi:(action) => { //二手房请求接口
	    return fuberUrl+'index.php?m=Api&a='+action;
	},
	worldApi:(action) => { //站点请求接口
	    return worldUrl+'api/index.php?&a='+action;
	},
	userApi:(action) => { //会员中心请求接口
	    return userUrl+'index.php?v='+curver.val+'&m=Api&a='+action;
	},
    apiTab:() => { // 返回基础地址,供一些地方拼接url用于web-view
        return {fuberUrl, worldUrl, userUrl}
    }
}
