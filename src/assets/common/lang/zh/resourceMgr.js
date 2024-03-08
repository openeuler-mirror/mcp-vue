// 资源管理 resourceMgr
export default {
    // 物理集群
    allcluster: '全部集群', // 全部集群
    plccluster: '请选择集群', // 请选择集群
    clusterName: '集群名称', // 集群名称
    loginCluster: '登入集群后台', // 登入集群后台
    clusterNameplaceholder: '请输入集群名称', // 请输入集群名称
    clusterStatus: '集群状态', // 集群状态 
    clusterStatusObj: {
        ONLINE: '在线',// "在线",
        OFFLINE: '离线',// "离线",
        EXCEPTION: '异常',// "异常",
    },
    clusterRemark: '描述', // 描述
    clusterUrl: '集群URL', // 集群URL
    clusterUrlWranMsg: 'ip或端口号输入有误', // ip或端口号输入有误
    clusterUrlIpWranMsg: 'ip地址输入有误', // ip地址输入有误
    clusterUrlPortWranMsg: '端口号输入有误', // 端口号输入有误
    clusterUrlprotocol: '协议', // 协议
    clusterUrlprotNum: '端口号', // 端口号
    clusterUrlContent: '输入所有CM/CM_VDI节点的IP，格式http或https', // 输入所有CM/CM_VDI节点的IP，格式http或https
    clustertype: '集群类型', // 集群类型
    clustertypeplaceholder: '请选择集群类型', // 集群类型
    clustercpurate: 'CPU利用率', // CPU利用率
    clustermemoryrate: '内存利用率', // 内存利用率
    clusterstoragerate: '存储利用率', // 存储利用率
    toCluster: '登入', // 登入

    clusterAdd: '添加物理集群', // 添加物理集群
    clusterAddtSussess: '创建物理集群成功!', // 添加物理集群
    clusterEdit: '编辑物理集群', // 编辑物理集群
    clusterEditSussess: '编辑物理集群成功!', // 编辑物理集群

    clusterEdleteConfirm: '确定删除该物理集群吗?', // 确定删除该物理集群吗?
    clusterEdleteSuccess: '删除物理集群成功!', // 删除物理集群成功!
    clusterBaseInfo: '基本信息', // 基本信息
    clusterStorageInfo: '存储信息', // 存储信息
    clusterConfirmInfo: '确认信息', // 确认信息

    clusterAdminName: '用户名', // 用户名
    clusterAdmin: ' 集群管理员', // 用户名
    clusterAdminPassword: '密码', // 用户名
    clusterEditPassword: '修改密码', // 修改密码

    clusterStorage: '存储', // 存储
    clusterStorageName: '名称', // 名称
    storageName: '存储名称', // 存储名称
    storageType: '存储类型', // 存储类型
    storageStatus: '存储状态', // 存储状态
    storageUsage: '存储用途', // 存储用途
    storagetotalSize: '总容量', // 存储用途
    storageUsedSize: '可用容量', // 存储用途
    storageUserate: '利用率', // 存储用途
    clusterSummary: '概要', // 概要
    clusterPhysicalHost: '物理主机', // 物理主机
    clusterVersion: '集群版本', // 集群版本
    clusterCeateTime: '添加时间', // 添加时间
    cpuModelName: '名称', // 名称
    cpuModelstatus: '状态', // 状态
    cpuModelType: 'CPU类型', // CPU类型
    cpuModelserverArch: '服务器架构', // 服务器架构
    cpuModelserverType: '服务器类型', // 服务器类型
    cpuModelcpurate: 'CPU利用率', // CPU利用率
    cpuModelmemoryrate: '内存利用率', // 内存利用率

    zoneName: '可用区', // 可用区
    zoneNameDesc: '可用区名称', // 可用区名称
    zoneRemark: '描述', // 描述
    zoneType: '资源类型', // 资源类型
    zoneCPUallocationratio: 'CPU分配比', // CPU分配比
    zoneMemoryallocationratio: '内存分配比', // 内存分配比
    zoneStorageallocationratio: '存储分配比', // 存储分配比
    cpuTotal: 'CPU总容量', // CPU总容量
    memTotal: '内存总容量', // 内存总容量
    storageTotal: '存储总容量', // 存储总容量
    zoneAdd: '添加可用区', // 添加可用区
    zoneAddSuccess: '创建可用区成功!', // 创建可用区成功!
    zoneEdit: '编辑可用区', // 编辑可用区
    zoneEditSuccess: '编辑可用区成功!', // 编辑可用区成功!
    zoneDleteConfirm: '确定删除该可用区吗?', // 确定删除该可用区吗?
    zoneDleteSuccess: '删除可用区成功!', //删除可用区成功!

    zoneBaseInfo: '基本信息', // 基本信息
    zoneCluster: '关联集群', // 存储信息
    zoneConfirmInfo: '确认信息', // 确认信息
    zoneNoClusterTo: '没有合适的物理集群? 前往', // 没有合适的物理集群? 前往
    zoneClusterDesc: '物理集群', // 物理集群
    zoneSummary: '概要', // 概要
    zoneCreateTime: '添加时间', // 添加时间

    vdcName: '名称', // 名称
    vdcparentName: '上级 VDC', // 上级vdc
    vdcorgName: '组织机构', // 组织机构
    vdcnetworkNum: '网络', // 网络
    vdcCPUallocationratio: 'CPU分配比', // CPU分配比
    vdcmemoryallocationratio: '内存分配比', // 内存分配比
    vdcStorageallocationratio: '存储分配比', // 存储分配比
    vdcAdd: '创建VDC', // 创建虚拟数据中心
    vdcAddSuccess: '创建VDC成功！', // 创建虚拟数据中心成功！'
    vdcEdit: '编辑VDC', // 编辑虚拟数据中心
    vdcEditSuccess: '编辑VDC成功！', // 编辑虚拟数据中心成功！
    cdcDleteConfirm: '确定删除该VDC吗?', // 创建虚拟数据中心
    cdcDdleteSuccess: '删除该VDC成功!', // 创建虚拟数据中心
    vdcBaseInfo: '基本信息', // 基本信息
    vdcResouse: '分配资源', // 分配资源
    vdcConfirmInfo: '确认信息', // 确认信息
    vdcArchitecture: '架构', // 架构
    vdcUsable: '可用', // 可用
    vdcTotal: '总大小', // 总大小
    vdcAllocationChild: '已使用', // 总大小
    vdcClusterDesc: '物理集群', // 物理集群
    vdcNetWorkDesc: '名称', // 名称
    vdcallocationCpuEditMsg: '分配CPU数不能大于上级可用数，并且不能小于已使用数', // '分配CPU数不能大于上级可用数，并且不能小于已使用数'
    vdcallocationCpuAddMsg: '分配CPU数为大于1的正整数，且小于可用cpu数', // '分配CPU数不能大于上级可用数，并且不能小于已使用数'
    vdcallocationCpuMinMsg: '分配CPU数不能小于已使用数', // '分配CPU数不能小于已使用数'
    vdcallocationMemEditMsg: '分配内存数不能大于上级可用数，并且不能小于已使用数', // '分配内存不能大于上级可用数，并且不能小于已使用数'
    vdcallocationMemAddMsg: '分配内存数为大于1的正整数，且小于可用内存数', // '分配CPU数不能大于上级可用数，并且不能小于已使用数'
    vdcallocationMemMinMsg: '分配内存数不能小于已使用数', // '分配内存数不能小于已使用数'
    allocationStorageAddMsg: '分配存储数为大于1的正整数，且小于可用存储数', // 分配存储大小为大于1的正整数，且小于可用存储数
    allocationStorageEditMsg: '分配存储数不能大于上级可用数，并且不能小于已使用数', // 分配存储数不能大于上级可用数，并且不能小于已使用数
    allocationStorageMinMsg: '分配存储数不能小于已使用数', // '分配存储数不能小于已使用数'
    vdcNetWorkResouse: '网络资源信息', // 网络资源信息
    vdcSummary: '概要', // 概要
    vdccreateTime: '添加时间', // 添加时间
    vdc: {
        nomatchingVDC: '无匹配VDC，前往', // 无匹配VDC，前往 No matching VDC, go to
        bindVDC: '绑定VDC', // 绑定VDC，前往 bind VDC
    },
    vdcallocatedtooltip: '分配资源额度,其可超过资源总量', // 分配资源额度,其可超过资源总量
    vdcSupCanassigned: '上级可分配', // 上级可分配
    firstvdcSupCanassigned: '资源总量', // 资源总量
    vdcAllocateCPUused: '分配CPU数应大于已使用CPU数', // 分配CPU数应大于已使用CPU数
    vdcAllocateCPUequal: '分配CPU数为大于等于1的正整数', // 分配CPU数为大于等于1的正整数
    vdcAllocateMemused: '分配内存数应大于已使用内存数', // 分配内存数应大于已使用内存数
    vdcAllocateMemequal: '分配内存数为大于等于1的正整数', // 分配内存数为大于等于1的正整数
    vdcAllocateStorageused: '分配存储数应大于已使用存储数', // 分配存储数应大于已使用存储数
    vdcAllocateStorageequal: '分配存储大小为大于等于1的正整数', // 分配存储大小为大于等于1的正整数
    vdcauditOpinion: '变更原因', // 变更原因不能为空
    vdcauditOpinionEmpt: '变更原因不能为空', // 变更原因不能为空
    vdcauditOpinionspecialChar: '变更原因只能由中文、英文、数字组合', // 变更原因只能由中文、英文、数字组合
    vdcSubAssigned: '已分配下级', // 已分配下级
    vdcThislevelUsed: '本级已使用', // 本级已使用

    zonelist: '可用区列表',// 可用区列表
    zoneerror: '已过期',// 已过期
    zonewarn: '即将过期',// 即将过期

    start_servervm: '开机',// 开机
    shutdown_servervm: '关机',// 关机
    shutdownSucc: '关机成功!',// 关机成功!
    shutdownErr: '关机失败!',// 关机失败!

    restart_servervm: '重启',// 重启
    restartSucc: '重启成功!',// 重启成功!
    restartErr: '重启失败!',// 重启失败!
    servervmmore: '更多',// 更多
    batchAbort: '强制关机',// 强制关机
    batchForceReboot: '强制重启',// 强制重启
    batchDelete: '删除',// 删除
    deleteSucc: '删除成功!',// 删除成功!
    deleteErr: '删除失败!',// 删除失败!
    batchstartSucc: '批量开机成功!',// 批量开机成功!
    batchstartErr: '批量开机失败!',// 批量开机失败!
    batchcloseSucc: '批量关机成功!',// 批量关机成功!
    batchcloseErr: '批量关机失败!',// 批量关机失败!
    batchrebootSucc: '批量重启成功!',// 批量重启成功!
    batchrebootErr: '批量重启失败!',// 批量重启失败!
    batchDeleteSucc: '删除成功!',// 删除成功!
    batchDeleteErr: '删除失败!',// 删除失败!
    deleteconfirmMsg: '确定要删除所选云服务器？',// 确定要删除所选云服务器？
    deleteconfirmTit: '删除',// 删除
    abortconfirmMsg: '此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？',// 此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？
    abortconfirmTit: '强制关机',// 强制关机
    abortSucc: '强制关机成功!',// 强制关机成功!
    abortErr: '强制关机失败!',// 强制关机失败!

    forcedRestartconfirmMsg: '此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制重启？',// 此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？
    forcedRestartconfirmTit: '强制重启',// 强制关机
    forcedRestartSucc: '强制重启成功!',// 强制重启成功!
    forcedRestartErr: '强制重启失败!',// 强制重启失败!
    openVnc: '控制台',// 控制台
    systemImg: '系统',// 系统
    aliasName: '名称',// 名称
    zonestatus: '状态',// 状态
    zonetaskStatus: '任务状态',// 任务状态
    zoneorgName: '所属组织',// 所属组织
    zoneclusterName: '所属集群',// 所属集群
    zoneip: 'IP地址',// IP地址
    zoneos: '操作系统',// 操作系统
    architecture: '架构',// 架构
    zonecpu: 'CPU(核)',//  CPU(核)
    zonememory: '内存(GB)',//  内存(GB)
    zonedisks: '磁盘(GB)',//  磁盘(GB)
    zoneusage: '利用率',//  利用率
    zonecreateDate: '创建时间',//  创建时间
    zonedeadlineTime: '到期时间(天)',//  到期时间(天)
    zonedescription: '描述',//  描述
    zoneAVAILABLE: '在线',//  在线
    zoneOFFLINE: '离线',//  离线
    zoneINSTALLING: '安装',//  安装
    zoneCONNECTED: '已连接',//  已连接
    zoneSUSPEND: '暂停',//  暂停
    zoneOVERDUE: '已过期',//  已过期
    zoneUNKNOWN: '其他',//  其他
    startServerVm: '开机成功',//  开机成功
    startServerVmErr: '开机失败',//  开机失败
    zoneLEISURE: '空闲',//  空闲
    zoneNEW: '新建',//  新建
    zonetaskINSTALLING: '安装中',//  安装中
    zoneNEWFAILED: '新建失败',//  新建失败
    zoneINSTALLFAILED: '安装失败',//  安装失败
    zoneCREATING: '正在创建',//  正在创建
    zoneSTARTING: '正在开机',//  正在开机
    zoneSHUTDOWNING: '正在关机',//  正在关机
    zoneREBOOTING: '正在重启',//  正在重启
    zoneSUSPENDING: '正在暂停',//  正在暂停
    zoneRESUMING: '正在唤醒',//  正在唤醒
    zoneVOLUME_MIGRATING: '正在存储迁移',//  正在存储迁移
    zoneHOST_MIGRATING: '正在主机迁移',//  正在主机迁移
    zoneBACKUP_RUNNING: '正在备份',//  正在备份
    zoneBACKUP_RECOVERING: '正在备份恢复',//  正在备份恢复
    zoneSNAPSHOT_RUNNING: '正在快照',//  正在快照
    zoneSNAPSHOT_RECOVERING: '正在快照恢复',//  正在快照恢复
    zoneIMPORTING: '正在导入',//  正在导入
    zoneEXPORTING: '正在导出',//  正在导出
    zoneCLONING: '正在克隆',//  正在克隆
    zoneDISK_COPYING: '正在磁盘复制',//  正在磁盘复制
    zoneSNAPSHOT_RUNNING: '正在快照',//  正在快照
    zoneOther: '其他',//  其他
    type: '类型',//  类型
    userName: '所有者',//  所有者
    vncAddr: 'VNC地址',//  VNC地址
    operationHours: '开机时间',//  开机时间
    powerOnDate: '运行时间',//  运行时间
    selectCluster: '计算资源',//  计算资源
    runMachine: '运行主机',//  运行主机
    monitor: '监控',//  监控
    log: '任务',//  任务
    summary: {
        summary: '概要',//  概要
        type: '告警类型',//  告警类型
        date: '告警时间',//  告警时间
        severity: '告警等级',//  告警等级
        info: '告警详情',//  告警详情
        objectName: '告警对象',//  告警对象
    },
    network: {
        network: '网络',//  网络
        networkName: '网络名称',//  网络名称
        virtualSwitch: '虚拟交换机',//  虚拟交换机
        portGroup: '所属端口组',//  所属端口组
        macAddress: 'MAC地址',//  MAC地址
        ipAddress: 'IP地址',//  IP地址
        pool: '地址池',//  地址池
        uploadSpend: '下行带宽(KB/S)',//  下行带宽(KB/S)
        downloadSpend: '上行带宽(KB/S)',//  上行带宽(KB/S)
        setUp: '网络设置', //网络设置
        cluster: '物理集群', //物理集群
        selectcluster: '请选择物理集群', //请选择物理集群
        networkName: '网络名称', //网络名称
        networkNameplac: '请输入网络名称', //请输入网络名称
        networkNametooltip: '支持中文、英文、数字，限定2~18字数', //支持中文、英文、数字，限定2~18字数
        modelType: '网卡类型', //网卡类型
        networkCard: '网卡', //网卡
        modelTypeplac: '请选择网卡类型', //请选择网卡类型
        addressPool: '地址池', //地址池
        addressPoolplac: '请选择地址池', //请选择地址池
        virtualSwitch: '虚拟交换机', //虚拟交换机
        virtualSwitchplac: '请选择虚拟交换机', //请选择虚拟交换机
        portGroup: '端口组', //端口组
        portGroupplac: '请选择端口组', //请选择端口组
        permission: '安全组', //安全组
        permissionresouse: '安全组资源', //安全组资源
        effectivepermission: '生效安全组资源', //生效安全组资源
        networkNamelen: '名称长度应控制在 2 ~ 18 个字符', //名称长度应控制在 2 ~ 18 个字符
        securityPolicy: '安全策略', //安全策略
        virtualFirewallName: '虚拟防火墙', //虚拟防火墙
        virtualFirewallNamePlc: '请选择虚拟防护墙', //请选择虚拟防护墙
    },
    storage: {
        disk: '存储',//  存储
        diskName: '名称',//  名称
        device: '存储类型',//  存储类型
        targetBus: '存储控制器',//  存储控制器
        diskCapacity: '容量(G)',//  容量(G)
        sourceFile: '存储路径',//  存储路径
        raw: '块设备',//  块设备
        existed: '本地磁盘',//  本地磁盘
        qcow2: '本地磁盘',//  本地磁盘
    },
    task: {
        action: '操作',//  操作
        objName: '对象名称',//  对象名称
        operUser: '操作用户',//  操作用户
        startTime: '开始时间',//  开始时间
        finishTime: '结束时间',//  结束时间
        status: '状态',//  状态
        detail: '详情',//  详情
        reason: '原因',//  原因
    },
    bindTheVirtualFirewall: '绑定虚拟防火墙', // 绑定虚拟防火墙
    virtualFirewallName: '名称', // 名称
    virtualFirewallRemark: '说明', // 说明

    statuscell: {
        OVERDUE: '已过期', // 已过期
        AVAILABLE: '在线', // 在线
        CONNECTED: '已连接', // 已连接
        INSTALLING: '安装', // 安装
        SUSPEND: '暂停', // 暂停
        UNKNOWN: '其他', // 其他
        ONLINE: '在线', // 在线
        OFFLINE: '离线', // 离线
        HALT: '异常', // 异常
        EXCEPTION: '异常', // 异常
        NORMAL: '正常', // 正常
        WARNING: '警告', // 警告
        ERROR: '错误', // 错误
        POWERED_ON: '在线', // 在线
        POWERED_OFF: '关闭', // 关闭
    },

    // VMware纳管
    vMwareMgr: {
        name: '名称', // 名称
        namePlac: '名称不能为空', // 名称不能为空
        remark: '描述', // 描述
        vcenterIp: 'ip地址', // ip地址
        vcenterPort: '端口', // 端口
        vcenterAccount: '账号', // 账号
        vcenterAdminName: '用户名', // 用户名
        vcenterAdminNameNot: '用户名不能为空', // 用户名不能为空
        vcenterAdminNamePlac: '输入vCenter管理员用户名', // 输入vCenter管理员用户名
        vcenterAdminPassword: '密码', // 密码
        vcenterAdminPasswordNot: '密码不能为空', // 密码不能为空
        vcenterAdminPasswordPlac: '请输入密码', // 请输入密码
        addvMwareMgr: '添加VMware纳管', // 添加VMware纳管
        editvMwareMgr: '编辑VMware纳管', // 编辑VMware纳管
        type: '类型', // 类型
        typePlac: '类型不能为空', // 类型不能为空
        addSucc: '添加成功', // 添加成功
        editSucc: '编辑成功', // 编辑成功
        vmlist: '云服务器列表', // 云服务器列表
        powerStatus: '状态', // 状态
        memory: '内存', // 内存
    }
}