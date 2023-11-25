
import i18n from '@/assets/common/lang/index'

const imageLogDic = [
    {
        "type": "IMAGE_UPLOAD",
        "name": "上传镜像",
        "logDetail": {
            "fileName": "文件名称",
            "imageName": "镜像名称",
            "imageRemark": "镜像描述",
            "zoneName": "可用区"
        }
    },
    {
        "type": "IMAGE_SYNC",
        "name": "同步镜像文件",
        "logDetail": {
            "imageName": "镜像名称",
            "clusterName": "集群名称"
        }
    },
    {
        "type": "IMAGE_CREATE_TEMPLATE",
        "name": "生成镜像模板",
        "logDetail": {
            "templateImageName": "模板镜像",
            "clusterName": "集群名称"
        }
    },
    {
        "type": "IMAGE_MODIFY",
        "name": "编辑镜像",
        "logDetail": {
            "oldImageName": "原镜像名称",
            "oldImageRemark": "原镜像描述",
            "oldZoneName": "原可用区",
            "imageName": "镜像名称",
            "imageRemark": "镜像描述",
            "zoneName": "可用区"
        }
    },
    {
        "type": "IMAGE_PRIVATE_TO_SHARE",
        "name": "私有镜像提升为共享镜像",
        "logDetail": {
            "oldImageName": "原镜像名称",
            "oldImageRemark": "原镜像描述",
            "imageName": "镜像名称",
            "imageRemark": "镜像描述",
            "shareOrg": "共享组织"
        }
    },
    {
        "type": "IMAGE_SHARE_TO_PUBLIC",
        "name": "共享镜像提升为公共镜像",
        "logDetail": {
            "oldImageName": "原镜像名称",
            "oldImageRemark": "原镜像描述",
            "oldZoneName": "原可用区",
            "imageName": "镜像名称",
            "imageRemark": "镜像描述",
            "zoneName": "可用区"
        }
    },
    {
        "type": "IMAGE_MAKE",
        "name": "制作镜像",
        "logDetail": {
            "selectMachineName": "云服务器",
            "selectCluster": "云服务器所在集群",
            "imageName": "镜像名称",
            "imageRemark": "镜像描述",
            "zoneName": "可用区"
        }
    },
    {
        "type": "IMAGE_CREATE_GVM_FILE",
        "name": "生成镜像文件",
        "logDetail": {
            "templateImageName": "模板镜像",
            "clusterName": "集群名称"
        }
    },
    {
        "type": "IMAGE_ERROR_SYNC",
        "name": "异常镜像-同步",
        "logDetail": {
            "imageName": "镜像名称"
        }
    },
    {
        "type": "IMAGE_DELETE",
        "name": "删除镜像",
        "logDetail": {
            "imageName": "镜像名称"
        }
    },
    {
        "type": "IMAGE_DOWNLOAD",
        "name": "镜像下载",
        "logDetail": {
            "filePath": "镜像路径",
            "imageName": "镜像名称",
            "clusterName": "下载集群"
        }
    }
]
export default {
    // 获取数据字典映射
    getLabelDesc(key, detailobj) {
        let newlogDetail = {}
        let reqObj = {}
        imageLogDic.forEach(element => {
            let { type, logDetail } = element
            if (key === type) {
                newlogDetail = JSON.parse(JSON.stringify(logDetail))
            }
        });
        for (let detailobjKey in detailobj) {
            if (detailobj.hasOwnProperty(detailobjKey)) {
                let reqkey = newlogDetail[detailobjKey] || detailobjKey
                let reqLabel = detailobj[detailobjKey]
                reqObj[reqkey] = reqLabel
            }

        }
        return JSON.stringify(reqObj)
    },

}