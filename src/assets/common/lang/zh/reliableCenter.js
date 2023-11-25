//$t('reliableCenter')
export default {
    drStragtegyInfor:{
        Monday: '星期一',
        Tuesday: '星期二',
        Wednesday: '星期三',
        Thurday: '星期四',
        Friday: '星期五',
        Saturday: '星期六',
        Sunday: '星期日',
        enable:'启用',
        deactivate:'停用'
    },
    weekObj: {
        MONDAY: "周一",
        TUESDAY: "周二",
        WEDNESDAY: "周三",
        THURSDAY: "周四",
        FRIDAY: "周五",
        STAURDAY: "周六",
        SUNDAY: "周天",
      },
    configurationGuide:'配置指引:',
    configurationGuideStep1:'1.请安装一个全新的KCP，并设置IP',
    configurationGuideStep2:'2.比处填写相应的信息将新KCP添加进来作为备KCP，系统将自动同步主KCP的相关配置和数据到该节点',
    configurationGuideStep3:'3.当主KCP故障后，可登录备KCP的IP，将备KCP切换成主KCP',
    nodeIp:'节点IP',
    password:'密码',
    addStandyAdd:'添加备KCP',
    standySlaveShip:'主备关系',
    Switch:'切换为主站点',
    undeleted:'已取消删除',
    promotedTips:'此操作将该KCP备节点提升为主节点, 是否继续?',
    promotedSuccess:'提升主节点成功',
    cancelPromoted:'已取消提升',
    delNode:'此操作将删除该KCP备节点, 是否继续',
    masterNoe:'主（当前访问）',
    slave:' 备',
    main:'主',
    slaveNow:'备（当前访问）',
    selectNic:'选择网卡规格',
    net2:'2层网络',
    net3:'3层网络',
    netName:'网络名称',
    netDes:'网络描述',
    netHie:'网络层级',
    nicType:'网卡类型',
    netType:'网络类型',
    addPool:'地址池',
    virSwitch:'虚拟交换机',
    primarySite:'主站点恢复点列表',
    secSiteList:'备站点恢复点列表',
    fullBackup:'全量备份',
    incBackup:'增量备份',
    secSite:'备站点',
    primarySite:'主站点',
    synTo:'同步至',
    backName:'备份文件名称',
    backPath:'备份路径',
    backMode:'备份方式',
    backSize:'备份大小',
    backComTime:'备份完成时间',
    selectRePoint:'请选择恢复点',
    mainSlaveSite:'主备站点容灾数据',
    disasterPolicy:'容灾策略',
    siteManage:'站点管理',
    addSite:'添加站点',
    siteName:'站点名称',
    addSiteSuccess:'站点添加成功',
    linkManage:'链路管理',
    delSiteTips:'删除后不可恢复，请谨慎操作',
    delSiteTite:'确定删除数据？',
    remark:'备注',
    createDrPolicy:'创建容灾策略',
    executeDrPolicy:'立即执行容灾策略',
    enable:'启用',
    disable:'禁用',
    connectivityTest:' 连通性检验',
    probeObj:'探测对象',
    detectionRes:'探测结果',
    underDete:'检测中',
    probObjectCom:'探测对象通信正常',
    communicationError:'探测对象通信异常，请检测网络后重试',
    linkDetection:'链路检测中',
    retest:'重新检测',
    addLink:'添加链路',
    unlimited:'不限制',
    limited:'限制',
    edit:'编辑',
    conTest:'连通性测试',
    delete:'删除',
    site1:'站点1',
    site2:'站点2',
    linkStatusSite:'站点链路连接状态',
    transRateLim:'传输速率限制',
    normal:'正常',
    anomaly:'异常',
    editLink:'编辑链路',
    sectionDescri:'配置站点与站点的管理节点主机IP，使站点与站点链路宽带限制之间能正常通信和传输数据。',
    linkRestr:'链路宽带限制',
    configureDrIp:'容灾IP配置',
    communicationIpAddress:'该通信ip不得为空',
    enterNormalIp:'请输入正常ip地址',
    selectThePrimary:'请选择主站点和备站点',
    site1Tips:'主站点不得为空',
    site2Tips:'备站点不得为空',
    linkBroadBand:'链路宽带限制不得为空',
    dataCommit:'数据提交中，请稍后关闭窗口',
    linkEditSucc:'链路编辑成功',
    linkDete:'链路检测异常',
    addLinkSuccess:'链路添加成功',

    backupServerLoc: '选择备份服务器位置',
    backupServer: '备份服务器',
    state: '状态',
    totalCapacity: '总容量',
    availableSpace: '可用空间',
    selectCloudServer: '选择云服务器',
    cloudServerSelected: '已选',
    clear: '清除',
    noDataSelected: '暂无选中数据',
    packetDataLoading: '分组数据加载中',
    cloudServerName: '云服务器名称',
    description: '描述',
    createDrPolicy: '创建容灾策略',
    executeDrPolicyImmediately: '立即执行容灾策略',
    compressedTransmission: '压缩传输',
    uncompressedTransmission: '无压缩传输',
    hour: '小时',
    drPolicyName: '容灾策略名称',
    primarySite: '主站点',
    secondarySite: '备站点',
    cloudServer: '云服务器',
    primarySiteBackupLoc: ' 主站点备份位置',
    primarySiteBackupPeriod: '主站点备份周期',
    secondarySiteDrLoc: '备站点容灾位置',
    drTransmissionMode: '容灾传输方式',
    drPro: '容灾pro',
    enabledState: '启用状态',
    nextDrTime: '下次容灾时间',

    backupServerLoc: '选择备份服务器位置',
    backupServer: '备份服务器',
    state: '状态',
    totalCapacity: '总容量',
    availableSpace: '可用空间',
    selectCloudServer: '选择云服务器',
    clear: '清除',
    noDataSelected: '暂无选中数据',
    packetDataLoading: '分组数据加载中',
    cloudServerName: '云服务器名称',
    description: '描述',

    createDrPolicy: '创建容灾策略',
    executeDrPolicyImmediately: '立即执行容灾策略',
    compressedTransmission: '压缩传输',
    uncompressedTransmission: '无压缩传输',
    immediately: '即时同步',
    hour: '小时',
    drPolicyName: '容灾策略名称',
    primarySite: '主站点',
    secondarySite: '备站点',
    cloudServer: '云服务器',
    primarySiteBackupLoc: '主站点备份位置',
    primarySiteBackupPeriod: '主站点备份周期',
    secondarySiteDrLoc: '备站点容灾位置',
    drTransmissionMode: '容灾传输方式',
    drPro: '容灾pro',
    enabledState: '启用状态',
    nextDrTime: '下次容灾时间',
    enableConfirmation: '启用确认',
    disableConfirmation: '禁用确认',
    deletionConfirmation: '删除确认',
    enabledSuccessfully: '启用成功',
    disabledSuccessfully: '禁用成功',
    hourlyBackup: '小时备份',
    dailyBackup: '每天备份',
    everyDay: '每天',
    startTime: '开始时间',
    endTime: '结束时间',
    weeklyBackup: '每周备份',
    everyWeek: '每周',
    executedSuccessfully: '执行成功',
    batchEnabledSuccessfully: '批量启用成功',
    batchDisabledSuccessfully: '批量禁用成功',
    disabledStatusPolicySelected: '选中策略中有禁用状态策略，无法进行立即执行',
    enabledPolicyExists: '选中策略中有启用状态策略，无法进行启动',
    disabledStatusPolicyExists: '选中策略中有禁用状态策略，无法进行禁用',
    basicInfo: '基本信息',
    drConfig: '容灾配置',
    definiteInfo: '确定信息',
    choose: '选择',
    schematicDiagram: '示意图',
    primarySiteLocalBackup: '主站点本地备份',
    backupLoc: '备份位置',
    pleaseEnter: '请输入',
    backupFreq: '备份频率',
    day: '天',
    weeks: '周',
    backupCycle: '备份周期',
    backupPeriod: '备份时间段',
    nextDay: '隔天',
    backupStartTime: '备份开始时间',
    arbitraryPointInTime: '任意时间点',
    policyDuration: '策略持续时长',
    singleServerTimeoutDuration: '单台超时时长',
    backupCopy: '备份份数',
    secondarySiteRemoteDr: '备站点异地容灾',
    drLocation: '容灾位置',
    drRpoPeriod: '容灾RPO周期',
    transmissionMode: '传输方式',
    dataSyncCompressed: '对同步到备站点的数据压缩后再进行传输，从而提高传输效率，减少对带宽的消耗，同时也将消耗更多的CPU资源，请根据带宽情况选择是否开启。',
    enterDrPolicyName: '请输入容灾策略名称',
    policyNameFormat: '支持2-32位中英文、数字、特殊字符',
    selectPrimarySite: '请选择主站点',
    selectSecondarySite: '请选择备站点',
    selectCloudServer: '请选择云服务器',
    selectBackupLoc: '请选择备份位置',
    selectDrLoc: '请选择容灾位置',
    selectStartTime: '请选择起始时间',
    selectEndTime: '请选择结束时间',
    selectBackupPeriod: '请选择备份周期',

    enterPolicyDuration: '请输入策略持续时长',
    enterSingleTimeout: '请输入单台超时时长',
    enterBackupCopies: '请输入备份份数',
    selectDrRpoPeriod: '请选择容灾RPO周期',
    cloudServerName: '云服务器名称',
    cloudServerStatus: '云服务器状态',
    createDrPolicy: '创建容灾策略',
    editDrPolicy: '编辑容灾策略',
    policyCreationSucceeded: '策略创建成功',
    policyModificationSucceeded: '策略修改成功',
    enableConfirmation: '确认启用该策略？',
    disableConfirmation: '确认禁用该策略？',
    deletionConfirmation: '确认删除该策略？',
    startTime: '起始时间',
    primarySiteBackupMethod: '主站点备份方式',
    secondarySiteDrMethod: '备站点容灾方式',
    weeklyBackup: '按周备份',
    hourlyBackup: '按小时备份',
    cloudServerList: '云服务器列表',
    cloudServerName: '云服务器名称',
    cloudServerStatus: '云服务器状态',
    serverSearchTips:'服务器名/IP/UUID/标签',

    DRTest: "容灾演练",
    startDrNote:"注：开始演练后，主站点云服务器立即关机，同时自动在备站点拉起灾备机。",
    endDrNote:"注：执行结束演练后，删除容灾备机并清理演练时容灾数据。",
    endDrNote2:"结束演练不会影响主站点云服务器业务",
    recoveryMethod: "恢复方式",
    startTest: "开始演练",
    endTest: "结束演练",
    startTestNote: "注：计划内恢复会立即关闭主站点云服务器，将最新数据同步到备站点，数据同步完成后，自动在备站点拉起容灾备机。",
    startTestNote1: "此过程中业务将会有短暂中断。",
    startTestNote2: "恢复过程中若错误，将取消恢复，将主站点云服务器重新接起。",
    endTestNote: "注：灾难后恢复立即在备站点拉起容灾备机，",
    endTestNote2: "未同步到备站点的数据会丢失。",
    testServer: "演练云服务器",
    testToBackup: "演练到备站点",
    testRecoveryPoint: "演练恢复点",
    chooseRecoveryPoint: "请选择演练恢复点",
    auto: "自动",
    storageLocation: "存储位置",
    chooseStorageLocation: "请选择存储位置",
    networkInterface: "网口",
    chooseNetworkInterfaceData: "请选择网口数据",
    testSubmitted: "容灾演练提交成功，具体进度请在任务栏中查看。",
    endTestSubmitted: "结束容灾演练提交成功，具体进度请在任务栏中查看。",
    notExist: "不存在",
    RPOSyncing: "RPO同步中",
    deleting: "删除中",
    allServers: "全部云服务器",
    mainSiteDRRecovery: "主站点容灾恢复",
    backupSiteDRRecovery: "备站点容灾恢复",
    revertToMainSite: "回迁到主站点",
    differencesCheck: "差异检测",
    mainSiteName: "主站点名称",
    mainSiteBackupCount: "主站点备份数量",
    mainSiteBackupSize: "主站点备份数据总大小",
    mainSiteLastRecoveryTime: "主站点最近恢复点时间",
    mainBackupDifferences: "主备站点数据差异量",
    backupSiteName: "备站点名称",
    backupSiteBackupSize: "备站点备份数据总大小",
    backupSiteBackupCount: "备站点备份数量",
    backupSiteLastRecoveryTime: "备站点最近恢复时间",
    performBackupCheck: "是否进行云服务器主备站点备份文件差异性检测",
    prompt: "提示",
    confirm: "确定",
    cancel: "取消",
    backupCheckSubmitted: "云服务器主备站点备份文件差异性检测提交成功，具体进度请在任务台查看。",
    mainSiteDRRecoverySubmitted: "主站点容灾恢复任务提交成功，具体进度请在任务中心查看。",
    revertNote: "注：执行回迁后，会立即关闭备站点云服务器，将最新数据回迁到主站点，并在数据回迁完成后，自动在主站点接起云服务器。",
    revertNote1:"此过程中业务将会有短暂中断。",
    revertNote2:"回迁过程中若错误，将取消回迁，将备站点云服务器重新接起。",
    revertServer: "回迁云服务器",
    revertSubmitted: "回迁数据提交成功，具体进度请在任务栏中查看。",
    backupSiteStatus: "备站点状态",
    mainSiteStatus: "主站点状态",
    syncTo: "备份恢复点同步且覆盖到",
    confirmSyncTo: "确定同步到",
    data: "数据",
    syncSubmitted: "数据同步成功提交成功，具体进度请在任务台查看。",
    plannedRecovery: "计划内恢复（主站点需在线）",
    DRRecovery: "灾难后恢复",
    recoveryServer: "恢复云服务器",
    recoveryToBackup: "恢复到备站点",
    recoveryPoint: "恢复点",
    runLocation: "运行位置",
    plannedRecoverySubmitted: "计划内备份恢复提交成功，具体进度请在任务栏中查看。",
    DRRecoverySubmitted: "灾难后恢复备份恢复提交成功，具体进度请在任务栏中查看。",
    NORMAL: "保护中",
    PLAN_RECOVER: "计划内恢复",
    PLAN_RECOVERING: "计划内恢复中",
    FAIL_RECOVER: "故障恢复",
    FAIL_RECOVERING: "故障恢复中",
    BACKUPING: "备份中",
    DELETEING: "删除备份文件中",
    PRONG: "备份文件pro同步中",
    START_DRILL: "开始容灾演练中",
    DRILL: "容灾演练中",
    END_DRILL: "结束容灾演练中",
    MOVE_BACK: "数据回迁中",
    MASTER_RECOVERING: "主站点恢复中",
    chooseMainRecoveryPoint:'选择恢复点',
    backupFileStatus:'备份文件状态',
    will:'将',
    bdStatus:'容灾状态',
    backStatus:'备份状态',
    PRONG:'pro同步中',

    runnowTips:'由于异地容灾占用资源较大，请谨慎操作',
    runnowTitleTips:'对"{name}"立即执行容灾策略?',
    hourBackupTips:'首次备份时为全量备份，成功备份后，再执行备份周期任务。',
    dayBackupTips:'超出持续时长后，正在备份的虚拟机继续备份，还未开始备份的虚拟机将在下一个备份周期优先进行备份',
    weekBackupTips:'超出持续时长后，正在备份的虚拟机继续备份，还未开始备份的虚拟机将在下一个备份周期优先进行备份',
    singleBackupTimeOut:'单台超时时间是指备份策略中单台云服务器的备份超时时间。超出超时时间后，云服务器认定为超时，执行备份策略中下一条云服务器备份'
}
