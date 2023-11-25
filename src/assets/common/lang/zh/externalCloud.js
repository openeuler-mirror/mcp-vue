// 外部云
export default {
    clusterEdleteConfirm: '确定删除该物理集群吗?', // 确定删除该物理集群吗?
    clusterEdleteSuccess: '删除物理集群成功!', // 删除物理集群成功!
    transVmTips1:'在迁移的过程中云服务器仍然正常对外提供服务，在迁移最后阶段系统自动将云服务器关机，并同步迁移过程中产生的增量数据完成迁移；',
    transVmTips2:'迁移完成后，在目标集群自动启动云服务器',
    overCpuMaxRes:'超出Vcenter可用最大资源,最大允许Cpu核数为{maxCpuCore}核',
    overDiskMaxRes:'磁盘总大小大于超出Vcenter可用最大资源,最大允许磁盘大小为{max}GB',
    overMemMaxRes:'超出Vcenter可用最大资源,最大允许内存大小为{max}GB',
    nameExiseted:'该名称已存在',
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
        TASK_EXECUTION: '执行中',
        INIT: '初始化中',
    },
    vcenter: {
        name: '名称',
        status: '状态',
        remark: '描述',
        clusterUrl: '集群URL',
        clustercpurate: 'CPU利用率',
        clustermemoryrate: '内存利用率',
        useRate:'使用率',
        clusterstoragerate: '存储利用率',
        addVcenter: '添加vCenter',
        versionNumber: '版本号',
        editVcenter: '编辑vCenter',
        nameLength: '长度应控制在 2 ~ 32 个字符',//The value contains 2 to 32 characters
        loginFalse: 'vcenter登录账号校验失败，请检查账号密码是否正确',//The vcenter login account fails to be verified. Check whether the account password is correct
        nametooltip: '支持中文、数字、字母进行组合，字符长度为2 ~ 32位',//The value can contain 2 to 32 characters, including digits, and letters
        type: '类型',
        storageTotalCapacity: '总容量',
        storageCapacityUsedRate: '容量利用率',
        clusterEditSussess: 'VCenter信息编辑成功',
        clusterAddtSussess: 'VCenter信息添加成功',
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
        vmNumber: '云服务器数量',
        storageModelmemoryrate: '存储利用率', // 内存利用率
        cloudServer: '云服务器',
        clusterStorage: '存储', // 存储
        domainName:'域名',
        domainNameUrlWranMsg:'请输入域名Ip',
        clusterEditPassword:'请输入密码',
        enterPort:'请输入端口号',
        enterProtocol:'请选择地址协议类型',
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
    },
    network: {
        networkName: '网络设备名称',//  网络设备名称
        modelType: '网卡型号', //网卡类型
        network: '网络',//  网络
        macAddress: 'MAC地址',//  MAC地址
        ipAddress: 'IP地址',//  IP地址
    },
    disk: {
        provisionMode: '置备方式',//Provision mode
        provisioningDeferredZeroing: '厚置备延迟置零',//Thick provisioning deferred zeroing
        setForQuickZeroing: '厚置备快速置零',//set for quick zeroing
        sourceFile: '磁盘文件',
        leanProvisioning: '精简置备'//Lean provisioning
    },
    task: {
        type: '类型',
        operation: '操作',
        objectName: '对象名称',
        operationUser: '操作用户',
        startTime: '开始时间',
        finishTime: '结束时间',
        status: '状态',
        detail: '详情',
        reason: '原因',
    },
    vmList: {
        shutdown: '关机',
        wakeUp: '唤醒',
        pause: '暂停',
        restart: '重启电源',
        powerOff: '关闭电源',
        clone: '克隆',
        edit: '编辑',
        migration: '迁移',
        delete: '删除',
        migrationMc:'迁入MC',
        create: '创建',
        cancelled: '已取消',
        turnOn: '开机',
        cancel: "取消",
        shutDown: '关机',
        reboot: '重启',
        ipAddress: 'ip地址',
        cpuCore: "cpu（核）",
        memorySize: "内存（GB）",
        storageSize: "存储（GB）",
        hasOpenVmTips: '已选中虚拟机中存在非关机状态虚拟机，请查验',
        hasCloseVmTips: "已选中虚拟机中存在非开机状态虚拟机，请查验",
        opensuccess: "开机任务下发成功，请在任务控制台查看",
        closesuccess: "关机任务下发成功，请在任务控制台查看",
        sureclose: "确认关机",
        delsuccess: "删除成功",
        wakeupsuccess: "唤醒任务下发成功，请在任务控制台查看",
        pausesuccess: "暂停成功",
        poweroffsuccess: "关闭电源任务下发成功，请在任务控制台查看",
        rebootsuccess: "重启成功",

        sureShutUpTips: "该操作将关机该云服务器，是否继续？",
        sureWeakUpTips: "该操作将唤醒该云服务器，是否继续？",
        sureDelTips: "该操作将删除该云服务器，是否继续？",
        sureBatchRebootTips: "该操作将批量重启云服务器，是否继续？",
        surePauseTips: "该操作将暂停该云服务器，是否继续？",
        sureRebootTips: "该操作将重启该云服务器，是否继续？",
        sureCloseTips: "该操作将关闭该云服务器电源，是否继续？",
        sureBatchDelTips: "该操作将批量删除该云服务器，是否继续？",
        sureWeakeUp: "确认唤醒",
        surePause: "确认暂停",
        sureReboot: "确认重启",
        surePowerOff: "确认关闭电源",
        powerOff: "关闭电源",
        sureDel: "确认删除",
        batchReboot: "批量重启",
        batchDel: "批量删除",
    },
    vmOperate: {
        createVm: '创建云服务器',
        physicalCluster: "物理集群",
        name: "名称",
        description: "描述",
        runningPosition: "运行位置",
        storageLocation: "存储位置",
        choose: "选择",
        MirrorFir: "镜像文件",
        core: "核",
        custom: "自定义",
        memory: "内存",
        diskCnatNull: '磁盘不得为空',
        disk: '磁盘',
        netCardCantNull: '网卡不得为空',
        netCard: '网卡',
        addntCard: "添加网卡",
        basicInfo: "基本信息",
        os: "操作系统",
        configInfo: "配置信息",
        network: '网络',
        networkName: '网络名称',
        ntAdapter: '网络适配器',
        cpuCore: "CPU核数",
        memSize: "内存大小",
        createSuccess: "虚拟机创建成功，请在任务台中查看进度",
        chooseRunWayTips: "请先选择虚拟机运行位置",
        cantMoreDisk: "磁盘数目已达上限",
        cantMoreNt: "网卡数目已达上限",
        chooseLocation: "选择存储位置",
        chooseMirFile: "选择镜像文件",
        sure: "确 定",
        cancel: "取 消",
        mirName: "镜像名称",
        opType: "操作类型",
        osType: "镜像类型",
        osSize: "镜像大小",
        host:'主机',
        editVm: '编辑云服务器',
        cantChangeOnlineCpu: '在线虚拟机无法修改CPU大小',
        cantChangeOnlineMem: '在线虚拟机无法修改内存大小',
        cantDelOnlineDisk: '在线虚拟机无法删除已添加磁盘',
        diskCantNull: '磁盘不得为空',
        willDelDisk: '该磁盘将删除',
        delThisDisk: '删除该磁盘',
        cancelThisDisk: '撤销删除磁盘',
        diskCantNull: '磁盘不得为空',
        addNewDisk: '新增磁盘',
        delNetCard: '该网卡将删除',
        recoverNetCard: '撤销删除网卡',
        cpuCantNull: 'cpu不能为空',
        memCantNull: '内存不能为空',
        cantChangeLessBefor: '修改后磁盘大小不得小于原磁盘大小',
        editSuccessTips: '编辑修改任务提交成功，请在任务台中查看具体信息',
        cloneVm: '克隆云服务器',
        chooseHost: '选择主机',
        cluster: '集群',
        cloneSuccess: '克隆任务提交成功，请在任务台中查看具体信息',
        chooseHostTips: '请先选择主机',
        
        autoPlace:'自动安置',
        computingRes:'计算资源',
        automatic:'自动',
        customize:'自定义',
        bindRes:'绑定资源',
        modeMig:'迁移方式',
        shutDownTips:'迁移完成后，自动关闭vCenter云服务器',
        stopTips:'迁移完成后，自动关闭原虚拟机',
        startMoving:'迁入后启动',
        addNicTips:'未添加网卡，请按需添加网卡',
        nic:'网卡',
        phyTips:'物理集群不得为空',
        storageTips:'存储位置不得为空',
        nicTips:'网卡规格不得为空',
        offlineMig:'离线迁移提交成功，请在任务台中查看具体进度',
    }

}