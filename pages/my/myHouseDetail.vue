<template>
	<view>
		<view class="title-row">
			<view class="block__title">房屋信息</view>
			<view class="status-tag" :class="getStatusClass">{{getStatusText}}</view>
		</view>
		<view class="cu-form-group">
			<view class="title">房屋ID</view>
			{{roomDetail.roomId}}
		</view>
		<view class="cu-form-group">
			<view class="title">楼栋</view>
			{{roomDetail.floorNum}}号楼
		</view>
		<view class="cu-form-group">
			<view class="title">单元</view>
			{{roomDetail.unitNum}}单元
		</view>
		<view class="cu-form-group">
			<view class="title">房屋编号</view>
			{{roomDetail.roomNum}}室
		</view>

		<view class="cu-form-group">
			<view class="title">楼层</view>
			{{roomDetail.layer+'层'}}
		</view>
		<view class="cu-form-group">
			<view class="title">户型</view>
			{{roomDetail.apartment}}
		</view>
		<!-- <view class="cu-form-group">
			<view class="title">建筑面积</view>
			{{roomDetail.builtUpArea+'平方米'}}
		</view> -->

		<view class="button_up_blank"></view>

		<view class="button-group"  v-if="roomDetail.userState == 0" >
			<button class="cu-btn bg-red" @tap="handleReject">拒绝</button>
			<button class="cu-btn bg-green" @tap="handleConfirm">确认</button>
		</view>

		<view class="block__bottom"></view>

	</view>
</template>

<script>
	// pages/my/myHouseDetail.js
	import context from '../../lib/java110/Java110Context.js';
	const factory = context.factory;
	import url from '../../constant/url.js'
	export default {
		data() {
			return {
				ownerInfo: {},
				// 用户信息
				userInfo: {},
				// 用户信息
				ownerFlag: false,
				// 是否有业主信息 标记 如果有为 true  没有为false
				roomDetail: {}
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			context.onLoad(options);
			console.log("1112312313123213213");

			_that.roomDetail = JSON.parse(options.room);

			factory.login.checkLoginStatus(function() {
				_that.userInfo = context.getUserInfo();
			console.log(_that.userInfo);

				//_that.roomDetail = wx.getStorageSync('roomDetail');
			}); //查询用户信息

			_that.loadOwenrInfo();
		},

		/**
		 * 生���周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			loadOwenrInfo: function() {
				let _that = this;

				context.getOwner(function(_ownerInfo) {
					console.log(_ownerInfo);

					if (_ownerInfo) {
						_that.ownerFlag = true;
						_that.ownerInfo = _ownerInfo;
					} else {
						_that.ownerFlag = false;
					}
				});
			},
			handleReject() {
				let _that = this;
				

				uni.showModal({
					title: '提示',
					content: '确定要拒绝吗？',
					success: function(res) {
						if (res.confirm) {
							_that.roomDetail.userState = 2
							roomDetail.ownerId = ownerInfo.ownerId
							context.request({
								url: url.updataOwner,
								header: context.getHeaders(),
								method: "POST",
								data: {
									..._that.roomDetail,
									
								},
								success: function(res) {
									let _json = res.data;
									if (_json.code == 0) {
										uni.showToast({
											title: "已拒绝",
											icon: 'success',
											duration: 2000
										});
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/my/my'
											});
										}, 2000);
										return;
									}
									uni.showToast({
										title: "操作失败",
											icon: 'none',
											duration: 2000
										});
								},
								fail: function(e) {
										uni.showToast({
											title: "服务器异常",
											icon: 'none',
											duration: 2000
										});
								}
							});
						}
					}
				});
			},
			handleConfirm() {
				let ownerInfo = uni.getStorageSync("ownerInfo");
				let _that = this;
				uni.showModal({
					title: '提示',
					content: '确定要确认吗？',
					success: function(res) {
						if (res.confirm) {
							_that.roomDetail.userState = 1
							// 调用接口更新房屋所有者
							context.request({
								url: url.updataOwner,
								header: context.getHeaders(),
								method: "POST",
								data: {
									..._that.roomDetail,
									ownerId: ownerInfo.ownerId
								} ,
								success: function(res) {
									let _json = res.data;
									if (_json.code == 0) {
										uni.showToast({
											title: "确认成功",
											icon: 'success',
											duration: 2000
										});
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/my/my'
											});
										}, 2000);
										return;
									}
									uni.showToast({
										title: "确认失败",
											icon: 'none',
											duration: 2000
										});
								},
								fail: function(e) {
									uni.showToast({
										title: "服务器异常",
											icon: 'none',
											duration: 2000
										});
								}
							});
						}
					}
				});
			},
			
		},
		computed: {
			getStatusText() {
				switch(Number(this.roomDetail.userState)) {
					case 0:
						return '待审核';
					case 1:
						return '认证成功';
					case 2:
						return '已拒绝';
					default:
						return '未知状态';
				}
			},
			getStatusClass() {
				switch(Number(this.roomDetail.userState)) {
					case 0:
						return 'status-warning';
					case 1:
						return 'status-success';
					case 2:
						return 'status-error';
					default:
						return 'status-default';
				}
			}
		}
	};
</script>
<style>
	@import "./myHouseDetail.css";

	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 20rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}

	.block__bottom {
		height: 180rpx;
	}
	.button-group {
    padding: 30rpx;
    display: flex;
    justify-content: space-around;
  }
  
  .button-group .cu-btn {
    width: 240rpx;
  }

	.title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30rpx;

	}

	.status-tag {
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		line-height: 1.2;
	}
	
	.status-warning {
		background-color: #fff7e6;
		color: #fa8c16;
		border: 1rpx solid #ffd591;
	}
	
	.status-success {
		background-color: #f6ffed;
		color: #52c41a;
		border: 1rpx solid #b7eb8f;
	}
	
	.status-error {
		background-color: #fff1f0;
		color: #f5222d;
		border: 1rpx solid #ffa39e;
	}
	
	.status-default {
		background-color: #f5f5f5;
		color: #999999;
		border: 1rpx solid #d9d9d9;
	}
</style>
