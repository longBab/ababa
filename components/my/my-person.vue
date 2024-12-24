<template>
  <view>
    <image class="topimgs" src="../../static/user/usetop.png" mode=""></image>
    <view class="user-container my_user" style="position: relative; z-index: 1">
      <view class="userinfo">
        <view class="wait" v-if="login">
          <view
            class="cu-avatar header-img round"
            :style="{ backgroundImage: 'url(' + headerImg + ')' }"
          >
          </view>
          <view class="userinfo-nickname margin-top">
            <text class="username">{{ userName }}</text>
            <text class="userphone">{{ userPhone }}</text>
            <!-- <text class="userarea" @tap="_changeCommunity()">{{ communityName }} <text class="cuIcon-settings text-white margin-left-sm"></text></text> -->
          </view>
          <view class="text-right" @click="_viewUserQrCode">
            <text class="cuIcon-qrcode text-white margin-left"></text>
          </view>
        </view>
        <view class="wait" v-else @tap="showLongModel">
          <!-- #ifdef MP-WEIXIN -->
          <view class="userinfo-avatar">
            <open-data type="userAvatarUrl" lang="zh_CN" />
          </view>
          <!-- #endif -->
          <!-- #ifdef H5 || APP-PLUS -->
          <view
            class="cu-avatar header-img round"
            :style="{ backgroundImage: 'url(' + headerImg + ')' }"
          >
          </view>
          <!-- #endif -->
          <view class="userinfo-nickname margin-top">
            <text>请登录</text>
          </view>
        </view>
      </view>
      <view class="card">
        <view class="card_item" @click="myAccount()">
          <view class="card_item_Num">￥{{ blance }}</view>
          <view class="card_item_title">余额</view>
        </view>
        <view class="link"></view>
        <view class="card_item" @click="myjifen()">
          <view class="card_item_Num">{{ inter }}</view>
          <view class="card_item_title">积分</view>
        </view>
        <view class="link"></view>
        <view class="card_item" @click="coupons()">
          <view class="card_item_Num">{{ ka }}</view>
          <view class="card_item_title">卡卷</view>
        </view>
      </view>
      <!-- <view class="money_box">
				<view class="money_item" @click="myAccount()">
					<view class="num">￥{{blance}}</view>
					<view class="name">余额</view>
				</view>
				<view class="line"></view>
				<view class="money_item">
					<view class="num">{{inter}}</view>
					<view class="name">积分</view>
				</view>
				<view class="line"></view>
				<view class="money_item" @click="coupons()">
					<view class="num">{{ka}}</view>
					<view class="name">卡劵</view>
				</view>
			</view> -->
    </view>

    <!-- 会员卡片 -->
    <view class="vip-card" @click="openVip">
      <view class="vip-content" v-if="!memberLevel">
        <view class="vip-left">
          <text class="vip-title">会员尊享特权</text>
          <text class="vip-subtitle">尊享30项专属特权</text>
        </view>
        <view class="vip-right">
          <text class="vip-btn">会员中心</text>
        </view>
      </view>

      <view class="vip-content member-content" v-else>
        <!-- <image :src="memberLevel.iconUrl" class="member-icon" /> -->

        <view class="vip-left">
          <view class="member-info">
            <view class="member-details">
              <text class="member-name">{{ memberLevel.levelName }}</text>
              <text
                >成长值：{{ memberLevel.growthValue }}/{{
                  memberLevel.totalGrowthValue
                }}</text
              >
            </view>
          </view>
          <view class="growth-info">
            <text class="member-expiry"
              >有效期至：{{ memberLevel.expirationTime.split(" ")[0] }}</text
            >
          </view>
        </view>
        <view class="vip-right">
          <text class="member-btn">查看特权</text>
        </view>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="cardOrder">
      <view class="order-header">
        <view style="display: flex; align-items: center">
          <view class="titleColor"></view>
          <view class="titleClass">我的订单</view>
        </view>
        <view class="more-btn" @click.stop="toggleMore">
          <text>更多</text>
          <text class="cuIcon-unfold" :class="{ rotate: showMore }"></text>
        </view>
      </view>
      <view class="cardOrderNav" :class="{ expanded: showMore }">
        <navigator
          class="cardOrderNav_item"
          :url="
            '/pages/orderInfo/orderInfo?currentTab=' +
            0 +
            '&modeType=' +
            item.modeType +
            '&currentOrderTab=' +
            item.modeId
          "
          v-for="(item, index) in orderNavs"
          :key="index"
        >
          <image class="icon" :src="item.icon" mode="" />
          <view class="cardOrderNav_item_text">{{ item.text }}</view>
        </navigator>
		<navigator
          class="cardOrderNav_item"
          :url="item.status"
          v-for="(item, index) in orderNavs2"
          :key="index+'a'"
        >
          <image class="icon" :src="item.icon" mode="" />
          <view class="cardOrderNav_item_text">{{ item.text }}</view>
        </navigator>
		
      </view>
    </view>

    <!-- 分销中心/积分商城 -->
    <view class="market-section">
      <view class="market-item" @click="goToDistribution">
        <view class="market-content">
          <view class="market-title">购物车</view>
          <view class="market-subtitle">查看已选商品</view>
        </view>
        <view class="market-image">
          <image
            style="width: 100%; height: 100%"
            class="icon"
            src="../../static/user/fx.png"
            mode=""
          />
        </view>
      </view>
      <view class="market-divider"></view>
      <view class="market-item" @click="goToPointsMall">
        <view class="market-content">
          <view class="market-title">积分商城</view>
          <view class="market-subtitle">攒积分兑好礼</view>
        </view>
        <view class="market-image">
          <image
            style="width: 100%; height: 100%"
            class="icon"
            src="../../static/user/jf.png"
            mode=""
          />
        </view>
      </view>
    </view>
    <auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
  </view>
</template>

<script>
import context from "@/lib/java110/Java110Context.js";
const factory = context.factory; //获取app实例
const constant = context.constant;
import conf from "@/conf/config.js";
import { queryOwnerAccount } from "@/api/user/userApi.js";
import { getCouponUsers } from "../../api/fee/feeApi.js";

import {
  getCommunityId,
  getCommunityName,
} from "../../api/community/communityApi.js";

import {
  loadLoginOwner,
  getMemberId,
  hasAuthOwner,
} from "../../api/owner/ownerApi.js";
import { getUserName, getUserTel } from "@/api/user/userApi.js";

import authOwnerDialog from "@/components/owner/auth-owner-dialog.vue";
export default {
  name: "my-person",
  data() {
    return {
      userInfo: {},
      headerImg: conf.imgUrl + "/h5/images/serve/head.png",
      topImg: conf.imgUrl + "/h5/images/serve/bg.png",
      userName: "",
      userPhone: "",
      communityName: "",
      blance: "0.00",
      inter: "0.00",
      ka: "0",
      ownerFlag: false, // 是否有业主信息 标记 如果有为 true  没有为false
      login: true,
      orderNavs: [
        {
          icon: "../../static/user/dfk.svg",
          text: "待付款",
          modeId: 1,
          modeType: "waitPayment",
        },

        {
          icon: "../../static/user/dsh.svg",
          text: "待收货",
          modeId: 2,
          modeType: "waitDelivered",
        },
        {
          icon: "../../static/user/dfh.svg",
          text: "待自提",
          modeId: 3,
          modeType: "waitReceived",
        },
        {
          icon: "../../static/user/ywc.svg",
          text: "已完成",
          modeId: 0,
          status: "/pages/order/myOrder?status=0",
        },
        {
          icon: "../../static/user/sh.png",
          text: "售后",
          modeId: 4,
          status: "/pages/order/afterSales/afterSales",
        },

       
        // { icon: '../../static/user/wdjf.png', text: '我的积分', status: '/pages/passport/entry/seller/index' },
      ],
	  orderNavs2:[
	  {
          icon: "../../static/user/dzgl.png",
          text: "地址管理",
          status: "/pages/address/address",
        },
        {
          icon: "../../static/user/wdzj.png",
          text: "我的收藏",
          status: "/pages/collect/collect",
        },
	  ],
      showMore: false,
      memberLevel: null,
    };
  },
  created() {
    this.refreshPageLoginInfo();
  },
  components: {
    authOwnerDialog,
  },
  methods: {
    getMemberLevel() {
      uni.request({
        url: `http://www.myxy.ltd:9900/shop/buyer/memberLevel/${getUserTel()}`,
        method: "GET",
        success: (res) => {
          console.log("memberLevel response:", res.data); // 添加调试日志
          this.memberLevel = res.data.data || res.data; // 可能需要访问 res.data.data
        },
        fail: (err) => {
          console.error("获取会员信息失败:", err);
        },
      });
    },
    toatTest() {
      uni.showToast({
        title: "暂未开放",
        icon: "none",
      });
    },
    //换小区
    _changeCommunity: function () {
      uni.navigateTo({
        url: "/pages/my/changeOwnerCommunity",
      });
    },

    refreshPageLoginInfo: function () {
      let _that = this; //查询用户信息
      if (!_that.ckeckUserInfo()) {
        _that.login = false;
        return;
      }
      _that.communityName = getCommunityName();
      _that.login = true;
      _that.userName = getUserName();
      _that.userPhone = getUserTel();
      _that.loadOwenrInfo();
      _that.userInfo = context.getUserInfo();
      this.loadOwnerHeaderImg();
      this.loadOwnerAccount();
      this.loadOwnerCoupon();
      // this.getMemberLevel()
    },
    ckeckUserInfo: function () {
      return context.checkLoginStatus();
    },
    loadOwenrInfo: function () {
      let _that = this;
      context.getOwner(function (_ownerInfo) {
        if (_ownerInfo) {
          _that.ownerFlag = true;
        } else {
          _that.ownerFlag = false;
        }
      });
    },
    /**
     * 查询业主头像
     */
    loadOwnerHeaderImg: function () {
      let _that = this;

      loadLoginOwner({
        memberId: getMemberId(),
        communityId: getCommunityId(),
      }).then((_data) => {
        //console.log(_data);
        if (_data.url) {
          _that.headerImg = _data.url;
        } else {
          _that.headerImg = conf.imgUrl + "/h5/images/serve/head.png";
        }
      });
    },
    // 余额
    loadOwnerAccount: function () {
      let _that = this;
      context.getOwner(function (_ownerInfo) {
        if (_ownerInfo) {
          queryOwnerAccount({
            page: 1,
            row: 20,
            idCard: _ownerInfo.idCard,
            link: _ownerInfo.ownerTel,
            communityId: _ownerInfo.communityId,
          }).then((data) => {
            if (!data) {
              _that.accounts = [];
              _that.blance = 0;
              return;
            }
            _that.accounts = data;
            let blanceSum = 0;
            let interSum = 0;
            //let kaSum = 0;
            _that.accounts.forEach((v, k) => {
              // if(v.acctType == '2005'){
              // 	kaSum += parseFloat(v.amount);
              // }
              if (v.acctType == "2004") {
                interSum += parseFloat(v.amount);
              }
              if (v.acctType == "2003") {
                blanceSum += parseFloat(v.amount);
              }
            });
            _that.blance = blanceSum.toFixed(2);
            _that.inter = interSum.toFixed(2);
            //_that.ka = kaSum.toFixed(2);
          });
        }
      });
    },
    loadOwnerCoupon: function () {
      let _that = this;
      let _count = 0;
      _that.ka = 0;
      context.getOwner(function (_ownerInfo) {
        if (_ownerInfo) {
          getCouponUsers(
            {
              page: 1,
              row: 100,
              tel: _ownerInfo.ownerTel,
              communityId: _ownerInfo.communityId,
              state: "1001",
            },
            null
          ).then((_couponList) => {
            _couponList.data.forEach((items) => {
              if (items.isExpire == "Y") {
                _count += parseInt(items.stock);
              }
            });
            _that.ka = _count;
          });
        }
      });
    },
    showLongModel: function () {
      this.vc.navigateTo(
        {
          url: "/pages/login/login",
        },
        () => {
          this.refreshPageLoginInfo();
        }
      );
    },
    // 我的钱包
    myAccount: function () {
      if (this.login) {
        this.vc.navigateTo({
          url: "/pages/my/myBalance",
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
        });
      }

      // wx.navigateTo({
      // 	url: '/pages/my/myBalance'
      // })
    },
    // 积分
    myjifen() {
      if (this.login) {
        this.vc.navigateTo({
          url: "/pages/integral/integral",
        });
      }
    },
    //优惠券
    coupons: function (_item) {
      if (this.login) {
        this.vc.navigateTo({
          url: "/pages/coupon/myCoupons",
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
        });
      }
    },
    _viewUserQrCode: function () {
      this.vc.navigateTo({
        url: "/pages/my/userQrCode",
      });
    },
    handleOrderNav(status, index) {
      if (this.login) {
        uni.navigateTo({
          url: status,
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
        });
      }
    },
    toggleMore() {
      this.showMore = !this.showMore;
    },
    goToDistribution() {
      if (this.login) {
		uni.navigateTo({
          url: `/pages/category/category`,
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
        });
      }
    },
    goToPointsMall() {
      if (this.login) {
        uni.navigateTo({
          url: "/pages/pointsMall/index",
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
        });
      }
    },
    openVip() {
      if (this.login) {
        uni.navigateTo({
          url: `/pages/member/member`,
        });
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
        });
      }
      // uni.navigateTo({
      // 	url: `/pages/member/member`
      // })
    },
  },
};
</script>

<style lang="scss" scoped>
.my_user {
  padding: 0;
}

.header-img,
.userinfo-avatar {
  width: 140upx;
  height: 140upx;
  margin-right: 20upx;
  background-color: #fff;
}

.userinfo {
  padding-top: 100rpx;
  // height: 280upx;
  //background: url('/static/images/serve/bg.png') no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.already,
.wait {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  // padding: 0 20%;
}

.userinfo-nickname {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  margin: 0 !important;
  height: 280upx;
}

.topimgs {
  width: 100%;
  height: 500rpx;
  position: absolute;
  top: 0;
  left: 0;
  // z-index: -1;
}

.money_box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20upx 50upx;
  border-radius: 20upx;

  .money_item {
    text-align: center;
    color: #333;
    font-size: 28upx;
    padding: 10upx 0;
  }

  .line {
    height: 20upx;
    width: 2upx;
    background: #eee;
  }
}

.cuIcon-qrcode {
  font-size: 48upx;
}

.card {
  width: 100%;
  height: 180rpx;
  background: linear-gradient(180deg, #dbebff 0%, #ffffff 100%);
  border-radius: 15rpx 15rpx 15rpx 15rpx;
  border: 2rpx solid #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 25rpx;
}

.card_item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card_item_Num {
  font-size: 40rpx;
  color: #333333;
  font-style: normal;
  font-weight: 400;
}

.card_item_title {
  font-weight: 400;
  font-size: 26rpx;
  color: #7e7e7e;
  font-style: normal;
}

.cardOrder {
  width: 100%;
  border-radius: 15rpx;
  background: #ffffff;
  box-shadow: 0rpx 9rpx 26rpx 1rpx #e9eff5;
  padding: 30rpx 20rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}

.titleColor {
  background: #1b76fe;
  width: 10rpx;
  height: 40rpx;
  border-radius: 30px;
}

.titleClass {
  font-weight: 500;
  font-size: 32rpx;
  color: #2b2b2b;
  margin-left: 10rpx;
}

.cardOrderNav {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* 一行 3 个 */
  gap: 20rpx;
  /* 列和行之间的间距 */
}

.icon {
  width: 60rpx;
  height: 60rpx;
}

.cardOrderNav_item {
  text-align: center;
  padding: 30rpx 0 0 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-btn {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 28rpx;

  .cuIcon-unfold {
    margin-left: 4rpx;
    transition: transform 0.3s ease;

    &.rotate {
      transform: rotate(180deg);
    }
  }
}

.cardOrderNav {
  max-height: 160rpx;
  overflow: hidden;
  transition: max-height 0.3s ease;

  &.expanded {
    max-height: 500rpx;
  }
}

.market-section {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  box-shadow: 0rpx 9rpx 26rpx 1rpx #e9eff5;
}

.market-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.market-content {
  flex: 1;
}

.market-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #2b2b2b;
  margin-bottom: 10rpx;
}

.market-subtitle {
  font-size: 24rpx;
  color: #7e7e7e;
}

.market-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
  margin-left: 20rpx;
}

.market-divider {
  width: 2rpx;
  height: 80rpx;
  background: #eeeeee;
  margin: 0 30rpx;
}

.bg-blue {
  background: #1b76fe;
}

.bg-orange {
  background: #ff9500;
}

.vip-card {
  background: linear-gradient(90deg, #1e1e1e 0%, #2b2b2b 100%);
  border-radius: 15rpx;
  margin: 20rpx 0;
  padding: 30rpx;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.vip-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-left {
  display: flex;
  flex-direction: column;
}

.vip-title {
  color: #e6c389;
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.vip-subtitle {
  color: rgba(230, 195, 137, 0.8);
  font-size: 24rpx;
}

.vip-btn {
  background: #e6c389;
  color: #1e1e1e;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
}

.member-content {
  .member-info {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
  }

  .member-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    margin-right: 20rpx;
  }

  .member-details {
    display: flex;
    flex-direction: column;
  }

  .member-name {
    color: #e6c389;
    font-size: 32rpx;
    font-weight: 500;
    margin-bottom: 8rpx;
  }

  .member-expiry {
    color: rgba(230, 195, 137, 0.8);
    font-size: 24rpx;
  }

  .growth-info {
    color: rgba(230, 195, 137, 0.8);
    font-size: 24rpx;
  }

  .member-btn {
    background: #e6c389;
    color: #1e1e1e;
    padding: 12rpx 30rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
  }
}
</style>
