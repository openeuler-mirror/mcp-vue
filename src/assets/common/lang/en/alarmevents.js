/** ******************  日志告警—告警事件  *********************************/
export default {
    'monitoring.alarmSeverity.ALL': 'All Alarm Severities',
    'monitoring.alarmSeverity.URGENT': 'Urgent',
    'monitoring.alarmSeverity.SERIOUS': 'Serious',
    'monitoring.alarmSeverity.ORDINARY': 'Ordinary',
    'monitoring.alarmSeverity.label': 'Alarm Severity',
    'monitoring.alarmType.label': 'Alarm Name',
    'monitoring.alarmObjType.label': 'Object Type',
    'monitoring.alarmObjType.ALL': 'All Object Types',
    'monitoring.alarmObjType.LOCAL_SERVER': 'Local Server',
    'monitoring.alarmObjType.BRANCH_SERVER': 'Branch Server',
    'monitoring.alarmObjType.VM': 'VM',
    'monitoring.alarmObjType.SERVER': 'Servers',
    'monitoring.alarmObjType.USER': 'user', // 用户
    'monitoring.alarmObjType.SERVERVIRTUAL': 'Service Virtual',
    'monitoring.serverType.ALL': 'All Servers',
    'monitoring.serverType.LOCAL': 'Local Servers',
    'monitoring.serverType.BRANCH': 'Branch Servers',
    'monitoring.alarmEvent.type.ALL': 'All Alarm Type',
    'monitoring.alarmEvent.type.LS_CPU_USAGE': 'Local Server CPU Usage Alarm',
    'monitoring.alarmEvent.type.LS_MEM_USAGE': 'Local Server Memory Usage Alarm',
    'monitoring.alarmEvent.type.LS_NET_USAGE': 'Local Server Network Usage Alarm',
    'monitoring.alarmEvent.type.BS_CPU_USAGE': 'Branch Server CPU Usage Alarm',
    'monitoring.alarmEvent.type.BS_MEM_USAGE': 'Branch Server Memory Usage Alarm',
    'monitoring.alarmEvent.type.BS_NET_USAGE': 'Branch Server Network Usage Alarm',
    'monitoring.alarmEvent.type.VM_CPU_USAGE': 'Virtual Machine CPU Usage Alarm',
    'monitoring.alarmEvent.type.VM_SWAP_USAGE': 'Virtual Machine Swap Memory Usage Alarm',
    'monitoring.alarmEvent.type.VM_SYS_DISK_USAGE': 'Virtual Machine System Disk Usage Alarm',
    'monitoring.alarmEvent.type.VM_USER_DISK_USAGE': 'Virtual Machine User Disk Usage Alarm',
    'monitoring.alarmEvent.type.VM_ERROR': 'Virtual Machine Error',
    'monitoring.alarmEvent.type.VM_MEM_USAGE': 'Virtual Machine Memory Usage Alarm',
    'monitoring.alarmEvent.type.SERVER_OFFLINE': 'Server Offline',
    'monitoring.alarmEvent.type.S_CPU_USAGE': 'Server CPU Usage Alarm',
    'monitoring.alarmEvent.type.S_MEM_USAGE': 'Server Memory Usage Alarm',
    'monitoring.alarmEvent.type.S_NET_USAGE': 'Server Network Resource Usage Alarm',
    'monitoring.alarmEvent.type.CM_ACTIVE': 'Cluster Master Active',
    'monitoring.alarmEvent.type.CM_STANDBY': 'Cluster Master Standby',
    'monitoring.alarmEvent.type.S_DISK_SHARE': 'Local Server Image Storage Alarm',
    'monitoring.alarmEvent.type.S_DISK_ROOT': 'Local Server Root Storage Alarm',
    'monitoring.alarmEvent.type.S_DISK_LOG': 'Local Server Log Storage Alarm',
    'monitoring.alarmEvent.type.S_DISK_HOME': 'Local Server Image Cache Storage Alarm',
    'monitoring.alarmEvent.type.BACKUP_FAIL': 'Desktop Backup Fail',
    'monitoring.alarmEvent.type.AUTHENTICATE_FAIL': 'Authentication failed', // 认证失败
    'monitoring.alarmEvent.type.SERVERVIRTUAL_CPU_USAGE': 'Server Virtual CPU Usage Alarm',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_MEM_USAGE': 'Server Virtual MEM Usage Alarm',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_NET_USAGE': 'Server Virtual NET Usage Alarm',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_DISK_USAGE': 'Server Virtual DISK Usage Alarm',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_EXPIRED': 'Server Expired Alarm',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_BACKUP_SERVER_AVAILABLE_SPACE_NOT_ENOUGH': 'Insufficient free space on backup server',
    'monitoring.alarmEvent.type.SERVERVIRTUAL_DYNAMIC_ADD': 'server dynamic add',
    'monitoring.alarmEvent.type.BRANCH_AUTHENTICATE_FAIL': 'Branch authentication error', // 分支认证错误
    'monitoring.alarmEvent.type.BRANCH_REQUEST_FAIL': 'branch request error', // 分支请求错误
    'monitoring.alarmEvent.type.branch.invalid_username': 'Branch username is wrong', // 分支用户名错误
    'monitoring.alarmEvent.type.branch.invalid_password': 'branch password error', // 分支密码错误
    'monitoring.alarmEvent.type.branch.error': 'Branch authentication error', // 分支认证错误
    'monitoring.alarmEvent.storage.log': 'Storage log',
    'monitoring.alarmEvent.log': 'Log',
    'monitoring.alarmObjType.STORAGE': 'Storage',
    'monitoring.alarmEvent.type.S_GPU_TEMPERATURE': 'Server GPU Temperature Alarm',
    'monitoring.alarmEvent.type.STORAGE_USAGE': 'Storage Usage Alarm',
    'monitoring.alarmEvent.type.BRICK_OFFLINE': 'Brick Offline Alarm',
    'monitoring.alarmEvent.type.IPMI': 'Server IPMI Alarm',
    'monitoring.alarmEvent.type.VIRTUALSERVER_DYNAMIC_ADD': 'server dynamic add',
    'monitoring.alarmEvent.type.RABBIT_CONNECT_FAIL': 'RabbitMQ Connect Failed',
    'monitoring.alarmEvent.type.VIRTUALSERVER_KYLINTOOL': 'qga version',
    'monitoring.alarmEvent.type.VIRTUALSERVER_KSVDTOOL_EVENT': 'set ip/user/passwd',

    alarmSetting: {
        type: 'Alarm Name',
        urgentValue: 'Urgent Value',
        seriousValue: 'Serious Value',
        ordinaryValue: 'Ordinary Value',
        interval: 'Alarm Continue Interval(minute):',
        smtpName: 'Mail Addr:',
        intervalEmpty: 'The interval is empty!',
        intervalInput: 'The interval must be a positive number not greater than 60!',
        smtpEmpty: 'address of mail is can not null',
        'seriousInput': 'Serious threshold must less than urgent threshold!',
        'ordinaryInput': 'Ordinary threshold must less than Serious threshold!',
        'thresholdInput': 'Invalid input! please input a integer between 0~99!',
        cloudServerAlarmPolicy: 'Cloud server alarm policy', // 云服务器告警策略
        physicalServerAlertPolicy: 'Physical Server Alert Policy', // 物理服务器告警策略

        clusterAlarmSettings: 'Cluster Alarm Settings', // 集群告警设置
        platformAlarmSettings: 'Platform Alarm Settings', // 平台告警设置
        clusterAlarmlog: 'Cluster alarm log', // 集群告警日志
        platformAlarmlog: 'Platform Alarm Log', // 平台告警日志
        indicatorItem: 'Indicator item', // 指标项
        allZone: 'All Availability Zones', // 全部可用区
        allOrganization: 'All organizations', // 全部组织
        zoneName: 'Availability Zone', // 可用区
        orgName: 'Organization', // 所在组织
        vdcCpuAlarm: 'VDC-CPU Allocation Ratio Alarm', // 所在组织
        vdcEmeAlarm: 'VDC-memory usage alarm', // 所在组织
        vdcStorageAlarm: 'VDC-Storage Utilization Alarm', // 所在组织
        general: 'General alert', // 一般告警
        severity: 'Serious warning', // 严重告警
        urgent: 'emergency alert', // 紧急告警
        platform: 'platform', // 紧急告警
    },
}