/** ******************  日志告警—告警事件  *********************************/
export default {
    'monitoring.alarmSeverity.ALL': '全部告警级别',
    'monitoring.alarmSeverity.URGENT': '紧急',
    'monitoring.alarmSeverity.SERIOUS': '严重',
    'monitoring.alarmSeverity.ORDINARY': '一般',
    'monitoring.alarmSeverity.label': '告警级别',
    'monitoring.alarmType.label': '告警名称',
    'monitoring.alarmObjType.label': '对象类型',
    'monitoring.alarmObjType.ALL': '全部对象类型',
    'monitoring.alarmObjType.LOCAL_SERVER': '本地服务器',
    'monitoring.alarmObjType.BRANCH_SERVER': '分支服务器',
    'monitoring.alarmObjType.VM': '桌面虚拟机',
    'monitoring.alarmObjType.SERVER': '服务器',
    'monitoring.alarmObjType.USER': '用户',
    'monitoring.alarmObjType.SERVERVIRTUAL': '服务器虚拟化',
    'monitoring.serverType.ALL': '全部服务器',
    'monitoring.serverType.LOCAL': '本地服务器',
    'monitoring.serverType.BRANCH': '分支服务器',
    'monitoring.alarmEvent.type.ALL': '全部告警名称',
    'monitoring.alarmEvent.type.LS_CPU_USAGE': '本地服务器CPU使用率告警',
    'monitoring.alarmEvent.type.LS_MEM_USAGE': '本地服务器内存使用率告警',
    'monitoring.alarmEvent.type.LS_NET_USAGE': '本地服务器网络资源使用率告警',
    'monitoring.alarmEvent.type.BS_CPU_USAGE': '分支服务器CPU使用率告警',
    'monitoring.alarmEvent.type.BS_MEM_USAGE': '分支服务器内存使用率告警',
    'monitoring.alarmEvent.type.BS_NET_USAGE': '分支服务器网络资源使用率告警',
    'monitoring.alarmEvent.type.VM_CPU_USAGE': '虚拟机CPU使用率告警',
    'monitoring.alarmEvent.type.VM_SWAP_USAGE': '虚拟机交换区使用率告警',
    'monitoring.alarmEvent.type.VM_SYS_DISK_USAGE': '虚拟机系统磁盘使用率告警',
    'monitoring.alarmEvent.type.VM_USER_DISK_USAGE': '虚拟机用户磁盘使用率告警',
    'monitoring.alarmEvent.type.SERVER_OFFLINE': '服务器脱机',
    'monitoring.alarmEvent.type.VM_ERROR': '虚拟机错误',
    'monitoring.alarmEvent.type.VM_MEM_USAGE': '虚拟机内存使用率告警',
    'monitoring.alarmEvent.type.S_CPU_USAGE': '服务器CPU使用率告警',
    'monitoring.alarmEvent.type.S_MEM_USAGE': '服务器内存使用率告警',
    'monitoring.alarmEvent.type.S_NET_USAGE': '服务器网络资源使用率告警',
    'monitoring.alarmEvent.type.CM_ACTIVE': '集群主机活动',
    'monitoring.alarmEvent.type.CM_STANDBY': '集群主机待机',
    'monitoring.alarmEvent.type.S_DISK_SHARE': '服务器镜像存储使用率告警',
    'monitoring.alarmEvent.type.S_DISK_ROOT': '服务器根分区使用率告警',
    'monitoring.alarmEvent.type.S_DISK_LOG': '服务器日志分区使用率告警',
    'monitoring.alarmEvent.type.S_DISK_HOME': '服务器镜像缓存分区使用率告警',
    'monitoring.alarmEvent.type.BACKUP_FAIL': '虚拟机备份失败',
    'monitoring.alarmEvent.type.AUTHENTICATE_FAIL': '认证失败',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_CPU_USAGE': '服务器虚拟化CPU使用率告警',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_MEM_USAGE': '服务器虚拟化内存使用率告警',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_NET_USAGE': '服务器虚拟化网络资源使用率告警',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_DISK_USAGE': '服务器虚拟化硬盘使用率告警',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_EXPIRED': '服务器虚拟化有效期告警',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_BACKUP_SERVER_AVAILABLE_SPACE_NOT_ENOUGH': '备份服务器剩余空间不足',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_DYNAMIC_ADD': '动态热添加',
    'monitoring.alarmEvent.type.BRANCH_AUTHENTICATE_FAIL': '分支认证错误',
    'monitoring.alarmEvent.type.BRANCH_REQUEST_FAIL': '分支请求错误',
    'monitoring.alarmEvent.type.branch.invalid_username': '分支用户名错误',
    'monitoring.alarmEvent.type.branch.invalid_password': '分支密码错误',
    'monitoring.alarmEvent.type.branch.error': '分支认证错误',
    'monitoring.alarmEvent.storage.log': '存储日志',
    'monitoring.alarmEvent.log': '日志',
    'monitoring.alarmObjType.STORAGE': '存储',
    'monitoring.alarmEvent.type.S_GPU_TEMPERATURE': '服务器显卡温度告警',
    'monitoring.alarmEvent.type.STORAGE_USAGE': '存储容量告警',
    'monitoring.alarmEvent.type.BRICK_OFFLINE': '副本掉线告警',
    'monitoring.alarmEvent.type.IPMI': '服务器IPMI事件告警',
    'monitoring.alarmEvent.type.VIRTUALSERVER_DYNAMIC_ADD': '动态热添加',
    'monitoring.alarmEvent.type.RABBIT_CONNECT_FAIL': 'RabbitMQ连接错误',
    'monitoring.alarmEvent.type.VIRTUALSERVER_KYLINTOOL': 'qga版本',
    'monitoring.alarmEvent.type.VIRTUALSERVER_KSVDTOOL_EVENT': '设置IP/用户名/密码',
    'monitoring.alarmEvent.type.MARIADB': '数据库告警',
    'monitoring.alarmEvent.type.RESOURCE_ALLOCATION': '资源达到配额阈值',
    alarmSetting: {
        type: '类型',
        urgentValue: '紧急告警',
        seriousValue: '严重告警',
        ordinaryValue: '一般告警',
        interval: '告警持续时间设置(分钟)：',
        smtpName: '邮件地址：',
        intervalEmpty: '间隔时间不能为空！',
        intervalInput: '无效的间隔时间，间隔时间有效范围：1～60!',
        smtpEmpty: '邮件地址不能为空',
        'seriousInput': '严重告警阈值必须小于紧急告警阈值！',
        'ordinaryInput': '一般告警阈值必须小于严重告警阈值！',
        'thresholdInput': '无效的告警阈值，告警阈值有效范围：0～99！',
        cloudServerAlarmPolicy: '云服务器告警策略', // 云服务器告警策略
        physicalServerAlertPolicy: '物理服务器告警策略', // 物理服务器告警策略
        siteLickCheck:'异地容灾-链路检测',
        machineExpire:'云服务器使用到期',
        clusterAlarmSettings: '集群告警设置', // 集群告警设置
        platformAlarmSettings: '平台告警设置', // 平台告警设置
        clusterAlarmlog: '集群告警日志', // 集群告警日志
        platformAlarmlog: '平台告警日志', // 平台告警日志
        indicatorItem: '指标项', // 指标项
        allZone: '全部可用区', // 全部可用区
        allOrganization: '全部组织', // 全部组织
        zoneName: '可用区', // 可用区
        orgName: '所在组织', // 所在组织
        vdcCpuAlarm: 'VDC-CPU分配比告警', // 所在组织
        vdcEmeAlarm: 'VDC-内存使用率告警', // 所在组织
        vdcStorageAlarm: 'VDC-存储使用率告警', // 所在组织
        general: '一般告警', // 一般告警
        severity: '严重告警', // 严重告警
        urgent: '紧急告警', // 紧急告警
        platform: '平台', // 紧急告警
    },
}
