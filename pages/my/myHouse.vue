<template>
	<view class="tab-container bg-white">
		<view class="cu-list menu">
			<view class="cu-item arrow" v-if="rooms.length > 0" v-for="(item, key) in rooms" :key="key"
				:data-item="item" @click="myHouseDetail(item)">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-homefill text-green margin-right-xs"></text>
						{{ item.floorNum }}号楼{{ item.unitNum }}单元{{ item.roomNum }}室
					</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-right margin-right-xs"></text> {{ item.roomId }}
					</view>
				</view>
				<view class="action">

				</view>
			</view>
			<view class="cu-item" v-if="rooms.length === 0">
				<view class="content">
					<text class="cuIcon-warn text-green"></text>
					<text class="text-grey">暂无房屋信息</text>
				</view>
				<view class="action">

				</view>
			</view>
		</view>
	</view>
</template>

<script>
// pages/my/myHouse.js
import context from '../../lib/java110/Java110Context.js';
const constant = context.constant;
import {
	getHeaders,
	request,
} from '../../lib/java110/java110Request.js'
import { getCommunityId } from '../../api/community/communityApi.js'
import conf from '../../conf/config.js'
const baseUrl = conf.baseUrl;
export default {
	data() {
		return {
			rooms: "",
			ownerCommunityId: ""
		};
	},

	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		context.onLoad(options);
		this.loadOwnerHouse();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.loadOwnerHouse();
		uni.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () { },

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () { },
	methods: {
		myHouseDetail: function (_item) {
			// _item.communityId = this.ownerCommunityId
			this.vc.navigateTo({
				url: '/pages/my/myHouseDetail?room=' + JSON.stringify(_item)
			});
		},

		/**
		 * 加载业主房屋信息
		 */
		loadOwnerHouse: function () {
			let _that = this;

			// context.getRooms(1).then(res => {
			// 	if (res) {
			// 		_that.rooms = res.data.rooms;
			// 		_that.ownerCommunityId = res.data.owner.communityId
			// 	}

			// });
			let ownerInfo = uni.getStorageSync("ownerInfo");
			let requestData = {
				_uId: 'ccdd00opikookjuhyyttvhnnjuuu',
				page: 1,
				row: 99,
				ownerId: ownerInfo.ownerId,
			}
			request({
				url: baseUrl + "app/room.queryRooms",
				header: getHeaders(),
				method: "GET",
				data: requestData,
				success: function (res) {

					if (res) {
						_that.rooms = res.data.rooms;
						_that.ownerCommunityId = res.data.owner.communityId
					}
				}
			});
		}
	}
};
</script>
<style>
.tab-container {
	/*border: 1px solid black;*/

	margin-top: 30rpx;
}

.tab-item {
	padding: 20rpx 30rpx;

	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.tab-item-hover {
	background-color: #e6e6e6;
}

.tab-icon {
	width: 30rpx;
	height: 30rpx;
}

.tab-text {
	display: inline-block;
	margin-left: 10rpx;
	color: #1e1e1e;
}

.tab-arrow {
	display: inline-block;
	width: 20rpx;
	height: 20rpx;
	border: 1px solid #cdcdcd;

	border-left: none;
	border-bottom: none;

	transform: rotate(45deg);
}

.border-bottom .icon {
	font-size: 38rpx;
	line-height: 38rpx;
}
</style>
