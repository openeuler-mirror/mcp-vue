import request from '@/utils/request'

// 检查镜像名称是否已存在 
export function checkImageName(data) {
    return request({
        url: '/image/checkImageName',
        method: 'post',
        data
    })
}

// 上传镜像
export function uploadImage(data, cancelToken, cd) {
    return request({
        url: '/image/uploadImage',
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (progressEvent) {
            if (progressEvent.lengthComputable) {
                cd(progressEvent);
            }
        },
        cancelToken: cancelToken
    })
}


// 分页查询镜像
export function pageImage(data) {
    return request({
        url: '/image/pageImage',
        method: 'post',
        data
    })
}

// 获取镜像详情
export function imageDetail(data) {
    return request({
        url: '/image/imageDetail',
        method: 'post',
        data
    })
}

// 编辑镜像
export function modifyImage(data) {
    return request({
        url: '/image/modifyImage',
        method: 'post',
        data
    })
}

// 镜像异常时-同步镜像
export function syncImage(data) {
    return request({
        url: '/image/syncImage',
        method: 'post',
        data
    })
}

// 将私有镜像转为共享镜像
export function changeToShare(data) {
    return request({
        url: '/image/changeToShare',
        method: 'post',
        data
    })
}

// 删除镜像
export function deleteImage(data) {
    return request({
        url: '/image/deleteImage',
        method: 'post',
        data
    })
}

// 制作镜像
export function makeImage(data) {
    return request({
        url: '/image/makeImage',
        method: 'post',
        data
    })
}

// 镜像详情
export function imageInfo(data) {
    return request({
        url: '/image/imageInfo',
        method: 'post',
        data
    })
}

// 获取镜像下载地址
export function imageDownload(data) {
    return request({
        url: '/image/imageDownload',
        method: 'post',
        data
    })
}

// 批量删除镜像
export function batchDeleteImage(data) {
    return request({
        url: '/image/batchDeleteImage',
        method: 'post',
        data
    })
}
