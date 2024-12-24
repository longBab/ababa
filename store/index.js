import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartItems: [],
    products: []
  },
  
  getters: {
    totalCount: state => {
      return Object.values(state.cartItems).reduce((sum, count) => sum + count, 0)
    },
    totalPrice: state => {
      return state.products
        .filter(product => state.cartItems[product.id])
        .reduce((sum, product) => sum + product.price * state.cartItems[product.id], 0)
        .toFixed(2)
    },
    originalTotalPrice: state => {
      return state.products
        .filter(product => state.cartItems[product.id])
        .reduce((sum, product) => sum + product.originalPrice * state.cartItems[product.id], 0)
        .toFixed(2)
    },
    cartProducts: state => {
      return state.products
        .filter(product => state.cartItems[product.id] > 0)
        .map(product => ({
          ...product,
          count: state.cartItems[product.id]
        }))
    }
  },
  
  mutations: {
    setProducts(state, products) {
      console.log('Vuex: 设置商品数据', products)
      state.products = products
    },
    updateCartItem(state, { productId, delta }) {
      console.log('Vuex: 更新购物车', productId, delta)
      const currentCount = state.cartItems[productId] || 0
      const newCount = currentCount + delta
      
      if (newCount <= 0) {
        Vue.delete(state.cartItems, productId)
      } else {
        Vue.set(state.cartItems, productId, newCount)
      }
      console.log('Vuex: 当前购物车状态', state.cartItems)
    },
    clearCart(state) {
      console.log('Vuex: 清空购物车')
      state.cartItems = {}
    },
    ADD_TO_CART(state, product) {
      const existingItem = state.cartItems.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.count++
      } else {
        state.cartItems.push(product)
      }
    }
  }
}) 