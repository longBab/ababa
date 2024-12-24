<template>
    <web-view :src="webviewUrl"></web-view>
</template>

<script>
export default {
    data() {
        return {
            webviewUrl: '',
            pageTitle: ''
        }
    },
    onNavigationBarButtonTap() {
        uni.setNavigationBarTitle({
            title: this.pageTitle
        });
    },
    onLoad(options) {
        this.webviewUrl = this.baseUrl
        if (options.page) {
            this.webviewUrl = this.baseUrl + options.page + (options.id ? '?id=' + options.id : '') + (options.goodsId ? '&goodsId=' + options.goodsId : '') + (options.storeId ? '&storeId=' + options.storeId : '');

            this.pageTitle = options.name;
            uni.setNavigationBarTitle({
                title: this.pageTitle
            });
        }
        if (options.tabber) { 
            uni.switchTab({
                url: options.tabber
            })
        }

    },
    methods: {
        getMSG({ detail }) {
            console.log(detail)
        }
    },
}
</script>
