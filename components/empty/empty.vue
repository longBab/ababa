<template>
    <view class="empty-wrapper">
        <image class="empty-image" src="../../static/images/em.svg" mode="aspectFit"></image>
        <text class="empty-text">{{ description }}</text>
        <slot></slot>
    </view>
</template>

<script>
export default {
    name: 'Empty',
    props: {
        description: {
            type: String,
            default: '暂无数据'
        }
    }
}
</script>

<style>
.empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
}

.empty-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #969799;
}
</style> 