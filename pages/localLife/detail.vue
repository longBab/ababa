<template>
  <view class="store-detail">
    <!-- 轮播图 -->
    <banner-swiper :images="bannerImages"></banner-swiper>


    <!-- 商家信息 -->
    <view class="store-info">
      <view class="store-title">
        <text class="name">{{ storeInfo.name }}</text>
        <text class="rating">{{ storeInfo.rating }}分</text>
      </view>

      <view class="info-item" @tap="makePhoneCall">
        <text class="iconfont">📞</text>
        <text class="text">{{ storeInfo.phone }}</text>
      </view>

      <view class="info-item location" @tap="openLocation">
        <text class="iconfont">📍</text>
        <text class="text">{{ storeInfo.address }}</text>
        <text class="navigate-text">导航</text>
      </view>

      <view class="info-item">
        <text class="iconfont">⏰</text>
        <text class="text">营业时间：{{ storeInfo.businessHours }}</text>
      </view>
    </view>

    <!-- 商家介绍 -->
    <view class="store-desc">
      <view class="section-title">商家介绍</view>
      <text class="desc-text">{{ storeInfo.description }}</text>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-buttons">
      <button class="btn contact" @tap="makePhoneCall">
        <uni-icons color="#2B7FF0" type="phone" size="20"></uni-icons>
        <text>联系</text>
      </button>
      <button class="btn navigate" @tap="openLocation">
        <uni-icons color="#fff" type="location" size="20"></uni-icons>
        <text>导航</text>
      </button>
    </view>
  </view>
</template>

<script>
import BannerSwiper from '@/components/BannerSwiper.vue'

export default {
  data() {
    return {
      storeInfo: {
        id: '',
        name: '示例商家名称',
        rating: 4.8,
        phone: '13888888888',
        address: '幸福小区东门100米',
        businessHours: '09:00-22:00',
        description: '这里是商家的详细介绍，可以包含多行文字...',
        
        latitude: 39.909177,
        longitude: 116.397451
      },
      bannerImages: [
          'https://picsum.photos/200/200?random=1',
          'https://picsum.photos/200/200?random=2',
          'https://picsum.photos/200/200?random=3'
        ],
    }
  },
  components: {
		BannerSwiper,
	},
  onLoad(options) {
    // 接收上一页传来的商家ID
    if (options.id) {
      this.loadStoreDetail(options.id)
    }
  },
  methods: {
    // 加载商家详情
    loadStoreDetail(id) {
      // 这里模拟接口请求
      console.log('加载商家ID:', id)
      // this.storeInfo = await getStoreDetail(id)
    },

    // 拨打电话
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.storeInfo.phone,
        success: () => {
          console.log('拨打电话成功')
        },
        fail: (err) => {
          console.log('拨打电话失败', err)
        }
      })
    },

    // 打开地图导航
    openLocation() {
      uni.openLocation({
        latitude: this.storeInfo.latitude,
        longitude: this.storeInfo.longitude,
        name: this.storeInfo.name,
        address: this.storeInfo.address,
        success: () => {
          console.log('打开导航成功')
        },
        fail: (err) => {
          console.log('打开导航失败', err)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.store-detail {
  min-height: 100vh;
  background-color: #f5f5f5;

  .swiper {
    height: 400rpx;

    .swiper-image {
      width: 100%;
      height: 100%;
    }
  }

  .store-info {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .store-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .name {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .rating {
        font-size: 28rpx;
        color: #ff6b6b;
      }
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      font-size: 28rpx;
      color: #666;

      .iconfont {
        margin-right: 10rpx;
        font-size: 32rpx;
      }

      .text {
        flex: 1;
      }

      &.location {
        .navigate-text {
          color: #2B7FF0;
          padding: 4rpx 20rpx;
          border: 1px solid #2B7FF0;
          border-radius: 24rpx;
          font-size: 24rpx;
        }
      }
    }
  }

  .store-desc {
    background-color: #fff;
    padding: 30rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .desc-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .footer-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      margin: 0 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .uni-icons {
        margin-right: 6rpx;
      }

      &.contact {
        background-color: #fff;
        color: #2B7FF0;
        border: 1px solid #2B7FF0;
      }

      &.navigate {
        background-color: #2B7FF0;
        color: #fff;
      }
    }
  }
}
</style>