<template>
	<view>
		<view class="padding margin-top">
			<text>订单信息</text>
		</view>
		<view class="cu-list menu" >
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-edit text-green"></text>
					<text class="text-grey">投诉编码</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.complaintId}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-ticket text-green"></text>
					<text class="text-grey">房屋编码</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.roomName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-footprint text-green"></text>
					<text class="text-grey">类型</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.typeName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-profile text-green"></text>
					<text class="text-grey">投诉人</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.complaintName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-phone text-green"></text>
					<text class="text-grey">投诉电话</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.tel}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-green"></text>
					<text class="text-grey">投诉时间</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.createTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-comment text-blue margin-right-xs"></text>投诉内容</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text>{{complaint.context}}</view>
				</view>
			</view>
			
			<view class="cu-item" v-if="complaint.photos && complaint.photos.length > 0">
				<view class="margin-top grid text-center col-3 grid-square" >
					<view class="" v-for="(_item,index) in complaint.photos" :key="index">
						<image mode="widthFix"   :data-url="_item.url" :src="ossUrl + _item.url" @tap="preview(index)"></image>
					</view>
				</view>
			</view>
		
		</view>
		<view class="cu-timeline">
			<view class="cu-item" v-for="(item, index) in audits" :key="index">
				<view class=" bg-white" style="padding: 10px;">
					<view class="">
						<view class="text-bold">
							{{ item.eventType === '1000' ? '用户发起反馈' :
								item.eventType === '1001' ? '已处理完成' : 
								item.eventType === '2002' ? '业主评价' : ''  }}
						</view>
					</view>
					<view style="margin: 5px 0;" v-if="item.eventType === '1000'">反馈者：{{item.createUserName}}</view>
					<view style="margin: 5px 0;" v-if="item.eventType === '1001'">处理者：{{item.createUserName}}</view>
					<view style="margin: 5px 0;" v-if="item.eventType === '1001'">处理意见：{{item.remark}}</view>
					<view style="margin: 5px 0;" v-if="item.eventType === '2002'">评价内容：{{item.remark}}</view>
					<!-- <view class="repair-img-item"
						v-if="item.photoVos && item.photoVos.length > 0 && item.state === '10005'">
						<image v-for="(pic, picIndex) in item.photoVos" :key="picIndex" :src="ossUrl + pic.url"
							@tap="preview(index, picIndex)" mode="widthFix">
						</image>
					</view> -->
					<view class="text-gray">{{ item.createTime }}</view>
				</view>
			</view>
		</view>
		<!-- <view class="cu-timeline margin-top" style="background-color: transparent;">
			<view class="cu-time">工单</view>
			<view class="cu-item " v-for="(item,index) in audits" :key="index">
				<view class="bg-white content"  v-if="item.eventType == '1000'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}} 投诉
				</view>
				<view class="bg-white content" v-if="item.eventType == '1001'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}处理
				</view>
				<view class="bg-white content" v-if="item.eventType == '1001'">
					<text>处理意见：</text> {{item.remark}}
				</view>
				<view class="bg-white content" v-if="item.eventType == '2002'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}评价
				</view>
				<view class="bg-white content" v-if="item.eventType == '2002'">
					<text>评价内容：</text> {{item.remark}}
				</view>
				<view class="bg-white content" v-if="item.eventType == '3003'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}回复
				</view>
				<view class="bg-white content" v-if="item.eventType == '3003'">
					<text>回复内容：</text> {{item.remark}}
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import config from '../../conf/config.js';
	import {getComplaints,getComplaintEvent} from '@/api/community/complaintApi.js';
	export default {
		data() {
			return {
				complaintId:'',
				communityId:'',
				complaint:{},
				audits:[],
				photoUrl: config.commonBaseUrl + '/callComponent/download/getFile/file',
			ossUrl: 'https://yuexiangtongcheng-1258340554.cos.ap-beijing.myqcloud.com/hc/'

			}
		},
		onLoad(options) {
			let _complaintId = options.complaintId;
			this.complaintId = _complaintId;
			this.communityId = options.communityId;
			this._loadCompaint();
			this._listWorkflowAuditInfo();
		},
		methods: {
			/**
			 * 加载我的报修
			 */
			_loadCompaint: function(_active) {
				let that = this;
				getComplaints({
					complaintId: that.complaintId,
					page: 1,
					row: 1,
					communityId: that.communityId
				}).then(_data=>{
					let _ownerComplaints = _data.data;
					that.complaint = _ownerComplaints[0];
				});
			},
			_listWorkflowAuditInfo: function(_active) {
				let _that =this;
				getComplaintEvent({
					complaintId: _that.complaintId,
					page: 1,
					row: 100,
					communityId: _that.communityId
				}).then(_data=>{
					_that.audits = _data.data;
				})
			},
			preview: function(index) {
				let urls = [];
				this.complaint.photos.forEach((item) => {
					urls.push(this.ossUrl + item.url);
				})
				uni.previewImage({
					current: index,
					urls: urls
				})
			},
		}
	}
</script>

<style>
page{
	background-color: #f9f9f9;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.cu-timeline>.cu-item::before {
	background-color: transparent;
}
.cu-item {
	background: #f9f9f9;
}

.cu-timeline {
	background: #f9f9f9;
}

.cu-timeline>.cu-item::before {
	background-color: transparent;
	color: #0081ff;
}

.repair-img-item {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin: 10px 0;
}

.repair-img-item image {
	width: 150upx;
	height: 150upx;
	border-radius: 8upx;
	object-fit: cover;
}
</style>
