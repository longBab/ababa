
let _systemConfig = uni.getStorageSync('java110SystemConfig');
// #ifdef H5
// 服务器域名 公众号时，配置为 / 就可以
const baseUrl = 'http://192.168.1.3:3001/';
// const baseUrl = 'https://api2.jgjuli.com/';

// #endif

// #ifndef H5
//服务器域名 小程序 或者 app 时 后端地址
// const baseUrl = 'http://192.168.10.70:3001/';
const baseUrl = 'https://api2.myxy.ltd/';
// #endif
// http://www.myxy.ltd:9900
let commonBaseUrl = 'http://demo.homecommunity.cn/';

//商城的url
let mallUrl = 'http://mallapp.homecommunity.cn/';

//商城小程序ID
let mallMinAppId = "xxx";

//默认的小区ID和名称，用户还没有登录时显示的小区信息

let DEFAULT_COMMUNITY_ID = "2023052267100146"; //HC测试小区id  用于没有登录时展示相关信息
let DEFAULT_COMMUNITY_NAME = "悦享同城用户端";

// APP 或者 公众号  appId
const wAppId = "wx059a1d597ebce513"; //微信AppId

//app支付时这里需要填写支付秘钥
const appPayKey = "";

const logLevel = "DEBUG"; // 日志级别

let systemName="业主版";

if(_systemConfig){
	mallUrl = _systemConfig.mallUrl;
	commonBaseUrl = _systemConfig.imgUrl;
	systemName = _systemConfig.ownerTitle;
	DEFAULT_COMMUNITY_ID = _systemConfig.defaultCommunityId;
}

const mallUrlIndexPage = mallUrl + '#/pages/index/index?mallFrom=HC';

//商城token 刷新页面
const mallUrlRefresh = mallUrl + "#/pages/mallTokenRefresh/mallTokenRefresh?mallFrom=HC"



export default {
	baseUrl: baseUrl,
	mallUrl: mallUrl,
	mallUrlIndexPage: mallUrlIndexPage,
	mallUrlRefresh: mallUrlRefresh,
	commonBaseUrl: commonBaseUrl,
	DEFAULT_COMMUNITY_ID: DEFAULT_COMMUNITY_ID,
	DEFAULT_COMMUNITY_NAME: DEFAULT_COMMUNITY_NAME,
	wAppId: wAppId,
	logLevel: logLevel,
	appPayKey: appPayKey,
	imgUrl:commonBaseUrl,
	systemName:systemName,
	mallMinAppId:mallMinAppId
}
