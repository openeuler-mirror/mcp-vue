// imageMgr 镜像管理
export default {
    imageMgr: {
        publicImage: 'public mirror', // 公共镜像
        sharedMirror: 'shared mirror', // 共享镜像
        privateImage: 'private image', // 私有镜像
        status: 'state', // 状态
        imageName: 'image name', // 镜像名称
        imageNameplac: 'Please enter a mirror name', // 请输入镜像名称
        imageRemark: 'describe', // 描述
        imageRemarkplac: 'Please enter a description', // 请输入描述
        imageSize: 'capacity', // 容量
        orgNameDesc: 'Organization', // 所属组织
        typeDesc: 'Image type', // 镜像类型
        imageFromDesc: 'source', // 来源
        zoneName: 'Availability Zone', // 可用区
        zoneNameplac: 'Please select an Availability Zone', // 可用区
        createTime: 'creation time', // 创建时间
        createUser: 'creator', // 创建者
        imageDownload: 'export image', // 导出镜像
        syncImage: 'Sync mirror', // 同步镜像
        syncImageSuccess: 'Sync mirroring succeeded', // 同步镜像
        deleteImage: 'delete', // 删除
        deleteConfirm: 'OK to delete the image?', // 确定删除该镜像?
        deletebatchConfirm: 'OK to delete the selected image?', // 确定删除所选镜像?
        deleteSuccess: 'Mirror deleted successfully!', // 删除镜像成功!
        tosharedImage: 'Convert to shared image', // 转为共享镜像
        topublicMirror: 'Convert to public mirror', // 转为公共镜像
        editImage: 'Edit image', // 编辑镜像
        editImageSuccess: 'Edit image successfully!', // 编辑镜像成功!
        makeImage: 'make a mirror', // 制作镜像
        makeImageSuccess: 'Created mirror successfully!', // 制作镜像成功!
        uploadImage: 'upload image', // 上传镜像
        orgName: 'organize', // 组织
        orgNameplac: 'Please select an organization', // 请选择组织
        imageupload: 'Upload local image files to KCP cloud platform', // 上传本地镜像文件到KCP云平台
        fileName: 'Upload local image files to KCP cloud platform', // 选择镜像
        fileNameplac: 'Please select an image file!', // 请选择镜像文件!
        uploadFileFormat: 'Upload files can only be in .iso, .gvm format!', // 上传文件只能是 .iso、.gvm格式!
        uploadFileSize: 'Upload file size cannot exceed 50GB!', // 上传文件大小不能超过 50GB!
        uploadingFile: 'uploading file', // 正在上传文件：
        notCloseThisPage: 'please do not close this page', // ，请不要关闭此页面
        filetatalSize: 'total file size', // ，请不要关闭此页面
        uploaded: 'uploaded', // ，请不要关闭此页面
        uploadSpeed: 'upload speed', // 上传速度
        timeSpent: 'time spent', // 已花费时间
        timeRemaining: 'estimated time remaining', // 预计剩余时间
        cancelUpload: 'cancel upload', // 取消上传
        imgstatus: {
            NORMAL: 'normal', // 正常
            ERROR: 'abnormal', // 异常
            SYNCING: 'synchronizing', // 同步中
        },
        imageFrom: {
            UPLOAD: 'upload', // 上传
            MACHINE_MAKE: 'Cloud server production', // 云服务器制作
            SHARE_CHANGE: 'Shared image conversion', // 共享镜像转换
            PRIVATE_CHANGE: 'Private image conversion', // 私有镜像转换
        },
        imageActionList: {
            IMAGE_UPLOAD: 'upload image', // 上传镜像
            IMAGE_SYNC: 'mirror sync', // 镜像同步
            IMAGE_CREATE_TEMPLATE: 'Generate template image', // 生成模板镜像
            IMAGE_MODIFY: 'Edit image', // 编辑镜像
            IMAGE_PRIVATE_TO_SHARE: 'Private image promoted to shared image', // 私有镜像提升为共享镜像
            IMAGE_SHARE_TO_PUBLIC: 'Shared image promoted to public image', // 共享镜像提升为公共镜像
            IMAGE_MAKE: 'make a mirror', // 制作镜像
            IMAGE_CREATE_GVM_FILE: 'Generate image file', // 生成镜像文件
            IMAGE_ERROR_SYNC: 'Mirror Abnormal - Sync Mirror', // 镜像异常-同步镜像
            IMAGE_DELETE: 'delete mirror', // 删除镜像
            IMAGE_DOWNLOAD: 'image download', // 镜像下载
        },
        makeImageMsg: 'The image only contains the system disk of the selected cloud server. In order to avoid incomplete image data, please migrate the important data of other disks of the cloud server to the system disk before making an image!', // 镜像中只包含选择云服务器的系统盘，为了避免镜像数据的不全面，请将云服务器的其他磁盘的重要数据迁移到系统盘中再来制作镜像！
    }
}