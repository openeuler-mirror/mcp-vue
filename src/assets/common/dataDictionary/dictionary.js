
import i18n from '@/assets/common/lang/index'
export default {
    storage: {
        type: { LOCAL: '本地存储', NFS: 'NFS', DISTRIBUTED: '分布式存储', CIFS: 'CFS', IPSAN: 'IPSAN', FCSAN: 'FCSAN' },
        usage: { MANAGE: '管理', DATA: '数据' },
    },
    // 告警名称
    // 枚举: VDC_CPU,VDC_MEM,VDC_STORAGE
    // 枚举备注: VDC_CPU(VDC-CPU分配比告警) VDC_MEM(VDC内存使用率告警) VDC_STORAGE(VDC存储使用率告警)
    resourceTypeArr: [
        {
            value: "VDC_CPU", label: i18n.t('alarmSetting.vdcCpuAlarm') // "VDC-CPU分配比告警"
        },
        {
            value: "VDC_MEM", label: i18n.t('alarmSetting.vdcEmeAlarm') // "VDC-内存使用率告警" 
        },
        {
            value: "VDC_STORAGE", label: i18n.t('alarmSetting.vdcStorageAlarm') // "VDC-存储使用率告警"
        },
        {
            value: "SITE_LICK_CHECK", label: i18n.t('alarmSetting.siteLickCheck') // "异地容灾-链路检测"
        },

        {
            value: "MACHINE_EXPIRE", label: i18n.t('alarmSetting.machineExpire') // "云服务器使用到期"
        },
    ],
    // "告警级别",
    // 枚举: GENERAL,SEVERITY,URGENT
    // 枚举备注: GENERAL(一般告警) SEVERITY(严重告警) URGENT(紧急告警)
    alarmLevelArr: [
        {
            value: "GENERAL", label: i18n.t('alarmSetting.general') //  "一般告警"
        },
        {
            value: "SEVERITY", label: i18n.t('alarmSetting.severity') //  "严重告警" 
        },
        {
            value: "URGENT", label: i18n.t('alarmSetting.urgent') //  "紧急告警" 
        },
    ],
    // "对象类型",
    // 枚举: PLATFORM
    // 枚举备注: PLATFORM（平台）
    targetTypeArr: [{
        value: "PLATFORM", label: i18n.t('alarmSetting.platform') //"平台"
    }],

    // 创建类型
    // 枚举: LINK_CLONE,FULL_CLONE
    // 枚举备注: LINK_CLONE(链接克隆) FULL_CLONE(完整克隆)
    cloneTypeArr: [
        {
            value: "LINK_CLONE", label: i18n.t('common.cloneTypeArr.LINK_CLONE') // "链接克隆"
        },
        {
            value: "FULL_CLONE", label: i18n.t('common.cloneTypeArr.FULL_CLONE') // "链接克隆"
        },
    ],

    // 安全策略
    // 枚举: NONE,SECURITY_GROUP,VIRTUAL_FIREWALL
    // 枚举备注: NONE(无) SECURITY_GROUP(安全组) VIRTUAL_FIREWALL(虚拟防火墙)
    securityPolicyArr: [
        {
            value: "NONE", label: i18n.t('common.securityPolicyArr.NONE') // "无"
        },
        {
            value: "SECURITY_GROUP", label: i18n.t('common.securityPolicyArr.SECURITY_GROUP') // "安全组"
        },
        {
            value: "VIRTUAL_FIREWALL", label: i18n.t('common.securityPolicyArr.VIRTUAL_FIREWALL') // "安全组"
        },
    ],

    // 角色类型
    // 枚举: ORG,SELF_SERVICE,PLATFORM
    // 枚举备注: ORG(组织管理) SELF_SERVICE(自服务用户) PLATFORM(平台管理)
    roleTypeArr: [
        {
            value: "ORG", label: i18n.t("authorityMgr.ORG"), // "组织管理"
        },
        {
            value: "SELF_SERVICE", label: i18n.t("authorityMgr.SELF_SERVICE"),// "自服务用户"
        },
        {
            value: "PLATFORM", label: i18n.t("authorityMgr.PLATFORM"), // "平台管理"
        },
    ],

    // 镜像管理 status
    // 枚举: NORMAL,ERROR,SYNCING
    // 枚举备注: NORMAL("正常"), ERROR("异常"), SYNCING("同步中"),
    imgstatusArr: [
        {
            value: "NORMAL", label: i18n.t("imageMgr.imgstatus.NORMAL"), // "正常"
        },
        {
            value: "ERROR", label: i18n.t("imageMgr.imgstatus.ERROR"), // "异常"
        },
        {
            value: "SYNCING", label: i18n.t("imageMgr.imgstatus.SYNCING"), // "同步中"
        },
    ],
    // 镜像管理 type
    // 枚举: ISO,GVM
    // 枚举备注: ISO GVM
    imgtypeArr: [
        {
            value: "ISO", label: "ISO", // "ISO"
        },
        {
            value: "GVM", label: "其他",// "其他"
        },
    ],
    // 镜像管理 imageFrom
    // 枚举: UPLOAD,MACHINE_MAKE,SHARE_CHANGE,PRIVATE_CHANGE
    // 枚举备注: UPLOAD( "上传"), MACHINE_MAKE("云服务器制作"), SHARE_CHANGE("共享镜像转换"), PRIVATE_CHANGE("私有镜像转换"),
    imageFromArr: [
        {
            value: "UPLOAD", label: i18n.t("imageMgr.imageFrom.UPLOAD"), // "上传"
        },
        {
            value: "MACHINE_MAKE", label: i18n.t("imageMgr.imageFrom.MACHINE_MAKE"), // "云服务器制作"
        },
        {
            value: "SHARE_CHANGE", label: i18n.t("imageMgr.imageFrom.SHARE_CHANGE"), // "共享镜像转换"
        },
        {
            value: "PRIVATE_CHANGE", label: i18n.t("imageMgr.imageFrom.PRIVATE_CHANGE"), // "私有镜像转换"
        },
    ],

    // 枚举: IMAGE,CLUSTER,VDC,ZONE,ORG
    // 枚举备注: IMAGE(镜像管理) CLUSTER(集群管理) VDC(VDC管理) ZONE(可用区管理) ORG(组织管理)
    operateLogTypeList: [
        {
            value: "IMAGE", label: i18n.t("operateLog.logType.IMAGE"), // "镜像管理"
        },
        {
            value: "CLUSTER", label: i18n.t("operateLog.logType.CLUSTER"), // "集群管理"
        },
        {
            value: "VDC", label: i18n.t("operateLog.logType.VDC"), // "VDC管理"
        },
        {
            value: "ZONE", label: i18n.t("operateLog.logType.ZONE"), // "可用区管理"
        },
        {
            value: "ORG", label: i18n.t("operateLog.logType.ORG"), // "组织管理"
        },
    ],

    // 枚举: IMAGE_UPLOAD,IMAGE_SYNC,IMAGE_CREATE_TEMPLATE,IMAGE_MODIFY,IMAGE_PRIVATE_TO_SHARE,IMAGE_SHARE_TO_PUBLIC,IMAGE_MAKE,IMAGE_CREATE_GVM_FILE,IMAGE_ERROR_SYNC,IMAGE_DELETE
    // 枚举备注: 
    // IMAGE_UPLOAD("上传镜像"), IMAGE_SYNC("镜像同步"), IMAGE_CREATE_TEMPLATE("生成模板镜像"), 
    // IMAGE_MODIFY("编辑镜像"), IMAGE_PRIVATE_TO_SHARE("私有镜像提升为共享镜像"), 
    // IMAGE_SHARE_TO_PUBLIC("共享镜像提升为公共镜像"), IMAGE_MAKE("制作镜像"), 
    // IMAGE_CREATE_GVM_FILE("生成镜像文件"), IMAGE_ERROR_SYNC("镜像异常-同步镜像"), IMAGE_DELETE("删除镜像");
    imageActionList: [
        {
            value: "IMAGE_UPLOAD", label: i18n.t("imageMgr.imageActionList.IMAGE_UPLOAD"),  // "上传镜像"
        },
        {
            value: "IMAGE_SYNC", label: i18n.t("imageMgr.imageActionList.IMAGE_SYNC"), // "镜像同步"
        },
        {
            value: "IMAGE_CREATE_TEMPLATE", label: i18n.t("imageMgr.imageActionList.IMAGE_CREATE_TEMPLATE"), // "生成模板镜像"
        },
        {
            value: "IMAGE_MODIFY", label: i18n.t("imageMgr.imageActionList.IMAGE_MODIFY"),  // "编辑镜像"
        },
        {
            value: "IMAGE_PRIVATE_TO_SHARE", label: i18n.t("imageMgr.imageActionList.IMAGE_PRIVATE_TO_SHARE"),  // "私有镜像提升为共享镜像"
        },
        {
            value: "IMAGE_SHARE_TO_PUBLIC", label: i18n.t("imageMgr.imageActionList.IMAGE_SHARE_TO_PUBLIC"),  // "共享镜像提升为公共镜像"
        },
        {
            value: "IMAGE_MAKE", label: i18n.t("imageMgr.imageActionList.IMAGE_MAKE"),  // "制作镜像"
        },
        {
            value: "IMAGE_CREATE_GVM_FILE", label: i18n.t("imageMgr.imageActionList.IMAGE_CREATE_GVM_FILE"),  // "生成镜像文件"
        },
        {
            value: "IMAGE_ERROR_SYNC", label: i18n.t("imageMgr.imageActionList.IMAGE_ERROR_SYNC"),  // "镜像异常-同步镜像"
        },
        {
            value: "IMAGE_DELETE", label: i18n.t("imageMgr.imageActionList.IMAGE_DELETE"),  // "删除镜像"
        },
        {
            value: "IMAGE_DOWNLOAD", label: i18n.t("imageMgr.imageActionList.IMAGE_DOWNLOAD"), // "镜像下载"
        }
    ],

    // 枚举: SUCCESS,FAIL,RUNNING
    // 枚举备注: SUCCESS("成功"), FAIL("失败"), RUNNING("执行中");
    operateLogStatusList: [
        {
            value: "SUCCESS", label: i18n.t("operateLog.logStatus.SUCCESS"),  // "成功"
        },
        {
            value: "FAIL", label: i18n.t("operateLog.logStatus.FAIL"), // "失败"
        },
        {
            value: "RUNNING", label: i18n.t("operateLog.logStatus.RUNNING"),  // "执行中"
        }
    ],


    // 枚举: NORMAL,WAIT_SYNC,SYNCING,SYNC_SUCCESS,SYNC_FAILED,CREATE_GVM_FILE_IMG,CREATE_GVM_FILE_ERROR,CREATE_GVM_FILE_SUCCESS,CREATE_IMAGE_ING,CREATE_IMAGE_ERROR
    // 枚举备注: 
    // NORMAL("正常"), WAIT_SYNC("等待同步镜像文件"), SYNCING("同步镜像文件中"), 
    // SYNC_SUCCESS("同步镜像文件完成"), SYNC_FAILED("同步镜像文件失败"), CREATE_GVM_FILE_IMG("生成GVM文件中"), 
    // CREATE_GVM_FILE_ERROR("生成GVM文件失败"), CREATE_GVM_FILE_SUCCESS("生成GVM文件成功"), 
    // CREATE_IMAGE_ING("创建模板镜像中"), CREATE_IMAGE_ERROR("创建镜像失败"),
    imageClusterStatus: [
        {
            value: "NORMAL", label: "正常",  // "正常"
        },
        {
            value: "WAIT_SYNC", label: "等待同步镜像文件",  // "等待同步镜像文件"
        },
        {
            value: "SYNCING", label: "同步镜像文件中",  // "同步镜像文件中"
        },
        {
            value: "SYNC_SUCCESS", label: "同步镜像文件完成",  // "同步镜像文件完成"
        },
        {
            value: "SYNC_FAILED", label: "同步镜像文件失败",  // "同步镜像文件失败"
        },
        {
            value: "CREATE_GVM_FILE_IMG", label: "生成GVM文件中",  // "生成GVM文件中"
        },
        {
            value: "CREATE_GVM_FILE_ERROR", label: "生成GVM文件失败",  // "生成GVM文件失败"
        },
        {
            value: "CREATE_GVM_FILE_SUCCESS", label: "生成GVM文件成功",  // "生成GVM文件成功"
        },
        {
            value: "CREATE_IMAGE_ING", label: "创建模板镜像中",  // "创建模板镜像中"
        },
        {
            value: "CREATE_IMAGE_ERROR", label: "创建镜像失败",  // "创建镜像失败"
        }
    ],

    // 任务中心状态枚举
    teskstatusList: [
        {
            value: "SUCCESS",
            label: i18n.t("taskcenter.success"), // "成功"
        },
        {
            value: "FAIL",
            label: i18n.t("taskcenter.fail"), //  "失败"
        },
        {
            value: "RUNNING",
            label: i18n.t("taskcenter.running"), //  "执行中"
        },
        {
            value: "WAIT_START",
            label: i18n.t("taskcenter.tobestarted"), //  "待开始"
        },
        {
            value: "CANCELED",
            label: i18n.t("taskcenter.canceled"), //  "已取消"
        },
        {
            value: "CANCELING",
            label: i18n.t("taskcenter.canceling"), // "取消中"
        },
        {
            value: "TIMEOUT",
            label: i18n.t("taskcenter.timeout"), // "超时"
        },
        {
            value: "UNKNOWN",
            label: i18n.t("taskcenter.unknown"), // "未知"
        },
    ],

    // 获取数据字典映射
    getDesc(key, list) {
        let desc = "";
        list.forEach((element) => {
            let { value, label } = element;
            if (value == key) {
                desc = label;
            }
        });

        return desc || key;
    },

}