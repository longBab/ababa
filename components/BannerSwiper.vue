<template>
  <view class="banner">
    <swiper 
      class="swiper" 
      circular 
      autoplay 
      interval="3000" 
      duration="500"
      indicator-dots
      indicator-color="rgba(255, 255, 255, 0.3)"
      indicator-active-color="#1377FD"
    >
      <swiper-item v-for="(image, index) in images" :key="index">
        <image :src="image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'BannerSwiper',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  height: 400rpx;
  
  .swiper {
    width: 100%;
    height: 100%;
    
    /deep/ .uni-swiper-dots-horizontal {
      .uni-swiper-dot {
        width: 20rpx !important;
        height: 10rpx !important;
        border-radius: 10rpx !important;
        margin: 0 6rpx !important;
        background: rgba(255, 255, 255, 0.3) !important;
        border: none !important;
        transition: all .5s ease-in-out !important;
        
        &.uni-swiper-dot-active {
          width: 40rpx !important;
          background: #1377FD !important;
        }
      }
    }
  }
  
  image {
    width: 100%;
    height: 100%;
  }
}
</style> 