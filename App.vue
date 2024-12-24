<script>
//app.js
import context from './lib/java110/Java110Context.js'
const loginFactory = context.factory.login;
const userFactory = context.factory.user;
import https from './utils/http.js';
import authService from './utils/auth';
import toastService from './utils/toast.service';
import { reciveMessage } from './api/webView/webViewApi.js';
import amapFile from './utils/gaode-libs/amap-wx';
	import * as Config from './utils/gaode-libs/config';
import { requestNoAuth } from './lib/java110/java110Request.js';


import url from './constant/url.js'
var initRegeoInfo = {
		name: '麓谷小镇',
		address: '岳麓大道尖山路口北300米',
		location: '112.885538,28.232363',
		isAutoLocation: false
	};
export default {
	// 小程序启动生命周期
	onLaunch: function () {
		let that = this; // 检查登录状态

		//loginFactory.checkLoginStatus(); // 获取用户地理位置
		userFactory.getUserLocation();
		this.globalData.getUserInfo();
		// #ifdef H5
		window.addEventListener("message", reciveMessage);
		// #endif

		uni.onTabBarMidButtonTap(() => {
			uni.navigateTo({
				url: "/pages/machine/openDoorByQrCode",
				animationType: 'slide-in-bottom'
			})
		})

		requestNoAuth({
			url: url.listSystemInfo,
			method: "GET",
			data: {
				page: 1,
				row: 1
			},
			success: function (res) {
				console.log(res.data);
				if (res.data.data && res.data.data.length > 0) {
					uni.setStorageSync('java110SystemConfig', res.data.data[0])
				}
				//reslove(res);
			},
			fail: function (e) { }

		});


		this.globalData.getSystemInfo();
		this.globalData.getUserInfo();
		// this.globalData.getUserAgent().then((result)=>{
		// 	toastService.showToast(result);
		// });

		this.globalData.getShoppingCarNumber();
		// #ifdef H5
		this.globalData.getH5Location();
		// #endif

		// #ifdef APP-PLUS
		this.globalData.getAppLocation();
		// #endif

		// #ifdef MP-WEIXIN||MP-ALIPAY
		this.globalData.getRegeoLocation();
		// #endif
	},
	// app全局数据
	globalData: {
		userInfo: null,
		appVersion: 5.28,

		getRegeoLocation() {
			let _this = this;
			setTimeout(function timeout() {
				var key = Config.key();
				var myAmapFun = new amapFile.AMapWX({
					key: key
				});

				// myAmapFun.getRegeo({
				// 	success: function(getRegeo) {
				// 		console.log(getRegeo);
				// 		if (getRegeo) {
				// 			_this.deliveryAndSelfTaking.location = getRegeo[0].longitude + ',' + getRegeo[0].latitude;
				// 		}
				// 		https.request('/rest/member/updateLastUseAddress', {
				// 				lastUseAddress: getRegeo[0].regeocodeData.formatted_address
				// 			}).then((result) => {
				// 				if (result.success) {
				// 				}
				// 			});
				// 	},
				// 	fail: function(info) {
				// 	}
				// });
			}, 1000);
		},
		//获取经纬度
		getH5Location() {
			var _this = this;
			console.log(2222222222);
			return new Promise((fulfil, reject) => {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					isHighAccuracy: true, // 开启地图精准定位
					success: (res) => {
						console.log("H5位置获取=", res);
						console.log('H5端当前位置的经度：' + res.longitude);
						console.log('H5端当前位置的纬度：' + res.latitude);
						const longs = res.longitude.toString();
						const lat = res.latitude.toString();
						if (longs !== '' && lat !== '') {
							this.deliveryAndSelfTaking.location = longs + ',' + lat;
							//this.turnAdrr(longs, lat)//经纬度转地区名
						}
						fulfil(res);
					},
					fail: (err) => {
						console.log("H5位置获取失败", err);
						fulfil(err);
					}
				});
			});
		},
		getAppLocation() {
			var _this = this;
			return new Promise((fulfil, reject) => {
				uni.getLocation({
					type: 'wgs84', // 返回可以用于高德地图的坐标
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					altitude: true,
					success: (res) => {
						console.log('APP端当前位置的经度：' + res.longitude);
						console.log('APP端当前位置的纬度：' + res.latitude);
						const longs = res.longitude.toString();
						const lat = res.latitude.toString();
						if (longs !== '' && lat !== '') {
							_this.deliveryAndSelfTaking.location = longs + ',' + lat;
							//this.turnAdrr(longs, lat)//经纬度转地区名
						}
						fulfil(res);
					},
					fail: (err) => {
						console.error('APP端获取位置失败：', err);
						fulfil(err);
					}
				});
			});
		},
		getSettingInfo() {
			var _this = this;
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.userLocation']) {
						_this.authSetting = res.authSetting;
					}
				}
			});
		},
		getSystemInfo() {
			var res = uni.getSystemInfoSync();
			this.systemInfoSync = res;
		},
		getUserAgent() {
			return new Promise((resolve, reject) => {
				let en = window.navigator.userAgent.toLowerCase();
				// 判断微信方法1、匹配en中是否含有MicroMessenger字符串
				if (en.match(/MicroMessenger/i) == 'micromessenger') {
					resolve("H5_WECHAT");
				}
				// 判断微信方法2
				// if (/MicroMessenger/.test(window.navigator.userAgent)) {
				// 	console.log('微信浏览器');
				// }
				if (en.match(/MicroMessenger/i) != 'micromessenger') {
					if (/AlipayClient/.test(window.navigator.userAgent)) {
						//判断是否是支付宝浏览器打开
						resolve("H5_ALIPAY");
					} else {
						resolve("H5_OTHER");
					}
				}
			});
		},
		getCurrentEnvironment() {
			var _this = this;
			return new Promise((resolve, reject) => {
				uni.getSystemInfo({
					success: function (res) {
						const platform = res.platform.toLowerCase();
						if (platform === 'devtools') {
							var userAgent = _this.getUserAgent();
							resolve(userAgent);
						} else if (platform === 'ios' || platform === 'android') {
							resolve('APP');
						} else if (platform === 'wechat') {
							resolve('WECHAT');
						} else {
							resolve('OTHER');
						}
					},
					fail: function (error) {
						reject(error);
					}
				})
			});
		},
		getLoginCode() {
			return new Promise((fulfil, reject) => {
				uni.login({
					success: (res) => {
						if (res.code) {
							fulfil(res.code);
						}
					}
				});
			});
		},

		weChatLogin(phoneNumber, openId, inviterId) {
			console.log('app.js -> inviterId = ' + inviterId);
			console.log(this.userInfo);
			var userInfo = this.userInfo;
			if (!userInfo) {
				uni.getUserInfo({
					success: (res) => {
						this.memberWeChatLogin(phoneNumber, openId, inviterId, res.userInfo);
					}
				});
			} else {
				this.memberWeChatLogin(phoneNumber, openId, inviterId, userInfo);
			}
		},

		memberWeChatLogin(phoneNumber, openId, inviterId, userInfo) {
			https.request('/rest/member/weChat/login', {
				mobile: phoneNumber,
				headImg: userInfo.avatarUrl,
				username: userInfo.nickName,
				sex: userInfo.gender,
				openId: openId,
				inviterId: inviterId ? inviterId : ''
			}).then((result) => {
				if (result.success) {
					authService.setToken(result.token);
					authService.setOpenId(openId);
					authService.setPhoneNumber(phoneNumber);
					toastService.showSuccess(result.message);
					this.isNewPeople = result.isNewPeople;
					this.getUserInfo();
					let timeout = setTimeout(() => {
						//如果是邀请链接直接跳转到首页，如果是进入用户后退一页
						if (inviterId) {
							uni.switchTab({
								url: '/pages/index/index'
							});
						} else {
							var pages = getCurrentPages();
							if (pages && pages.length > 0) {
								uni.navigateBack(1);
							} else {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						}
						clearTimeout(timeout);
					}, 300);
				}
			});
		},

		getMemberInfo: function (e) {
			return new Promise((fulfil, reject) => {
				https.request('/rest/member/getLoginMemberInfo', {}).then((result) => {
					if (result.success) {
						fulfil({
							isNewPeople: result.data.isNewPeople,
							isRemindNewPeople: result.data.isRemindNewPeople
						});
					}
				});
			});
		},

		getUserInfo() {
			https.request('/rest/member/getLoginMemberInfo', {}).then((result) => {
				if (result.success) {
					//console.log(result.data);
					this.loginUserInfo = result.data;
					//console.log(this.globalData.userInfo);
				}
			});
		},

		bindInDevelopment() {
			toastService.showModal(null, '敬请期待~', null, null, false);
		},

		getIsBusiness(startTime, endTime, isOperating) {
			return new Promise((fulfil, reject) => {
				let isBusiness = dateHelper.differenceTime(startTime, endTime);
				console.log('实际后端传值isOperating======》' + isOperating);
				console.log('计算商家的关店时间isBusiness====》' + isBusiness);
				if (!isOperating || !isBusiness) {
					fulfil(false);
					toastService.showModal(
						null,
						'店铺休息中，目前不能下单',
						function confirm() {
							return;
						},
						null,
						false
					);
					return;
				}
				fulfil(true);
			});
		},

		getIsItNear(startTime, endTime) {
			let itNear = dateHelper.itNearTime(startTime, endTime);
			console.log('是否相差30分钟===》' + itNear);
			console.log('商家开门时间======》' + startTime);
			console.log('商家打烊时间====》' + endTime);
			if (itNear) {
				if (!this.deliveryAndSelfTaking.isItNear) {
					this.deliveryAndSelfTaking.isItNear = true;
					toastService.showModal(
						null,
						'店铺临近打烊或已打烊',
						function confirm() {
							return;
						},
						null,
						false
					);
				}
			}
		},

		isRemindNewPeople() {
			return new Promise((fulfil, reject) => {
				https.request('/rest/member/updateIsRemindNewPeople').then((result) => {
					console.log(result);
					if (result.success) {
						fulfil(true);
					}
					fulfil(false);
				});
			});
		},

		checkIsAuth(authSetting, params) {
			toastService.showModal(
				null,
				'当前未登录，确定去登录吗?',
				function confirm() {
					// #ifdef H5
					let url = '/pages/internal/login/code/code';
					if (params) {
						if (params.inviterId) {
							url = url + (params.inviterId ? '?inviterId=' + params.inviterId : '');
						}
					}
					uni.navigateTo({
						url: url
					});
					// #endif
					// #ifdef MP-WEIXIN||MP-ALIPAY
					uni.getSetting({
						success: (res) => {
							console.log(res);
							console.log(res.authSetting[authSetting]);
							if (res.authSetting[authSetting]) {
								let url = '/pages/internal/login/choose/choose';
								if (params) {
									if (params.inviterId) {
										url = url + (params.inviterId ? '?inviterId=' + params.inviterId : '');
									}
								}
								uni.navigateTo({
									url: url
								});
							} else {
								let url = '/pages/internal/login/authorization/authorization';
								if (params) {
									if (params.inviterId) {
										url = url + (params.inviterId ? '?inviterId=' + params.inviterId : '');
									}
								}
								uni.redirectTo({
									url: url
								});
							}
						}
					});
					// #endif
				},
				null,
				true
			);

		},
		beforeClose(action) {
			new Promise((resolve) => {
				setTimeout(() => {
					// action !== 'confirm'  拦截取消操作
					resolve(action === 'confirm');
				}, 1000);
			})
		},
		getDeliveryAddressList() {
			https.request('/rest/member/deliveryAddress/list', {
				pageNo: -1,
				pageSize: 10
			}).then((result) => {
				if (result.success) {
					result.data.records.forEach((item, index) => {
						if (item.isDefault) {
							this.deliveryAndSelfTaking.deliveryAddress = item;
						}
					});
				}
			});
		},

		getShoppingCarNumber() {
			authService.checkIsLogin().then((result) => {
				if (result) {
					https.request('/rest/member/pointsMall/shoppingCart/list', {
						pageNo: -1,
						pageSize: 20
					}).then((result) => {
						if (result.success) {
							const items = result.data.records;
							let totalNum = 0;
							for (let i = 0; i < items.length; i++) {
								totalNum = totalNum + items[i].number;
							}
							if (totalNum) {
								uni.setTabBarBadge({
									index: 3,
									text: String(totalNum)
								});
								return;
							}
							uni.removeTabBarBadge({
								index: 3
							});
						}
					});
					return;
				}
			});
		},
		setTabBarBadge(num) {
			if (num) {
				uni.setTabBarBadge({
					index: 3,
					text: String(num)
				});
				return;
			}
			uni.removeTabBarBadge({
				index: 3
			});
		},
		deliveryAndSelfTaking: {
			modeList: [{
				id: 0,
				radioName: '配送',
				title: '配送信息',
				tipName: '送达',
				checked: true
			},
			{
				id: 1,
				radioName: '自取',
				tipName: '可取',
				title: '自提门店',
				mode: [{
					id: 0,
					name: '店内用餐',
					checked: true
				},
				{
					id: 0,
					name: '自提带走',
					checked: false
				}
				],
				checked: false
			}
			],
			radioIndex: 0,
			feeData: 0,
			shopAddress: null,
			currentTab: 0,
			isReducedDeliveryPrice: false,
			reducedDeliveryTotalPrice: 0,
			isItNear: false,
			isThereADiscount: false,
			location: initRegeoInfo.location,
			isOutofDeliveryRange: false,
			initRegeoInfo: initRegeoInfo,
			regeoInfo: initRegeoInfo,
			ifIndexSwitchTab: false,
			ifChooseBack: false,
			ifChoosePayBack: false,
			selfOutActiveIndex: 0,
			payType: '',
			orderDetail: {
				initShopInfo: {}
			}
		},
		authSetting: '',
		systemInfoSync: '',
		isNewPeople: '',
		loginUserInfo: ''
	},
	methods: {}
};
</script>
<style>
@import "./app.css";

/* @import "./styleaa.scss"; */
/* #ifdef H5 */
uni-page-head {
	display: none;
}

.theme-bg {
	background: #1377FD;
	color: white;
	border: none;
}

/* #endif */
</style>
