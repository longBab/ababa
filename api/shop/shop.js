import { http, Method } from "../../utils/request/index.js";
import api from '../../config/api.js'

/**
 * 获取首页数据
 */
export function getShopIndex() {
  return http.request({
    url: `${api.buyer}/buyer/other/pageData/getIndex`,
    method: Method.GET,
    data: {
      clientType: 'H5'
    }
  });
} 