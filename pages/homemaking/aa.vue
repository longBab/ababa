<template>
	<view>
		<view>

			<view class="title">费用相关</view>
			<view class="serveBox">
				<view v-for="(item,index) in real_list.fees" @tap="to(item)" :key="index" class="serveBoxItem">
					<image :src="item.icon" mode="" />
					<view class="serveBoxItemTitle">{{item.name}}</view>
				</view>
			</view>
			<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
		</view>
		
		<view style="height: 50rpx;"></view>

		<view>
			<view class="title">社区服务</view>
			<view class="serveBox">
				<view v-for="(item,index) in real_list.communityServices" @tap="to(item)" :key="index" class="serveBoxItem">
					<image :src="item.icon" mode="" />
					<view class="serveBoxItemTitle">{{item.name}}</view>
				</view>
			</view>
			<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
		</view>
		
		<view style="height: 50rpx;"></view>
		
		<view>
			<view class="title">个人管理</view>
			<view class="serveBox">
				<view v-for="(item,index) in real_list.personalManagement" @tap="to(item)" :key="index" class="serveBoxItem">
					<image :src="item.icon" mode="" />
					<view class="serveBoxItemTitle">{{item.name}}</view>
				</view>
			</view>
			<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
		</view>
		
		<view style="height: 50rpx;"></view>
		
		<view>
			<view class="title">其他</view>
			<view class="serveBox">
				<view v-for="(item,index) in real_list.others" @tap="to(item)" :key="index" class="serveBoxItem">
					<image :src="item.icon" mode="" />
					<view class="serveBoxItemTitle">{{item.name}}</view>
				</view>
			</view>
			<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
		</view>
	</view>
</template>

<script>
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'

	export default {
		name: "serviceProperty",
		data() {
			return {
				real_list: [],
			};
		},
		created() {
			this._loadMenu();
		},
		components: {
			authOwnerDialog
		},
		methods: {
			to: function(v) {
				if (v.name == '商圈') {
					uni.switchTab({
						url: v.href
					});
					return;
				}
				if (!v.href) {
					uni.showToast({
						icon: 'none',
						title: '此功能暂不开放'
					});
					return;
				}
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
			_loadMenu: function() {
				this.real_list = {
					fees: [ // 费用相关
						{
							name: '生活缴费',
							src: this.imgUrl + '/h5/images/serve/1.png',
							href: '/pages/fee/oweFee',
							ownerAuth: true,
							icon: '../../static/serve/0.svg'
						},
						{
							name: '房屋费',
							src: this.imgUrl + '/h5/images/serve/5.png',
							href: '/pages/fee/roomFeeListNew',
							ownerAuth: true,
							icon: '../../static/serve/1.svg'
						},
						{
							name: '停车费',
							src: this.imgUrl + '/h5/images/serve/9.png',
							href: '/pages/fee/payParkingFeeList',
							ownerAuth: true,
							icon: '../../static/serve/2.svg'
						},
						{
							name: '合同费',
							src: this.imgUrl + '/h5/images/serve/12.png',
							href: '/pages/fee/contractFeeList',
							ownerAuth: true,
							icon: '../../static/serve/3.svg'
						},
						{
							name: '水电充值',
							src: this.imgUrl + '/h5/images/serve/5.png',
							href: '/pages/meter/meter',
							ownerAuth: true,
							icon: '../../static/serve/4.svg'
						}
					],
					communityServices: [ // 社区服务
						{
							name: '社区公告',
							src: this.imgUrl + '/h5/images/serve/7.png',
							href: '/pages/notice/index',
							ownerAuth: false,
							icon: '../../static/serve/9.svg'
						},
						{
							name: '球场预约',
							src: this.imgUrl + '/h5/images/serve/order4.png',
							href: '/pages/appointment/appointment',
							ownerAuth: false,
							icon: '../../static/serve/16.svg'
						},
						{
							name: '就餐',
							src: this.imgUrl + '/h5/images/serve/order4.png',
							href: '/pages/reserve/reserveDining',
							ownerAuth: false,
							icon: '../../static/serve/17.svg'
						},
						{
							name: '预约服务',
							src: this.imgUrl + '/h5/images/serve/order4.png',
							href: '/pages/reserve/reserveService',
							ownerAuth: false,
							icon: '../../static/serve/18.svg'
						},
						{
							name: '智能充电',
							src: this.imgUrl + '/h5/images/serve/my3.png',
							href: '/pages/machine/chargeMachines',
							ownerAuth: false,
							icon: '../../static/serve/22.svg'
						}
					],
					personalManagement: [ // 个人管理
						{
							name: '家庭成员',
							src: this.imgUrl + '/h5/images/serve/2.png',
							href: '/pages/family/familyList',
							ownerAuth: true,
							icon: '../../static/serve/5.svg'
						},
						{
							name: '访客通行',
							src: this.imgUrl + '/h5/images/serve/3.png',
							href: '/pages/visit/visitList',
							ownerAuth: true,
							icon: '../../static/serve/6.svg'
						},
						{
							name: '业主信息',
							src: this.imgUrl + '/h5/images/serve/my1.png',
							href: '/pages/viewBindOwner/viewBindOwner',
							ownerAuth: true,
							icon: '../../static/serve/12.svg'
						},
						{
							name: '意见反馈',
							src: this.imgUrl + '/h5/images/serve/4.png',
							href: '/pages/complaint/complaint',
							ownerAuth: true,
							icon: '../../static/serve/7.svg'
						},
						{
							name: '报事维修',
							src: this.imgUrl + '/h5/images/serve/6.png',
							href: '/pages/repair/repair',
							ownerAuth: true,
							icon: '../../static/serve/8.svg'
						},
						{
							name: '物业打分',
							src: this.imgUrl + '/h5/images/serve/my9.png',
							href: '/pages/complaint/examineStaff',
							ownerAuth: true,
							icon: '../../static/serve/20.svg'
						}
					],
					others: [ // 其他
					
						{
							name: '一键开门',
							src: this.imgUrl + '/h5/images/serve/8.png',
							href: '/pages/machine/openDoor',
							ownerAuth: true,
							icon: '../../static/serve/10.svg'
						},
						{
							name: '装修报备',
							src: this.imgUrl + '/h5/images/serve/10.png',
							href: '/pages/renovation/roomRenovation',
							ownerAuth: true,
							icon: '../../static/serve/11.svg'
						},
						{
							name: '物品放行1',
							src: this.imgUrl + '/h5/images/serve/order4.png',
							href: '/pages/itemRelease/itemRelease',
							ownerAuth:true,
							icon: '../../static/serve/11.svg',
						},
						
						{
							name: '车位申请',
							src: this.imgUrl + '/h5/images/serve/my6.png',
							href: '/pages/applyparking/applyparking',
							ownerAuth: true,
							icon: '../../static/serve/13.svg'
						},
						{
							name: '投票问卷',
							src: this.imgUrl + '/h5/images/serve/my2.png',
							href: '/pages/questionAnswer/questionAnswer',
							ownerAuth: true,
							icon: '../../static/serve/14.svg'
						},
						{
							name: '空置房申请',
							src: this.imgUrl + '/h5/images/serve/my9.png',
							href: '/pages/applyRoom/applyRoom',
							ownerAuth: true,
							icon: '../../static/serve/15.svg'
						},
						{
							name: '小区公示',
							src: this.imgUrl + '/h5/images/serve/my1.png',
							href: '/pages/common/communityPublicity',
							ownerAuth: false,
							icon: '../../static/serve/21.svg'
						},
						{
							name: '投诉',
							src: this.imgUrl + '/h5/images/serve/my3.png',
							href: '/pages/complaint/tousu',
							ownerAuth: true,
							icon: '../../static/serve/23.svg'
						}
					]
				};

			}
		}
	}
</script>

<style lang="less">
	.real_list,
	.live_list {
		background: #fff;
		padding: 0 40upx;
		margin-top: 20upx;

		.title {
			line-height: 32upx;
			background: #fff;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 40upx 0;
			margin-top: 10px;
		}

		.item {
			width: 25%;
			display: inline-block;
			text-align: center;
			margin-bottom: 40upx;
		}

		image {
			height: 44upx;
			width: 44upx;
			margin-bottom: 10upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}

	.serveBox,
	.serveBox2 {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		/* 一行 3 列 */
		gap: 40rpx 30rpx;
	}

	.serveBox2 {
		grid-template-columns: repeat(4, 1fr);
	}

	.title {
		font-weight: bold;
		font-size: 28rpx;
		color: #353535;
		margin: 20rpx 0;
	}

	.serveBoxItem {
		text-align: center;
	}

	.serveBoxItem image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 8px;
		overflow: hidden;
	}

	.serveBoxItemTitle {
		font-weight: 400;
		font-size: 24rpx;
		color: #353535;
		margin-top: 10rpx;
	}
</style>