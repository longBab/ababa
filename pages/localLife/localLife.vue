<template>
    <view class="local-life">
        
        <view class="grid-container">
            <view class="grid-item" v-for="(item, index) in gridItems" :key="index" @tap="handleItemClick(item)">
                <view class="item-image" :style="{ backgroundColor: item.color }"></view>
                <text class="item-text">{{ item.text }}</text>
            </view>
        </view>

        <view class="store-list">
            <view class="store-item" v-for="(store, index) in storeList" :key="index" @tap="handleStoreClick(store)">
                <image class="store-image" :src="store.image" mode="aspectFill"></image>
                <view class="store-info">
                    <text class="store-name">{{ store.name }}</text>
                    <view class="store-phone">
                        <text class="iconfont icon-phone">📞</text>
                        <text>{{ store.phone }}</text>
                    </view>
                    <view class="store-address">
                        <text class="iconfont icon-location">📍</text>
                        <text>{{ store.address }}</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="loading-more" v-if="hasMore">
            <text>加载中...</text>
        </view>
        <view class="no-more" v-else>
            <text>没有更多数据了</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            gridItems: [
                { text: '美食', color: '#FF6B6B' },
                { text: '超市', color: '#4ECDC4' },
                { text: '水果', color: '#45B7D1' },
                { text: '药店', color: '#96CEB4' },
                { text: '医院', color: '#FFEEAD' },
                { text: '快递', color: '#D4A5A5' },
                { text: '家政', color: '#9EC1CF' },
                { text: '汽修', color: '#FFD93D' },
                { text: '教育', color: '#FF9EAA' },
                { text: '更多', color: '#A8E6CF' },
            ],
            storeList: [],
            page: 1,
            pageSize: 10,
            hasMore: true,
            isLoading: false,
            isRefreshing: false
        }
    },
    onLoad() {
        this.loadInitialData()
    },
    onPullDownRefresh() {
        this.refreshData()
    },
    onReachBottom() {
        if (this.hasMore && !this.isLoading) {
            this.loadMoreData()
        }
    },
    methods: {
        generateMockData(page) {
            const mockImages = [
                'https://picsum.photos/200/200?random=1',
                'https://picsum.photos/400/400?random=2',
                'https://picsum.photos/200/200?random=3',
                'https://picsum.photos/200/200?random=4',
                'https://picsum.photos/200/200?random=5'
            ]

            const mockStores = []
            const startIndex = (page - 1) * this.pageSize

            for (let i = 0; i < this.pageSize; i++) {
                mockStores.push({
                    id: startIndex + i + 1,
                    image: mockImages[Math.floor(Math.random() * mockImages.length)],
                    name: `商家${startIndex + i + 1}`,
                    phone: `138${String(Math.random()).substr(2, 8)}`,
                    address: `幸福小区${Math.floor(Math.random() * 3 + 1)}号楼${Math.floor(Math.random() * 100 + 1)}号`,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    type: ['餐饮', '超市', '水果', '便利店'][Math.floor(Math.random() * 4)]
                })
            }

            return mockStores
        },

        loadInitialData() {
            this.storeList = this.generateMockData(1)
        },

        async refreshData() {
            if (this.isRefreshing) return

            this.isRefreshing = true

            setTimeout(() => {
                this.page = 1
                this.hasMore = true

                this.storeList = this.generateMockData(1)

                uni.stopPullDownRefresh()
                this.isRefreshing = false

                uni.showToast({
                    title: '刷新成功',
                    icon: 'success',
                    duration: 1500
                })
            }, 1000)
        },

        async loadMoreData() {
            if (this.isLoading) return

            this.isLoading = true

            setTimeout(() => {
                const nextPage = this.page + 1
                const newData = this.generateMockData(nextPage)

                if (nextPage >= 5) {
                    this.hasMore = false
                }

                this.storeList = [...this.storeList, ...newData]
                this.page = nextPage
                this.isLoading = false
            }, 1000)
        },

        handleItemClick(item) {
            console.log('点击了分类:', item.text)
        },

        handleStoreClick(store) {
            uni.navigateTo({
                url: `/pages/localLife/detail?id=${store.id}`
            })
        }
    }
}
</script>

<style lang="scss">
.local-life {
    padding: 20rpx;

    .grid-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 30rpx;

        .grid-item {
            width: 20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30rpx;

            .item-image {
                width: 80rpx;
                height: 80rpx;
                border-radius: 10rpx;
                margin-bottom: 10rpx;
            }

            .item-text {
                font-size: 24rpx;
                color: #333;
            }
        }
    }

    .store-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .store-item {
            width: 48%;
            margin-bottom: 20rpx;
            background: #fff;
            border-radius: 12rpx;
            overflow: hidden;
            box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

            .store-image {
                width: 100%;
                height: 200rpx;
            }

            .store-info {
                padding: 16rpx;

                .store-name {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10rpx;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .store-phone,
                .store-address {
                    display: flex;
                    align-items: center;
                    font-size: 24rpx;
                    color: #666;
                    margin-top: 8rpx;

                    .iconfont {
                        font-size: 24rpx;
                        margin-right: 8rpx;
                        color: #999;
                    }
                }

                .store-address {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .loading-more,
    .no-more {
        text-align: center;
        padding: 20rpx 0;
        color: #999;
        font-size: 24rpx;
    }
}
</style>