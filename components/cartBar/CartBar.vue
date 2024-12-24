<template>
  <view class="cart-bar">
    <view style="position: relative;z-index: 999;  width: 100%; display: flex; justify-content: space-between; align-items: center;">
      <view class="cart-info" @click="showCartDetail">
        <view class="cart-icon">
          <view class="cart-circle">
            <uni-icons type="shop" size="24" color="#fff"></uni-icons>
          </view>
          <view class="cart-count">{{ totalCount }}</view>
        </view>
        <view class="price-info">
          <view class="total-price">¥{{ totalPrice }}</view>
          <view class="original-total">¥{{ originalTotalPrice }}</view>
        </view>
      </view>
      <view class="checkout-btn" @click="goToConfirm">
        去结算
      </view>
    </view>

    <!-- 购物车弹窗 -->
    <view class="cart-popup" v-show="showCart" @click.self="closeCart">
      <view class="cart-content" :class="{ 'slide-enter': showCart, 'slide-leave': !showCart }">
        <view class="cart-header">
          <text class="title">购物车</text>
          <view class="clear-cart" @click="clearCart">
            <uni-icons type="trash" size="16" color="#666"></uni-icons>
            <text>清空</text>
          </view>
        </view>
        <view class="cart-list">
          <view class="cart-item" v-for="product in cartProducts" :key="product.id">
            <text class="product-name">{{ product.name }}</text>
            <view class="quantity-control">
              <view class="price">¥{{ product.price }}</view>
              <view class="quantity-buttons">
                <view class="btn minus" @click="updateCart(product.id, -1)">
                  <uni-icons type="minus" size="16" color="#666"></uni-icons>
                </view>
                <text class="count">{{ cartItems[product.id] }}</text>
                <view class="btn plus" @click="updateCart(product.id, 1)">
                  <uni-icons type="plus" size="16" color="#1377FD"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      showCart: false
    }
  },

  computed: {
    ...mapState(['cartItems']),
    ...mapGetters([
      'totalCount',
      'totalPrice',
      'originalTotalPrice',
      'cartProducts'
    ])
  },

  methods: {
    showCartDetail() {
      this.showCart = true
      document.body.style.overflow = 'hidden'
    },

    closeCart() {
      this.showCart = false
      document.body.style.overflow = 'auto'
    },

    updateCart(productId, delta) {
      this.updateCartItem({ productId, delta })
    },

    clearCart() {
      this.$store.commit('clearCart')
    },

    goToConfirm() {
      uni.navigateTo({
        url: '/pages/order/confirm',
        success: (res) => {
          res.eventChannel.emit('orderData', {
            products: this.cartProducts,
            totalAmount: this.totalPrice
          })
        }
      })
    },

    ...mapMutations(['updateCartItem'])
  }
}
</script>

<style lang="scss" scoped>
.cart-bar {
  position: fixed;
  bottom: 10rpx;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  width: 95vw;
  margin: 0 auto;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  border-radius: 200rpx;
  z-index: 999;

  .cart-info {
    flex: 1;
    display: flex;
    align-items: center;

    .cart-icon {
      position: relative;
      margin-right: 20rpx;

      .cart-circle {
        width: 80rpx;
        height: 80rpx;
        background: #1377FD;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cart-count {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        background: #f00;
        color: #fff;
        font-size: 24rpx;
        padding: 0 12rpx;
        border-radius: 20rpx;
        min-width: 32rpx;
        text-align: center;
      }
    }

    .price-info {
      .total-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #1377FD;
      }

      .original-total {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }
  }

  .checkout-btn {
    width: 200rpx;
    height: 80rpx;
    background: #1377FD;
    color: #fff;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
  }
}

.cart-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 888;

  .cart-content {
    position: absolute;
    bottom: -100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx 30rpx calc(30rpx + 120rpx) 30rpx;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;

    &.slide-enter {
      bottom: 0;
    }

    &.slide-leave {
      bottom: -100%;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .title {
        font-size: 32rpx;
        font-weight: bold;
      }

      .clear-cart {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 28rpx;

        text {
          margin-left: 10rpx;
        }
      }
    }

    .cart-list {
      max-height: 60vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;

        .product-name {
          flex: 1;
          font-size: 28rpx;
        }

        .quantity-control {
          display: flex;
          align-items: center;

          .price {
            font-size: 32rpx;
            color: #1377FD;
            margin-right: 30rpx;
          }

          .quantity-buttons {
            display: flex;
            align-items: center;

            .btn {
              width: 50rpx;
              height: 50rpx;
              border: 1rpx solid #eee;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .count {
              width: 60rpx;
              text-align: center;
              font-size: 28rpx;
            }
          }
        }
      }
    }
  }
}
</style>