<template>
	<view class="container">
		<!-- 账户余额卡片 -->
		<view class="balance-card">
			<view class="balance-header">
				<view class="coupon-entry" @click="coupons">
					<uni-icons type="gift" size="24" color="#ff2442"></uni-icons>
					<text>优惠券</text>
				</view>
			</view>
			<view class="balance-left">
				<view class="balance-title">我的余额(元)</view>
				<view class="balance-amount" @click="myAccountDetail(accounts[0])">
					{{ accounts.length > 0 ? accounts[0].amount : '0.00' }}
				</view>
				<view class="balance-total">累计余额: {{ accounts.reduce((sum, acc) => sum + Number(acc.amount),
					0).toFixed(2)}} 元</view>
			</view>
			<button @click="_toPrestoreAccount" class="recharge-btn">充值</button>
		</view>

		<!-- 无数据展示 -->
		<view class="empty-state" v-if="accounts.length === 0">
			<text>暂无账户记录</text>
		</view>
	</view>
</template>

<script>
// pages/account/myAccount.js
import context from '../../lib/java110/Java110Context.js';
import {
	queryOwnerAccount
} from '../../api/user/userApi.js';
import { getCommunityId } from '../../api/community/communityApi.js'

export default {
	data() {
		return {
			accounts: []
		};
	},

	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		context.onLoad(options);
		this.loadOwnerAccount();
	},


	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () { },

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () { },
	methods: {
		coupons: function (_item) {
			this.vc.navigateTo({
				url: '/pages/coupon/myCoupons',
			})
		},
		myAccountDetail: function (_item) {
			this.vc.navigateTo({
				url: '/pages/account/myAccountDetail?acctId=' + _item.acctId + '&acctType=' + _item.acctType
			});
		},
		/**
		 * 载业主房屋信息
		 */
		loadOwnerAccount: function () {
			let _that = this;
			context.getOwner(function (_ownerInfo) {
				if (_ownerInfo) {
					queryOwnerAccount({
						page: 1,
						row: 20,
						idCard: _ownerInfo.idCard,
						link: _ownerInfo.ownerTel,
						communityId: _ownerInfo.communityId
					}).then((data) => {
						if (!data) {
							_that.accounts = [];
							return;
						}
						_that.accounts = data;
					})
				}
			});
		},
		_toPrestoreAccount: function () {
			const userInfo = uni.getStorageSync('userInfo');
			uni.navigateTo({
				url: `/pages/test/test?url=${this.baseUrl + '/pages/account/preStoreAccount'}&username=${userInfo.ownerTel}&password=${userInfo.ownerTel}`
			})
			// uni.navigateTo({
			// 	url:'/pages/account/preStoreAccount?communityId='+getCommunityId()
			// })
		}
	}
};
</script>
<style>
.container {
	min-height: 100vh;
	background-color: #ffffff;
}

.balance-card {
	text-align: center;
	padding: 60rpx 40rpx;
	width: 90vw;
	background: #ffffff;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	border-radius: 20rpx;
	margin: 20rpx;
}

.balance-header {
	justify-content: flex-end;
	margin-bottom: 20rpx;
}

.balance-left {
	text-align: center;
	width: 100%;
}

.balance-title {
	font-size: 28rpx;
	color: #999;
}

.balance-amount {
	font-size: 80rpx;
	font-weight: 500;
	margin: 20rpx 0;
}

.balance-total {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 40rpx;
}

.coupon-entry {
	display: flex;
	flex-direction: column;
	align-items: flex-end;

}

.coupon-entry text {
	font-size: 24rpx;
	color: #ff2442;
	margin-top: 8rpx;
}

.recharge-btn {
	width: 95%;
	height: 88rpx;
	line-height: 88rpx;
	background: #ff2442;
	color: #fff;
	border-radius: 44rpx;
	font-size: 32rpx;
	border: none;
}

.empty-state {
	padding-top: 300rpx;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}
</style>
