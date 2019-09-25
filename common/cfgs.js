
/* 后续相关参数与配置,都写到这里来吧 (Peace) */

// 当前版本,用于更新
let curver = {
    key: 815, 
    val: '8.1.5'
}
// 静态配置
let statics = {
    //jq: 'test'
    s3rd: 'http://static.my_domain.com/h5/3rd/',
    favor: 'http://static.my_domain.com/h5/favor/',
    basic: 'http://static.my_domain.com/h5/basic/'
}
// 聊天配置
let chats = {
    upload: 'http://192.168.1.228/house/public/api.php/chat/upload', // 上传api地址，安全等后续评估
    server: 'wss://xxx.fzg360.com:8830/',
    svloc: 'ws://192.168.1.228:8830/', // 测试用
    part: 'svloc' //
};
//都市房产评论配置
let dsfcChats = {
    server: 'wss://121.40.22.214:8888/',
    svloc: 'ws://192.168.1.228:8827/', // 测试用
    part: 'svloc' //
};
//高德微信小程序key
let aMapWxKey = '9406420da8ba41fe097b682e0c558fe6';
/*
let apib = {
    url: 'http://xxx.fzg360.com/xxx/run',
    ver: 'nver',
    psk: 'api-3333-IywfA-givEQ-zXTLt-LQtpf'
};
let apim = {
    url: 'http://xxx.fzg360.com/xxx/run',
    ver: 'nver',
    psk: 'api-4444-IywfA-givEQ-zXTLt-LQtpf'
}; 
*/

export {
    curver, statics,chats, dsfcChats,aMapWxKey
}
