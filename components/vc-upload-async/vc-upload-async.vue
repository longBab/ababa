<template>
	<view>
		<view class="cu-bar bg-white ">
			<view class="action">
				{{title}}
			</view>
			<view class="action" v-if="canEdit">
				{{mediaList.length}}/{{maxMediaNum}}
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in mediaList" :key="index" @click.stop="preview(index)">
					<image v-if="isImage(item)" :src="item" mode='aspectFill'></image>
					<video v-else class="media-preview" :src="item"></video>
					<view class="cu-tag bg-red" v-if="canEdit" @tap.stop="deleteMedia(index)">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="solids" @tap="chooseMedia" v-if="canEdit && mediaList.length < maxMediaNum">
					<text class="cuIcon-cameraadd"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as TanslateImage from '../../lib/java110/utils/translate-image.js';
	import conf from '../../conf/config.js'
	import {uploadImageAsync} from '../../api/common/commonApi.js'
	const context = require("../../lib/java110/Java110Context.js");
	const factory = context.factory;
	export default {
		name:"vc-upload",
		data() {
			return {
				mediaList: [],
				photos: [],
				photoUrl: conf.commonBaseUrl + '/callComponent/download/getFile/file',
			};
		},
		props: {
			communityId: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '图片上传'
			},
			maxMediaNum: {
				type: Number,
				default: 4
			},
			sendMediaList: {
				type: Array,
				default () {
					return []
				}
			},
			count: {
				type: Number,
				default: 4
			},
			sizeType: {
				type: Array,
				default () {
					return ['original', 'compressed']
				}
			},
			sourceType: {
				type: Array,
				default () {
					return ['album', 'camera']
				}
			},
			canEdit: {
				type: Boolean,
				default: true
			},
			mediaType: {
				type: Array,
				default: () => ['image', 'video']
			}
		},
		watch:{
			photos:function(val){
				this.sendData();
			},
			deep: true
		},
		mounted() {
			if(this.sendMediaList.length > 0){
				uni.showLoading({
					title: "图片加载中...",
					mask: true
				})
			}
			this.sendMediaList.forEach((item, index) => {
				if (item.indexOf('base64,') > -1) {
					this.mediaList.push(_photo);
				}
				if (item.indexOf("https") > -1 || item.indexOf("http") > -1 || item.indexOf(this.photoUrl) > -1) {
					this.mediaList.push(item);
					let urlParams = this._getUrlParams(item);
					if(urlParams['fileId']){
						this.photos.push({fileId:urlParams['fileId'], url:item});
					}
				}else{
					let url = this.photoUrl + "?fileId=" + item + "&communityId=-1&time=" + new Date();
					this.mediaList.push(url);
					this.photos.push({fileId:item, url:url});
				}
			})
			uni.hideLoading();
			console.log(this.mediaList);
		},
		methods:{
			// 向父组件传递base64数据
			sendData() {
				this.$emit('sendImagesData', this.photos)
			},
			// 删除
			deleteMedia: function(index) {
				this.mediaList.splice(index, 1);
				this.photos.splice(index, 1);
			},
			// 添加
			chooseMedia() {
				let that = this;
				// 计算还能选择的数量
				const remainCount = this.maxMediaNum - this.mediaList.length;
				
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
					count: remainCount,
					mediaType: this.mediaType,
					sourceType: this.sourceType,
					success: (res) => {
						// 处理多个文件
						res.tempFiles.forEach(tempFile => {
							if (tempFile.fileType === 'image') {
								that.handleImageUpload(tempFile.tempFilePath);
							} else if (tempFile.fileType === 'video') {
								that.handleVideoUpload(tempFile.tempFilePath);
							}
						});
					},
					fail: (err) => {
						console.error('选择媒体失败：', err);
						uni.showToast({
							title: '选择媒体失败',
							icon: 'none'
						});
					}
				});
				// #endif

				// #ifdef H5
				uni.chooseImage({
					count: remainCount,
					sizeType: this.sizeType,
					sourceType: this.sourceType,
					success: (upImgRes) => {
						// 处理多个文件
						upImgRes.tempFilePaths.forEach(tempFilePath => {
							that.$forceUpdate();
							TanslateImage.translate(tempFilePath, (base64) => {
								let _objData = {
									uploadFile: base64,
									communityId: that.communityId
								}
								uploadImageAsync(_objData, that).then((res) => {
									that.mediaList.push(res.url);
									that.photos.push(res);
								})
							})
						});
					}
				});
				// #endif
			},
			// 预览
			preview: function(index){
				const current = this.mediaList[index];
				if (this.isImage(current)) {
					// 图片预览逻辑
					let urls = this.mediaList.filter(item => this.isImage(item));
					// 空集合 return
					if(urls.length < 1){
						return;
					}
					// domain拼接
					urls.forEach((item, index) => {
						let start = item.indexOf("/callComponent");
						if(start == 0){
							urls[index] = conf.commonBaseUrl + item;
						}
					})
					uni.previewImage({
						current: index,
						urls: urls
					})
				} else {
					// 视频预览逻辑
					uni.navigateTo({
						url: `/pages/common/video-player?url=${encodeURIComponent(current)}`
					});
				}
			},
			isImage(url) {
				return url.match(/\.(jpg|jpeg|png|gif)$/i);
			},
			handleImageUpload(tempFilePath) {
				let that = this;
				// #ifdef MP-WEIXIN
				factory.base64.urlTobase64(tempFilePath).then(function(base64) {
					let _objData = {
						uploadFile: base64,
						communityId: that.communityId
					}
					uploadImageAsync(_objData, that).then((res) => {
						that.mediaList.push(res.url);
						that.photos.push(res);
					})
				});
				// #endif
			},
			handleVideoUpload(tempFilePath) {
				let that = this;
				uni.uploadFile({
					url: conf.commonBaseUrl + '/api/file/upload', // 请确保这是正确的视频上传接口
					filePath: tempFilePath,
					name: 'file',
					formData: {
						communityId: that.communityId
					},
					success: (uploadRes) => {
						let res = JSON.parse(uploadRes.data);
						if (res.code === 0) {
							that.mediaList.push(res.url);
							that.photos.push(res);
						} else {
							uni.showToast({
								title: '视频上传失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('视频上传失败：', err);
						uni.showToast({
							title: '视频上传失败',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style>
.media-preview {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
