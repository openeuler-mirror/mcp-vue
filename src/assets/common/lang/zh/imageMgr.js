// imageMgr 镜像管理
export default {
    imageMgr: {
        publicImage: '公共镜像', // 公共镜像
        sharedMirror: '共享镜像', // 共享镜像
        privateImage: '私有镜像', // 私有镜像
        status: '状态', // 状态
        imageName: '镜像名称', // 镜像名称
        imageNameplac: '请输入镜像名称', // 请输入镜像名称
        imageRemark: '描述', // 描述
        imageRemarkplac: '请输入描述', // 请输入描述
        imageSize: '容量', // 容量
        orgNameDesc: '所属组织', // 所属组织
        typeDesc: '镜像类型', // 镜像类型
        imageFromDesc: '来源', // 来源
        zoneName: '可用区', // 可用区
        zoneNameplac: '请选择可用区', // 可用区
        createTime: '创建时间', // 创建时间
        createUser: '创建者', // 创建者
        imageDownload: '导出镜像', // 导出镜像
        syncImage: '同步镜像', // 同步镜像
        syncImageSuccess: '同步镜像成功', // 同步镜像
        deleteImage: '删除', // 删除
        deleteConfirm: '确定删除该镜像?', // 确定删除该镜像?
        deletebatchConfirm: '确定删除所选镜像?', // 确定删除所选镜像?
        deleteSuccess: '删除镜像成功!', // 删除镜像成功!
        tosharedImage: '转为共享镜像', // 转为共享镜像
        topublicMirror: '转为公共镜像', // 转为公共镜像
        editImage: '编辑镜像', // 编辑镜像
        editImageSuccess: '编辑镜像成功!', // 编辑镜像成功!
        makeImage: '制作镜像', // 制作镜像
        makeImageSuccess: '制作镜像成功!', // 制作镜像成功!
        uploadImage: '上传镜像', // 上传镜像
        orgName: '组织', // 组织
        orgNameplac: '请选择组织', // 请选择组织
        imageupload: '上传本地镜像文件到KCP云平台', // 上传本地镜像文件到KCP云平台
        fileName: '选择镜像', // 选择镜像
        fileNameplac: '请选择镜像文件!', // 请选择镜像文件!
        uploadFileFormat: '上传文件只能是 .iso、.gvm格式!', // 上传文件只能是 .iso、.gvm格式!
        uploadFileSize: '上传文件大小不能超过 50GB!', // 上传文件大小不能超过 50GB!
        uploadingFile: '正在上传文件', // 正在上传文件：
        notCloseThisPage: '请不要关闭此页面', // ，请不要关闭此页面
        filetatalSize: '文件总大小', // ，请不要关闭此页面
        uploaded: '已上传', // ，请不要关闭此页面
        uploadSpeed: '上传速度', // 上传速度
        timeSpent: '已花费时间', // 已花费时间
        timeRemaining: '预计剩余时间', // 预计剩余时间
        cancelUpload: '取消上传', // 取消上传
        imgstatus: {
            NORMAL: '正常', // 正常
            ERROR: '异常', // 异常
            SYNCING: '同步中', // 同步中
        },
        imageFrom: {
            UPLOAD: '上传', // 上传
            MACHINE_MAKE: '云服务器制作', // 云服务器制作
            SHARE_CHANGE: '共享镜像转换', // 共享镜像转换
            PRIVATE_CHANGE: '私有镜像转换', // 私有镜像转换
        },
        imageActionList: {
            IMAGE_UPLOAD: '上传镜像', // 上传镜像
            IMAGE_SYNC: '镜像同步', // 镜像同步
            IMAGE_CREATE_TEMPLATE: '生成模板镜像', // 生成模板镜像
            IMAGE_MODIFY: '编辑镜像', // 编辑镜像
            IMAGE_PRIVATE_TO_SHARE: '私有镜像提升为共享镜像', // 私有镜像提升为共享镜像
            IMAGE_SHARE_TO_PUBLIC: '共享镜像提升为公共镜像', // 共享镜像提升为公共镜像
            IMAGE_MAKE: '制作镜像', // 制作镜像
            IMAGE_CREATE_GVM_FILE: '生成镜像文件', // 生成镜像文件
            IMAGE_ERROR_SYNC: '镜像异常-同步镜像', // 镜像异常-同步镜像
            IMAGE_DELETE: '删除镜像', // 删除镜像
            IMAGE_DOWNLOAD: '镜像下载', // 镜像下载
        },
        makeImageMsg: '镜像中只包含选择云服务器的系统盘，为了避免镜像数据的不全面，请将云服务器的其他磁盘的重要数据迁移到系统盘中再来制作镜像！', // 镜像中只包含选择云服务器的系统盘，为了避免镜像数据的不全面，请将云服务器的其他磁盘的重要数据迁移到系统盘中再来制作镜像！
    }
}