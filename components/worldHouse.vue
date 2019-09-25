<template>
    <view @tap="goView(row)" class="iHouse">
        <view>
            <image :src="row.thumb ? row.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
        </view>
        <view>
            <view>
                {{row.subject}}
            </view>
            <view>
                [{{row.ccid1title}}] {{row.ccid12title[0]}}
            </view>
            <view>
                <text>{{row.zjloc}}</text>
                <text>| {{row.zjrmb}}万</text>
            </view>
            <view v-if="row.keywords[0]">
                {{row.keywords[0]}}
            </view>
            <view v-if="row.keywords[1]">
                {{row.keywords[1]}}
            </view>
            <view v-if="row.keywords[2]">
                {{row.keywords[2]}}
            </view>
        </view>
    </view>

</template>

<script>
    // 如果没有其他中文字,打开默认就是gbk编码(不管他实际是什么编码),
    // 多加些中文字,默认就是utf-8编码了。
	export default{
        props: ['row'],
		methods:{
			goView(row){
				uni.navigateTo({
					url:"/pages/world/houseView?aid="+row.aid
				})
			}
		}
	}
</script>

<style lang="less" scoped>
    .iHouse{
		width: 345rpx;
        margin-bottom: 30rpx;
        &>view:nth-child(1){
			width: 345rpx;
            height: 250rpx;
            image{
				width: 100%;
                height: 100%;
            }
        }
        &>view:nth-child(2){
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding: 10rpx;
            box-sizing: border-box;
            background-color: #F7F7F7;
			&>view{
				overflow:hidden; /*内容超出宽度时隐藏超出部分的内容 */
                text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
                white-space:nowrap; /*不换行 */
			}
            &>view:nth-child(1){
                font-size: 30rpx;
                color: #383838;
                margin-bottom: 10rpx;
            }
            &>view:nth-child(2){
                font-size: 22rpx;
                color: #333333;
                margin-bottom: 5rpx;
            }
            &>view:nth-child(3){
                font-size: 22rpx;
                &>text:nth-child(1){
                    color: #e83836;
                    margin-right: 10rpx;
                }
                &>text:nth-child(2){
                    color: #333333;
                }
                margin-bottom: 10rpx;
            }
            &>view:nth-child(4),&>view:nth-child(5),&>view:nth-child(6){
                font-size: 22rpx;
                display:inline-block;
                height: 26rpx;
                line-height: 26rpx;
                text-align: center;
                color: #14C26C;
                border-radius: 3px;
                padding: 2rpx;
                border: 1px solid #14C26C;
                margin: 0 15rpx 10rpx 0;
                overflow:hidden; 
                text-overflow:ellipsis;
                white-space:nowrap;
            }
        }
    }

</style>
