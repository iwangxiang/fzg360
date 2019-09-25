<template>
	<view class="housePics">
		<view>
			<fzg-icon @tap="$tool.back()" type="back" size="20"></fzg-icon>
			<view>{{swpnow.length}}/{{taball.length}}</view>
			<view @tap="tapTab(0)" :class="tabIndex ? 'comtop' : 'comtop acttop' ">全部</view>
		</view>
		<view>
			<view>
				<view class="uni-padding-wrap"><!--v-if="swpnow.length>0"-->
					<view class="page-section swiper">
						<view class="page-section-spacing"><!--v-if="resetSwiper"-->
							<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
								<swiper-item v-for="(item,index) in swpnow" :key="index">
									<view class="swiper-item uni-bg-red">
										<image :src="item.img_s"></image>
									</view>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</view>
			</view>
		</view> 
		<view>
			<scroll-view class="uni-swiper-tab" scroll-x>
				<view v-for="(name,no) in types" :key="no" class="swiper-tab-list" @tap="tapTab(no)">
					<text :class="cnts[no] ? (tabIndex==no ? 'active' : '') : 'disable'">
                    {{name}}({{cnts[no] ? cnts[no] : 0}})
                    </text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import fzgIcon from "../../components/fzg-icon/index.vue"
	export default{
		data(){
			return{
				tabIndex:0,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
                
                aid:0,
                //resetSwiper:true,
                
                imgs:[], // 原始数据
                taball:[], // 所有tab
                swpnow:[], // 当前播放
                cnts:{},
				types:[]
			}
		},
		components:{
			fzgIcon
		},
        onLoad(option) { 
			if (!option || !option.aid) {
				uni.navigateBack();
				return;
			}
            this.aid = option.aid;
        	this.getData();
        },
		methods:{
            getData(){ 
                let params = {aid:this.aid};
            	this.$http.get(this.$api.worldApi('houseDetail'), {data:params}).then(res => {
                    this.types = res.data.Cimgs
                    this.imgs = res.data.imgs
                    for(var gid in res.data.imgs){
                        let group = res.data.imgs[gid]
                        this.cnts[gid] = group.length
                        this.taball = this.taball.concat(group);
					} 
                    this.swpnow = this.taball
            	}).catch(error => {
            		uni.showToast({title:'加载数据失败'});
            	})
            },
			tapTab(index){
                if(index && !this.cnts[index]) return;
                this.autoplay = false
                //console.log('bbb:', this.swpnow)
                this.swpnow = index>0 ? this.imgs[index] : this.taball;
                //console.log('ccc:', this.swpnow)
				this.tabIndex = index
                this.autoplay = true
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../common/uni.css';
   .disable{
        /*display:none;*/
        color: #888;
    }
    .comtop, .acttop{
        padding:0 10rpx;
        border-radius:5rpx;
    }
    .acttop{
        background-color: #e5e5e5;  
    }
    .active{
        background-color: #e5e5e5;
        padding: 10rpx;
    }
	.housePics{
		&>view:nth-child(1){
			width: 750rpx;
			height: 100rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9;
			border-bottom: 1px solid #e5e5e5;
			background-color: #ffffff;
			&>view:nth-child(1){
				margin-left: 10rpx;
			}
			&>view:nth-child(2){
				color: #383838;
				font-size: 26rpx;
			}
			&>view:nth-child(3){
				margin-right: 15rpx;
				font-size: 26rpx;
			}
		}
		&>view:nth-child(2){
			width: 100vw;
			height: 100vh;
			position: fixed;
			left: 0;
			top: 100rpx;
			z-index: 9;
			background-color: #000;
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			.uni-padding-wrap{
				width: 750rpx;
				height: 380rpx;
				margin-top: -200rpx;
				padding: 0;
				.swiper {
					width: 750rpx;
					height: 380rpx;
				}
				.swiper-item {
					width: 750rpx;
					height: 380rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		&>view:nth-child(3){
			width: 750rpx;
			height: 100rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 9;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			flex-direction: row-reverse;
			align-items: flex-end;
			.uni-swiper-tab{
				height: 90rpx;
				line-height: 67rpx;
				border-bottom: none;
				border-top: 1px solid #e5e5e5;
				.swiper-tab-list{
					font-size: 24rpx;
				}
			}
		}
	}
</style>
