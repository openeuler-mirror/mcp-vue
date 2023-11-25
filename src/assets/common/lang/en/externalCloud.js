// externalCloud
export default {
    clusterEdleteConfirm: 'Are you sure you want to delete this physical cluster?', // 确定删除该物理集群吗?
    clusterEdleteSuccess: 'Delete physical cluster successfully!', // 删除物理集群成功!
    transVmTips1:'During the migration process, the cloud server still provides services to the public normally. In the final stage of migration, the system automatically shuts down the cloud server and synchronizes the incremental data generated during the migration process to complete the migration；',
    transVmTips2:'After the migration is completed, automatically start the cloud server on the target cluster',
    statuscell: {
        OVERDUE: 'expired', // 已过期
        AVAILABLE: 'online', // 在线
        CONNECTED: 'connected', // 已连接
        INSTALLING: 'Install', // 安装
        SUSPEND: 'pause', // 暂停
        UNKNOWN: 'other', // other
        ONLINE: 'online', // 在线
        OFFLINE: 'offline', // 离线
        HALT: 'abnormal', // 异常
        EXCEPTION: 'abnormal', // 异常
        NORMAL: 'normal', // 正常
        WARNING: 'warn', // 警告
        ERROR: 'mistake', // 错误
        POWERED_ON: 'online', // 在线
        POWERED_OFF: 'closure', // 关闭
        TASK_EXECUTION: 'task executtion',
        INIT: 'init',
    },
    vcenter: {
        name: 'name',
        remark: 'remark',
        status: 'status',
        versionNumber: 'version Number',
        clusterUrl: 'Cluster URL',
        useRate:'Utilization',
        clustercpurate: 'CPU utilization',
        clustermemoryrate: 'memory utilization', // 内存利用率
        clusterstoragerate: 'storage utilization', // 存储利用率
        addVcenter: 'add vcenter',
        versionNumber: 'version number',
        editVcenter: 'edit vCenter',
        nameLength: 'The value contains 2 to 32 characters',//
        loginFalse: 'The vcenter login account fails to be verified. Check whether the account password is correct',//
        nametooltip: 'The value can contain 2 to 32 characters, including digits, and letters',//The value can contain 2 to 32 characters, including digits, and letters
        type: 'type',
        storageTotalCapacity: 'Total capacity',
        storageCapacityUsedRate: 'Capacity utilization rate',
        clusterEditSussess: 'VCenter information is successfully edited',
        clusterAddtSussess: 'VCenter information is successfully added. Procedure',
        clusterSummary: 'Summary', // 概要
        clusterPhysicalHost: 'Physical Host', // 物理主机
        clusterVersion: 'Version', // 集群版本
        clusterCeateTime: 'Ceate Time', // 添加时间
        cpuModelName: 'name', // 名称
        cpuModelstatus: 'status', // 状态
        cpuModelType: 'CPU type', // CPU类型
        cpuModelserverArch: 'server Arch', // 服务器架构
        cpuModelserverType: 'server Type', // 服务器类型
        cpuModelcpurate: 'CPU rate', // CPU利用率
        cpuModelmemoryrate: 'memory rate', // 内存利用率
        vmNumber: 'host number',
        storageModelmemoryrate: 'storage rate', // 内存利用率
        cloudServer: 'cloud Server', // 存储
        domainName:'Domain Name',
        domainNameUrlWranMsg:'please input domain name Ip',
        clusterEditPassword:'please input edit password',
        enterPort:'Please enter the port number',
        enterProtocol:'Please select an address protocol type',
    },

    // VMware纳管
    vMwareMgr: {
        name: 'name', // 名称
        namePlac: 'Name is required', // 名称不能为空
        remark: 'describe', // 描述
        vcenterIp: 'ip address', // ip地址
        vcenterPort: 'port', // 端口
        vcenterAccount: 'account', // 账号
        vcenterAdminName: 'username', // 用户名
        vcenterAdminNameNot: 'Username can not be empty', // 用户名不能为空
        vcenterAdminNamePlac: 'Enter the vCenter administrator username', // 输入vCenter管理员用户名
        vcenterAdminPassword: 'password', // 密码
        vcenterAdminPasswordNot: 'password can not be blank', // 密码不能为空
        vcenterAdminPasswordPlac: 'Please enter password', // 请输入密码
        addvMwareMgr: 'Add VMware Managed', // 添加VMware纳管
        editvMwareMgr: 'Edit VMware Managed', // 编辑VMware纳管
        type: 'type', // 类型
        typePlac: 'Type cannot be null', // 类型不能为空
        addSucc: 'Added successfully', // 添加成功
        editSucc: 'Edited successfully', // 编辑成功
        vmlist: 'Cloud server list', // 云服务器列表
        powerStatus: 'state', // 状态
        memory: 'Memory', // 内存
    },
    network: {
        network: 'The internet',//  网络
        networkName: 'network name',//  网络名称
        virtualSwitch: 'virtual switch',//  虚拟交换机
        portGroup: 'Port group to which it belongs',//  所属端口组
        macAddress: 'MAC address',//  MAC地址
        ipAddress: 'IP address',//  IP地址
        pool: 'address pool',//  地址池
        uploadSpend: 'Downlink bandwidth(KB/S)',//  下行带宽(KB/S)
        downloadSpend: 'Upstream bandwidth(KB/S)',//  上行带宽(KB/S)
        setUp: 'network settings', //网络设置
        cluster: 'physical cluster', //物理集群
        selectcluster: 'Please select a physical cluster', //请选择物理集群
        networkName: 'network name', //网络名称
        networkNameplac: 'Please enter a network name', //请输入网络名称
        networkNametooltip: 'Support Chinese, English, numbers, limited to 2~18 characters', //支持中文、英文、数字，限定2~18字数
        modelType: 'NIC type', //网卡类型
        networkCard: 'NIC', //网卡
        modelTypeplac: 'Please select the network card type', //请选择网卡类型
        addressPool: 'address pool', //地址池
        addressPoolplac: 'Please select an address pool', //请选择地址池
        virtualSwitch: 'virtual switch', //虚拟交换机
        virtualSwitchplac: 'Please select a virtual switch', //请选择虚拟交换机
        portGroup: 'port group', //端口组
        portGroupplac: 'Please select a port group', //请选择端口组
        permission: 'security group', //安全组
        permissionresouse: 'Security Group Resources', //安全组资源
        effectivepermission: 'Effective security group', //生效安全组资源
        networkNamelen: 'Name length should be controlled between 2 ~ 18 characters', //名称长度应控制在 2 ~ 18 个字符
        securityPolicy: 'security strategy', //安全策略
        virtualFirewallName: 'virtual firewall', //虚拟防火墙
        virtualFirewallNamePlc: 'Please select a virtual wall', //请选择虚拟防护墙
    },
    disk: {
        provisionMode: 'Provision mode',//Provision mode
        provisioningDeferredZeroing: 'Thick provisioning deferred zeroing',//Thick provisioning deferred zeroing
        setForQuickZeroing: 'set for quick zeroing',//set for quick zeroing
        sourceFile: 'source File',
        leanProvisioning: 'Lean provisioning'//Lean provisioning
    },
    task: {
        type: 'type',
        operation: 'operation',
        objectName: 'object Name',
        operationUser: 'operation User',
        startTime: 'start Time',
        finishTime: 'finish Time',
        status: 'status',
        detail: 'detail',
        reason: 'reason',
    },
    vmList: {
        shutdown: 'shutdown',
        wakeUp: 'wakeUp',
        pause: 'pause',
        restart: 'restart',
        powerOff: 'power Off',
        clone: 'clone',
        edit: 'edit',
        migration: 'migration',
        migrationMc:'migration to MC',
        delete: 'delete',
        create: 'Create ',
        cancelled: 'Cancelled ',
        turnOn: 'Turn on ',
        cancel: "Cancel ",
        shutDown: 'Shut down ',
        reboot: 'Reboot ',
        ipAddress: 'ip address ',
        cpuCore: "cpu (core) ",
        memorySize: "Memory (GB) ",
        storageSize: "Storage (GB) ",
        hasOpenVmTips: 'There is a VM in power-on state in the selected VM, please check ',
        hasCloseVmTips: "The selected VMS have VMS in shutdown state, please check ",
        opensuccess: "Successfully issued the startup task. Please view it in the task console ",
        closesuccess: "Successfully issued the Power off. Please view it in the task console ",
        sureclose: "Confirm power off ",
        delsuccess: "Delete successfully ",
        wakeupsuccess: "Successfully issued the Wake up success. Please view it in the task console ",
        pausesuccess: "Pause success ",
        poweroffsuccess: "Successfully issued the  Power off success. Please view it in the task console ",
        rebootsuccess: "Successful reboot ",
        sureShutUpTips: " This action will shut down this cloud server. Do you want to continue?",
        sureWeakUpTips: " This operation will wake up the cloud server, Do you want to continue?",
        sureDelTips: " This action will delete this cloud server, do you want to continue?",
        sureBatchRebootTips: " This operation will restart cloud servers in bulk. Do you want to continue?",
        surePauseTips: " This action will pause this cloud server. Do you want to continue?",
        sureRebootTips: " This operation will restart the cloud server. Do you want to continue?",
        sureCloseTips: " This operation will power down the cloud server. Do you want to continue?",
        sureBatchDelTips: " This action will remove this cloud server in bulk, do you want to continue?",
        sureWeakeUp: " Confirm wake up ",
        surePause: "Confirm pause",
        sureReboot: " Confirm restart ",
        surePowerOff: " Confirm power off ",
        powerOff: "power off",
        sureDel: "Confirm delete",
        batchReboot: "Batch restart",
        batchDel: " Batch delete ",
    },
    vmOperate: {
        createVm: ' Create Cloud Server ',
        physicalCluster: 'physical cluster',
        name: 'Name',
        description: 'Description',
        runningPosition: 'Running position',
        storageLocation: 'Storage location',
        choose: 'choose',
        MirrorFir: " mirror file ",
        core: 'core',
        custom: 'custom',
        memory: 'memory',
        diskCnatNull: "The disk must not be empty",
        disk: ' Disk ',
        netCardCantNull: ' Network card must not be empty ',
        netCard: 'net card',
        addntCard: " Add NIC ",
        basicInfo: 'Basic information',
        os: " operating system ",
        configInfo: " Configuration information ",
        disk: " disk ",
        network: 'network',
        networkName: ' Network name ',
        ntAdapter: ' network adapter ',
        cpuCore: " Number of CPU cores ",
        memSize: " memory size ",
        createSuccess: " The VM is created successfully, please view the progress on the task console ",
        chooseRunWayTips: " Please select a virtual machine run location first ",
        cantMoreDisk: 'The number of disks has reached the upper limit',
        cantMoreNt: "The number of network card has reached the upper limit",
        chooseLocation: "Choose where to store it ",
        sure: "Be sure",
        host:'host',
        cancel: "Cancel",
        mirName: "Mirror name",
        opType: "Operation type",
        osType: "Mirror type",
        osSize: "Mirror size",
        chooseMirFile: "Choose Mirror File",
        editVm: 'Edit Cloud server ',
        cantChangeOnlineCpu: 'The CPU size of an online VM cannot be modified ',
        cantChangeOnlineMem: 'The memory size of an online virtual machine cannot be modified ',
        cantDelOnlineDisk: ' Cannot delete an added disk from an online VM',
        diskCantNull: 'Disk must not be empty ',
        willDelDisk: 'This disk will be deleted ',
        delThisDisk: 'Delete this disk ',
        cancelThisDisk: 'cancel delete disk ',
        diskCantNull: 'Disk must not be empty ',
        addNewDisk: 'Add a new disk',
        delNetCard: 'This network card will be deleted ',
        recoverNetCard: 'undo to delete a network card',
        cpuCantNull: 'cpu cannot be empty ',
        memCantNull: 'Memory cannot be empty ',
        cantChangeLessBefor: 'The disk size after modification must not be smaller than the original disk size ',
        editSuccessTips: 'Edit and modify task submitted successfully, please view specific information in the task desk',
        cloneVm: 'Clone Cloud Server ',
        chooseHost: 'Select host ',
        cluster: 'cluster',
        cloneSuccess: 'Clone task submitted successfully, please check the specific information in the task console ',
        chooseHostTips: 'Please select the host first',
        autoPlace:'Automatic placement',
        computingRes:'Computing resource',
        automatic:'automatic',
        customize:'customize',
        bindRes:'Bind resources',
        modeMig:'Mode of migration',
        shutDownTips:'After the migration, the vCenter cloud server is automatically shut down',
        stopTips:'After the migration is complete, the original VM is automatically stopped',
        startMoving:'Start after moving in',
        addNicTips:'If no NIC is added, add nics as required',
        nic:'Network card',
        phyTips:'The physical cluster cannot be empty',
        storageTips:'The storage location cannot be empty',
        nicTips:'The NIC specifications cannot be empty',
        offlineMig:'The offline migration is submitted successfully. Check the progress on the task console',
    }
}
