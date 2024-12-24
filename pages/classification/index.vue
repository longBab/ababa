<template>
		<web-view :src="url"></web-view>
</template>

<script>

export default {
	data() {
		return {
			pageData: {},
			url: ''
		}
	},
	onLoad() {
		this.url = this.baseUrl+'/pages/tabbar/category/category'
		// uni.redirectTo({
		// 	url: '/pages/test/test'
		// })
	},
	onShow() {
		// uni.hideTabBar();
	},
	methods: {
	}
}
</script>

<style lang="scss">
</style>
