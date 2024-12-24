	<template>
	<view>
		<view>
			<view style="display: flex;align-items: center;">
				<view class="san_t1">
					<image class="sanimage" style="width: 100%;height: 100%;" src="../../static/index/lxwy.svg"
						mode="" />
					<view class="san_2Item_item"  @click="to(new_list[1])">
						<view style="padding: 40rpx;">
							<view class="sii_t">联系物业</view>
							<view class="sii_sub_t">服务到家,温馨在家</view>
						</view>
					</view>
				</view>
				<view style="width: 20rpx;"> </view>
				<view class="san_t2"  @click="to(home_list[2])">
					<view class="san_t2Item">
						<image class="sanimage" src="../../static/index/fktx.svg" mode="" />
						<view class="san_2Item_item">
							<view class="san_2Item_itemText">
								访客通行
							</view>
						</view>
					</view>
					<view style="height: 10rpx;"></view>
					<view class="san_t2Item"  @click="to(new_list[0])">
						<image class="sanimage" src="../../static/index/bsbx.svg" mode="" />
						<view class="san_2Item_item">
							<view class="san_2Item_itemText">
								报事报修
							</view>
						</view>
					</view>
				</view>
			</view>
		
			<!-- 公告 -->
			<view class="gonggao"  @tap="to_gg">
				<image src="../../static/index/ssqgq.png" mode="" />
				<view class="gonggaoContent">欢迎访问智慧物业</view>
				<view class="gonggaoTime">
					<view class="gonggaoTime_t">
						<view>今天</view>
						<view>2天前</view>
					</view>
					<image style="width: 55rpx;margin: 0;" src="../../static/index/into2.svg" mode="" />
				</view>
			</view>
		
			<!-- 服务中心 -->
			<view class="cardOrder">
				<view class="cardOrderNav">
					<view v-for="(i,x) in serve_list2" :key="x" @tap="to_serve(i)" class="cardOrderNav_item">
						<image class="icon3" :src="i.src" mode="" />
						<view class="cardOrderNav_item_text">{{i.name}}</view>
					</view>
				</view>
			</view>
		
		</view>
		
	<!-- 	<view class="home_list">
			<view class="home_item" v-for="(item,index) in home_list" :key="index" @click="to(item)">
				<image :src="item.src"></image>
				<view class="text">{{item.name}}</view>
			</view>
		</view> -->

		<!-- <view class="serve_box">
			<view class="serve_title">功能服务<text class="more" @click="more()">更多</text></view>
			<view class="serve_list">
				<view class="serve_item" v-for="(item,index) in serve_list" :key="index" @click="to(item)">
					<image :src="item.src"></image>
					<view class="text">{{item.name}}</view>
				</view>
			</view>
		</view> -->

		<!-- <view class="new_box">
			<view class="margin-bottom-xs">
				<uni-notice-bar showIcon="true" scrollable="true" single="true" speed="30" text="欢迎访问智慧物业">
				</uni-notice-bar>
			</view>
			<view class="new_list">
				<view class="new_item" v-for="(item,index) in new_list" :key="index" @click="to(item)">
					<view class="new_wrap">
						<view class="new_font">
							<view class="name">{{item.name}}</view>
							<view class="text">{{item.desc}}</view>
						</view>
						<image :src="item.src"></image>
					</view>
				</view>
			</view>
		</view> -->

		<view class="cu-modal" :class="callPropertyModal==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">拨打电话
						<text v-if="property.communityQrCode">/ 加微信好友</text>
					</view>
					<view class="action" @tap="_cancleCall()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view v-if="property.communityQrCode">
						<image class="call-qrcode" :src="property.communityQrCode"></image>
					</view>
					<view>您确认拨打,{{property.communityName}}物业客服电话<br />{{property.sCommunityTel}}</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleCall()">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="_doCall()">拨号</view>
				</view>
			</view>
		</view>
		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
	</view>
</template>

<script>
	import {
		hasAuthOwner
	} from '../../api/owner/ownerApi.js';
	import {
		hasLogin
	} from '../../lib/java110/page/Page.js';

	import {
		getProperty
	} from '../../api/property/propertyApi.js';

	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'


	import {
		getCommunityName,
		getCommunityTel
	} from '../../api/community/communityApi.js';

	export default {
		name: "indexMenu",
		data() {
			return {
				serve_list2: [{
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
					// {
					// 	name: '我的报修',
					// 	src:  "../../static/user/bx.svg",
					// 	href: '/pages/repair/myRepair',
					// 	ownerAuth: true
					// },
					{
						name: '报事维修',
						src: '../../static/serve/8.svg',
						href: '/pages/repair/repair',
						ownerAuth: true,
					},
					// {
					// 	name: '我的反馈',
					// 	src:  "../../static/user/ts.svg",
					// 	href: '/pages/complaint/complaintList',
					// 	ownerAuth: true
					// },
					{
						name: '投诉',
						src: '../../static/serve/23.svg',
						href: '/pages/complaint/tousu',
						ownerAuth: true,
						icon: '../../static/serve/23.svg'
					},
					{
						name: '我的车位',
						src: "../../static/user/cl.svg",
						href: '/pages/applyparking/parkingInfo',
						ownerAuth: true
					},
					
					{
						name: '门禁日志',
						src:  "../../static/user/rz_1.svg",
						href: '/pages/machine/machineTranslateLog',
						ownerAuth: true
					},
					{
						name: '发票',
						src:  "../../static/user/fp.svg",
						href: '/pages/invoice/invoice',
						ownerAuth: true
					},
					
					// {
					// 	name: '充电订单',
					// 	src: this.imgUrl + '/h5/images/serve/11.png',
					// 	href: '/pages/machine/chargeMachineOrders',
					// 	ownerAuth: false
					// },
					
				],
				
				home_list: [],
				serve_list: [],
				callPropertyModal: false,
				property: {},
				new_list: [{
						src: this.imgUrl + '/h5/images/serve/new1.png',
						name: '报事报修',
						desc: '一键维修',
						href: '/pages/repair/repair',
						ownerAuth:true
					},
					{
						src: this.imgUrl + '/h5/images/serve/new2.png',
						name: '联系物业',
						desc: '一键搞定',
						href: '_callPropertyTel',
						ownerAuth:false
					},
				],
			};
		},
		created() {
			this._loadFunc();
		},
		components: {
			authOwnerDialog
		},
		methods: {
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
			to_gg(){
				this.vc.navigateTo({
					url: '/pages/common/communityPublicity'
				});
			},
			_loadFunc: function() {
				this.home_list = [{
							name: '社区公告',
							src: this.imgUrl + '/h5/images/serve/7.png',
							href: '/pages/notice/index',
							ownerAuth: false
						},
						{
							name: '家庭成员',
							src: this.imgUrl + '/h5/images/serve/2.png',
							href: '/pages/family/familyList',
							ownerAuth: true
						},
						{
							name: '访客通行',
							src: this.imgUrl + '/h5/images/serve/3.png',
							href: '/pages/visit/visitList',
							ownerAuth: true
						},
					],
					this.serve_list = [{
							name: '生活缴费',
							src: this.imgUrl + '/h5/images/serve/1.png',
							href: '/pages/fee/oweFee',
							ownerAuth: true
						},
						{
							name: '房屋费',
							src: this.imgUrl + '/h5/images/serve/5.png',
							href: '/pages/fee/roomFeeListNew',
							ownerAuth: true
						},
						{
							name: '停车费',
							src: this.imgUrl + '/h5/images/serve/9.png',
							href: '/pages/fee/payParkingFeeList',
							ownerAuth: true
						},
						{
							name: '一键开门',
							src: this.imgUrl + '/h5/images/serve/8.png',
							href: '/pages/machine/openDoor',
							ownerAuth: true
						},
						// {
						// 	name: '人脸识别',
						// 	src: this.imgUrl + '/h5/images/serve/8.png',
						// 	href: '/pages/machine/faceRecognition'
						// },
					]
			},
			to: function(v) {
				if (!v.ownerAuth) {
					if (v.href == '_callPropertyTel') {
						this.callPropertyTel();
					} else {
						this.vc.navigateTo({
							url: v.href
						});
					}
					return;
				}
				hasAuthOwner(this).then(_owner => {
					if (v.href == '_callPropertyTel') {
						this.callPropertyTel();
					} else {
						this.vc.navigateTo({
							url: v.href
						});
					}
				}, _err => {

				})

			},
			callPropertyTel: function() { //拨打电话
				let _that = this;
				if (!hasLogin()) {
					this.vc.navigateTo({
						url: '../login/showlogin'
					});
					return;
				}

				this.property.sCommunityTel = getCommunityTel();
				this.property.communityName = getCommunityName();
				_that.callPropertyModal = true;

			},
			_doCall: function() {

				let _that = this;
				uni.makePhoneCall({
					// 手机号
					phoneNumber: _that.property.sCommunityTel,
					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			_cancleCall: function() {
				this.callPropertyModal = false;
			},
			more: function() {
				uni.switchTab({
					url: '/pages/homemaking/homemaking'
				})
			}
		}
	}
</script>

<style lang="less">
	.home_list {
		display: flex;
		margin-bottom: 20upx;

		.home_item {
			padding: 20upx;
			width: calc((100% - 40upx) / 3);
			margin-right: 20upx;
			background: #fff;
			text-align: center;
			display: flex;
			align-items: center;
			border-radius: 5upx;
			font-size: 28upx;

			image {
				height: 40upx;
				width: 40upx;
				margin-right: 5upx;
			}
		}

		.home_item:last-child {
			margin-right: 0;
		}
	}

	.serve_box {
		padding: 0 20upx;
		background: #fff;
		margin-bottom: 20upx;

		.serve_title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20upx 0;
			font-size: 30upx;
			font-weight: 600;

			.more {
				font-size: 24upx;
				font-weight: 400;
				color: #999;
			}
		}

		.serve_list {
			border-radius: 5px;
		}

		.serve_item {
			display: inline-block;
			padding: 20upx;
			width: 25%;
			text-align: center;
			font-size: 28upx;

			image {
				height: 64upx;
				width: 64upx;
			}

			.text {
				white-space: nowrap;
				font-size: 20upx;
				font-weight: 400;
			}
		}

		.home_item:last-child {
			margin-right: 0;
		}

	}

	.new_box {
		background: #fff;
		padding: 20upx;
		margin-bottom: 20upx;

		.new_wrap {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.new_item {
			position: relative;
			display: inline-block;
			padding: 20upx;
			margin-right: 20upx;
			width: calc((100% - 40upx) / 2);
			background: #f5f5f5;
			border-radius: 5upx;

			.new_font {
				z-index: 2;
			}

			.name {
				font-size: 28upx;
				font-weight: 600;
				color: #333;
				text-align: left;
			}

			.text {
				font-size: 24upx;
				font-weight: 400;
				color: #999;
			}

			image {
				width: 160upx;
				height: 120upx;
			}
		}

		.new_item:last-child {
			margin-right: 0;
		}
	}

	.call-qrcode {
		width: 480upx;
		height: 480upx;
	}
	.san_t1 {
		flex: 1;
		height: 250rpx;
		border-radius: 21rpx 21rpx 21rpx 21rpx;
		position: relative;
	}
	
	.san_t2 {
		flex: 1;
		height: 250rpx;
	}
	
	.san_t2Item {
		height: 120rpx;
		width: 100%;
		border-radius: 21rpx;
		background-size: 100% 100%;
		position: relative;
	}
	
	.sanimage {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	.san_2Item_item {
		position: relative;
		z-index: 1;
	}
	
	.sii_t {
		font-weight: 400;
		font-size: 32rpx;
		color: #FFFFFF;
	}
	
	.sii_sub_t {
		font-weight: 400;
		font-size: 28rpx;
		color: #FFFFFF;
		margin-top: 10rpx;
	}
	
	.san_2Item_itemText {
		padding: 40rpx 0 40rpx 40rpx;
		margin-left: 100rpx;
		font-weight: 400;
		font-size: 32rpx;
		color: #FFFFFF;
	}
	
	.gonggao {
		background: #F2F4FF;
		border-radius: 15rpx 15rpx 15rpx 15rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		margin: 20rpx 0;
	}
	
	.gonggao image {
		width: 75rpx;
		height: 95rpx;
		margin: 0 20rpx;
	}
	
	.cardOrder {
		width: 100%;
		border-radius: 15rpx;
		box-shadow: 0rpx 9rpx 26rpx 1rpx #E9EFF5;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}
	
	.gonggaoContent {
		width: 400rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-height: 42rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #1A1A1A;
	}
	
	.gonggaoTime {
		text-align: right;
	
		display: flex;
		align-items: center;
	}
	
	.gonggaoTime_t {
		font-weight: 400;
		font-size: 26rpx;
		color: #353535;
	}
	
	.cardOrderNav {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		/* 一行 3 列 */
		gap: 20rpx;
		/* 列和行之间的间距 */
	}
	
	.cardOrderNav_item {
		text-align: center;
	}
	
	.icon3 {
		width: 70rpx;
		height: 70rpx;
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