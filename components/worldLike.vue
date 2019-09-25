<template>
	<view @tap="like(aid)" class="like">
		<fzg-icon class="iFzgIcon" type="dianzan-" color="#ffffff"></fzg-icon>
		{{ digg2 ? digg2 : digg }}
	</view>
</template>

<script>
import fzgIcon from './fzg-icon/index.vue';
export default {
	props: ['aid', 'digg', 'active'],
	data() {
		return {
			isDigg: false,
			digg2: ''
		};
	},
	components: {
		fzgIcon
	},
	methods: {
		like(aid) {
			this.isDigg = uni.getStorageSync(aid + 'isDigg');
			if (this.isDigg) {
				uni.showToast({ title: '文章已赞'});
			} else {
				this.diggArchive(aid);
			}
		},
		diggArchive(aid) {
			let params = { aid: aid };
			this.$http
				.get(this.$api.worldApi('diggArchive'), { data: params })
				.then(res => {
					if (res.data.status) {
						uni.showToast({ title: '点赞成功'});
						this.$http
							.get(this.$api.worldApi(this.active), { data: params })
							.then(res => {
								// console.log(res.data);
								this.digg2 = res.data.info.digg;
								uni.setStorageSync(aid + 'isDigg', true);
							})
							.catch(error => {
								uni.showToast({ title: '加载数据失败'});
							});
					} else {
						uni.showToast({ title: '点赞失败'});
					}
				})
				.catch(error => {
					uni.showToast({ title: '加载数据失败'});
				});
		}
	}
};
</script>

<style lang="less" scoped>
.like {
	width: 160upx;
	height: 60upx;
	line-height: 60upx;
	background-color: #ef7372;
	border-radius: 10upx;
	text-align: center;
	color: #ffffff;
	font-size: 26upx;
	.iFzgIcon {
		margin-right: 10upx;
	}
}
</style>
