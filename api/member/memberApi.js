import { request } from '../../lib/java110/java110Request.js'
import url from '../../constant/url.js'

/**
 * 获取会员信息
 */
export function getMemberInfo() {
  return new Promise((resolve, reject) => {
    request({
      url: url.getMemberInfo,
      method: "GET",
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function(e) {
        reject(e)
      }
    })
  })
}

/**
 * 更新会员信息
 */
export function updateMemberInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      url: url.updateMemberInfo,
      method: "POST",
      data: data,
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function(e) {
        reject(e)
      }
    })
  })
}
