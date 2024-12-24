<template>
	<view>
		<!-- <view class="serve_box">
			<view class="serve_title">基础服务</view>
			<view class="serve_list">
				<view class="list">
					<view class="item" v-for="(item,index) in serve_list" :key="index" @tap="to_serve(item)">
						<image :src="item.src"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view> -->
		
		  <!-- 服务中心 -->
		  <view class="cardOrder">
		    <view style="display: flex;align-items: center;">
		      <view class="titleColor"></view>
		      <view class="titleClass">服务中心</view>
		    </view>
		    <view class="cardOrderNav">
		      <view  v-for="(item,index) in serve_list" :key="index" @tap="to_serve(item)" class="cardOrderNav_item">
		        <image class="icon3" :src="item.src" mode="" />
		        <view class="cardOrderNav_item_text">{{item.name}}</view>
		      </view>
		    </view>
		  </view>
		  
		  <!-- 服务中心 -->
		  <view class="cardOrder">
		    <view style="display: flex;align-items: center;">
		      <view class="titleColor"></view>
		      <view class="titleClass">其他服务</view>
		    </view>
		    <view class="cardOrderNav">
		      <view  v-for="(item,index) in other_list" :key="index" @tap="to_serve(item)" class="cardOrderNav_item">
		        <image class="icon3" :src="item.src" mode="" />
		        <view class="cardOrderNav_item_text">{{item.name}}</view>
		      </view>
		    </view>
		  </view>
		<!-- #ifdef H5 && WUYE -->
		<!-- <view class="order_box">
			<view class="order_title">我的订单</view>
			<view class="order_list">
				<view class="list">
					<view class="item" v-for="(item,index) in order_list" :key="index" @tap="toMallOrders()">
						<image :src="item.src"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- #endif -->
		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
	</view>
</template>

<script>
	import context from '@/lib/java110/Java110Context.js';
	const factory = context.factory; //获取app实例
	const constant = context.constant;
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'
	export default {
		name: "myMenu",
		data() {
			return {
				order_list: [{
						name: '待付款',
						src: this.imgUrl + '/h5/images/serve/order1.png',
						href: ''
					},
					{
						name: '待发货',
						src: this.imgUrl + '/h5/images/serve/order2.png',
						href: ''
					},
					{
						name: '待收货',
						src: this.imgUrl + '/h5/images/serve/order3.png',
						href: ''
					},
					{
						name: '已完成',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: ''
					}
				],
				other_list:[
					{
						name: '装修记录',
						src:  "../../static/user/zxjl.svg",
						href: '/pages/renovation/myRoomList',
						ownerAuth: true
					},
					{
						name: '订场记录',
						src:  "../../static/user/zxjl.svg",
						href: '/pages/appointment/myBoomList',
						ownerAuth: false
					},
					{
						name: '缴费记录',
						src:  "../../static/user/jfjl.svg",
						href: '/pages/fee/payFeeDetail',
						ownerAuth: true
					},
					{
						name: '预约记录',
						src:  "../../static/user/yyjl.svg",
						href: '/pages/reserve/reserveMyOrder',
						ownerAuth: false
					},
					{
						name: '放行记录',
						src:  "../../static/user/fxjl.svg",
						href: '/pages/itemRelease/myItemReleaseList',
						ownerAuth: true
					},
					{
						name: '空置房记录',
						src:  "../../static/user/kfjl.svg",
						href: '/pages/applyRoom/myRoomList',
						ownerAuth: true
					},
					{
						name: '发票',
						src:  "../../static/user/fp.svg",
						href: '/pages/invoice/invoice',
						ownerAuth: true
					},
					
				],
				serve_list: [{
						name: '业主信息',
						src: "../../static/user/yz.svg",
						href: '/pages/viewBindOwner/viewBindOwner',
						ownerAuth: true
					},
					{
						name: '我的物业',
						src:  "../../static/user/wy.svg",
						href: '/pages/my/myProperty',
						ownerAuth: true
					},
					{
						name: '我的房屋',
						src:  "../../static/user/fw.svg",
						href: '/pages/my/myHouse',
						ownerAuth: true
					},
					{
						name: '我的报修',
						src:  "../../static/user/bx.svg",
						href: '/pages/repair/myRepair',
						ownerAuth: true
					},
					{
						name: '我的车位',
						src: "../../static/user/cl.svg",
						href: '/pages/applyparking/parkingInfo',
						ownerAuth: true
					},
					{
						name: '我的反馈',
						src:  "../../static/user/ts.svg",
						href: '/pages/complaint/complaintList',
						ownerAuth: true
					},
					{
						name: '我的投诉',
						src:  "../../static/user/fp.svg",
						href: '/pages/complaint/tousuList',
						ownerAuth: true
					},
					{
						name: '门禁日志',
						src:  "../../static/user/rz_1.svg",
						href: '/pages/machine/machineTranslateLog',
						ownerAuth: true
					},
					
					
					
					// {
					// 	name: '充电订单',
					// 	src: this.imgUrl + '/h5/images/serve/11.png',
					// 	href: '/pages/machine/chargeMachineOrders',
					// 	ownerAuth: false
					// },
					
				]
			};
		},
		created() {
		},
		components: {
			authOwnerDialog
		},
	methods: {
			
			// 我的服务跳转
		to_serve(v) {
				if (!v.ownerAuth) {
					this.vc.navigateTo({
						url: v.href
					});
					return;
				}
				hasAuthOwner(this).then(_owner => {
					this.vc.navigateTo({
						url: v.href
					});
				})
			},
			ckeckUserInfo: function() {
				return context.checkLoginStatus();
			},
			toMallOrders() {
				if (!this.ckeckUserInfo()) {
					this.vc.navigateTo({
						url: '../login/showlogin'
					}, () => {
						this.refreshPageLoginInfo();
					});
					return;
				}
				this.vc.navigateToMall({
					url: '/pages/myOrder/myOrderAll'
				})
			},
		}
	}
</script>

<style lang="less">
	.order_box {
		margin-top: 20upx;

		.order_title {
			line-height: 42upx;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 20upx;
		}

		.order_list {
			padding: 20upx 20upx 0;
			background: #fff;
		}

		.item {
			width: 25%;
			display: inline-block;
			text-align: center;
			margin-bottom: 20upx;
		}

		image {
			height: 44upx;
			width: 44upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}

	.serve_box {
		margin-top: 20upx;

		.serve_title {
			line-height: 42upx;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 20upx;
		}

		.serve_list {
			padding: 40upx 20upx 0;
			background: #fff;
		}

		.item {
			width: 20%;
			display: inline-block;
			text-align: center;
			margin-bottom: 40upx;
		}

		image {
			height: 44upx;
			width: 44upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}
	.cardOrder {
	  width: 100%;
	  border-radius: 15rpx;
	  background: #FFFFFF;
	  box-shadow: 0rpx 9rpx 26rpx 1rpx #E9EFF5;
	  padding: 30rpx 20rpx;
	  box-sizing: border-box;
	  margin-top: 20rpx;
	}
	
	.titleColor {
	  background: #1B76FE;
	  width: 10rpx;
	  height: 40rpx;
	  border-radius: 30px;
	}
	
	.titleClass {
	  font-weight: 500;
	  font-size: 32rpx;
	  color: #2B2B2B;
	  margin-left: 10rpx;
	}
	
	.cardOrderNav {
	  display: grid;
	  grid-template-columns: repeat(4, 1fr);
	  /* 一行 3 列 */
	  gap: 20rpx;
	  /* 列和行之间的间距 */
	}
	
	.icon3 {
	  width: 70rpx;
	  height: 70rpx;
	}
	
	.cardOrderNav_item {
	  text-align: center;
	  padding: 30rpx 0 0 0;
	}
	
	.cardOrderNav_item_text {
	  font-weight: 400;
	  font-size: 28rpx;
	  margin-top: 5rpx;
	  color: #353535;
	  text-align: center;
	  font-style: normal;
	}
</style>