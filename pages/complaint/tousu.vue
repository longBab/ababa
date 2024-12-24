<template>
	<view>
		<view v-if="unshowInfo">
				<view class="block__title">房屋信息</view>
				<view class="cu-form-group">
					<view class="title">小区名称</view>
					<input style="text-align: right;"  disabled="true" v-model="communityName" ></input>
				</view>
				<view class="cu-form-group">
					<view class="title">房屋信息</view>
					<picker :value="index" :range="roomCloums" @change="_changeRoom">
						<view class="picker">
							{{roomName}}
						</view>
					</picker>
				</view>
		</view>
		
		<view class="block__title">投诉信息</view>
		<!-- 	<view class="cu-form-group">
			<view class="title">投诉类型</view>
			<picker :value="complaintIndex" :range="typeCds" :range-key="'typeName'" @change="_changeComplaint">
				<view class="picker">
					{{typeName}}
				</view>
			</picker>
		</view> -->
		<view style="display: none;">
			
			<view class="cu-form-group">
				<view class="title">投诉人</view>
				<input style="text-align: right;" id="complaintName" v-model="complaintName" placeholder="请输入投诉人"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">手机号</view>
				<input id="tel" style="text-align: right;" v-model="tel" placeholder="请输入手机号"></input>
			</view>
		</view>
		<view class="cu-form-group margin-top" style="border: none ;">
			<textarea id="context" v-model="context" placeholder="请输入手机号/投诉内容"></textarea>
		</view>

		<!-- <view class="block__title">照片信息</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData"></uploadImageAsync>
		 -->
		<view class="button_up_blank"></view>
		<view class="flex flex-direction">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_submitComplaint()">提交</button>
		</view>
	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import * as TanslateImage from '../../lib/java110/utils/translate-image.js';

	import {
		checkPhoneNumber
	} from '../../lib/java110/utils/StringUtil.js';
	import context from '../../lib/java110/Java110Context.js';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	import {
		complaint,
		getComplaintType
	} from '@/api/community/complaintApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js'
	const constant = context.constant;
	const factory = context.factory;
	import mapping from '../../constant/MappingConstant.js';
	import {
		getOwnerId,
		getOwnerName,
		getOwnerTel
	} from '@/api/owner/ownerApi.js';
	export default {
		data() {
			return {
				imgList: [],
				imageIndex: 0,
				index: null,
				complaintIndex: 0,
				roomCloums: [],
				roomIdArr: [],
				roomName: "请选择",
				roomId: '',
				roomShow: false,
				typeCds: [],
				typeName: '请选择',
				typeCd: '',
				typeShow: false,
				photoList: [],
				tel: '',
				context: '',
				complaintName: '',
				userId: '',
				storeId: '',
				photos: [],
				communityId: "",
				uploadImage: {
					maxPhotoNum: 4,
					imgTitle: '图片上传',
					canEdit: true
				},
				communityName:"",
				unshowInfo:true
			};
		},
		components: {
			uploadImageAsync
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			context.getRooms().then(res => {
				let arr = res.data.rooms;
				let roomCloums = [];
				let roomIdArr = [];
				arr.map(item => {
					roomCloums.push(item.floorNum + "-" + item.unitNum + "-" + item.roomNum);
					roomIdArr.push(item.roomId);
				});
				that.roomCloums = roomCloums;
				that.roomIdArr = roomIdArr;
				that.userId = res.data.owner.appUserId;
				that.communityId = res.data.owner.communityId;
				// that.complaintName = res.data.owner.appUserName;
				// that.tel = res.data.owner.link;
				
				that.complaintName = getOwnerName();
				that.tel = getOwnerTel();
				
				if( that.roomCloums.length  == 1){
					that.roomName = that.roomCloums[0];
					this.roomId = this.roomIdArr[0];
					that.unshowInfo = false
				}
			});
			context.getOwner(function(_ownerInfo) {
				if (_ownerInfo) {
					that.communityName = _ownerInfo.communityName;
					console.log(1123)
					console.log(that.communityName)
				}
			});
			
			this._loadComplaintType();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			sendImagesData: function(e) {
				this.photos = [];
				if (e.length > 0) {
					e.forEach((img) => {
						this.photos.push(img.fileId);
					})
				}
			},
			_changeComplaint: function(e) {
				this.typeName = this.typeCds[e.detail.value].typeName;
				this.typeCd = this.typeCds[e.detail.value].typeCd;
			},
			_changeRoom: function(e) {
				this.roomName = this.roomCloums[e.detail.value];
				this.roomId = this.roomIdArr[e.detail.value];
			},
			_submitComplaint: function(e) {
				let data = {
						"complainOwner": this.complaintName,// 投诉人
						"mobileNum": this.tel, //手机
						"tenement":this.communityName +  " " + this.roomName ,//房间号
						"complainContent": this.context,
						"createBy":wx.getStorageSync('opid')
				}
				if(this.context == ''){
					
					wx.showToast({
						title:"请填写内容",
						icon:"none"
					})
					return
				}
				uni.request({
					url: 'https://api.jgjuli.com/system/complainInfo', // 接口地址
					method: 'POST', // 请求方法，默认为 GET，可以省略
					header: {
						'Content-Type': 'application/json', // 根据需要设置请求头
					},
					data:data,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.navigateTo({
								url:"/pages/successPage/successPage?msg=提交成功&objType=4004"
							})
						} else {
							console.error('请求失败:', res);
						}
					},
					fail: (err) => {
						console.error('请求出错:', err);
					},
				});
				
				
				


				

				// complaint({
				// 	"typeCd": this.typeCd,
				// 	"complaintName": this.complaintName,
				// 	"tel": this.tel,
				// 	"roomId": this.roomId,
				// 	"photos": this.photos,
				// 	"context": this.context,
				// 	"userId": this.userId,
				// 	"communityId": this.communityId
				// }).then(_data =>{
				// 	uni.navigateTo({
				// 		url:"/pages/successPage/successPage?msg=提交成功&objType=4004"
				// 	})
				// },err=>{
				// 	uni.showToast({
				// 		icon:'none',
				// 		title:err
				// 	})
				// });
			},
			
			_loadComplaintType: function() {
				let _that = this;
				getComplaintType({
					page: 1,
					row: 100,
					communityId: getCommunityId()
				}).then(_data => {
					_that.typeCds = _data.data;
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

	.uploader-container {
		margin: 0 10px;
	}

	.aku_photo_view {
		background-color: #FFF;
		padding: 40rpx 0 40rpx 40rpx;
	}

	.aku_photo_view text {
		font-size: 30rpx;
		color: #8a8a8a
	}
</style>