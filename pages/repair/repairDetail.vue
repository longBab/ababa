<template>
	<view>
		<view class="cu-timeline">
			<view class="cu-time text-bold">工单处理进度</view>
			<view class="cu-item" v-for="(item, index) in staffs" :key="index">
				<view class=" bg-white" style="padding: 10px;">
					<view class="">
						<view class="text-bold">
							{{ item.state === '10005' ? '提交申请' :
								item.state === '10006' ? '已派单' :
								item.state === '10000' ? '已受理' :
								item.state === '10001' ? '已上门' :
								item.state === '10002' ? '结单' :
								item.state === '12001' ? '暂停' :
								item.state === '11000' ? '待评价' :
							item.state === '10007' ? '业主已评价' :
							item.state === '10010' ? '评价回复' :
							item.state === '10008' ? '已回访' :
								item.state === '12002' ? '启动' : '' }}
						</view>
					</view>
					<view style="margin: 5px 0;" v-if="item.state === '10005'">正在安排工作人员进行处理</view>
					<view style="margin: 5px 0;" v-if="item.state === '11000'">等待业主评价</view>
					<view style="margin: 5px 0;" v-if="item.state !== '11000' && item.state !== '10005'">
						{{ item.state === '10006' ? '派单人: ' :
							item.state === '10000' ? '维修人员: ' :
							item.state === '10001' ? '维修人员: ' :
							item.state === '10002' ? '结单人员: ' :
							item.state === '12001' ? '暂停人: ' :
							item.state === '10007' ? '评价业主: ' :
							item.state === '10010' ? '回复人员: ' :
							item.state === '10008' ? '回访人员: ' :
							item.state === '12002' ? '启动人: ' : '' }}{{ item.staffName }}
					</view>
					<view style="margin: 5px 0;" v-if="item.state === '10007'">评价内容: {{ item.context }}</view>
					<view style="margin: 5px 0;" v-if="item.state === '10008'">回访内容: {{ item.context }}</view>

					<view class="repair-img-item"
						v-if="item.photoVos && item.photoVos.length > 0">
						<image v-for="(pic, picIndex) in item.photoVos" :key="picIndex" :src="ossUrl + pic.url"
							@tap="preview(index, picIndex)" mode="widthFix">
						</image>
					</view>
					<view class="text-gray">{{ item.createTime }}</view>
				</view>
			</view>
		</view>
		<!-- <view class="cu-timeline" style="background-color: #f9f9f9;">
			<view class="cu-time">工单</view>
			<view class="cu-item " v-for="(item,index) in staffs" :key="index">
				<view class="bg-white content">
					<text>{{item.startTime}} </text> 到达 {{item.staffName}} 工位
				</view>
				<view class="bg-white content" v-if="item.endTime != undefined">
					<text>{{item.endTime}} </text> 处理完成
				</view>
				<view class="bg-white content" v-if="item.endTime != undefined">
					<text>处理意见：</text>  {{item.context}}
					<block v-if="item.state == '12000' && item.payTypeName != undefined">
						({{item.payTypeName}})
					</block>
				</view>
				<view class="bg-white content" v-if="item.state == '10009'">
					<text>处理意见：</text> {{item.context}}
					<block v-if="item.payTypeName != undefined">({{item.payTypeName}})</block>
				</view>
				<view class="bg-white content" v-if="item.photoVos.length > 0 && item.state==10005">
					<view class="repair-img-item" v-for="(pic, index2) in item.photoVos" :key="index2">
						<image :src="ossUrl+pic.url" @tap="preview(index, index2)" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view> -->
		<!-- <viewImage ref="viewImageRef"></viewImage> -->

	</view>
</template>

<script>
import context from '../../lib/java110/Java110Context.js';
const constant = context.constant;
const factory = context.factory;
import conf from '../../conf/config.js';
import { listRepairStaffs } from '@/api/repair/repairApi.js';

export default {
	data() {
		return {
			viewImage: false,
			viewImageSrc: '',
			staffs: [],
			repairId: '',
			communityId: '',
			imgUrlPre: '',
			photoUrl: conf.commonBaseUrl + '/callComponent/download/getFile/file',
			ossUrl: 'https://yuexiangtongcheng-1258340554.cos.ap-beijing.myqcloud.com/hc/'
		}
	},
	components: {
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		context.onLoad(options);
		this.repairId = options.repairId;
		this.communityId = context.getCurrentCommunity().communityId;
		this.imgUrlPre = conf.commonBaseUrl;

		//加载报修类型
		this._loadRepairStaffs();
	},
	methods: {
		_loadRepairStaffs: function () {
			let _communityInfo = context.getCurrentCommunity();
			let _that = this;
			let dataObj = {
				page: 1,
				row: 50,
				communityId: _communityInfo.communityId,
				repairId: this.repairId
			};

			listRepairStaffs(dataObj).then(_json => {
				if (_json.code == 0) {
					_that.staffs = _json.data;
					_that.staffs.forEach((item) => {
						if (item.photoVos.length > 0 && item.state == 10005) {
							// item.photoVos.forEach((img) => {
							// 	img.url = img.url+ "&communityId=-1&time=" + new Date();
							// })
						}
					})
				}
			});
		},
		preview: function (recordIndex, imgIndex) {
			let urls = [];
			this.staffs[recordIndex].photoVos.forEach((item) => {
				urls.push(this.ossUrl + item.url);
			})
			uni.previewImage({
				current: imgIndex,
				urls: urls
			})
		}
	}
}
</script>
<style>
page {
	background-color: #f9f9f9;
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
