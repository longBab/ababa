import {
	request,
	requestNoAuth
} from '../../lib/java110/java110Request.js'
import
url
from '../../constant/url.js'

import
mapping
from '../../constant/MappingConstant.js'

/**
 * 查询首页数据
 */
export function shopHomeData() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: url.shopHome,
			method: 'GET',
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}