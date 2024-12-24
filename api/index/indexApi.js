/**
 * 首页相关 数据封装API
 * add by 吴学文 2020-09-07
 * QQ 92825595
 * 
 */

import {
	requestNoAuth
} from '../../lib/java110/java110Request.js';
import url from '../../constant/url.js';


import {
	dateTimeStringToDateString
} from '../../lib/java110/utils/DateUtil.js'

/**
 * 查询活动列表
 */
export function getActivitiTitle(dataObj) {

	return new Promise(
		(resolve, reject) => {
			requestNoAuth({
				url: url.queryActivitiesType,
				method: "GET",
				data: dataObj,
				//动态数据
				success: function(res) {
					if (res.statusCode == 200) {
						let _activites = res.data.data;
						resolve(_activites);
						return;
					}
					reject();
				},
				fail: function(e) {
					reject();
				}
			});
		})
}

/**
 * 查询 目录列表
 */
export function getCategoryList() {
	return {
		pageone: [{
			name: "综合缴费",
			src: "/static/images/index_payFee.png",
			href: "/pages/fee/oweFee"
			//href: "/pages/fee/oweFeeGarden"
			
		}, {
			name: "房屋费",
			src: "/static/images/index_property.png",
			href: "/pages/fee/roomFeeListNew"
		}, {
			name: "停车费",
			src: "/static/images/index_park.png",
			href: "/pages/fee/payParkingFeeList"
		}, {
			name: "投诉咨询",
			src: "/static/images/index_complaint.png",
			href: "/pages/complaint/complaint"
		}, {
			name: "报修",
			src: "/static/images/index_repair.png",
			href: "/pages/repair/repair"
		}, {
			name: "公告",
			src: "/static/images/index_notice.png",
			href: "/pages/notice/index"
		}, {
			name: "开门",
			src: "/static/images/index_openDoor.png",
			href: "/pages/machine/openDoor"
		// }, {
		// 	name: "二维码开门",
		// 	src: "/static/images/index_openDoor.png",
		// 	href: "/pages/openDoorByQrCode/openDoorByQrCode"
		}, {
			name: "联系客服",
			src: "/static/images/index_persion.png",
			href: "callProperty"
		}],
		pagetwo: [{
				name: "家庭成员",
				src: "/static/images/index_member.png",
				href: "/pages/family/familyList"
			}, {
				name: "车位申请",
				src: "/static/images/index_parking.png",
				href: "/pages/applyparking/applyparking"
			},
			{
				name: "空置房",
				src: "/static/images/index_emptyRoom.png",
				href: "/pages/applyRoom/applyRoom"
			},
			{
				name: "房屋装修",
				src: "/static/images/index_fitment.png",
				href: "/pages/renovation/roomRenovation"
			},
			// {
			// 	name: "临时车收费",
			// 	src: "/static/images/index_carCharges.png",
			// 	href: "/pages/fee/tempParkingFee"
			// },
			{
				name: "合同费用",
				src: "/static/images/index_contractCost.png",
				href: "/pages/fee/contractFeeList"
			},
			{
				name: "投票问卷",
				src: "/static/images/index_Voting.png",
				href: "/pages/questionAnswer/questionAnswer"
			},
			{
				name: "访客登记",
				src: "/static/images/index_complaint.png",
				href: "/pages/visit/visitList"
			},
			{
				name: "反省上报",
				src: "/static/images/index_complaint.png",
				href: "/pages/reportInfoBack/reportInfoBack",
				needLogin:'N'
			}
		]
	};
}


/**
 * 查询活动
 */
export function loadActivites(dataObj) {
	return new Promise(
		(resolve, reject) => {
			requestNoAuth({
				url: url.listActivitiess,
				method: "GET",
				data: dataObj,
				//动态数据
				success: function(res) {
					if (res.statusCode == 200) {
						let _activites = res.data.activitiess;
						let _acts = [];
						if(!_activites || _activites.length<1){
							resolve(_acts);
							return;
						}
						
						_activites.forEach(function(_item) {
							_item.src = url.filePath + "?fileId=" + _item.headerImg +
								"&communityId=" + dataObj.communityId +
								"&time=" + new Date();
							_item.startTime = dateTimeStringToDateString(_item.startTime);

							_acts.push(_item);
						});
						resolve(_acts);
						return;
					}
					reject();
				},
				fail: function(e) {
					reject();
				}
			});
		})
}

/**
 * 查询小区广告
 */
export function loadAdverts(dataObj) {
	return new Promise(
		(resolve, reject) => {
			requestNoAuth({
				url: url.listAdvertPhoto,
				method: "GET",
				data: dataObj,
				//动态数据
				success: function(res) {
					if (res.statusCode == 200) {
						let _advertPhotos = res.data;
						resolve(_advertPhotos);
						return;
					}
					reject();
				},
				fail: function(e) {
					reject();
				}
			});
		})
}

/**
 * 查询小区广告
 */
export function listMarketPicByCommunity(dataObj) {
	return new Promise(
		(resolve, reject) => {
			requestNoAuth({
				url: url.listMarketPicByCommunity,
				method: "GET",
				data: dataObj,
				//动态数据
				success: function(res) {
					if (res.statusCode == 200) {
						resolve(res.data);
						return;
					}
					reject();
				},
				fail: function(e) {
					reject();
				}
			});
		})
}

/**
 * 查询小区广告
 */
export function listCommunityMarketGoods(dataObj) {
	return new Promise(
		(resolve, reject) => {
			requestNoAuth({
				url: url.listCommunityMarketGoods,
				method: "GET",
				data: dataObj,
				//动态数据
				success: function(res) {
					if (res.statusCode == 200) {
						resolve(res.data);
						return;
					}
					reject();
				},
				fail: function(e) {
					reject();
				}
			});
		})
}

