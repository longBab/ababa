<template>
	<view>
		<view v-if="accounts.length > 0">
			<view class="block__title">业主账户</view>
			<checkbox-group @change="checkboxChange">
				<view class="cu-list menu" v-for="(account, idx) in accounts" :key="idx" :data-item="account"
				 @click="_viewAccountDetail(account)">
					<view class="cu-item ">
						<view class="content padding-tb-sm">
							<view>
								<view class="text-cut" style="width:220px">
									<checkbox :value="account.acctId"  :checked="account.checked" /> {{account.acctTypeName}}
								</view>
							</view>
						</view>
						<view class="action">
							<text class="text-grey text-sm">{{account.amount}}{{account.acctType == '2004' ? '分' : '元'}}</text>
						</view>
					</view>
				</view>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	import {
		queryOwnerAccount
	} from '../../api/user/userApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js'
	export default {
		components: {
		},
		data() {
			return {
				accounts: [],
				selectedAccounts: [],
			};
		},
		props: {
			
		},
		computed: {},
		watch: {
			selectedAccounts(val) {
				let _totalUserAmount = 0.0;
				let _selectedAccounts = [];
				this.accounts.forEach(item => {
					if(val.includes(item.acctId)){
						// 账户类型判断
						if (item.acctType == '2004') { //积分账户
							if (parseFloat(item.amount) >= parseFloat(item.maximumNumber)) { //如果积分账户余额大于最大使用积分，就抵扣最大使用积分
								_totalUserAmount += parseFloat(item.maximumNumber / item.deductionProportion);
								_selectedAccounts.push(item);
							} else {
								_totalUserAmount += parseFloat(item.amount / item.deductionProportion);
								_selectedAccounts.push(item);
							}
						} else if (item.acctType == '2003') { //现金账户
							_totalUserAmount += parseFloat(item.amount);
							_selectedAccounts.push(item);
						} else {
							_totalUserAmount += parseFloat(item.amount);
							_selectedAccounts.push(item);
						}
					}
				})
				
				this.$emit('getUserAmount', {
                    totalUserAmount: _totalUserAmount,
                    selectedAccounts: _selectedAccounts
                });
			},
		},
		methods: {
			/**
			 * @param {Object} e
			 * 选择账户事件
			 */
			checkboxChange: function (e) {
				var values = e.detail.value;
				this.selectedAccounts = values;
				this.accounts.forEach((item, index) => {
					if(values.includes(item.acctId)){
						item.checked = true;
					}
				});
			},
			
			_listOwnerAccount: function(_communityId) {
				// 2023.6.12
				let _that = this;
				context.getOwner(function(_ownerInfo) {
					if (_ownerInfo) {
						queryOwnerAccount({
							page: 1,
							row: 99,
							idCard: _ownerInfo.idCard,
							link: _ownerInfo.ownerTel,
							communityId: _communityId,
							// acctType:'2003',
							acctTypes: '2003,2004'
						}).then((data) => {
							if (!data) {
								_that.accounts = [];
								return;
							}
							_that.accounts = data;
						})
					}
				});
				// let _that = this;
				// queryOwnerAccount({
				// 	page: 1,
				// 	row: 30,
				// 	feeId: _feeId,
				// 	communityId: _communityId
				// }).then((data) => {
				// 	if(!data){
				// 		_that.accounts = [];
				// 		return;
				// 	}
				// 	_that.accounts = data;
				// })
			},
			_viewAccountDetail: function(_account) {

			}
		}
	};
</script>

<style>
.block__title {
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    color: rgba(69,90,100,.6);
    padding: 40rpx 30rpx 20rpx;
}
</style>
