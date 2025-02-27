/**
 * 上下文对象,再其他文件调用常量 方法 时间工具类时 只引入上下文文件
 * 
 * add by wuxw 2019-12-27
 * 
 * the source opened https://gitee.com/java110/WechatOwnerService
 */
import constant from '../../constant/index.js'

import factory from '../../factory/index.js'

import {
	getHeaders,
	request,
	requestNoAuth,
} from './java110Request.js'

import {
	getCurOwner
} from '../../api/owner/ownerApi.js';

import {
	getProperty
} from '../../api/property/propertyApi.js'

import {onLoad,checkSession} from './page/Page.js'


import {getLoginFlag,getUserInfo} from './utils/StorageUtil.js'

let util = {};

/**
 * http 请求 加入是否登录判断
 */
const requestObj = function(_reqObj) {

	//白名单直接跳过检查登录
	if (constant.url.NEED_NOT_LOGIN_URL.includes(_reqObj.url)) {
		_reqObj.communityId = constant.mapping.HC_TEST_COMMUNITY_ID;
		requestNoAuth(_reqObj);
		return;
	}
	//校验是否登录，如果没有登录跳转至温馨提示页面
	request(_reqObj);
};
/**
 * 获取位置
 * add by wuxw 2019-12-28
 */


const getLocation = function() {
	return wx.getStorageSync('location');
};

const getCurrentLocation = function() {
	return wx.getStorageSync('currentLocation');
};



const _loadArea = function(_level, _parentAreaCode, callBack = _areaList => {}) {
	let areaList = wx.getStorageSync(constant.mapping.AREA_INFO);
	if (areaList) {
		callBack(areaList);
		return;
	}
	
	requestNoAuth({
		url: constant.url.areaUrl,
		data: {
			areaLevel: _level,
			// 临时登录凭证
			parentAreaCode: _parentAreaCode
		},
		success: function(res) {
			res = res.data;
			var province = [],
				city = [],
				area = [];
			var _currentArea = [];
			province = res.areas.filter(item => {
				return item.areaLevel == '101';
			});
			city = res.areas.filter(item => {
				return item.areaLevel == '202';
			});
			area = res.areas.filter(item => {
				return item.areaLevel == '303';
			});
			var provinceList = {};
			province.forEach(function(item) {
				provinceList[item.areaCode] = item.areaName;
			});
			var cityList = {};
			city.forEach(function(item) {
				cityList[item.areaCode] = item.areaName;
			});
			var quyuList = {};
			area.forEach(function(item) {
				quyuList[item.areaCode] = item.areaName;
			});
			let areaList = {
				province_list: provinceList,
				city_list: cityList,
				county_list: quyuList
			};
			callBack(areaList); //将 地区信息存储起来

			wx.setStorageSync(constant.mapping.AREA_INFO, areaList);
		},
		fail: function(error) {
			// 调用服务端登录接口失败
			wx.showToast({
				title: '调用接口失败'
			});
			console.log(error);
		}
	});
};

const getOwner = function(callBack = _ownerInfo => {}) {
	// 从硬盘中获取 业主信息
	getCurOwner()
		.then((_owner) => {
			callBack(_owner);
		})
};


/**
 * 获取当前小区信息
 */


const getCurrentCommunity = function() {
	let communityInfo = wx.getStorageSync(constant.mapping.CURRENT_COMMUNITY_INFO);
	return communityInfo;
};
/**
 * add by shil 2020-01-08
 * 获取当前用户的房屋信息
 */


const getRooms = function(type) {
	return new Promise((resolve, reject) => {
		getOwner(function(_owner) {
			if(!_owner.ownerId || _owner.ownerId == '-1'){
				resolve({
					data:{rooms:[]}
				});
				return;
			}
			// Create base data object
			let requestData = {
				communityId: _owner.communityId,
				ownerId: _owner.ownerId,
			};
			
			// Only add userState when type == 1
			if (type == 1) {
				requestData.userState = '0';
			}
			
			request({
				url: constant.url.queryRoomsByOwner,
				header: getHeaders(),
				method: "GET",
				data: requestData,
				success: function(res) {
					if (res.statusCode == 200) {
						//将业主信息和房屋信息一起返回
						res.data['owner'] = _owner;

						if (res.data.rooms.length == 0) {
							wx.showToast({
								title: "未查询到房屋信息",
								icon: 'none',
								duration: 2000
							});
						}

						resolve(res);
					} else {
						wx.showToast({
							title: '未查询到房屋信息',
							icon: 'none',
							duration: 2000
						});
					}
				},
				fail: function(res) {
					//  调用服务端登录接口失败
					wx.showToast({
						title: '调用接口失败'
					});
					reject(res);
				}
			});
		});
	});
};

//判断当前登录状态，不调跳转登录界面
const checkLoginStatus = function() {
	let loginFlag = wx.getStorageSync(constant.mapping.LOGIN_FLAG);
	let nowDate = new Date();
	if (loginFlag && loginFlag.expireTime > nowDate.getTime()) {
		return true;
	} else {
		return false;
	}
};

/**
 * 跳转功能封装
 * @param {Object} _param 跳转入参
 */
const navigateTo = function(_param) {
	let _url = _param.url;
	let _tempUrl = _url.indexOf('?') > 0 ? _url.substring(0, _url.indexOf('?')) : _url;
	//是否需要登录
	constant.url.NEED_NOT_LOGIN_PAGE.forEach(item => {
		if (item == _tempUrl) {
			uni.navigateTo(_param);
			return;
		}
	});
	console.log('跳转参数', _param);
	//校验是否登录，如果没有登录跳转至温馨提示页面
	checkSession(_param.url,function(){
		//有回话 跳转至相应页面
		uni.navigateTo(_param);
	})
};



module.exports = {
	constant: constant,
	util: util,
	factory: factory,
	getHeaders: getHeaders,
	getLocation: getLocation,
	getUserInfo: getUserInfo,
	getLoginFlag: getLoginFlag,
	_loadArea: _loadArea,
	getCurrentLocation: getCurrentLocation,
	getOwner: getOwner,
	getCurrentCommunity: getCurrentCommunity,
	request: requestObj,
	getRooms: getRooms,
	getProperty: getProperty,
	checkLoginStatus: checkLoginStatus,
	onLoad: onLoad,
	navigateTo: navigateTo,
};
