<template>
	<view class="shop-detail">
		<banner-swiper :images="bannerImages"></banner-swiper>

		<!-- 添加 sticky-container 包裹需要吸顶的内容 -->
		<view class="sticky-container">
			<!-- 商家信息卡片添加 sticky 类 -->
			<view class="info-card sticky-info">
				<image class="shop-logo" src="https://picsum.photos/200/200?random=1" mode="aspectFill"></image>
				<view class="shop-info">
					<view class="shop-name">{{ shopInfo.name }}</view>
					<view class="shop-rating">
						<text class="rating">{{ shopInfo.rating }}分</text>
						<text class="distance">{{ shopInfo.distance }}km</text>
					</view>
				</view>
				<view class="action-buttons">
					<view class="action-btn" @click="makePhoneCall">
						<uni-icons type="phone" size="24" color="#666"></uni-icons>
					</view>
					<view class="action-btn" @click="openLocation">
						<uni-icons type="location" size="24" color="#666"></uni-icons>
					</view>
				</view>
			</view>

			<!-- 商品分类和列表 -->
			<view class="products-container">
				<!-- 左侧分类导航添加 sticky 类 -->
				<view class="category-sidebar">
					<view v-for="(category, index) in categories" :key="index"
						:class="['category-item', currentCategory === index ? 'active' : '']" @tap="switchCategory(index)">
						{{ category.name }}
					</view>
				</view>

				<!-- 移除右侧商品列表的独立滚动 -->
				<view class="products-list">
					<view class="product-item" v-for="(product, index) in currentProducts" :key="index"
						@click="goToProductDetail(product)">
						<image class="product-image" 
							:src="`https://picsum.photos/200/200?random=${product.id}`" 
							mode="aspectFill">
						</image>
						<view class="product-info">
							<text class="product-name">{{ product.name }}</text>
							<view class="price-row">
								<view class="price-info">
									<text class="product-price">¥{{ product.price }}</text>
									<text class="original-price">¥{{ product.originalPrice }}</text>
								</view>
								<view class="add-btn" @click.stop="addToCart(product.id, $event)">
									<uni-icons type="plus" size="20" color="#1377FD"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加新组件 -->
		<cart-bar></cart-bar>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import CartBar from '@/components/cartBar/CartBar.vue'
import BannerSwiper from '@/components/BannerSwiper.vue'

export default {
	components: {
		BannerSwiper,
		CartBar
	},

	data() {
		return {
			shopInfo: {
				image: '',
				name: '',
				rating: 0,
				distance: 0,
				phone: '',

				address: '',
				description: ''
			},
			categories: [], // 商品分类列表
			currentCategory: 0, // 当前选中的分类索引
			products: [], // 所有商品数据
			pageNum: 1,
			pageSize: 10,
			hasMore: true, // 是否还有更多数据
			scrollPositions: {}, // 新增：存储每个分类的滚动位置
			bannerImages: [
				'https://picsum.photos/200/200?random=1',
				'https://picsum.photos/200/200?random=2',
				'https://picsum.photos/200/200?random=3'
			],
		}
	},

	computed: {
		// 从 Vuex 中获取需要的状态
		...mapGetters(['totalCount', 'totalPrice', 'originalTotalPrice', 'cartProducts']),

		// 添加回 currentProducts
		currentProducts() {
			// 返回当前分类的商品
			return this.products.filter(product =>
				product.categoryId === this.categories[this.currentCategory]?.id
			)
		}
	},

	methods: {
		// 拨打电话
		makePhoneCall() {
			if (!this.shopInfo.phone) return
			uni.makePhoneCall({
				phoneNumber: this.shopInfo.phone
			})
		},

		// 打开地图
		openLocation() {
			// 这里需要真实的经纬度数据
			uni.showToast({
				title: '打开地图',
				icon: 'none'
			})
		},

		// 切换分类
		switchCategory(index) {
			// 保存当前分类的滚动位置
			this.scrollPositions[this.currentCategory] = this.getScrollTop()

			// 切换分类
			this.currentCategory = index

			// 恢复该分类之前的滚动位置
			this.$nextTick(() => {
				const savedPosition = this.scrollPositions[index] || 0
				this.setScrollTop(savedPosition)
			})
		},

		// 获取当前滚动位置
		getScrollTop() {
			const productsList = document.querySelector('.products-list')
			return productsList ? productsList.scrollTop : 0
		},

		// 设置滚动位置
		setScrollTop(position) {
			const productsList = document.querySelector('.products-list')
			if (productsList) {
				productsList.scrollTop = position
			}
		},

		// 加载更多商品
		async loadMoreProducts() {
			if (!this.hasMore) return

			// 拟异步加载
			const newProducts = Array(5).fill(null).map((_, index) => ({
				id: this.products.length + index + 1,
				categoryId: this.categories[this.currentCategory].id,
				name: `商品${this.products.length + index + 1}`,
				price: (Math.random() * 100).toFixed(2),
				originalPrice: (Math.random() * 150).toFixed(2),
				image: ''
			}))

			// 模拟网络延迟
			await new Promise(resolve => setTimeout(resolve, 500))

			this.products.push(...newProducts)
			this.pageNum++

			// 模拟数据到达上限
			if (this.products.length >= 30) {
				this.hasMore = false
			}
		},

		// 获取商品分类和商品数据
		async fetchProductsData() {
			// 重置分页相关数据
			this.pageNum = 1
			this.hasMore = true

			// 示例数据
			this.categories = [
				{ id: 1, name: '热销' },
				{ id: 2, name: '新品' },
				{ id: 3, name: '套餐' }
			]

			// 生成测试商品数据
			const products = Array(10).fill(null).map((_, index) => ({
				id: index + 1,
				categoryId: 1,
				name: `商品${index + 1}`,

				price: Number((Math.random() * 100).toFixed(2)),
				originalPrice: Number((Math.random() * 150).toFixed(2)),
				image: ''
			}))

			// 更新本地数据
			this.products = products

			// 重要：更新到 Vuex store
			this.$store.commit('setProducts', products)

			console.log('加载的商品数据:', products) // 检查商品数据
		},

		// 添加到购物车
		addToCart(productId) {
			// 直接使用 store commit
			this.$store.commit('updateCartItem', { productId, delta: 1 })
			uni.showToast({
				title: '已添加到购物车',
				icon: 'none'
			})
		},

		// 显示物车详情弹窗
		showCartDetail() {
			this.showCart = true;
			console.log('购物车商品:', this.cartProducts);
			console.log('购物车数量:', this.cartItems);
		},

		// 关闭购物车详情弹窗
		closeCart() {
			this.showCart = false;
		},

		// 更新购物车商品数量
		updateCart(productId, delta) {
			const currentCount = this.cartItems[productId] || 0;
			const newCount = currentCount + delta;

			if (newCount <= 0) {
				// 如果数量为0，从购物车中移除
				this.$delete(this.cartItems, productId);
			} else {
				// 更新数量
				this.$set(this.cartItems, productId, newCount);
			}
		},

		// 清空购物车
		clearCart() {
			this.cartItems = {}
		},

		// 在 methods 添加
		goToConfirm() {
			uni.navigateTo({
				url: '/pages/order/confirm',
				success: (res) => {
					res.eventChannel.emit('orderData', {
						products: this.cartProducts,
						totalAmount: this.totalPrice,
						shopInfo: this.shopInfo
					})
				}
			})
		},

		goToProductDetail(product) {
			uni.navigateTo({
				url: '/pages/product/detail',
				success: (res) => {
					res.eventChannel.emit('productData', { product })
				}
			})
		},

		// 确保正确映射 mutations
		...mapMutations(['updateCartItem'])
	},


	onLoad(options) {
		// 获取上一页传递的数据
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('shopData', ({ data }) => {
			this.shopInfo = { ...this.shopInfo, ...data }
		})
		this.fetchProductsData()
	},

	onReachBottom() {
		this.loadMoreProducts()
	},
}
</script>

<style lang="scss" scoped>
.shop-detail {
	min-height: 100vh;
	background-color: #f8f8f8;
}

// 新增 sticky-container 样式
.sticky-container {
	position: relative;
	z-index: 1;
}

// 修改商家信息卡片样式
.info-card {
	position: sticky;
	top: 0;
	z-index: 2;
	background-color: #fff;
	margin: 20rpx;
	padding: 30rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	display: flex;
	align-items: center;

	.shop-logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.shop-info {
		flex: 1;

		.shop-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 12rpx;
		}

		.shop-rating {
			.rating {
				font-size: 26rpx;
				color: #1377FD;
				margin-right: 20rpx;
			}

			.distance {
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	.action-buttons {
		display: flex;
		gap: 30rpx;

		.action-btn {
			padding: 10rpx;

			&:active {
				opacity: 0.7;
			}
		}
	}
}

.products-container {
	display: flex;
	background-color: #fff;
	border-radius: 12rpx;
	margin-bottom: 120rpx;
	padding-bottom: 100rpx;

	.category-sidebar {
		position: sticky;
		top: 180rpx;
		width: 160rpx;
		height: fit-content;
		background-color: #f8f8f8;

		.category-item {
			padding: 30rpx 20rpx;
			text-align: center;
			font-size: 28rpx;
			color: #666;
			border-left: 4rpx solid transparent;

			&.active {
				color: #1377FD;
				background-color: #fff;
				border-left-color: #1377FD;
			}
		}
	}

	.products-list {
		flex: 1;
		padding: 20rpx;
		padding-bottom: 40rpx;

		.product-item {
			display: flex;
			padding: 20rpx;
			border-bottom: 1rpx solid #eee;

			.product-image {
				width: 160rpx;
				height: 160rpx;
				background-color: #f0f0f0; // 占位色
				border-radius: 8rpx;
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

				.price-row {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;

					.price-info {
						.product-price {
							font-size: 32rpx;
							color: #1377FD;
							font-weight: bold;
							margin-right: 12rpx;
						}

						.original-price {
							font-size: 24rpx;
							color: #999;
							text-decoration: line-through;
						}
					}

					.add-btn {
						width: 40rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}

			&:last-child {
				border-bottom: none;
			}
		}
	}
}
</style>