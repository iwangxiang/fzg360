<template>
	<view class="newHouseDetails">
		<view class="swiper">
			<swiper class="iSwiperContent" indicator-dots="true" autoplay="true" interval="2000" duration="500" v-if="topImgs.length">
				<swiper-item v-for="(item,index) in topImgs" :key="index">
					<image @tap="goPhoto(item)" :src="item.img ? item.img : 'data:image/gif;base64,R0lGODlhgAJoAfcAANPT1f7+/tLS1P39/dXV19bW2Pv7+/z8/OLi49DQ0vPz9NnZ29fX2eHh4tjY2tvb3fX19dHR0+/v8Onp6vj4+NPT1uXl5t3d3u/v7/Pz8+fn6Ofn6fr6+vf39/Hx8ezs7ff3+Ovr7Orq6/T09dra3N3d3/z8/fT09ODg4dzc3uLi5O7u7/v7/Pb29tvb3OPj5P39/ubm5/Dw8Orq7OTk5fn5+t/f4fb29+Tk5ujo6e3t7t7e39zc3d7e4PLy8+Hh4/Dw8d/f4NfX2Pj4+fn5+enp6/r6+9bW2dXV1vX19tra29jY2dLS1fHx8uDg4tPT1P7+/f7+/9nZ2tTU1eXl5/Ly8tHR1NbW19TU1+Pj5ezs7P39/M/P0u3t7dXV2Pb2+Orq6v///u7u7uvr7djY2+np6ebm6Pv7+uzs7t7e4dDQ0+Pj4+vr6+Xl5dnZ3Ojo6O3t7+jo6uLi4ufn59vb28/P0fX19Pr6+eLi5ebm5tLS0/X199/f3/Hx8+/v8fPz9fz8+/Ly9Nvb3tfX2t3d4M7O0N3d3fT09vb29dra2vj499ra3dzc3+Dg4+7u8Pf39tTU2PLy8eHh4fj4+vz8/t/f4t7e3vr6/Pv7/dnZ2fDw8tHR0u7u7dLS1v39/+Pj5s3Nzs3N0PPz8unp7Pf39dDQ0fn5+PHx8OTk5Pf3+f///9TU1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5RjNBNTk2Q0YyMzExRTdBN0EwQjRERTkxQkUzNzQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5RjNBNTk3Q0YyMzExRTdBN0EwQjRERTkxQkUzNzQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTlGM0E1OTRDRjIzMTFFN0E3QTBCNERFOTFCRTM3NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTlGM0E1OTVDRjIzMTFFN0E3QTBCNERFOTFCRTM3NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAf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'"></image>
					<view class="swiperTitleText">
						<view>
							<text>{{info.title}}</text>
							<template v-if="info.lpbm">
							<text>别名：</text>
							<text>{{info.lpbm}}</text>
							</template>
						</view>
						<view>
							<text>{{info.area_id}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<swiper class="iSwiperContent" v-else>
				<swiper-item>
					<image :src="info.thumb ? info.thumb : 'data:image/gif;base64,R0lGODlhgAJoAfcAANPT1f7+/tLS1P39/dXV19bW2Pv7+/z8/OLi49DQ0vPz9NnZ29fX2eHh4tjY2tvb3fX19dHR0+/v8Onp6vj4+NPT1uXl5t3d3u/v7/Pz8+fn6Ofn6fr6+vf39/Hx8ezs7ff3+Ovr7Orq6/T09dra3N3d3/z8/fT09ODg4dzc3uLi5O7u7/v7/Pb29tvb3OPj5P39/ubm5/Dw8Orq7OTk5fn5+t/f4fb29+Tk5ujo6e3t7t7e39zc3d7e4PLy8+Hh4/Dw8d/f4NfX2Pj4+fn5+enp6/r6+9bW2dXV1vX19tra29jY2dLS1fHx8uDg4tPT1P7+/f7+/9nZ2tTU1eXl5/Ly8tHR1NbW19TU1+Pj5ezs7P39/M/P0u3t7dXV2Pb2+Orq6v///u7u7uvr7djY2+np6ebm6Pv7+uzs7t7e4dDQ0+Pj4+vr6+Xl5dnZ3Ojo6O3t7+jo6uLi4ufn59vb28/P0fX19Pr6+eLi5ebm5tLS0/X199/f3/Hx8+/v8fPz9fz8+/Ly9Nvb3tfX2t3d4M7O0N3d3fT09vb29dra2vj499ra3dzc3+Dg4+7u8Pf39tTU2PLy8eHh4fj4+vz8/t/f4t7e3vr6/Pv7/dnZ2fDw8tHR0u7u7dLS1v39/+Pj5s3Nzs3N0PPz8unp7Pf39dDQ0fn5+PHx8OTk5Pf3+f///9TU1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk5RjNBNTk2Q0YyMzExRTdBN0EwQjRERTkxQkUzNzQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk5RjNBNTk3Q0YyMzExRTdBN0EwQjRERTkxQkUzNzQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTlGM0E1OTRDRjIzMTFFN0E3QTBCNERFOTFCRTM3NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTlGM0E1OTVDRjIzMTFFN0E3QTBCNERFOTFCRTM3NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAf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'"></image>
					<view class="swiperTitleText">
						<view>
							<text>{{info.title}}</text>
							<template v-if="info.lpbm">
							<text>别名：</text>
							<text>{{info.lpbm}}</text>
							</template>
						</view>
						<view>
							<text>{{info.area_id}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="iconList" :class="[iconListDefaultFlag?'iconListDefault':'iconListFixed']">
			<view>
				<view @tap="goPath('detail')">
					<view v-if="iconList">
						<image src="../../static/iconDetails.png"></image>
					</view>
					<text>详情</text>
				</view>
				<view @tap="goPath('dynamic')">
					<view v-if="iconList">
						<image src="../../static/iconDynamic.png"></image>
					</view>
					<text>动态</text>
				</view>
				<view @tap="goPath('hxList')">
					<view v-if="iconList">
						<image src="../../static/iconHouseType.png"></image>
					</view>
					<text>户型</text>
				</view>
				<view v-if="buildingArr.length" @tap="goPath('building')">
					<view v-if="iconList">
						<image src="../../static/iconFloor.png"></image>
					</view>
					<text>楼栋</text>
				</view>
			</view>
		</view>
		<view class="houseTextDetails">
			<view>
				<view>
					<text>均价 : {{info.price}}</text>
					<!-- <text>参考首付：60万元</text> -->
				</view>
				<!-- <view>
					<view>
						<image src="../../static/iconCalc.png"></image>
					</view>
					<text>参考月供：6000元</text>
				</view> -->
			</view>
			<view>
				<view @tap="goMap">
					<view>
						<text>地址：</text>
						<text>{{info.address}}</text>
					</view>
					<uni-icon class="iUniIcon" type="forward"></uni-icon>
				</view>
				<view @tap="goPath('dynamic')">
					<view>
						<text>开盘：</text>
						<text>{{info.kpsj}}（{{info.sale}}）</text>
					</view>
					<uni-icon class="iUniIcon" type="forward"></uni-icon>
				</view>
			</view>
			<view>
				<view v-for="(item,index) in info.wylxArr" :key="index">
					<text>{{item}}</text>
				</view>
			</view>
			<view>
				<view v-for="(item,index) in popupList" :key="index" @tap="goPopup(index)">
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		
		<view class="groupBuy" v-if="Object.keys(tuan).length">
			<view class="sectionName1">
				<text>掌柜团</text>
				<view>
					<text>{{tuan.enrollnum}}人已报名</text>
					<uni-icon class="iUniIcon" type="forward" color="#9e9e9e"></uni-icon>
				</view>
			</view>
			<view class="sectionName2">
				<view>
					<image src="https://static.fzg360.com/images/app/nopic.gif"></image>
				</view>
				<view>
					<view>{{tuan.title}}</view>
					<view>
						<fzg-icon type="down" size="20" color="#E83836"></fzg-icon>
						<text>{{tuan.favprice}}</text>
					</view>
					<view>
						<text>倒计时</text>
						<uni-countdown :day="day" :hour="hour" :minute="minute" :second="second" color="#9e9e9e" background-color="#EAEAEA" border-color="#EAEAEA"></uni-countdown>
					</view>
				</view>
			</view>
		</view>
		
		<view class="houseType" v-if="zlhx.length">
			<view>
				<view @tap="goPath('hxList')">
					<text>主力户型（{{zlhxTotal}}）</text>
					<view>
						<text>显示全部</text>
						<uni-icon class="iUniIcon" type="forward" color="#9e9e9e"></uni-icon>
					</view>
				</view>
				<view>
					<!-- #ifndef MP-ALIPAY -->
					<swiper class="iSwiperContent" autoplay="true" interval="5000" duration="500" :display-multiple-items="zlhxTotal >= 3 ? 3 : zlhxTotal" next-margin="10px">
						<swiper-item class="iSwiperContentItem" v-for="(item,index) in zlhx" :key="index" @tap="goTypeDetail(item.outsid,item.id)">
							<view class="swiperContent">
								<view class="sectionName1">{{item.xiangq}}</view>
								<view class="sectionName2">{{item.price}}</view>
								<view class="iSwiperContentImage">
									<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<!-- #endif  -->
					<!-- #ifdef MP-ALIPAY -->
					<scroll-view scroll-x="true">
						<view class="iScrollViewAlipy">
							<view class="isAlipay" v-for="(item,index) in zlhx" :key="index" @tap="goTypeDetail(item.outsid,item.id)">
								<view class="swiperContent isAlipayScroll">
									<view class="sectionName1">{{item.xiangq}}</view>
									<view class="sectionName2">{{item.price}}</view>
									<view class="iSwiperContentImage">
										<image :src="item.thumb ? item.thumb : 'https://static.fzg360.com/images/app/nopic.gif'"></image>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<!-- #endif -->
				</view>
			</view>
		</view>
		
		<view class="houseDynamic" v-if="dynamic.length || news.length">
			<view>
				<view>
					<!-- 这里动态的根据是否有楼盘导购来确定是否是TAB切换的模式，如果只有楼盘动态，没有楼盘导购则就不会是Tab切换的类型 -->
					<view v-if="dynamic.length" :class="{active:dynamicActiveFlag}" @tap="dynamicActive">
						<text>楼盘动态</text>
					</view>
					<!-- 如果有楼盘导购则显示该标题，如果没有楼盘导购则不显示该标题 -->
					<view v-if="news.length" :class="{active:shoppingActiveFlag}" @tap="shoppingActive">
						<text>楼盘导购</text>
					</view>
				</view>
				<view class="iUniIcon" @tap="goPath('dynamic')">
					<uni-icon type="forward" color="#9e9e9e" size="20"></uni-icon>
				</view>
			</view>
			<view>
				<view v-if="dynamic.length && dynamicActiveFlag" @tap="goPath('dynamic')">
					<view class="viewDynamicCont">
						<house-dynamic v-for="(item,index) in dynamic" :key="index" :item="item"></house-dynamic>
					</view>
				</view>
				<!-- 如果有楼盘导购则显示该模块，如果没有楼盘导购则不显示该模块 -->
				<view v-if="news.length && shoppingActiveFlag">
					<view class="viewShoppingCont">
						<house-shopping v-for="(item,index) in news" :key="index" :item="item" :site="site"></house-shopping>
					</view>
				</view>
			</view>
		</view>
		
		<view class="building" v-if="Object.keys(shapan).length && shapan.thumb" @tap="goPath('building')">
			<view class="sectionName1">
				<text>楼栋信息</text>
				<uni-icon class="iUniIcon" type="forward" size="20" color="#9e9e9e"></uni-icon>
			</view>
			<view class="sectionName2">
				<view class="sectionName2Position">
					<view class="viewLeft1" v-for="(item,index) in building" :key="index" :style="{top: (item.topRelative) + 'px' , left: (item.leftRelative) + 'px'}">
						<text>{{item.title}}</text>
						<!-- <text>{{item.saleText}}</text> -->
						<fzg-icon class="fzgIcon" type="open" size="10" color="#EE9044"></fzg-icon>
					</view>
				</view>
				<image :src="shapan.thumb" :style="{width: thumbW + 'px',height:thumbH + 'px'}"></image>
			</view>
		</view>
		
		<view class="like">
			<view>
				<view>
					<text>对该楼盘感兴趣的人还看了</text>
				</view>
				<view class="iHouseList">
					<house-lists v-for="item in nearbyHouses" :key="item.id" :item="item" :site="site"></house-lists>
				</view>
			</view>
		</view>
		<view class="statement">
			<view>
				<text>
					免责声明：本站楼盘信息旨在为用户提供更多信息的无偿服务，信息以政府部门登记备案为准，请谨慎核查。
				</text>
			</view>
		</view>
		<view class="footer">
			<view>
				<view @tap="doCollect">
					<view>
						<image :src="loveFlag ? '../../static/love2.png' : '../../static/love.png'"></image>
					</view>
					<text>{{loveFlagText}}</text>
				</view>
				<view>
					<view>
						<text @tap="toChat()">掌聊</text>
					</view>
					<view @tap="addOrder">
						<text>预约看房</text>
					</view>
					<view @tap="$util.doCall('',info.tel)">
						<text>拨打热线</text>
					</view>
				</view>
			</view>
		</view>
		
		<share-popup :show="show" :shareParams="shareParams" @hidePopup="closePoP"></share-popup>
		
		<view class="goPopupView" v-if="popupViewFlag">
			<view class="sectionName1">
				<image src="../../static/remind.png"></image>
			</view>
			<view class="sectionName2">{{popupFlag}}通知</view>
			<view class="sectionName3">{{popupFlag}}消息会通过短信及推送消息通知您</view>
			<view class="sectionName4">
				<text>手机号</text>
				<input type="number" v-model="phone" placeholder="请输入您的手机号码">
			</view>
			<view class="sectionName5">
				<view @tap="goCloseMask">取消</view>
				<view @tap="houseNotice">确认</view>
			</view>
		</view>
		<view class="goPopupMask" v-if="popupMaskFlag" @touchstart="goCloseMask"></view>
		<view class="goLoveView" v-if="loveViewFlag">
			<view>
				<view>温馨提醒</view>
				<view>收藏成功</view>
			</view>
			<view>
				<text @tap="goCollection">查看我的收藏</text>
				<text @tap="goCloseMask">继续看房</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {uniIcon} from '@dcloudio/uni-ui'
	import fzgIcon from '@/components/fzg-icon/index.vue'
	import houseLists from "../../components/houseLists.vue"
	import sharePopup from "../../components/sharePopup.vue";
	import uniCountdown from '../../components/uni-countdown/uni-countdown.vue'
	import houseDynamic from "../../components/houseDynamic.vue";
	import houseShopping from "../../components/houseShopping.vue";
    import {mapState,mapMutations} from 'vuex'
    
	export default {
		onLoad(option) {
			if(!option || !option.id){
				uni.navigateBack();
				return;
			}
			this.id = option.id;
			if(option.opt) this.opt = option.opt;
			this.site = option.site ? option.site : this.$city; //根据广告通栏的链接所在站点
			const res = uni.getSystemInfoSync();
			this.viewW = res.windowWidth;
			this.viewH = res.windowWidth/1.5;
			if (this.hasLogin && this.userInfo.mtel) {
				this.phone = this.userInfo.mtel;
				if(uni.getStorageSync('collect_lpids_'+this.site)){
					this.collectHouseIds = uni.getStorageSync('collect_lpids_'+this.site);
					if(this.collectHouseIds.includes(this.id)){
						this.loveFlag = true;
						this.loveFlagText = '已收藏';
					}
				}
			}
			uni.$once('login',() => { //监听登录事件
				if (this.hasLogin && this.userInfo.hash) {
					if(uni.getStorageSync('collect_lpids_'+this.site)){
						this.collectHouseIds = uni.getStorageSync('collect_lpids_'+this.site);
						if(this.collectHouseIds.includes(this.id)){
							this.loveFlag = true;
							this.loveFlagText = '已收藏';
						}
					}
				}
			})
			this.getData();
		},
		onReady(){
			let menuSelectView = uni.createSelectorQuery().select(".iconList");
			menuSelectView.boundingClientRect(data => {
				this.selectTop = data.top;
				//console.log(this.selectTop)
			}).exec();
		},
		data() {
			return {
				selectTop:'',
				iconList:true,
				iconListDefaultFlag:true,
				colorFlag:0,
				fzgIconColor:"#fff",
				lxlocationIcon:"white",
				talknewsIcon:"white",
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				titleFlag:false,
				dynamicActiveFlag:true,
				shoppingActiveFlag:false,
				newHouseItems:[],
				show:false,
				popupViewFlag:false,
				popupMaskFlag:false,
				popupFlag:"",
				popupList:["降价通知我","开盘通知我"],
				loveFlag:false,
				loveFlagText:"收藏",
				loveViewFlag:false,
				
				phone:'', //手机号
				typeOpen:0,//开盘通知
				typeDown:0, //降价通知
				id:'', //楼盘id
				info:{},//详情数据
				shareParams:{},//分享对象
				tuan:{},//掌柜团
				day:0,
	    		hour:0,
	    		minute:0,
	    		second:0,
				zlhx:[],//主力户型
				zlhxTotal:0,//户型总数
				catalog:{}, //相册分类
				topImgs:[], //轮播图
	    		hxImgs:[], //户型图
				imgs:{}, //所有图片
				imgsTotal:0, //图片总数
	    		dynamic:[], //楼盘动态
	    		news:[], //楼盘导购
				shapan:{}, //沙盘
				building:{}, //楼栋对象集
	    		buildingArr:[], //楼栋
                managers:[], // 经纪人(多个)
				viewW:0,
				viewH:0,
				thumbW:0,//沙盘图片计算后的相对宽度
				thumbH:0,//沙盘图片计算后的相对高度
	    		nearbyHouses:[], //感兴趣楼盘
				collectHouseIds:[],
				opt:'',
				site:''
			}
		},
		components: {
			uniIcon,
			fzgIcon,
			houseLists,
			sharePopup,
			uniCountdown,
			houseDynamic,
			houseShopping
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
        
		methods: {
			...mapMutations(['setChats']),
            goPhoto(item){
				let data = {
					key:item.key,
					catalog:this.catalog,
					imgs:this.imgs,
					imgsTotal:this.imgsTotal,
					tel:this.info.tel,
					managers:this.managers
				};
				uni.navigateTo({
					url:`/pages/house/pics?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
			goMap(){
				let data = {
					id:this.id,
					title:this.info.title,
					address:this.info.address,
					price:this.info.price,
					thumb:this.info.thumb,
					lng:this.info.dt_lng,
					lat:this.info.dt_lat,
					zbpt:this.info.zbpt,
					jtzk:this.info.jtzk
				};
				uni.navigateTo({
					url:`/pages/house/map?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
			goPath(type){
				uni.navigateTo({
					url:type == 'building' ? './'+type+'?id='+this.id+'&shapanId='+this.shapan.id+(this.site != this.$city ? '&site='+this.site : '') : './'+type+'?id='+this.id+(this.site != this.$city ? '&site='+this.site : '')
				})
			},
			goTypeDetail(outsid,id){
				uni.navigateTo({
					url:'./hxView?id='+id+(outsid ? '&outsid='+outsid : '')+(this.site != this.$city ? '&site='+this.site : '')
				})
			},
			goCollection(){
				uni.navigateTo({
					url:'../user/vlogs'
				});
				this.goCloseMask();
			},
			goCloseMask(){
				setTimeout(()=>{
					this.popupViewFlag=false;
					this.popupMaskFlag=false;
					this.loveViewFlag=false;
				},150);
			},
			goPopup(index){
				this.typeOpen = index ? 1 : 0;
				this.typeDown = index ? 0 : 1;
				this.popupFlag=index?"开盘":"降价";
				this.popupViewFlag=true;
				this.popupMaskFlag=true;
			},
			dynamicActive(){
				this.dynamicActiveFlag=true;
				this.shoppingActiveFlag=false;
			},
			shoppingActive(){
				this.dynamicActiveFlag=false;
				this.shoppingActiveFlag=true;
			},
			showCountDown(year,month,day){
				var now = new Date(); 
				var endDate = new Date(year, month-1, day); 
				var leftTime = endDate.getTime()-now.getTime(); 
				var leftsecond = parseInt(leftTime/1000);
				if(Math.floor(leftsecond/(60*60*24)) < 0) return;
				this.day = Math.floor(leftsecond/(60*60*24)); 
				this.hour = Math.floor((leftsecond-this.day*24*60*60)/3600); 
				this.minute = Math.floor((leftsecond-this.day*24*60*60-this.hour*3600)/60) >= 10 ? Math.floor((leftsecond-this.day*24*60*60-this.hour*3600)/60) : '0'+Math.floor((leftsecond-this.day*24*60*60-this.hour*3600)/60); 
				this.second = Math.floor(leftsecond-this.day*24*60*60-this.hour*3600-this.minute*60) >= 10 ? Math.floor(leftsecond-this.day*24*60*60-this.hour*3600-this.minute*60) : '0'+Math.floor(leftsecond-this.day*24*60*60-this.hour*3600-this.minute*60);
			},
			houseNotice() {
				if(!this.phone || this.phone.length !== 11 || !/^1[345678]\d{9}$/.test(this.phone)){
					uni.showToast({icon: 'none',title: '手机号不正确'});
					return;
				}
				let params = {phone: this.phone, aid: this.id, city: this.site,area_id:this.info.ar_id,type_open:this.typeOpen,type_down:this.typeDown};
				this.$http.post(this.$api.userApi('houseNotice'), { data: params}).then(res => {
					this.goCloseMask();
					uni.showToast({ title: res.data.info, icon: 'none'});
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			doCollect() {
				if(!this.hasLogin || !this.userInfo.hash){
					this.$util.ckLogin('/pages/house/home?id='+this.id+(this.site != this.$city ? '&site='+this.site : ''),'doCollect');
					return;
				}
				let params = {aid: this.id,type:3, city: this.site };
				this.$http.get(this.$api.userApi('collect'), { data: params }).then(res => {
					if (res.data.status) {
						if(this.loveFlag){
							if(this.collectHouseIds.includes(this.id)){
								this.collectHouseIds.splice(this.collectHouseIds.findIndex(item => item === this.id), 1);
								uni.setStorageSync('collect_lpids_'+this.site,this.collectHouseIds);
							}
							uni.showToast({ title: res.data.info, icon: 'none'});
						}else{
							if(this.collectHouseIds.includes(this.id)) return;
							this.collectHouseIds.push(this.id);
							uni.setStorageSync('collect_lpids_'+this.site,this.collectHouseIds);
						}
						this.loveFlag = !this.loveFlag;
						this.popupMaskFlag = this.loveViewFlag = this.loveFlag ? true : false;
						this.loveFlagText = this.loveFlag ? '已收藏' : '收藏';
					}
				}).catch(error => {
					uni.showToast({title:'该用户无效',icon:'none'});
				});
			},
			addOrder() {
				if(!this.hasLogin || !this.userInfo.hash){
					this.$util.ckLogin('/pages/house/home?id='+this.id+(this.site != this.$city ? '&site='+this.site : ''));
					return;
				}
				if (!this.userInfo.mtel) {
					uni.showModal({
						title: '提示',
						content: '请先绑定手机号',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/bindTel'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '您确定要预约吗?',
					success: (res) => {
						if (res.confirm) {
							let params = {houseid: this.id, city: this.site};
							this.$http.get(this.$api.userApi('addOrder'), { data: params}).then(res => {
								if(res.data.status){
									uni.showModal({
										title: '温馨提示',
										content: res.data.info,
										cancelText: '好的',
										confirmText: '查看预约',
										success: (res) => {
											if (res.confirm) {
												uni.navigateTo({
													url:'../user/appointment'
												})
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
								}else{
									uni.showToast({ title: res.data.info, icon: 'none'});
								}
							}).catch(error => {
								console.log(error);
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			initShapanSize() {
				var l = this.shapan.shapanW,h = this.shapan.shapanH,
				c = this.viewW,k = this.viewH,
				d,g,j,e;
				g = l > this.viewW ? this.viewW : l;
				d = g / l * h;
				j = g / c;
				e = d / k;
				if (j < 1 || e < 1) {
					if (j > e) {
						d = k;
						g = d / h * l
					} else {
						g = c;
						d = g / l * h
					}
				}
				this.thumbW = g;
				this.thumbH = d;
				/* console.log(this.viewW)
				console.log(this.thumbW)
				console.log(this.thumbH) */
			},
			initBuildingSpans() {
				let labelW = 90,labelH = 18;
				let o = this.thumbW,h = this.thumbH,c = {x: labelW / 2,y: labelH};
				for (let i in this.building) {
					let m = this.building[i],
					g = (Number.parseInt(m.left)+c.x)/this.shapan.shapanW * o,
					q = (Number.parseInt(m.top)+c.y)/this.shapan.shapanH * h;
					this.building[i].leftRelative = g - c.x;
					this.building[i].topRelative = q - c.y;
				}
				this.buildingArr = Object.values(this.building);
			},
			getData(){
				let params = { id: this.id };
				this.$http.get(this.$api.siteApi(this.site, 'houseDetail'), { data: params }).then(res => {
					if (res.data.code == 0) {
						this.shareParams = {
							title:res.data.data.info.title,
							desc:res.data.data.info.abstract,
							img: res.data.data.info.thumb,
							link:res.data.data.info.weburl
						};
						// #ifdef H5
						if (this.$wechat && this.$wechat.isWeixin()) {
							this.shareParams.link = window.location.href;
							this.$wechat.share(this.shareParams);
						}
						// #endif
						// #ifndef H5
						uni.setStorageSync('houseDetails',res.data.data.info);
						// #endif
						let broswerRecords = uni.getStorageSync('brecords_'+this.site) || {}; //浏览记录				
						if(Object.keys(broswerRecords).length >= 30){
							for(let i in broswerRecords){
								delete broswerRecords[i];
								break;
							} 
						}
						broswerRecords[this.site+this.id+'_house'] = { //以城市+楼盘id+_类型
							id:this.id,
							title:res.data.data.info.title,
							thumb:res.data.data.info.thumb,
							area_id:res.data.data.info.area_id,
							wylxArr:res.data.data.info.wylxArr,
							sale_id:res.data.data.info.sale_id,
							sale:res.data.data.info.sale,
							price:res.data.data.info.price,
							type:'house'
						};
						uni.setStorageSync('brecords_'+this.site,broswerRecords);
						//console.log(uni.getStorageSync('brecords_'+this.site))
						this.info = res.data.data.info;
						if(res.data.data.tuan){
							this.tuan = res.data.data.tuan;
							this.showCountDown(this.tuan.end_timeArr[0],this.tuan.end_timeArr[1],this.tuan.end_timeArr[2]);
						}
						/* if (res.data.data.building) {
							this.building = Object.values(res.data.data.building);
							//console.log(res.data.data.building)
							//for(var i in res.data.data.building) this.building.push(res.data.data.building[i]);
						} */
						if(res.data.data.shapan){
							this.shapan = res.data.data.shapan;
							uni.getImageInfo({
								src: this.shapan.thumb,
								success:(image) => {
									/* console.log(image.width);
									console.log(image.height); */
									this.shapan.shapanW = image.width;
									this.shapan.shapanH = image.height;
									this.initShapanSize();
									if(res.data.data.building){
										this.building = res.data.data.building;
										//this.buildingArr = Object.values(res.data.data.building);
										this.initBuildingSpans();
										//console.log(this.building)
									}
								}
							});
						}
						this.zlhx = res.data.data.zlhx;
						this.zlhxTotal = res.data.data.zlhxTotal;
						this.dynamic = res.data.data.dynamic;
						this.news = res.data.data.news;
						this.catalog = res.data.data.Cimgs;
						res.data.data.imgs && (this.imgs = res.data.data.imgs);
						this.imgsTotal = res.data.data.imgsTotal;
						res.data.data.topimgs && (this.topImgs = Object.values(res.data.data.topimgs));
						this.nearbyHouses = res.data.data.nearbyHouses;
                        this.managers = res.data.data.manager;
						if(this.hasLogin && this.userInfo.hash && this.opt){
							setTimeout(() => {
								this.doCollect();
							},1000)
						}
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none'});
					}
				})
				.catch(error => {
					uni.showToast({ title: '加载数据失败', icon: 'none'});
				});
			},
			closePoP(){
				this.show = false;
			},
            toChat() { 
                if(!this.hasLogin || !this.userInfo.mid){
                    this.$tool.tab('user/index', '请登录聊天')
                }
                if(this.managers[0]){ // 多个经纪人,设置pop弹窗选择?
                    let ir = this.info, mr = this.managers[0]
                    let f3msg = {id:ir.id, type:'house', title:ir.title, area_id:ir.area_id,
                        sale:ir.sale, price:ir.price, wylx_id:ir.wylx_id, thumb:ir.thumb}
                    this.setChats({key:'f3msg', val:f3msg}) // 保存楼盘(房源)信息
                    let params = "id="+mr.mid+"&name="+mr.name+"&thumb="+mr.thumb
                    uni.navigateTo({
                    	url: "/pages/msg/chat?"+params
                    })
                }else{
                    uni.showToast({title:'没有设置聊天经纪人。'})
                }
            }
		},
		// #ifdef APP-PLUS || H5
		onNavigationBarButtonTap(e){
			if(e.index == 0){
				this.toChat();
			}else{
				// #ifdef H5
				uni.showToast({ title: '请在手机浏览器中进行分享', icon: 'none' });
				// #endif
				// #ifdef APP-PLUS
				this.show = true;
				// #endif
			}
		},
		// #endif
		// #ifdef MP
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自右上角分享按钮
				uni.showToast({ title: '分享成功', icon: 'none' });
			}
			return {
				title: this.shareParams.title,
				path: '/pages/house/home?id='+this.id,
				imageUrl: this.shareParams.img,
				desc: this.shareParams.desc,
			}
		},
		// #endif
		onPageScroll(e) {
			let flag=0;
			// #ifdef !MP
				flag=44;
			// #endif
			//console.log(e.scrollTop+"---"+(this.selectTop-flag));
			// #ifdef APP-PLUS
			const res = uni.getSystemInfoSync();
			flag = 44+Number(res.statusBarHeight); //app端有状态栏的高度
			// #endif
			if(e.scrollTop >= this.selectTop-flag){
				this.iconList=false;
				this.iconListDefaultFlag=false;
			}else{
				this.iconList=true;
				this.iconListDefaultFlag=true;
			}
		}
	}
</script>

<style lang="less" scoped>
	.newHouseDetails {
		background-color: #F9F9F9;
		padding-bottom: 117rpx;
		.swiper{
			height: 500rpx;
			border-bottom: 1px solid #e5e5e5;
			.iSwiperContent{
				height: 500rpx;
				image{
					width: 100%;
					height: 100%;
				}
				.swiperTitleText{
					position: absolute;
					left: 21rpx;
					bottom: 104rpx;
					z-index: 9;
					& text{
						color: #ffffff;
					}
					&>view:nth-child(1){
						&>text:nth-child(1){
							font-size: 40rpx;
							margin-right: 20rpx;
						}
						&>text:nth-child(2),&>text:nth-child(3){
							font-size: 28rpx;
						}
					}
					&>view:nth-child(2){
						&>text:nth-child(1){
							font-size: 28rpx;
						}
					}
				}
			}
		}
		
		.iconListDefault{
			padding: 45rpx 90rpx;
		}
		
		.iconListFixed{
			width: 100%;
			padding: 20rpx 90rpx;
			box-sizing: border-box;
			position: fixed;
			/* #ifdef MP */
			top: 0;
			/* #endif */
			/* #ifdef !MP */
			top:44px;
			/* #endif */
			z-index: 9;
		}
		
		.iconList{
			background-color: #ffffff;
			&>view:nth-child(1){
				display: flex;
				justify-content: space-between;
				&>view{
					text{
						font-size: 28rpx;
						color: #3f3f3f;
					}
				}
				&>view:nth-child(1){
					&>view:nth-child(1){
						width: 44rpx;
						height: 50rpx;
						margin: 0 auto;
						/* #ifdef MP-ALIPAY */
						margin-bottom:15rpx;
						/* #endif */
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				&>view:nth-child(2){
					&>view:nth-child(1){
						width: 44rpx;
						height: 50rpx;
						margin: 0 auto;
						/* #ifdef MP-ALIPAY */
						margin-bottom:15rpx;
						/* #endif */
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				&>view:nth-child(3){
					&>view:nth-child(1){
						width: 44rpx;
						height: 50rpx;
						margin: 0 auto;
						/* #ifdef MP-ALIPAY */
						margin-bottom:15rpx;
						/* #endif */
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				&>view:nth-child(4){
					&>view:nth-child(1){
						width: 49rpx;
						height: 49rpx;
						margin: 0 auto;
						/* #ifdef MP-ALIPAY */
						margin-bottom:15rpx;
						/* #endif */
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
		.houseTextDetails{
			padding: 0 20rpx;
			margin-top: 24rpx;
			background-color: #ffffff;
			padding-bottom: 26rpx;
			&>view:nth-child(1){
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				padding-top: 20rpx;
				&>view:nth-child(1){
					&>text{
						display: block;
					}
					&>text:nth-child(1){
						color: #e83836;
						font-size: 32rpx;
					}
					&>text:nth-child(2){
						font-size: 24rpx;
						margin-top: 20rpx;
					}
				}
				&>view:nth-child(2){
					margin-top: 25rpx;
					&>view:nth-child(1){
						width: 44rpx;
						height: 46rpx;
						margin-left: 100rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					&>text:nth-child(2){
						font-size: 24rpx;
						color: #3f3f3f;
						margin-top: 20rpx;
						display: block;
					}
				}
			}
			&>view:nth-child(2){
				&>view:nth-child(1),&>view:nth-child(2){
					display: flex;
					justify-content: space-between;
					margin-top: 20rpx;
					&>view:nth-child(1){
						&>text:nth-child(1){
							font-size: 32rpx;
							color: #000000;
						}
						&>text:nth-child(2){
							font-size: 32rpx;
							color: #3f3f3f;
						}
					}
					.iUniIcon{
						margin-top: 13rpx;
					}
				}
			}
			&>view:nth-child(3){
				margin: 60rpx auto 0;
				display: flex;
				&>view{
					width: 118rpx;
					height: 37rpx;
					line-height: 37rpx;
					font-size: 26rpx;
					border: 1px solid #9E9E9E;
					border-radius: 5px;
					text-align: center;
					color: #e83836;
					margin-right: 20rpx;
				}
			}
			&>view:nth-child(4){
				margin: 44rpx auto 0;
				border-top: 1px solid #E5E5E5;
				display: flex;
				justify-content: space-around;
				&>view{
					width: 50%;
					padding: 20rpx 0;
					text{
						width: 216rpx;
						height: 40rpx;
						display: block;
						font-size: 32rpx;
						color: #3f3f3f;
						margin: 0 auto;
						text-indent: 50rpx;
					}
					&>text:nth-child(1){
						background: url(../../static/iconPriceReduction.png) 0 0 no-repeat;
						background-size: 40rpx;
					}
					&>text:nth-child(2){
						background: url(../../static/iconOpening.png) 0 0 no-repeat;
						background-size: 40rpx 40rpx;
					}
				}
				&>view:nth-child(1){
					border-right: 1px solid #e5e5e5;
				}
			}
		}
		
		.groupBuy{
			background-color: #ffffff;
			margin-top: 24rpx;
			.sectionName1{
				height: 112rpx;
				padding: 0 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #E5E5E5;
				&>text{
					color: #3f3f3f;
					font-size: 32rpx;
				}
				&>view{
					&>text{
						font-size: 28rpx;
						color: #9e9e9e;
					}
				}
			}
			.sectionName2{
				padding: 40rpx 20rpx;
				display: flex;
				justify-content: space-between;
				&>view:nth-child(1){
					width: 248rpx;
					height: 178rpx;
					border: 1px solid #F7F7F7;
					image{
						width: 100%;
						height: 100%;
					}
				}
				&>view:nth-child(2){
					font-size: 32rpx;
					width: 388rpx;
					height: 178rpx;
					margin-left: 30rpx;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					&>view:nth-child(1){
						color: #484848;
						overflow:hidden; 
						text-overflow:ellipsis;
						white-space:nowrap; 
					}
					&>view:nth-child(2){
						color: #9e9e9e;
						&>text{
							margin-left: 10rpx;
						}
					}
					&>view:nth-child(3){
						color: #9e9e9e;
					}
				}
			}
		}
		
		.houseType{
			margin-top: 24rpx;
			background-color: #ffffff;
			&>view{
				padding: 0 20rpx;
				&>view:nth-child(1){
					display: flex;
					justify-content: space-between;
					height: 112rpx;
					line-height: 112rpx;
					border-bottom: 1px solid #E5E5E5;
					&>text{
						font-size: 32rpx;
						color: #3f3f3f;
					}
					&>view{
						&>text{
							font-size: 28rpx;
							color: #9e9e9e;
						}
					}
				}
				&>view:nth-child(2){
					.iSwiperContent{
						height: 350rpx;
						.iSwiperContentItem{
							height: 350rpx;
							.swiperContent{
								.sectionName1{
									color: #3f3f3f;
									font-size: 32rpx;
									margin-top: 20rpx;
									overflow:hidden; 
									text-overflow:ellipsis;
									white-space:nowrap;
								}
								.sectionName2{
									font-size: 28rpx;
									color: #e83836;
									overflow:hidden; 
									text-overflow:ellipsis;
									white-space:nowrap; 
								}
								.iSwiperContentImage{
									width: 200rpx;
									height: 200rpx;
									margin-top: 20rpx;
									image{
										width: 100%;
										height: 100%;
										border: 1px solid #E5E5E5;
									}
								}
							}
						}
					}
					.iScrollViewAlipy{
						display: flex;
						.isAlipay{
							.swiperContent{
								width: 225rpx;
								.sectionName1{
									color: #3f3f3f;
									font-size: 32rpx;
									margin-top: 20rpx;
									overflow:hidden; 
									text-overflow:ellipsis;
									white-space:nowrap;
								}
								.sectionName2{
									font-size: 28rpx;
									color: #e83836;
									overflow:hidden; 
									text-overflow:ellipsis;
									white-space:nowrap; 
								}
								.iSwiperContentImage{
									width: 200rpx;
									height: 200rpx;
									margin-top: 20rpx;
									image{
										width: 100%;
										height: 100%;
										border: 1px solid #E5E5E5;
									}
								}
							}
						}
					}
				}
			}
		}
		.houseDynamic{
			margin-top: 24rpx;
			background-color: #ffffff;
			padding:0 20rpx;
			&>view:nth-child(1){
				height: 112rpx;
				line-height: 112rpx;
				margin: 0 auto;
				border-bottom: 1px solid #E5E5E5;
				display: flex;
				justify-content: space-between;
				&>view{
					display: flex;
					&>view{
						&>text{
							font-size: 32rpx;
							color: #3f3f3f;
						}
					}
					&>view:nth-child(1){
						margin-right: 50rpx;
					}
					&>view.active{
						border-bottom: 2px solid red;
					}
				}
				.iUniIcon{
					width: 40rpx;
					margin-top: 40rpx;
				}
			}
			&>view:nth-child(2){
				.viewDynamicCont{
					padding-bottom: 80rpx;
				}
				.viewShoppingCont{
					// ...
				}
			}
		}
		
		.building{
			background-color: #ffffff;
			margin-top: 24rpx;
			.sectionName1{
				height: 112rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 20rpx;
			}
			.sectionName2{
				.sectionName2Position{
					position: relative;
					&>view{
						background-color: #EE9044;
						width:180rpx;
						height: 30rpx;
						line-height: 30rpx;
						padding: 5rpx;
						font-size: 12px;
						color: #ffffff;
						z-index: 9;
						text-align: center;
						position: absolute;
						.fzgIcon{
							position: absolute;
							bottom: -15rpx;
							left: 30rpx;
						}
					}
				}
				height: 500rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.like{
			margin-top: 24rpx;
			background-color: #ffffff;
			&>view{
				&>view:nth-child(1){
					height: 112rpx;
					line-height: 112rpx;
					padding: 0 20rpx;
					border-bottom: 1px solid #E5E5E5;
					&>text{
						font-size: 32rpx;
						color: #3f3f3f;
					}
				}
			}
		}
		.statement{
			background-color: #F0F0F0;
			padding: 35rpx 0;
			&>view{
				padding: 0 20rpx;
				line-height: 100%;
				&>text{
					font-size: 18rpx;
					color: #cccccc;
				}
			}
		}
		.footer{
			width: 100%;
			height: 117rpx;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;
			left: 0;
			border-top: 1px solid #E5E5E5;
			box-sizing: border-box;
			padding: 0 20rpx;
			&>view{
				height: 117rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				align-items: center;
				&>view:nth-child(1){
					width: 90rpx;
					text-align: center;
					&>view{
						width: 43rpx;
						height: 35rpx;
						margin: 0 auto;
						image{
							width: 100%;
							height: 100%;
						}
					}
					&>text{
						font-size: 24rpx;
						color: #6e6e6e;
					}
				}
				&>view:nth-child(2){
					display: flex;
					justify-content: flex-end;
					flex: 1;
					&>view{
						width: 30%;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						background-color: #EF8733;
						border-radius: 5px;
						margin-left: 10rpx;
						&>text{
							font-size: 32rpx;
							color: #ffffff;
						}
					}
					&>view:last-child{
						background-color: #e83836;
					}
				}
			}
		}
		.goPopupView{
			width: 542rpx;
			height: 536rpx;
			padding: 20rpx 0;
			box-sizing: border-box;
			background-color: #ffffff;
			border-radius: 20rpx;
			position: fixed;
			left: 0;
			top: 0;
			left: 50%;
			top: 50%;
			margin-left: -271rpx;
			margin-top: -268rpx;
			z-index: 20;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items:center;
			align-content:space-around;
			.sectionName1{
				width: 108rpx;
				height: 108rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.sectionName2{
				font-size: 26rpx;
				color: #3f3f3f;
			}
			.sectionName3{
				font-size: 26rpx;
				color: #9e9e9e;
			}
			.sectionName4{
				width: 85%;
				display: flex;
				height: 58rpx;
				line-height: 58rpx;
				justify-content: space-between;
				&>text{
					font-size: 26rpx;
					color: #3f3f3f;
				}
				&>input{
					width: 370rpx;
					height: 58rpx;
					border: 1px solid #e5e5e5;
					font-size: 28rpx;
					padding-left: 10rpx;
					box-sizing: border-box;
				}
			}
			.sectionName5{
				width: 85%;
				display: flex;
				justify-content: space-between;
				&>view{
					width: 210rpx;
					height: 60rpx;
					font-size: 26rpx;
					text-align: center;
					line-height: 60rpx;
				}
				&>view:nth-child(1){
					border: 1px solid #e5e5e5;
					border-radius: 10rpx;
					color: #3f3f3f;
					box-sizing: border-box;
				}
				&>view:nth-child(2){
					background-color: #E83836;
					border-radius: 10rpx;
					color: #ffffff;
				}
			}
		}
		.goPopupMask{
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			background-color: #000000;
			opacity: .3;
			z-index: 19;
		}
		.goLoveView{
			width: 540rpx;
			height: 218rpx;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -270rpx;
			margin-top: -109rpx;
			z-index: 20;
			background-color: #ffffff;
			border-radius: 20rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items:center;
			align-content:space-around;
			&>view:nth-child(1){
				padding: 30rpx 0;
				&>view:nth-child(1){
					font-size: 34rpx;
					color: #3f3f3f;
				}
				&>view:nth-child(2){
					font-size: 28rpx;
					color: #3f3f3f;
					margin-top:5rpx;
				}
			}
			&>view:nth-child(2){
				width: 100%;
				display: flex;
				justify-content: space-between;
				height: 60rpx;
				line-height: 60rpx;
				border-top: 1px solid #e5e5e5;
				&>text{
					flex: 1;
					display: block;
				}
				&>text:nth-child(1){
					border-right: 1px solid #e5e5e5;
				}
				&>text:nth-child(1),&>text:nth-child(2){
					font-size: 28rpx;
					color: #3379F4;
				}
			}
		}
	}
</style>
