<template>
	<view>
		<view class="block__title">注册信息</view>
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input v-model="link" required label="手机号" clearable placeholder="请输入手机号"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">密码</view>
			<input v-model="password" required type="password" label="密码" clearable placeholder="请输入密码"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">确认密码</view>
			<input v-model="rePassword" required type="password" label="确认密码" clearable placeholder="请输入确认密码"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">验证码</view>
			<input v-model="msgCode" placeholder="请输入短信验证码" name="input"></input>
			<button class='cu-btn bg-green shadow' :disabled="btnDisabled" @click="_sendMsgCode()">{{ btnValue }}</button>
		</view>
		<view class="padding flex justify-start">
			<checkbox-group @change="_changeReadme">
				<checkbox style="transform: scale(0.7)" value="readme"></checkbox>
			</checkbox-group>
			<view class="read-me">
				<text class="margin-left-xs">我已阅读</text>
				<text class="user-read" @click="_readMe">《用户须知》</text>
			</view>
		</view>
		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-green   lg" @click="_doRegister()">绑定</button>
		</view>
	</view>
</template>

<script>
import context from '../../lib/java110/Java110Context.js';
const constant = context.constant;
import conf from '../../conf/config';
import  hexMD5  from './m5d.js';
import { sendSmsCode, ownerRegiter } from '../../api/user/userApi.js';


export default {
	data() {
		return {
			link: '',
			second: 60,
			codeMsg: '',
			msgCode: '',
			areaShow: false,
			btnValue: '验证码',
			btnDisabled: false,
			password: '',
			rePassword: '',
			readme: false,
		};
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let _that = this;
	},
	methods: {
		_sendMsgCode: function () {
			sendSmsCode(this.link, this)
		},
		_changeReadme: function (e) {
			if (e.detail.value && e.detail.value.length > 0) {
				this.readme = true;
			} else {
				this.readme = false;
			}
		},
		_doRegister: function (e) {
			
			let _communityId = uni.getStorageSync("DEFAULT_COMMUNITY_ID")
			if (!_communityId) {
				_communityId = conf.DEFAULT_COMMUNITY_ID;
			}
			let obj = {
				"link": this.link,
				"msgCode": this.msgCode,
				"password": this.password,
				"openId": uni.getStorageSync(constant.mapping.CURRENT_OPEN_ID),
				"defaultCommunityId": _communityId
			}
			if (!this.readme) {
				wx.showToast({
					title: '未选择我已阅读《用户须知》',
					icon: 'none',
					duration: 2000
				})
				return;
			}
			let msg = "";
			if (this.password == '' || this.password != this.rePassword) {
				msg = "密码和重置密码不一致";
			} else if (obj.link == "") {
				msg = "请填写手机号";
			} else if (obj.msgCode == "") {
				msg = "请填写验证码";
			}
			if (msg != "") {
				wx.showToast({
					title: msg,
					icon: 'none',
					duration: 2000
				})
				return;
			}
			ownerRegiter(obj).then(_data => {
				if (_data.code == 0) {
					this.shopRegister();
					wx.hideLoading();
					wx.redirectTo({
						url: "/pages/login/login"
					});
					return;
				}
			});
		},
		shopRegister: function () {
			const formData = {
				mobilePhone: this.link,
				username: this.link,
				password: hexMD5.hexMD5(this.link)
			};

			uni.request({
				url: 'https://api4.myxy.ltd/buyer/passport/member/register',
				method: 'POST',
				data: formData,
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'uuid': this.link
				},
				success: (res) => {
					console.log('注册成功:', res.data);
				},
				fail: (err) => {
					console.error('注册失败:', err);
				}
			});
		},
		change: function (data) {
			let _that = this;
			_that.areaName = '';
			data.data.forEach(function (_obj) {
				_that.areaName += _obj.name;
			});
			_that.areaCode = data.data[2].code;
			console.log(data);
		},

		_readMe: function () {
			uni.navigateTo({
				url: '/pages/login/registerProtocol'
			})
		}
	}
};
</script>
<style>
.block__title {
	margin: 0;
	font-weight: 400;
	font-size: 14px;
	color: rgba(69, 90, 100, .6);
	padding: 40rpx 30rpx 20rpx;
}

.button_up_blank {
	height: 40rpx;
	text-align: center;
}

.read-me {
	line-height: 64upx;
}

.user-read {
	margin-left: 10upx;
	color: darkgreen;
}
</style>
