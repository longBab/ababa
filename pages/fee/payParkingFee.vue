<template>
	<view>

		<scroll-view scroll-y>
			<view class="block__title">车位信息</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">小区</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{communityName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">车位编号</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{num + '号车位'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">车位类型</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feeTypeCdName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">车牌号</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{carNum}}</text>
					</view>
				</view>
			</view>
			<view class="block__title">费用信息</view>
			<view class="cu-list menu fee-last">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">费用编号</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feeId }}</text>
					</view>
				</view>
				<view class="cu-item" v-if="feeFlag == '1003006'">
					<view class="content">
						<text class="text-grey">金额</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feePrice + '元/月' }}</text>
					</view>
				</view>
				<view class="cu-item" v-else>
					<view class="content">
						<text class="text-grey">金额</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feePrice + '元' }}</text>
					</view>
				</view>
				<view class="cu-item arrow" v-if="feeFlag == '1003006'">
					<view class="content">
						<text class="text-grey">周期</text>
					</view>
					<view class="action">
						<picker bindchange="PickerChange" :value="index" :range="feeMonthList" @change="dateChange">
							<view class="picker">
								{{feeMonthName}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" v-if="feeFlag != '2006012'">
					<view class="content">
						<text class="text-grey">缴费后时间</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{endTime }}</text>
					</view>
				</view>
				<gift-coupon ref="giftCoupon" ></gift-coupon>
				<vcUserAccount ref="vcUserAccountRef" @getUserAmount="getUserAmount"></vcUserAccount>
				<vc-discount ref="vcDiscountRef" @computeFeeDiscount="computeFeeDiscount" :endTime="formatEndTime" :feeId="feeId" :cycles="feeMonth"
				 :communityId="communityId"></vc-discount>


			</view>
		</scroll-view>
		<view class=" bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">

			<view class="action text-orange margin-right line-height">
				合计：{{receivableAmount}}元
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">提交订单</button>
			</view>
		</view>
	</view>

	</view>
</template>

<script>

	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import vcDiscount from '@/components/vc-discount/vc-discount.vue';
	import giftCoupon from '@/components/coupon/gift-coupon.vue'
	import vcUserAccount from '@/components/vc-user-account/vc-user-account.vue';
	import {getUserId} from '../../api/user/userApi.js';
	import {
		addMonth,
		formatDate,
		date2String
	} from '../../lib/java110/utils/DateUtil.js'

	export default {
		components: {
			vcDiscount,
			vcUserAccount,
			giftCoupon
		},
		data() {
			return {
				showFeeMonth: false,
				feeMonthList: [],
				feeMonthName: '',
				feeMonth: 1,
				endTime: '',
				ordEndTime: '',
				formatEndTime:'',
				amount: 0,
				receivableAmount: 0.00,
				additionalAmount: 0,
				num: '',
				feeTypeCdName: '',
				carNum: '',
				feePrice: 0.00,
				communityId: '',
				communityName: '',
				feeId: '',
				appId: '',
				feeFlag: '',
				paymentCycle: 1,
				selectUserAccount: [], // 选中的账户
				accountAmount: 0.0, // 账户金额
				deductionAmount: 0.0, // 抵扣金额
				payerObjId: '',
				payerObjType: '',
				userId: '',
				payOnline:'Y'
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			let _fee = JSON.parse(options.fee);

			let _receivableAmount = _fee.paymentCycle * _fee.feePrice;

			let _communityInfo = context.getCurrentCommunity();
			let _lastDate = new Date(_fee.endTime);


			this.receivableAmount = _receivableAmount;
			this.communityId = _communityInfo.communityId;
			this.communityName = _communityInfo.communityName;
			this.num = _fee.num;
			this.feeTypeCdName = _fee.feeTypeCdName;
			this.carNum = _fee.carNum;
			this.feeId = _fee.feeId;
			this.feePrice = _fee.feePrice;
			this.payerObjId = _fee.payerObjId;
			this.payerObjType = _fee.payerObjType;
			this.userId = _fee.userId;

			this.ordEndTime = _fee.endTime;
			this.formatEndTime = date2String(_fee.endTime);
			this.feeFlag = _fee.feeFlag;
			if (this.feeFlag == '2006012') {
				return;
			}
			this.paymentCycle = _fee.paymentCycle;
			this.feeMonth = _fee.paymentCycle;
			for (let _index = 1; _index < 7; _index++) {
				this.feeMonthList.push(_index * this.paymentCycle + '个月')
			}
			this.feeMonthName = this.paymentCycle + '个月';
			let _endTime = addMonth(_lastDate, parseInt(this.feeMonth));
			this.endTime = formatDate(_endTime);
			var pages = getCurrentPages();
			var prevPage = pages[pages.length - 2]; //上一个页面
			//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			prevPage.needFefresh = false;
			this.$nextTick(() => {
				this.$refs.vcDiscountRef._loadFeeDiscount(this.feeId, this.communityId, this.feeMonth);
				this.$refs.vcUserAccountRef._listOwnerAccount(this.communityId);
				this.$refs.giftCoupon.listGiftCoupon(this.feeId, this.communityId, this.feeMonth);
			});
			this.payOnline = _fee.payOnline;
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			// 选择使用账户余额
			getUserAmount: function(_accInfo) {
				// 选中的账户列表
				this.selectUserAccount = _accInfo.selectedAccounts;
				// 账户金额
				this.accountAmount = _accInfo.totalUserAmount;
				this._updatePrice(this.feeMonth);
			},
			computeFeeDiscount: function(_price) {
				// this.receivableAmount = this.receivableAmount - _price;
				this.receivableAmount = (parseFloat(this.receivableAmount) + parseFloat(_price)).toFixed(2);
				this._computeUserAmount();
			},
			// 使用账户余额后，更新金额
			_computeUserAmount: function() {
				// 抵扣金额
				this.deductionAmount = parseFloat(this.accountAmount) > parseFloat(this.receivableAmount) ? parseFloat(
					this.receivableAmount) : parseFloat(this.accountAmount);
				// 更新应缴金额
				let receivableAmount = parseFloat(this.receivableAmount) - parseFloat(this.accountAmount);
				this.receivableAmount = receivableAmount < 0 ? '0.00' : receivableAmount.toFixed(2);
			},
			dateChange: function(e) {
				console.log("onConfirm", e);
				let _feeMonthName = null;
				_feeMonthName = this.feeMonthList[e.detail.value];
				let _feeMonth = _feeMonthName.replace("个月", "");;
				this._updatePrice(_feeMonth);
			},
			// 更新金额
			_updatePrice(_feeMonth) {
				let _lastDate = new Date(this.ordEndTime);
				let _newDate = addMonth(_lastDate, parseInt(_feeMonth));
				this.showFeeMonth = false;
				this.feeMonthName = _feeMonth + '个月';
				this.feeMonth = _feeMonth;
				this.endTime = formatDate(_newDate);
				this.receivableAmount = _feeMonth * this.feePrice;
				this.$refs.vcDiscountRef._loadFeeDiscount(this.feeId, this.communityId, this.feeMonth);
				this.$refs.giftCoupon.listGiftCoupon(this.feeId, this.communityId, this.feeMonth);
			},
			onFeeMonthCancel: function(e) {
				this.showFeeMonth = false;
			},
			
			onPayFee: function() {
				if(this.payOnline == 'N'){
					uni.showToast({
						icon:'none',
						title:'暂不支持线上缴费，请到前台缴费'
					})
					return;
				}
				let _tradeType = 'JSAPI';
				let _receivedAmount = this.receivableAmount;
				
				let _objData = {
					business: "payFee",
					cycles: this.feeMonth,
					communityId: this.communityId,
					feeId: this.feeId,
					feeName: '停车费',
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					endTime: this.formatEndTime,
					selectUserAccount: this.selectUserAccount, // 选中的账户
					accountAmount: this.accountAmount, // 账户金额
					deductionAmount: this.deductionAmount, // 抵扣金额
					payerObjId: this.payerObjId,
					payerObjType: this.payerObjType,
					userId: this.userId,
				};
				uni.setStorageSync('doing_cashier',_objData);
				uni.navigateTo({
					url:'/pages/fee/cashier?money='+_receivedAmount+"&business=payFee&communityId="+this.communityId+"&cashierUserId="+getUserId()
				})
			}
		}
	};
</script>
<style>
	
.ppf_item{
  padding: 0rpx 0rpx 0rpx 0rpx;
}

.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69,90,100,.6);
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank{
  height: 40rpx;
}

	.fee-last {
		margin-bottom: 200upx;
	}

	.cu-btn.lgplus {
		padding: 0 20px;
		font-size: 18px;
		height: 100upx;

	}

	.cu-btn.sharp {
		border-radius: 0upx;
	}

	.line-height {
		line-height: 100upx;
	}
</style>
