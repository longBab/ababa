<template>
	<view>
			<view v-if="unshowInfo" >
				<view class="block__title">房屋信息</view>
				<view class="cu-form-group"  >
					<view class="title">位置</view>
					<picker bindchange="PickerChange" :value="repairScopeIndex" :range="repairScopes" :range-key="'name'"
						@change="repairScopeChange">
						<view class="picker">
							{{repairScopes[repairScopeIndex].name}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group arrow" v-if="repairObjType == '002' || repairObjType =='003'" @tap="chooseFloor">
					<view class="title">楼栋</view>
					<input required readonly label="楼栋" v-model="floorNum" class="text-right" placeholder="请选择楼栋"
						name="floorNum" icon="arrow"></input>
					<text class='cuIcon-right'></text>
				</view>
				<view class="cu-form-group arrow" v-if="repairObjType =='003'" @tap="chooseUnit">
					<view class="title">单元</view>
					<input v-model="unitNum" placeholder="请选择单元" class="text-right"></input>
					<text class='cuIcon-right'></text>
				</view>
				<view class="cu-form-group" v-if="repairObjType == '004'">
					<view class="title">房屋信息</view>
					<picker bindchange="PickerChange" :value="index" :range="roomCloums" @change="roomChange">
						<view class="picker">
							{{roomName?roomName:'请选择'}}
						</view>
					</picker>
				</view>
				
			</view>

			<view class="block__title">报修信息</view>
			<view class="cu-form-group">
				<view class="title">报修类型</view>
				<picker id="complaintType" bindchange="PickerChange" :value="repairTypeIndex"
					:range-key="'repairTypeName'" :range="repairTypes" v-if="repairTypes.length>0"
					@change="repairTypeChange">
					<view class="picker">
						{{repairTypes.length==0 ? "请选择" : repairTypes[repairTypeIndex].repairTypeName}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" v-if="priceScope !=''">
				<view class="title">收费标准</view>
				<input disabled="disable" v-model="priceScope" class="text-right"></input>
			</view>
			<view style="display: none;">
				<view class="cu-form-group">
					<view class="title">报修人</view>
					<input v-model="bindRepairName" placeholder="请输入报修人" class="text-right"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">手机号</view>
					<input v-model="bindTel" placeholder="请输入手机号" class="text-right"></input>
				</view>
			</view>
			<view class="cu-form-group arrow" style="display: none;">
				<view class="title">预约日期</view>
				<picker mode="date" :value="bindDate" :start="todayDate" end="2050-09-01" @change="dateChange">
					<view class="picker">
						{{bindDate}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group arrow" style="display: none;">
				<view class="title">预约时间</view>
				<picker mode="time" :value="bindTime" :start="todayDateTime" end="22:00" @change="timeChange">
					<view class="picker">
						{{bindTime}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top" style="border: none ;">
				<textarea  v-model="context" placeholder="请输入手机号/报修内容"></textarea>
			</view>

			<view class="block__title">相关图片</view>
			<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum"
				:canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData">
			</uploadImageAsync>

			<view class="button_up_blank"></view>

			<view class="flex flex-direction">
				<button class="cu-btn bg-green margin-tb-sm lg" @click="submitRepair()">提交</button>
			</view>

		</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import {
		checkPhoneNumber,
		checkStrLength
	} from '../../lib/java110/utils/StringUtil.js'
	import context from '../../lib/java110/Java110Context.js'
	const constant = context.constant;
	const factory = context.factory;
	import {
		formatDate,
		formatHourAndMin
	} from '@/lib/java110/utils/DateUtil.js';

	import {
		getCommunityId,
		getCommunityName
	} from '@/api/community/communityApi.js';

	import {
		getOwnerId,
		getOwnerName,
		getOwnerTel
	} from '@/api/owner/ownerApi.js';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";

	import {
		listRepairSettings
	} from '../../api/repair/repairApi.js'
	// import tuiInput from "@/components/thorui/tui-input/tui-input.vue"
	export default {
		data() {
			return {
				minDate: new Date().getTime(),
				bindDate: '请选择',
				bindTime: '请选择',
				roomCloums: [],
				roomIdArr: [],
				roomName: "",
				roomId: '',
				roomShow: false,
				typeName: '',
				repairType: '',
				typeShow: false,
				timeShow: false,
				imgList: [],
				bindTel: '',
				context: '',
				bindRepairName: '',
				userId: '',
				userName: '',
				storeId: '',
				photos: [],
				communityId: "",
				communityName: "",
				complaintIndex: 0,
				index: 0,
				repairScopes: [
					// {
					// 	id: '001',
					// 	name: '小区'
					// },
					// {
					// 	id: '002',
					// 	name: '楼栋'
					// },
					// {
					// 	id: '003',
					// 	name: '单元'
					// },
					{
						id: '004',
						name: '房屋'
					}
				],
				repairTypes: [],
				repairTypeIndex: 0,
				repairScopeIndex: 0,
				repairObjType: '004',
				repairObjId: '',
				repairObjName: '',
				floorNum: '',
				floorId: '',
				unitNum: '',
				unitId: '',
				priceScope: '',
				todayDate: '',
				todayDateTime: '',
				uploadImage: {
					maxPhotoNum: 4,
					imgTitle: '图片上传',
					canEdit: true
				},
				unshowInfo:true
			};
		},

		components: {
			uploadImageAsync,
			// tuiInput
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			this.communityId = getCommunityId();
			this.communityName = getCommunityName();
			this.userName = getOwnerName();
			this.bindTel = getOwnerTel();
			this.bindRepairName = this.userName;
			context.getRooms().then(res => {
				let arr = res.data.rooms;
				let roomCloums = [];
				let roomIdArr = [];
				arr.map(item => {
					roomCloums.push(item.floorNum + "号楼" + item.unitNum + "单元" + item.roomNum + "室");
					roomIdArr.push(item.roomId);
				})
				that.roomCloums = roomCloums;
				that.roomIdArr = roomIdArr;
				that.userId = res.data.owner.userId;
				if( that.roomCloums.length  == 1){
					that.roomName = that.roomCloums[0];
					this.roomId = this.roomIdArr[0];
					that.unshowInfo = false
				}
				
			});

			//加载报修类型
			this._loadRepairTypes();
			this.todayDate = formatDate(new Date());
			this.bindDate = formatDate(new Date());
			this.todayDateTime = formatHourAndMin(new Date())
			this.bindTime = formatHourAndMin(new Date())
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let _floor = uni.getStorageSync("_selectFloor");

			if (_floor != null && _floor != undefined && _floor != '') {
				this.floorNum = _floor.floorNum + "栋";
				this.floorId = _floor.floorId;
			}

			let _unit = uni.getStorageSync("_selectUnit");
			if (_unit != null && _unit != undefined && _unit != '') {
				this.unitNum = _unit.unitNum + "单元";
				this.unitId = _unit.unitId;
			}
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			//清理楼栋和单元
			uni.removeStorageSync('_selectFloor');
			uni.removeStorageSync('_unitFloor');
		},

		methods: {
			sendImagesData: function(e) {
				this.photos = [];
				if (e.length > 0) {
					e.forEach((img) => {
						this.photos.push(img.fileId);
					})
				}
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`;
				} else if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},

			submitRepair: function(e) {
				let obj = {
					"repairName": this.bindRepairName,
					"repairType": this.repairType,
					"appointmentTime": this.bindDate + " " + this.bindTime + ":00",
					"tel": this.bindTel,
					"roomId": this.roomId,
					"photos": this.photos,
					"context": this.context,
					"userId": this.userId,
					"userName": this.userName,
					"communityId": this.communityId,
					"bindDate": this.bindDate,
					"bindTime": this.bindTime,
					"repairObjType": this.repairObjType,
					"repairChannel": 'Z'
				}

				if (this.repairObjType == '001') {
					obj.repairObjId = this.communityId;
					obj.repairObjName = this.communityName;
				} else if (this.repairObjType == '002') {
					obj.repairObjId = this.floorId;
					obj.repairObjName = this.floorNum;
				} else if (this.repairObjType == '003') {
					obj.repairObjId = this.unitId;
					obj.repairObjName = this.floorNum + this.unitNum;
				} else {
					obj.repairObjId = this.roomId;
					obj.repairObjName = this.roomName;
				}

				// let _photos = this.photos;
				// _photos.forEach(function(_item) {
				// 	obj.photos.push({
				// 		"photo": _item
				// 	});
				// });
				// 预约时间校验
				let oppoTime = Date.parse(new Date(obj.appointmentTime.replace(/-/g, '/'))),
					now = Date.parse(new Date());
				let msg = "";
				if (obj.repairType == "") {
					msg = "请选择报修类型";
				} else if (obj.repairName == "") {
					msg = "请填写报修人";
				} else if (checkStrLength(obj.repairName) > 30) {
					msg = "报修人长度不能超过15位";
				} else if (obj.tel == "") {
					msg = "请填写手机号";
				} else if (!checkPhoneNumber(obj.tel)) {
					msg = "手机号有误";
				} else if (obj.bindDate == "请选择") {
					msg = "请选择预约日期";
				} else if (obj.bindTime == "请选择") {
					msg = "请选择预约时间";
				} else if (now - oppoTime > 1800 * 1000) {
					msg = "预约时间有误";
				} else if (obj.context == "") {
					msg = "请填写报修内容";
				} 
				else if (obj.repairObjId == '') {
					msg = "请选择报修位置";
				}
				console.log(obj.repairObjId)
				if (msg != "") {
					wx.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
				} else {
					context.request({
						url: constant.url
						.saveOwnerRepair, //  http://hc.demo.winqi.cn:8012/appApi/ownerRepair.saveOwnerRepair 
						header: context.getHeaders(),
						method: "POST",
						data: obj, //动态数据
						success: function(res) {
							let _json = res.data;
							if (_json.code == 0) {
								// wx.redirectTo({
								// 	url: '/pages/repair/myRepair',
								// });
								uni.navigateTo({
									url: "/pages/successPage/successPage?msg=提交成功&objType=4004"
								})
								return;
							}
							wx.showToast({
								title: _json.msg,
								icon: 'none',
								duration: 2000
							})
						},
						fail: function(e) {
							wx.showToast({
								title: "服务器异常了",
								icon: 'none',
								duration: 2000
							})
						}
					});

				}
			},
			afterRead: function(event) {
				const {
					file
				} = event.detail;

				let _that = this;

				const {
					photoList = []
				} = this;
				photoList.push(file);
				this.photoList = photoList;

				factory.base64.urlTobase64(file.path).then(function(_baseInfo) {
					_that.photos.push(_baseInfo);
				});
			},
			roomChange: function(e) {
				this.roomId = this.roomIdArr[e.detail.value];
				this.roomName = this.roomCloums[e.detail.value];
			},
			repairScopeChange: function(e) {
				this.repairScopeIndex = e.target.value //取其下标
				let selected = this.repairScopes[this.repairScopeIndex] //获取选中的数组
				this.repairObjType = selected.id //选中的id
				this._loadRepairTypes();
			},
			repairChange: function(e) {
				this.typeName = this.columns[e.detail.value];
				this.typeId = this.repairIdAttr[e.detail.value];
			},
			repairTypeChange: function(e) {
				this.repairTypeIndex = e.target.value //取其下标
				let selected = this.repairTypes[this.repairTypeIndex] //获取选中的数组
				if (selected == undefined) {
					return;
				}
				this.repairType = selected.repairType //选中的id
				let _payFeeFlag = selected.payFeeFlag;

				if (_payFeeFlag == 'T') {
					this.priceScope = selected.priceScope;
				} else {
					this.priceScope = '';
				}

			},
			dateChange: function(e) {
				this.bindDate = e.detail.value;
				if (this.bindDate == formatDate(new Date()).replaceAll('/', '-')) {
					this.todayDateTime = formatHourAndMin(new Date());
				} else {
					this.todayDateTime = '8:30';
				}
			},
			timeChange: function(e) {
				this.bindTime = e.detail.value;
			},
			chooseFloor: function(e) {
				context.navigateTo({
					url: '/pages/selectFloor/selectFloor'
				});
			},
			chooseUnit: function(e) {
				if (this.floorId == null || this.floorId == '') {
					uni.showToast({
						title: "请先选择楼栋"
					});
					return;
				}
				context.navigateTo({
					url: '/pages/selectUnit/selectUnit?floorId=' + this.floorId
				});
			},
			_loadRepairTypes: function() {
				let _communityInfo = context.getCurrentCommunity();
				let _that = this;
				// 公共区域标识
				let publicArea = _that.repairObjType == '004' ? 'F' : 'T';
				// 默认选择第一个
				_that.repairTypeIndex = 0;
				let dataObj = {
					page: 1,
					row: 50,
					communityId: _communityInfo.communityId,
					publicArea: publicArea
				};
				listRepairSettings(dataObj).then(_json => {
					if (_json.code == 0 && _json.data.length > 0) {
						_that.repairTypes = _json.data;

						let selected = _that.repairTypes[_that.repairTypeIndex] //获取选中的数组
						_that.repairType = selected.repairType //选中的id
						let _payFeeFlag = selected.payFeeFlag;

						if (_payFeeFlag == 'T') {
							_that.priceScope = selected.priceScope;
						} else {
							_that.priceScope = '';
						}
					} else {
						uni.showToast({
							icon: "none",
							title: "未配置报修设置"
						})
					}
				})
			}

		}
	};
</script>
<style>
	page {
	  background-color: #f9f9f9;
	  padding: 30rpx 30rpx 100rpx;
	  box-sizing: border-box;
	}
	
	.card {
	  width: 100%;
	  background-color: #fff;
	  border-radius: 8px;
	  padding: 10rpx 0;
	}
	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}
</style>