
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

    // 获取数据字典映射
    getDesc(key, list) {
        let desc = "";
        list.forEach((element) => {
            let { value, label } = element;
            if (value == key) {
                desc = label;
            }
        });
        return desc;
    },

}