import Method from './method'
import Storage from '../storage.js'
import api from '../../config/api.js'

/**
 * 请求函数
 */
export default class Request {
  /**
   * 构造函数
   */
  constructor() {
    // 存储当前正在进行的请求
    this.requestQueue = {}
  }

  /**
   * 请求拦截器
   */
  interceptors(options) {
    // 添加token
    if (options.needToken) {
      const accessToken = Storage.getAccessToken()
      if (accessToken) {
        options.header = {
          ...options.header,
          'Authorization': 'Bearer ' + accessToken
        }
      }
    }
    return options
  }

  /**
   * 请求方法
   */
  request(options = {}) {
    // 默认配置
    const defaultOptions = {
      method: Method.GET,
      needToken: true,
      loading: true,
      message: true
    }

    // 合并配置
    options = {
      ...defaultOptions,
      ...options
    }

    // 请求拦截
    options = this.interceptors(options)

    // 显示loading
    if (options.loading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    // 发起请求
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: (res) => {
          // 请求成功处理
          this.success(res, options, resolve, reject)
        },
        fail: (err) => {
          // 请求失败���理
          this.fail(err, options, reject)
        },
        complete: () => {
          // 请求完成处理
          this.complete(options)
        }
      })
    })
  }

  /**
   * 请求成功处理
   */
  success(res, options, resolve, reject) {
    const { statusCode, data } = res

    // 请求成功
    if (statusCode === 200) {
      // 业务成功
      if (data.code === 200) {
        resolve(data)
      } 
      // token过期
      else if (data.code === 401) {
        // 刷新token
        this.handleRefreshToken(options).then(
          () => {
            this.request(options).then(resolve).catch(reject)
          }
        ).catch(() => {
          this.handleError(data, options, reject)
        })
      }
      // 其他业务错误
      else {
        this.handleError(data, options, reject)
      }
    }
    // 请求失败
    else {
      this.handleError(res, options, reject)
    }
  }

  /**
   * 请求失败处理
   */
  fail(err, options, reject) {
    this.handleError(err, options, reject)
  }

  /**
   * 请求完成处理
   */
  complete(options) {
    // 隐藏loading
    if (options.loading) {
      uni.hideLoading()
    }
  }

  /**
   * 处理错误
   */
  handleError(res, options, reject) {
    if (options.message) {
      uni.showToast({
        title: res.message || '服务器开小差了',
        icon: 'none'
      })
    }
    reject(res)
  }
} 