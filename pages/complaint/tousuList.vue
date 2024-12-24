<template>
	<view>
	<!-- <scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="active==0?'text-green cur':''" @tap="tabSelect(0)">
						正在处理
					</view>
					<view class="cu-item flex-sub" :class="active==1?'text-green cur':''" @tap="tabSelect(1)">
						处理完成
					</view>
				</view>
			</scroll-view> -->
		<!-- <tui-tabs :tabs="tabs" :currentTab="currentTab" @change="changeTab"></tui-tabs> -->
		<view v-if="active == 0" class="ppfl_c">
			<!-- -->
			<view v-if="noData==false">
				<view class="vantabClass">
					<view class="card" v-for="(item,index) in waitComplaint" :key="index">
						<!-- 派单状态 -->
						<view style="align-items: center; display:flex;justify-content: space-between;">
							<view style="display: flex;align-items: center;">
								<view class="paidanBg">
									<view class="paidanBgtitle">处理中</view>
									<view class="pdbg" style="background-color: #00BAAD;"></view>
								</view>
								<!-- <view class="cardTitle">{{item.tel}}</view> -->
							</view>
						</view>

						<view class="flex margin-top-sm padding-top-sm solid-top justify-between">
							<view class="text-gray">订单号</view>
							<view class="text-gray">{{item.id}}</view>
						</view>
						
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">反馈人</view>
							<view class="text-gray">{{item.complainOwner}}</view>
						</view>
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">所属区域</view>
							<view class="text-gray">{{item.tenement}}</view>
						</view>
						<view class="flex justify-between">
							<view class="text-gray">反馈时间</view>
							<view class="text-gray">{{item.createTime}}</view>
						</view>
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">反馈内容</view>
							<view class="text-gray">{{item.complainContent}}</view>
						</view>
						
					</view>
				</view>

				<!-- <view v-for="(item,index) in waitComplaint" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.complaintId}}</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">投诉类型</view>
						<view class="text-gray">{{item.typeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉人</view>
						<view class="text-gray">{{item.complaintName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">所属房间</view>
						<view class="text-gray">{{item.roomName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">报修内容</view>
						<view class="text-gray">{{item.context}}</view>
					</view>

					<view class="solid-top flex justify-end margin-top padding-top-sm padding-bottom-sm">
						<button class="cu-btn sm line-gray" @click="_toComplaintDetail(item)">详情</button>
					</view>
				</view> -->
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</view>

			
		
		<view v-if="active == 1" class="ppfl_c">
			<view v-if="noData==false">
				<view class="vantabClass">
					<view class="card" v-for="(item,index) in complaintd" :key="index">
						<!-- 派单状态 -->
						<view style="align-items: center; display:flex;justify-content: space-between;">
							<view style="display: flex;align-items: center;">
								<view class="paidanBg">
									<view class="paidanBgtitle">已处理</view>
									<view class="pdbg" style="background-color: #00BAAD;"></view>
								</view>
								<view class="cardTitle">{{item.tel}}</view>
							</view>
						</view>
						<view class="flex margin-top-sm padding-top-sm solid-top justify-between">
							<view class="text-gray">订单号</view>
							<view class="text-gray">{{item.complaintId}}</view>
						</view>
						<view class="flex justify-between">
							<view class="text-gray">反馈类型</view>
							<view class="text-gray">{{item.typeName}}</view>
						</view>
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">反馈人</view>
							<view class="text-gray">{{item.complaintName}}</view>
						</view>
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">所属房间</view>
							<view class="text-gray">{{item.roomName}}</view>
						</view>
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">反馈时间</view>
							<view class="text-gray">{{item.createTime }}</view>
						</view>
						<view class="flex margin-top-xs justify-between">
							<view class="text-gray">反馈内容</view>
							<view class="text-gray">{{item.context}}</view>
						</view>
						<view class="solid-top flex justify-end margin-top padding-top-sm padding-bottom-sm">
							<button class="cu-btn sm bg-green " @click="_appraiseComplaint(item)">评价</button>
							<button class="cu-btn sm line-gray margin-left" @click="_toComplaintDetail(item)">详情</button>
						</view>
					</view>
				</view>
				<!-- <view v-for="(item,index) in complaintd" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.complaintId}}</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">投诉类型</view>
						<view class="text-gray">{{item.typeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉人</view>
						<view class="text-gray">{{item.complaintName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">所属房间</view>
						<view class="text-gray">{{item.roomName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉时间</view>
						<view class="text-gray">{{item.createTime }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">投诉内容</view>
						<view class="text-gray">{{item.context}}</view>
					</view>
					<view class="solid-top flex justify-end margin-top padding-top-sm padding-bottom-sm">
						<button class="cu-btn sm bg-green " @click="_appraiseComplaint(item)">评价</button>
						<button class="cu-btn sm line-gray margin-left" @click="_toComplaintDetail(item)">详情</button>
					</view>
				</view> -->
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</view>

	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import noDataPage from '@/components/no-data-page/no-data-page.vue';
	import {
		getComplaints
	} from '@/api/community/complaintApi.js';
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	import tuiTabs from "@/components/thorui/tui-tabs/tui-tabs.vue"
	import {
		getOwnerTel
	} from '@/api/owner/ownerApi.js';
	export default {
		data() {
			return {
				currentTab: 0,
				tabs: [{
					name: "正在处理"
				}, {
					name: "处理完成"
				}],
				TabCur: 0,
				scrollLeft: 0,
				waitComplaint: [],
				complaintd: [],
				active: 0,
				ownerId: '',
				roomId: '',
				communityId: '',
				page: 1,
				totalPage: 0,
				loading: false,
				noData: false,
				userId: ''
			};
		},
		components: {
			noDataPage,
			tuiTabs
		},
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			this.communityId = getCommunityId();

			// that._loadCompaint(that.active);
			that.getList()
		},
		onShow: function() {
			let that = this;
			// if (that.communityId) {
			// 	that._loadCompaint(that.active);
			// }
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			// this._loadCompaint(this.active);
			uni.stopPullDownRefresh();
		},

		methods: {
			getList(){
				uni.request({
					url: 'https://api.myxy.ltd/system/complainInfo/list', // 接口地址
					method: 'GET', // 请求方法，默认为 GET，可以省略
					header: {
						'Content-Type': 'application/json', // 根据需要设置请求头
					},
					data:{
						pageNum:1,
						pageSize:99,
						mobileNum:getOwnerTel()
					},
					success: (res) => {
						this.waitComplaint = res.data.rows
						console.log(this.waitComplaint)
					},
					fail: (err) => {
						console.error('请求出错:', err);
					},
				});
			},
			changeTab(e) {
				this.currentTab = e.index
				this.active = e.index;
				this._loadCompaint(e.index);
				this.noData = false;
			},
			/**
			 * 加载我的报修
			 */
			_loadCompaint: function(_active) {
				let that = this;

				let _state = '';
				if (_active == 0) {
					_state = 'W';
				} else {
					_state = 'C';
				}
				getComplaints({
					state: _state,
					roomIds: that.roomId,
					page: 1,
					row: 10,
					communityId: that.communityId,
				}).then(_data => {
					let _ownerComplaints = _data.data;
					if (_ownerComplaints.length < 1) {
						that.noData = true;
					}
					if (_active == 0) {
						that.waitComplaint = _ownerComplaints;
					} else {
						that.complaintd = _ownerComplaints;
					}
					return;
				});

			},
			onChange: function(e) {
				this._loadCompaint(e.detail.index);
			},
			tabSelect: function(_active) {
				this.active = _active;
				this._loadCompaint(_active);
				this.noData = false;
			},
			_toComplaintDetail: function(_item) {
				context.navigateTo({
					url: '/pages/complaint/complaintDetail?complaintId=' +
						_item.complaintId +
						"&communityId=" + _item.communityId
				})
			},
			_appraiseComplaint: function(_item) {
				context.navigateTo({
					url: '/pages/complaint/appraiseComplaint?complaintId=' +
						_item.complaintId +
						"&communityId=" + _item.communityId
				})
			}
		}
	};
</script>
<style>
	.user-container {
		padding: 25rpx 10rpx;
		background-color: #F0F0F0;

		/*border: 1px solid black;*/
	}

	.add_button {}

	.notice {
		margin: 10rpx 7rpx;
		padding: 25rpx;
		background-color: #ffffff;
		border-radius: 7rpx;
		/* display: flex;
	    justify-content: space-between;
	    align-items: flex-end; */
	}

	.title {
		border-bottom: 1rpx solid #dedede;
		font-weight: 700;
		font-size: 34rpx;
		color: #5f5e5e;
		display: flex;
		justify-content: space-between;
	}

	.text {
		padding: 4rpx 0;
		font-size: 30rpx;
	}

	.main {
		/* display: flex;
	  justify-content: space-between;
	  align-items: flex-end; */
		position: relative;
	}

	.main_right {
		position: absolute;
		right: 0px;
		bottom: 0px;
	}

	.button {
		margin-right: 10px;
	}

	.card {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0rpx 9rpx 26rpx 1rpx #E9EFF9;
		border-radius: 10px;
		padding: 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.paidanBg {
		position: relative;
		overflow: hidden;
		padding: 0 20rpx;
	}

	.paidanBgtitle {
		position: relative;
		z-index: 1;
		color: #fff;
		font-size: 24rpx;
	}

	.pdbg {
		background: #F5AB4C;
		width: 100rpx;
		height: 90rpx;
		left: 3rpx;
		position: absolute;
		top: -20rpx;
		transform: rotate(-75deg);
	}

	.cardTitle {
		font-weight: 400;
		font-size: 30rpx;
		color: #353535;
		font-style: normal;
		margin-left: 5rpx;
	}

	.cardType {
		font-weight: 400;
		font-size: 31rpx;
		color: #1B76FE;
	}

	.bxInfo {
		font-weight: 400;
		font-size: 28rpx;
		color: #353535;
		line-height: 60rpx;
		margin: 20rpx 0;
	}

	.bxContent {
		width: 100%;
		background-color: #F0F7FF;
		font-weight: 400;
		font-size: 28rpx;
		color: #353535;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.time {
		font-weight: 400;
		font-size: 28rpx;
		color: #353535;
	}

	.btn {
		padding: 8rpx 40rpx;
		border: 1rpx solid #383838;
		border-radius: 30px;
		font-weight: 400;
		font-size: 24rpx;
		color: #000000;
	}

	.vantabClass {
		padding: 20rpx;
		box-sizing: border-box;
	}

	.pjbtn {
		background: #1B76FE;
		border: 1rpx solid #0E7FF5;
		color: #fff;
	}

	.pjclass {
		padding: 20rpx;
		box-sizing: border-box;
	}

	.imoji {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		/* 一行 3 列 */
		gap: 20rpx;
		margin: 30rpx 0;
	}

	.imojiItem {
		text-align: center;
	}

	.vantabClass {
		padding: 20rpx;
		box-sizing: border-box;
	}

	.imojiImg {
		width: 60rpx;
		height: 60rpx;
	}

	.actionImojiTitle {
		color: #1377FF !important;
	}

	.pjsubTitle {
		font-weight: 400;
		font-size: 28rpx;
		color: #16181A;
	}

	.imojiTitle {
		font-weight: 400;
		font-size: 24rpx;
		color: #9E9E9E;
	}

	.pjclass_othen {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		/* 一行 3 列 */
		gap: 60rpx;
	}

	.pjclass_othen_box {
		text-align: center;
		font-weight: 400;
		font-size: 28rpx;
		color: #9E9E9E;
		border-radius: 4px;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
	}

	.activePjclass_othen_box {
		border: 2rpx solid #1377FF;
		color: #1377FF;
	}

	.pingjiaCentent {
		width: 100%;
		background-color: #f7f7f7;
		min-height: 250rpx;
	}
</style>