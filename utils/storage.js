/**
 * Storage 工具类
 */
export default {
  // 通用存储方法
  getStorage(key) {
    return uni.getStorageSync(key)
  },

  setStorage(key, value) {
    uni.setStorageSync(key, value)
  },

  removeStorage(key) {
    uni.removeStorageSync(key)
  },

  // 特定的 AccessToken 方法
  getAccessToken() {
    return uni.getStorageSync('accessToken')
  },

  setAccessToken(token) {
    uni.setStorageSync('accessToken', token)
  },

  removeAccessToken() {
    uni.removeStorageSync('accessToken')
  }
} 