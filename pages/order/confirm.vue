<template>
    <view class="order-confirm">
        <!-- 收货地址 -->
        <view class="address-card" @click="chooseAddress">
            <view class="address-info" v-if="address.name">
                <view class="user-info">
                    <text class="name">{{ address.name }}</text>
                    <text class="phone">{{ address.phone }}</text>
                </view>
                <view class="address-detail">{{ address.fullAddress }}</view>
            </view>
            <view class="no-address" v-else>
                <text>请选择收货地址</text>
            </view>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>

        <!-- 商品列表 -->
        <view class="products-card">
            <view class="shop-name">{{ shopInfo.name }}</view>
            <view class="product-item" v-for="item in orderProducts" :key="item.id">
                <image class="product-image" :src="item.image" mode="aspectFill"></image>
                <view class="product-info">
                    <text class="product-name">{{ item.name }}</text>
                    <view class="price-count">
                        <text class="price">¥{{ item.price }}</text>
                        <text class="count">x{{ item.count }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 优惠信息 -->
        <view class="discount-card">
            <!-- 优惠券 -->
            <view class="discount-item" @click="showCouponSelect">
                <text class="label">优惠券</text>
                <view class="value">
                    <text :class="{ 'highlight': selectedCoupon }">
                        {{ selectedCoupon ? `省${selectedCoupon.amount}元` : '未使用' }}
                    </text>
                    <uni-icons type="right" size="16" color="#999"></uni-icons>
                </view>
            </view>
            
            <!-- 积分抵扣 -->
            <view class="discount-item">
                <view class="label">
                    <text>积分抵扣</text>
                    <text class="sub-label">可用{{ availablePoints }}积分，最高抵扣{{ maxPointsDeduction }}元</text>
                </view>
                <switch :checked="usePoints" @change="togglePoints" color="#1377FD" />
            </view>
            
            <!-- 会员折扣 -->
            <view class="discount-item">
                <view class="label">
                    <text>会员折扣</text>
                    <text class="sub-label">会员可享{{ memberDiscount }}折</text>
                </view>
                <text class="value highlight">-¥{{ memberDiscountAmount }}</text>
            </view>
        </view>

        <!-- 支付方式 -->
        <view class="payment-card">
            <view class="card-title">支付方式</view>
            <view 
                class="payment-item" 
                v-for="(method, index) in paymentMethods" 
                :key="index"
                @click="selectPayment(method.id)"
            >
                <view class="payment-info">
                    <image class="payment-icon" :src="method.icon"></image>
                    <text>{{ method.name }}</text>
                </view>
                <radio :checked="selectedPayment === method.id" color="#1377FD" />
            </view>
        </view>

        <!-- 备注 -->
        <view class="remark-card">
            <view class="card-title">备注</view>
            <input 
                type="text" 
                v-model="remark" 
                placeholder="请输入备注信息（选填）"
                placeholder-class="placeholder"
            />
        </view>

        <!-- 底部订单栏 -->
        <view class="order-bar">
            <view class="price-detail">
                <view class="total">
                    <text>合计：</text>
                    <text class="amount">¥{{ totalAmount }}</text>
                </view>
                <view class="discount">已优惠：¥{{ totalDiscount }}</view>
            </view>
            <view class="submit-btn" @click="submitOrder">
                立即支付
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            shopInfo: {
                name: ''
            },
            address: {
                name: '',
                phone: '',
                fullAddress: ''
            },
            orderProducts: [], // 订单商品列表
            selectedCoupon: null, // 选中的优惠券
            availablePoints: 1000, // 可用积分
            maxPointsDeduction: 10, // 最大积分抵扣金额
            usePoints: false, // 是否使用积分
            memberDiscount: 9.5, // 会员折扣
            paymentMethods: [
                { id: 'wxpay', name: '微信支付', icon: '/static/wxpay.png' },
                { id: 'alipay', name: '支付宝支付', icon: '/static/alipay.png' },
                { id: 'balance', name: '余额支付', icon: '/static/balance.png' }
            ],
            selectedPayment: 'wxpay', // 默认选择微信支付
            remark: '', // 订单备注
            originalAmount: 0, // 原始金额
        }
    },

    computed: {
        // 会员折扣金额
        memberDiscountAmount() {
            return (this.originalAmount * (1 - this.memberDiscount / 10)).toFixed(2)
        },
        
        // 积分抵扣金额
        pointsDeductionAmount() {
            return this.usePoints ? Math.min(this.maxPointsDeduction, this.originalAmount) : 0
        },
        
        // 优惠券抵扣金额
        couponDeductionAmount() {
            return this.selectedCoupon ? this.selectedCoupon.amount : 0
        },
        
        // 总优惠金额
        totalDiscount() {
            return (Number(this.memberDiscountAmount) + 
                    Number(this.pointsDeductionAmount) + 
                    Number(this.couponDeductionAmount)).toFixed(2)
        },
        
        // 最终支付金额
        totalAmount() {
            return (this.originalAmount - this.totalDiscount).toFixed(2)
        }
    },

    methods: {
        // 选择收货地址
        chooseAddress() {
            // 跳转到地址选择页
            uni.navigateTo({
                url: '/pages/address/select'
            })
        },

        // 显示优惠券选择
        showCouponSelect() {
            // 显示优惠券选择弹窗
            uni.navigateTo({
                url: '/pages/coupon/select'
            })
        },

        // 切换积分抵扣
        togglePoints(e) {
            this.usePoints = e.detail.value
        },

        // 选择支付方式
        selectPayment(paymentId) {
            this.selectedPayment = paymentId
        },

        // 提交订单
        submitOrder() {
            if (!this.address.name) {
                uni.showToast({
                    title: '请选择收货地址',
                    icon: 'none'
                })
                return
            }

            // 这里添加提交订单的逻辑
            uni.showLoading({
                title: '正在创建订单'
            })

            // 模拟订单创建
            setTimeout(() => {
                uni.hideLoading()
                // 跳转到支付页面或订单详情页
                uni.navigateTo({
                    url: '/pages/payment/index'
                })
            }, 1500)
        }
    },

    onLoad(options) {
        // 添加错误处理
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('orderData', (data) => {
            // 确保 data 中包含所需数据
            if (data) {
                this.orderProducts = data.products || []
                this.originalAmount = data.totalAmount || 0
                // 确保 shopInfo 存在
                this.shopInfo = data.shopInfo || { name: '默认商家' }
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.order-confirm {
    min-height: 100vh;
    background-color: #f8f8f8;
    padding-bottom: 120rpx;
}

.address-card {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .address-info {
        flex: 1;
        margin-right: 20rpx;
        
        .user-info {
            margin-bottom: 10rpx;
            
            .name {
                font-size: 32rpx;
                font-weight: bold;
                margin-right: 20rpx;
            }
            
            .phone {
                font-size: 28rpx;
                color: #666;
            }
        }
        
        .address-detail {
            font-size: 28rpx;
            color: #333;
        }
    }
    
    .no-address {
        font-size: 28rpx;
        color: #999;
    }
}

.products-card {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .shop-name {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
    }
    
    .product-item {
        display: flex;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
        
        &:last-child {
            border-bottom: none;
        }
        
        .product-image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
            background-color: #f0f0f0;
        }
        
        .product-info {
            flex: 1;
            margin-left: 20rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            
            .product-name {
                font-size: 28rpx;
                color: #333;
            }
            
            .price-count {
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                .price {
                    font-size: 32rpx;
                    color: #1377FD;
                    font-weight: bold;
                }
                
                .count {
                    font-size: 28rpx;
                    color: #999;
                }
            }
        }
    }
}

.discount-card {
    background-color: #fff;
    margin-bottom: 20rpx;
    
    .discount-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #eee;
        
        &:last-child {
            border-bottom: none;
        }
        
        .label {
            font-size: 28rpx;
            color: #333;
            
            .sub-label {
                font-size: 24rpx;
                color: #999;
                margin-left: 20rpx;
            }
        }
        
        .value {
            display: flex;
            align-items: center;
            font-size: 28rpx;
            color: #999;
            
            &.highlight {
                color: #1377FD;
            }
        }
    }
}

.payment-card, .remark-card {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .card-title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
    }
}

.payment-card {
    .payment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        
        .payment-info {
            display: flex;
            align-items: center;
            
            .payment-icon {
                width: 48rpx;
                height: 48rpx;
                margin-right: 20rpx;
            }
            
            text {
                font-size: 28rpx;
                color: #333;
            }
        }
    }
}

.remark-card {
    input {
        width: 100%;
        height: 80rpx;
        font-size: 28rpx;
        
        &.placeholder {
            color: #999;
        }
    }
}

.order-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .price-detail {
        .total {
            font-size: 28rpx;
            color: #333;
            
            .amount {
                font-size: 36rpx;
                font-weight: bold;
                color: #1377FD;
            }
        }
        
        .discount {
            font-size: 24rpx;
            color: #999;
        }
    }
    
    .submit-btn {
        background-color: #1377FD;
        color: #fff;
        padding: 20rpx 60rpx;
        border-radius: 50rpx;
        font-size: 32rpx;
    }
}
</style> 