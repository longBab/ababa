<template>
	<view>
		<view class="block__title">充值金额</view>

		<!-- Recharge amount options -->
		<view class="amount-grid">
			<view v-for="(item, index) in rechargeOptions" :key="index"
				:class="['amount-item', selectedAmount === item.value ? 'amount-selected' : '']"
				@click="selectAmount(item.value)">
				<view class="amount-value">{{ item.value }}元</view>
				<view class="bonus-text" v-if="item.bonus">
					送{{ item.growth }}成长值 + {{ item.points }}积分
				</view>
			</view>

			<!-- Custom amount input -->

		</view>
		<view style="width: 100%;padding: 0 30rpx;">
			<view :class="['custom-input', customAmount || isFocused ? 'amount-selected' : '']">
				<input 
					type="text" 
					v-model="customAmount" 
					placeholder="请输入充值金额" 
					@input="onCustomInput"
					@focus="onCustomFocus"
					@blur="isFocused = false"
					maxlength="10">
			</view>
		</view>

		<!-- Payment method -->
		<view class="payment-section">
			<view class="block__title">支付方式</view>
			<view class="payment-options">
				<view :class="['payment-item', payMethod === 'wechat' ? 'payment-selected' : '']"
					@click="selectPayment('wechat')">
					<image src="/static/wechat-pay.png" mode="aspectFit" />
					<text>微信支付</text>
				</view>
				<view :class="['payment-item', payMethod === 'alipay' ? 'payment-selected' : '']"
					@click="selectPayment('alipay')">
					<image src="/static/alipay.png" mode="aspectFit" />
					<text>支付宝支付</text>
				</view>
			</view>
		</view>

		<!-- Bottom payment bar -->
		<view class="bottom-bar">
			<view class="total-amount">
				¥ {{ getFinalAmount() }}
			</view>
			<button class="pay-button" @click="onPayFee()">立即充值</button>
		</view>
	</view>
</template>

<script>
// pages/account/myAccount.js
import context from '../../lib/java110/Java110Context.js';
import {
	queryOwnerAccount,
	getUserId
} from '../../api/user/userApi.js';
import { getCommunityId } from '@/api/community/communityApi.js';
import { getWAppId } from '../../lib/java110/utils/StorageUtil.js'

import { payFeeApp, payFeeWechat } from '@/api/fee/feeApi.js';
export default {
	data() {
		return {
			account: {},
			amount: '',
			appId: '',
			communityId: '',
			rechargeOptions: [
				{ value: 100, bonus: false },
				{ value: 200, bonus: true, growth: 20, points: 20 },
				{ value: 500, bonus: true, growth: 50, points: 50 },
				{ value: 1000, bonus: true, growth: 100, points: 100 },
				{ value: 2000, bonus: true, growth: 200, points: 200 },
				{ value: 5000, bonus: true, growth: 500, points: 500 }
			],
			selectedAmount: 100,
			customAmount: '',
			payMethod: 'wechat',
			isFocused: false
		}
	},
	onLoad(options) {
		this.communityId = options.communityId;
		this.loadOwnerAccount();
	},
	methods: {
		loadOwnerAccount: function () {
			let _that = this;
			context.getOwner(function (_ownerInfo) {
				if (_ownerInfo) {
					queryOwnerAccount({
						page: 1,
						row: 20,
						idCard: _ownerInfo.idCard,
						link: _ownerInfo.ownerTel,
						communityId: _that.communityId,
						acctType: '2003'
					}).then((data) => {
						if (!data) {
							_that.account = {};
							return;
						}
						_that.account = data[0];
					})
				}
			});
		},
		onPayFee: function () {
			

			let finalAmount = this.getFinalAmount();
			if (!finalAmount) {
				uni.showToast({
					icon: 'none',
					title: '未填写金额'
				});
				return;
			}
			
			let _receivedAmount = finalAmount;
			let _tradeType = 'JSAPI';

			let _objData = {
				business: "preStoreOnline",
				communityId: this.communityId,
				acctId: this.account.acctId,
				feeName: '账户充值',
				receivedAmount: _receivedAmount,
				tradeType: _tradeType,
			};

			uni.setStorageSync('doing_cashier', _objData);
			uni.navigateTo({
				url: '/pages/fee/cashier?money=' + _receivedAmount + "&business=preStoreOnline&communityId=" + this.communityId + "&cashierUserId=" + getUserId()
			})
		},
		selectAmount(value) {
			this.selectedAmount = value;
			this.customAmount = '';
		},
		selectPayment(method) {
			this.payMethod = method;
		},
		onCustomInput() {
			this.selectedAmount = null;
		},
		onCustomFocus() {
			this.isFocused = true;
			this.selectedAmount = null;
		},
		getFinalAmount() {
			return this.customAmount || this.selectedAmount || 0;
		}
	}
}
</script>

<style lang="scss">
.block__title {
	padding: 30rpx;
}

.amount-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 30rpx;
	padding: 0 30rpx;
}

.amount-item {
	background: #fff;
	padding: 30rpx;
	text-align: center;
	border-radius: 8rpx;
	border: 1rpx solid #fff;

	&.amount-selected {
		background: rgba(60, 135, 245, 0.1);
		border: 1rpx solid #3c87f5;
	}
}

.amount-value {
	font-size: 32rpx;
	font-weight: bold;
}

.bonus-text {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.custom-input {
	margin-top: 30rpx;
	padding: 20rpx;
	border-radius: 8rpx;
	background: #fff;
	width: 100%;
	border: 1rpx solid #fff;

	&.amount-selected {
		background: rgba(60, 135, 245, 0.1);
		border: 1rpx solid #3c87f5;
	}

	input {
		width: 100%;

	}
}

.payment-section {
	margin-top: 40rpx;
	padding: 0 30rpx;
}

.payment-options {
	padding: 20rpx 0;
}

.payment-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border: 2rpx solid #eee;
	border-radius: 8rpx;
	background: #fff;

	&.payment-selected {
		border-color: #3c87f5;
	}

	image {
		width: 48rpx;
		height: 48rpx;
		margin-right: 20rpx;
	}
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.total-amount {
	flex: 1;
	font-size: 36rpx;
	font-weight: bold;
	padding-left: 20rpx;
}

.pay-button {
	background: #3c87f5;
	color: #fff;
	padding: 20rpx 60rpx;
	border-radius: 8rpx;
	font-size: 32rpx;
}
</style>
