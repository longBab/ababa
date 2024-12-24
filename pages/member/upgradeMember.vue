<template>
    <view class="upgrade-container">


        <!-- 普通会员卡片 -->
        <view class="vip-card" @click="goToOpenMember">
            <view
                style="height: 60rpx;position: relative; display: flex; justify-content: flex-end; align-items: center;">
                <view
                    style="display: flex;justify-content: center;align-items: center; width: 100rpx;height: 50rpx;border-top-right-radius: 25rpx;border-bottom-right-radius: 25rpx;position: absolute;top: 0;left: -30rpx;right: 0;bottom: 0;background: #000;z-index: 10;">
                    <view class="vip-right">
                        <view class="vip-icon">VIP</view>
                    </view>
                </view>
                <view style="display: flex; align-items: center;color: #000;">
                    <text>去充值</text>
                    <uni-icons type="forward" size="25" color="#000" style="margin-left: 10rpx;" />

                </view>
            </view>
            <view class="vip-info">
                <view class="vip-left">
                    <text class="vip-type">普通会员</text>
                    <text class="vip-date">有效期至：2022-10-12</text>
                    <view class="progress-bar">
                        <view class="progress" style="width: 80%"></view>
                    </view>
                </view>
                <view class="vip-right">
                    <!-- <view class="vip-icon">VIP</view> -->
                </view>
            </view>
            <view class="vip-tip">
                再消费 500 元升级黄金会员，享全场 8.5 折
            </view>
        </view>

        <!-- 铂金会员卡片 -->
        <view class="vip-card">
            <view
                style="height: 60rpx;position: relative; display: flex; justify-content: flex-end; align-items: center;">
                <view
                    style="display: flex;justify-content: center;align-items: center; width: 100rpx;height: 50rpx;border-top-right-radius: 25rpx;border-bottom-right-radius: 25rpx;position: absolute;top: 0;left: -30rpx;right: 0;bottom: 0;background: #000;z-index: 10;">
                    <view class="vip-right">
                        <view class="vip-icon">VIP</view>
                    </view>
                </view>
                <view style="display: flex; align-items: center;color: #000;">
                    <text>去充值</text>
                    <uni-icons type="forward" size="25" color="#000" style="margin-left: 10rpx;" />

                </view>
            </view>
            <view class="vip-info">
                <view class="vip-left">
                    <text class="vip-type">普通会员</text>
                    <text class="vip-date">有效期至：2022-10-12</text>
                    <view class="progress-bar">
                        <view class="progress" style="width: 80%"></view>
                    </view>
                </view>
                <view class="vip-right">
                    <!-- <view class="vip-icon">VIP</view> -->
                </view>
            </view>
            <view class="vip-tip">
                再消费 500 元升级黄金会员，享全场 8.5 折
            </view>
        </view>


        <!-- 黄金会员卡片 -->
        <view class="vip-card">
            <view
                style="height: 60rpx;position: relative; display: flex; justify-content: flex-end; align-items: center;">
                <view
                    style="display: flex;justify-content: center;align-items: center; width: 100rpx;height: 50rpx;border-top-right-radius: 25rpx;border-bottom-right-radius: 25rpx;position: absolute;top: 0;left: -30rpx;right: 0;bottom: 0;background: #000;z-index: 10;">
                    <view class="vip-right">
                        <view class="vip-icon">VIP</view>
                    </view>
                </view>
                <view style="display: flex; align-items: center;color: #000;">
                    <text>去充值</text>
                    <uni-icons type="forward" size="25" color="#000" style="margin-left: 10rpx;" />

                </view>
            </view>
            <view class="vip-info">
                <view class="vip-left">
                    <text class="vip-type">普通会员</text>
                    <text class="vip-date">有效期至：2022-10-12</text>
                    <view class="progress-bar">
                        <view class="progress" style="width: 80%"></view>
                    </view>
                </view>
                <view class="vip-right">
                    <!-- <view class="vip-icon">VIP</view> -->
                </view>
            </view>
            <view class="vip-tip">
                再消费 500 元升级黄金会员，享全场 8.5 折
            </view>
        </view>

    </view>
</template>

<script>
export default {
    name: 'upgradeMember',
    data() {
        return {}
    },
    methods: {
        goToOpenMember() {
            uni.navigateTo({
                url: '/pages/member/openMember'
            })
        }
    }
}
</script>

<style lang="scss">
.vip-card {
    position: relative;
    z-index: 2;
    background: linear-gradient(to right, #333333, #666666);
    border-radius: 20rpx;
    padding: 30rpx;
    margin: 20rpx 0;

    .vip-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .vip-left {
            .vip-type {
                color: #000;
                font-size: 32rpx;
                margin-bottom: 10rpx;
                display: block;
            }

            .vip-date {
                color: rgba(0, 0, 0, 0.8);
                font-size: 24rpx;
                margin-bottom: 20rpx;
                display: block;
            }

            .progress-bar {
                width: 300rpx;
                height: 10rpx;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 5rpx;

                .progress {
                    height: 100%;
                    background: #FFB800;
                    border-radius: 5rpx;
                }
            }
        }

    }

    .vip-tip {
        color: rgba(0, 0, 0, 0.8);
        font-size: 24rpx;
    }
}
.vip-icon {
    color: #FFB800;
    font-size: 40rpx;
    font-weight: bold;
}
.upgrade-container {
    min-height: 100vh;
    background-color: #fff;
    padding: 20rpx;
    padding-bottom: 150rpx;
    position: relative;
    padding: 30rpx;
    box-sizing: border-box;

}
</style>
