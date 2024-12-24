<template>
  <view>
    <scroll-view scroll-x class="bg-white nav">
      <view class="flex text-center">
        <view
          class="cu-item flex-sub"
          :class="active == 0 ? 'text-green cur' : ''"
          @tap="tabSelect(0)"
        >
          待处理1
        </view>
        <view
          class="cu-item flex-sub"
          :class="active == 1 ? 'text-green cur' : ''"
          @tap="tabSelect(1)"
        >
          处理中
        </view>
        <view
          class="cu-item flex-sub"
          :class="active == 2 ? 'text-green cur' : ''"
          @tap="tabSelect(2)"
        >
          完成
        </view>
      </view>
    </scroll-view>

    <!-- <tui-tabs :tabs="tabs" :currentTab="currentTab" @change="change"></tui-tabs> -->
    <!---->
    <view v-if="active == 0" class="ppfl_c">
      <view v-if="noData == false">
        <view class="vantabClass">
          <view class="card" v-for="(item, index) in waitRepair" :key="index">
            <!-- 派单状态 -->
            <view
              style="
                align-items: center;
                display: flex;
                justify-content: space-between;
              "
            >
              <view style="display: flex; align-items: center">
                <view class="paidanBg">
                  <view class="paidanBgtitle">接单中</view>
                  <view class="pdbg" style="background-color: #00baad"></view>
                </view>
                <view class="cardTitle">{{ item.tel }}</view>
              </view>
            </view>
            <view
              class="flex margin-top-sm padding-top-sm solid-top justify-between"
            >
              <view class="text-gray">订单号</view>
              <view class="text-gray">{{ item.repairId }}</view>
            </view>
            <view class="flex justify-between">
              <view class="text-gray">报修类型</view>
              <view class="text-gray">{{ item.repairTypeName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">报修人</view>
              <view class="text-gray">{{ item.repairName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">位置</view>
              <view class="text-gray">{{ item.repairObjName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">预约时间</view>
              <view class="text-gray">{{ item.appointmentTime }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">状态</view>
              <view class="text-gray">{{ item.stateName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">报修内容</view>
              <view class="text-gray">{{ item.context }}</view>
            </view>
            <view class="solid-top flex justify-end margin-top padding-top-sm">
              <button class="cu-btn sm line-gray" @click="repairDetail(item)">
                详情
              </button>
              <button
                class="cu-btn sm bg-red margin-left"
                @click="deleteRepair(item)"
              >
                删除
              </button>
            </view>
          </view>
        </view>
      </view>
      <view v-else>
        <no-data-page></no-data-page>
      </view>
    </view>

    <view v-if="active == 1" class="ppfl_c">
      <view v-if="noData == false">
        <view class="vantabClass">
          <view class="card" v-for="(item, index) in doingRepair" :key="index">
            <!-- 派单状态 -->
            <view
              style="
                align-items: center;
                display: flex;
                justify-content: space-between;
              "
            >
              <view style="display: flex; align-items: center">
                <view class="paidanBg">
                  <view class="paidanBgtitle">处理中</view>
                  <view class="pdbg" style="background-color: #00baad"></view>
                </view>
                <view class="cardTitle">{{ item.tel }}</view>
              </view>
            </view>
            <view
              class="flex margin-top-sm padding-top-sm solid-top justify-between"
            >
              <view class="text-gray">订单号</view>
              <view class="text-gray">{{ item.repairId }}</view>
            </view>
            <view class="flex justify-between">
              <view class="text-gray">报修类型</view>
              <view class="text-gray">{{ item.repairTypeName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">报修人</view>
              <view class="text-gray">{{ item.repairName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">位置</view>
              <view class="text-gray">{{ item.repairObjName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">预约时间</view>
              <view class="text-gray">{{ item.appointmentTime }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">状态</view>
              <view class="text-gray">{{ item.stateName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">报修内容</view>
              <view class="text-gray">{{ item.context }}</view>
            </view>
            <view class="solid-top flex justify-end margin-top padding-top-sm">
              <button class="cu-btn sm line-gray" @click="repairDetail(item)">
                详情
              </button>
            </view>
          </view>
        </view>

        <!-- <view v-for="(item,index) in doingRepair" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.repairId}}</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">报修类型</view>
						<view class="text-gray">{{item.repairTypeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">报修人</view>
						<view class="text-gray">{{item.repairName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">位置</view>
						<view class="text-gray">{{item.repairObjName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">预约时间</view>
						<view class="text-gray">{{item.appointmentTime }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">状态</view>
						<view class="text-gray">{{item.stateName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">报修内容</view>
						<view class="text-gray">{{item.context}}</view>
					</view>
					<view class="solid-top flex justify-end margin-top padding-top-sm ">
						<button class="cu-btn sm line-gray" @click="repairDetail(item)">详情</button>
					</view>
				</view> -->
      </view>
      <view v-else>
        <no-data-page></no-data-page>
      </view>
    </view>

    <view v-if="active == 2" class="ppfl_c">
      <view v-if="noData == false">
        <view class="vantabClass">
          <view class="card" v-for="(item, index) in repaired" :key="index">
            <!-- 派单状态 -->
            <view
              style="
                align-items: center;
                display: flex;
                justify-content: space-between;
              "
            >
              <view style="display: flex; align-items: center">
                <view class="paidanBg">
                  <view class="paidanBgtitle">已完成</view>
                  <view class="pdbg" style="background-color: #00baad"></view>
                </view>
                <view class="cardTitle">{{ item.tel }}</view>
              </view>
            </view>
            <view
              class="flex margin-top-sm padding-top-sm solid-top justify-between"
            >
              <view class="text-gray">订单号</view>
              <view class="text-gray">{{ item.repairId }}</view>
            </view>
            <view class="flex justify-between">
              <view class="text-gray">报修类型</view>
              <view class="text-gray">{{ item.repairTypeName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">报修人</view>
              <view class="text-gray">{{ item.repairName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">位置</view>
              <view class="text-gray">{{ item.repairObjName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">预约时间</view>
              <view class="text-gray">{{ item.appointmentTime }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">状态</view>
              <view class="text-gray">{{ item.stateName }}</view>
            </view>
            <view class="flex margin-top-xs justify-between">
              <view class="text-gray">报修内容</view>
              <view class="text-gray">{{ item.context }}</view>
            </view>
            <view class="solid-top flex justify-end margin-top padding-top-sm">
              <button class="cu-btn sm line-gray" @click="repairDetail(item)">
                详情
              </button>
              <button
                v-if="item.state == '1400'"
                class="cu-btn sm bg-green margin-left"
                @click="_toPay(item)"
              >
                支付
              </button>
              <button
                v-if="item.state == '1700'"
                class="cu-btn sm bg-green margin-left"
                @click="_appraiseRepair(item)"
              >
                评价
              </button>
              <button
                v-if="item.state == '1700' || item.state == '1400'"
                class="cu-btn sm bg-red margin-left"
                @click="_backRepair(item)"
              >
                退回
              </button>
            </view>
          </view>
        </view>

        <!-- <view v-for="(item,index) in repaired" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.repairId}}</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">报修类型</view>
						<view class="text-gray">{{item.repairTypeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">报修人</view>
						<view class="text-gray">{{item.repairName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">位置</view>
						<view class="text-gray">{{item.repairObjName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">预约时间</view>
						<view class="text-gray">{{item.appointmentTime }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">状态</view>
						<view class="text-gray">{{item.stateName}}</view>
					</view>

					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">报修内容</view>
						<view class="text-gray">{{item.context}}</view>
					</view>
					<view class="solid-top flex justify-end margin-top padding-top-sm ">
						<button class="cu-btn sm line-gray" @click="repairDetail(item)">详情</button>
						<button v-if="item.state == '1400'" class="cu-btn sm bg-green  margin-left"
							@click="_toPay(item)">支付</button>
						<button v-if="item.state == '1700'" class="cu-btn sm bg-green margin-left"
							@click="_appraiseRepair(item)">评价</button>
						<button v-if="item.state == '1700' || item.state == '1400'"
							class="cu-btn sm  bg-red margin-left" @click="_backRepair(item)">退回</button>
					</view>
				</view> -->
      </view>
      <view v-else>
        <no-data-page></no-data-page>
      </view>
    </view>

    <view class="cu-modal" :class="deleteRepairModal == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">温馨提示</view>
          <view class="action" @tap="_cancleDeleteRepair()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> 您确认删除当前订单 </view>
        <view class="cu-bar bg-white justify-end">
          <view
            class="action margin-0 flex-sub solid-left"
            @tap="_cancleDeleteRepair()"
            >取消</view
          >
          <view
            class="action margin-0 flex-sub text-green solid-left"
            @tap="_doDeleteRepair()"
            >删除</view
          >
        </view>
      </view>
    </view>

    <view class="cu-modal" :class="backRepairModal == true ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">退单原因</view>
          <view class="action" @tap="_cancleBackRepair()">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="cu-form-group">
          <textarea
            v-model="context"
            maxlength="50"
            placeholder="请输入退单原因"
          ></textarea>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view
            class="action margin-0 flex-sub solid-left"
            @tap="_cancleBackRepair()"
            >取消</view
          >
          <view
            class="action margin-0 flex-sub text-green solid-left"
            @tap="_doBackRepair()"
            >确认</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import noDataPage from "@/components/no-data-page/no-data-page.vue";
import context from "../../lib/java110/Java110Context.js";
import { listRepairStaffs } from "@/api/repair/repairApi.js";
import { getUserId } from "../../api/user/userApi.js";
import tuiTabs from "@/components/thorui/tui-tabs/tui-tabs.vue";
const factory = context.factory;
const constant = context.constant;
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          name: "待处理",
        },
        {
          name: "处理中",
        },
        {
          name: "已完成",
        },
      ],
      active: 0,
      userId: "",
      roomId: "",
      communityId: "",
      waitRepair: [],
      doingRepair: [],
      repaired: [],
      deleteRepairModal: false,
      backRepairModal: false,
      curRepair: {},
      noData: false,
      preStaffId: "",
      preStaffName: "",
      context: "",
    };
  },
  components: {
    noDataPage,
    tuiTabs,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    context.onLoad(options);
    this.userId = getUserId();
    context.getOwner((res) => {
      that.communityId = res.communityId;
      that._loadRepair(that.active);
    });
  },

  onShow: function () {
    if (this.userId && this.communityId) {
      this._loadRepair(this.active);
    }
  },
  methods: {
    change(e) {
      this.currentTab = e.index;
      this.active = this.currentTab;
      this._loadRepair(this.currentTab);
    },
    /**
     * 加载我的报修
     */
    _loadRepair: function (_active) {
      let that = this;

      let _url = "";
      let _states = "";
      _url = constant.url.listStaffFinishRepairs;
      if (_active == 0) {
        _states = "1000";
      } else if (_active == 1) {
        _url = constant.url.listStaffFinishRepairs;
        _states = "1100,1200,1300,1101";
      } else {
        _url = constant.url.listStaffFinishRepairs;
        _states = "1400,1500,1700,1800,1900,2000";
      }

      let _paramIn = {
        communityId: that.communityId,
        page: 1,
        row: 10,
        userId: that.userId,
        repairStates: _states,
      };
      context.request({
        url: _url,
        header: context.getHeaders(),
        method: "GET",
        data: _paramIn,
        success: function (res) {
          let _json = res.data;
          if (_json.code == 0) {
            let _ownerRepairs = _json.data;
            console.log("_ownerRepairs", _ownerRepairs);
            if (_ownerRepairs.length < 1) {
              that.noData = true;
            } else {
              that.noData = false;
            }
            if (_active == 0) {
              that.waitRepair = _ownerRepairs;
            } else if (_active == 1) {
              that.doingRepair = _ownerRepairs;
            } else {
              that.repaired = _ownerRepairs;
            }
            return;
          }

          wx.showToast({
            title: "查询报修单失败",
            icon: "none",
            duration: 2000,
          });
        },
        fail: function (e) {
          wx.showToast({
            title: "服务器异常了",
            icon: "none",
            duration: 2000,
          });
        },
      });
    },
    onChange: function (e) {
      this._loadRepair(e.detail.index);
    },
    tabSelect: function (_active) {
      this.active = _active;
      this._loadRepair(_active);
    },
    repairDetail: function (_repair) {
      context.navigateTo({
        url: "/pages/repair/repairDetail?repairId=" + _repair.repairId,
      });
    },
    deleteRepair: function (_repair) {
      this.curRepair = _repair;
      this.deleteRepairModal = true;
    },
    _cancleDeleteRepair: function () {
      this.deleteRepairModal = false;
    },
    _doDeleteRepair: function () {
      let that = this;
      context.request({
        url: constant.url.deleteOwnerRepair,
        header: context.getHeaders(),
        method: "POST",
        data: this.curRepair,
        //动态数据
        success: function (res) {
          console.log(res); //成功情况下跳转
          if (res.data.code != 0) {
            uni.showToast({
              icon: "none",
              title: res.data.msg,
              duration: 2000,
            });
            return;
          }
          uni.showToast({
            icon: "none",
            title: "处理成功",
            duration: 2000,
          });
          that._cancleDeleteRepair();
          that._loadRepair(0);
        },
        fail: function (e) {
          console.log(e);
          wx.showToast({
            title: "服务器异常了",
            icon: "none",
            duration: 2000,
          });
        },
      });
    },
    _backRepair: function (_repair) {
      //查询 上一任处理人
      let _communityInfo = context.getCurrentCommunity();
      let _that = this;
      let dataObj = {
        page: 1,
        row: 1,
        communityId: _communityInfo.communityId,
        repairId: _repair.repairId,
        staffId: this.userId,
        //state: '10001'
      };
      listRepairStaffs(_paramIn).then((_json) => {
        if (_json.code == 0) {
          let _data = _json.data;

          if (_data.length < 1) {
            uni.showToast({
              title: "当前不能退单",
            });
            return;
          }
          _that.preStaffId = _data[0].preStaffId;
          _that.preStaffName = _data[0].preStaffName;
          _that.curRepair = _repair;
          _that.backRepairModal = true;
        }
      });
    },
    _cancleBackRepair: function () {
      this.backRepairModal = false;
    },
    _doBackRepair: function () {
      let that = this;
      if (this.context == "") {
        uni.showToast({
          title: "退单内容不能为空",
          icon: "none",
        });
        return;
      }
      let _communityInfo = context.getCurrentCommunity();
      let _data = {
        staffId: this.userId,
        staffName: this.preStaffName,
        context: this.context,
        action: "BACK",
        repairId: this.curRepair.repairId,
        communityId: _communityInfo.communityId,
      };
      context.request({
        url: constant.url.repairDispatch,
        header: context.getHeaders(),
        method: "POST",
        data: _data,
        //动态数据
        success: function (res) {
          console.log(res); //成功情况下跳转
          if (res.data.code != 0) {
            uni.showToast({
              icon: "none",
              title: res.data.msg,
              duration: 2000,
            });
            return;
          }
          uni.showToast({
            icon: "none",
            title: "处理成功",
            duration: 2000,
          });
          that._cancleBackRepair();
          that._loadRepair(0);
        },
        fail: function (e) {
          console.log(e);
          wx.showToast({
            title: "服务器异常了",
            icon: "none",
            duration: 2000,
          });
        },
      });
    },
    _appraiseRepair: function (_repair) {
      context.navigateTo({
        url: "/pages/repair/appraiseRepair?repairId=" + _repair.repairId,
      });
    },
    _toPay: function (_item) {
      console.log(_item);
      context.navigateTo({
        url:
          "/pages/fee/repairPay?repairId=" +
          _item.repairId +
          "&communityId=" +
          _item.communityId +
          "&userId=" +
          this.userId +
          "&repairObjId=" +
          _item.repairObjId +
          "&appointmentTime=" +
          _item.appointmentTime +
          "&repairTypeName=" +
          _item.repairTypeName +
          "&repairObjName=" +
          _item.repairObjName +
          "&repairName=" +
          _item.repairName +
          "&context=" +
          _item.context,
      });
    },
  },
};
</script>

<style>
.solid-bottom::after {
  border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
}

.card {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx 9rpx 26rpx 1rpx #e9eff9;
  border-radius: 10px;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 25rpx;
}

.paidanBg {
  position: relative;
  overflow: hidden;
  padding: 0 20rpx;
}

.paidanBgtitle {
  position: relative;
  z-index: 1;
  color: #fff;
  font-size: 24rpx;
}

.pdbg {
  background: #f5ab4c;
  width: 100rpx;
  height: 90rpx;
  left: 3rpx;
  position: absolute;
  top: -20rpx;
  transform: rotate(-75deg);
}

.cardTitle {
  font-weight: 400;
  font-size: 30rpx;
  color: #353535;
  font-style: normal;
  margin-left: 5rpx;
}

.cardType {
  font-weight: 400;
  font-size: 31rpx;
  color: #1b76fe;
}

.bxInfo {
  font-weight: 400;
  font-size: 28rpx;
  color: #353535;
  line-height: 60rpx;
  margin: 20rpx 0;
}

.bxContent {
  width: 100%;
  background-color: #f0f7ff;
  font-weight: 400;
  font-size: 28rpx;
  color: #353535;
  padding: 10rpx;
  box-sizing: border-box;
}

.time {
  font-weight: 400;
  font-size: 28rpx;
  color: #353535;
}

.btn {
  padding: 8rpx 40rpx;
  border: 1rpx solid #383838;
  border-radius: 30px;
  font-weight: 400;
  font-size: 24rpx;
  color: #000000;
}

.vantabClass {
  padding: 20rpx;
  box-sizing: border-box;
}

.pjbtn {
  background: #1b76fe;
  border: 1rpx solid #0e7ff5;
  color: #fff;
}

.pjclass {
  padding: 20rpx;
  box-sizing: border-box;
}

.imoji {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 一行 3 列 */
  gap: 20rpx;
  margin: 30rpx 0;
}

.imojiItem {
  text-align: center;
}

.vantabClass {
  padding: 20rpx;
  box-sizing: border-box;
}

.imojiImg {
  width: 60rpx;
  height: 60rpx;
}

.actionImojiTitle {
  color: #1377ff !important;
}

.pjsubTitle {
  font-weight: 400;
  font-size: 28rpx;
  color: #16181a;
}

.imojiTitle {
  font-weight: 400;
  font-size: 24rpx;
  color: #9e9e9e;
}

.pjclass_othen {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 一行 3 列 */
  gap: 60rpx;
}

.pjclass_othen_box {
  text-align: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #9e9e9e;
  border-radius: 4px;
  border: 2rpx solid rgba(0, 0, 0, 0.1);
}

.activePjclass_othen_box {
  border: 2rpx solid #1377ff;
  color: #1377ff;
}

.pingjiaCentent {
  width: 100%;
  background-color: #f7f7f7;
  min-height: 250rpx;
}
</style>
