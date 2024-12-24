<template>
	<view>
		<view class="userTop">
		    <view style="display: flex;align-items: center;">
		      <image class="icon2" src="../../static/index/dw.svg" mode="" />
		      <view style="margin-left: 10rpx;color: #353535;">xxx小区</view>
		    </view>
		    <image class="icon" src="../../static/index/sm.svg" mode="" />
		  </view>
		<view class="home_wrap">

			<!--首页广告-->
			<index-menu></index-menu>
			<view style="height: 30rpx;"></view>
			<index-ads></index-ads>
			<index-notice ref="indexNoticeRef"></index-notice>
		</view>




	</view>
</template>

<script>
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import indexAds from '@/components/index/index-ads.vue'
	import indexMenu from '@/components/index/index-menu.vue'
	import indexNotice from '@/components/index/index-notice.vue';
	import {
		getActivitiTitle,
		getCategoryList,
		loadActivites,
		loadAdverts
	} from '../../api/index/indexApi.js'
	import {
		getCommunityId,
		getMallCommunityId,
		getMallCommunityName
	} from '../../api/community/communityApi.js';

	import {
		getCurOwner
	} from '../../api/owner/ownerApi.js'

	import {
		hasLogin
	} from '../../lib/java110/page/Page.js'

	import {
		hasOwner
	} from '../../api/owner/ownerApi.js';

	import conf from '@/conf/config.js';
	import {
		autoLogin
	} from '../../api/user/sessionApi.js';
	export default {
		data() {
			return {
				
				selectCommunityName: "",
				communityId: '',
				selected: 0,
				mask1Hidden: true,
				mask2Hidden: true,
				animationData: "",
				location: "",
				characteristicSelected: [false, false, false, false, false, false, false],
				discountSelected: null,
				selectedNumb: 0,
				sortSelected: "综合排序",

			};
		},
		components: {
			uniNoticeBar,
			indexAds,
			indexMenu,
			indexNotice,
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			uni.setNavigationBarTitle({
				title: conf.systemName
			})
			this.vc.onLoad(options);
			autoLogin(options);
			//查询目录
		},

		onShareAppMessage: function() {
			return {
				title: '首页',
				path: '/pages/index/index?wAppId=' + this.vc.getWAppId(),
				success: function(res) {
					// 转发成功
				},
				fail: function(res) {
					// 转发失败
				}
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.selectCommunityName = getMallCommunityName();
			let _that = this;
			_that.location = this.vc.getStorageSync('location');
			if (hasLogin()) {
				_that.judgeBindOwnerFun();
			}
			if (this.$refs.indexNoticeRef) {
				this.$refs.indexNoticeRef._loadData();
			}
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.notices.length >= this.page * this.row) {
				this.page = this.page + 1;
				this._loadActivites();
			}
		},
		methods: {
			judgeBindOwnerFun: function() {
				//查询业主
				getCurOwner();
			},
			/**
			 * 加载活动
			 * 第一次加载是可能没有小区 则直接下载固定小区
			 *
			 */
			showModal: function(e) {
				this.vc.navigateTo({
					url: '../bindOwner/bindOwner'
				});
			},
			toPage: function(pageUrl) {
				hasOwner();
				this.vc.navigateTo({
					url: pageUrl
				});
			},
		}
	};
</script>
<style lang="less">
	@import "./index.css";
	page{
		background-color: #fff;
		padding-top: 120rpx;
	}
	.bock-icon {
		height: 34upx;
		width: 14upx;
		line-height: 100upx;
		background-color: #00AA00;
	}

	.margin-top-1 {
		margin-top: 2upx;
	}

	.tec-height {
		height: 120upx;
	}

	.home_hd {
		position: relative;
		height: 30upx;
		margin-bottom: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.home_wrap {
		padding: 20upx 20upx 0;
	}

	.home_swiper {
		margin-bottom: 20upx;
	}

	.userTop {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 0 30rpx;
	}
	
	.icon {
	  width: 60rpx;
	  height: 60rpx;
	}
	
	.icon2 {
	  width: 40rpx;
	  height: 40rpx;
	
	}
	
</style>