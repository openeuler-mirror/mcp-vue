// 资源管理 resourceMgr
export default {
  // 物理集群
  allcluster: "All clusters", // 全部集群
  plccluster: "Please select a cluster", // 请选择集群
  clusterName: "cluster name", // 集群名称
  loginCluster: "Log in to the cluster background", // 登入集群后台
  loginVcenter: "Log in to vCenter", // 登入Vcenter
  clusterNameplaceholder: "Please enter a cluster name", // 请输入集群名称
  clusterStatus: "cluster status", // 集群状态
  BMC_IPaddress: "BMC IP Address",
  clusterStatusObj: {
    ONLINE: "online", // "在线",
    OFFLINE: "offline", // "离线",
    EXCEPTION: "abnormal", // "异常",
  },
  clusterRemark: "describe", // 描述
  zoneName: "Availability Zone", // 可用区
  clusterUrl: "Cluster URL", // 集群URL
  clusterUrlWranMsg: "ip or port number entered incorrectly", // ip或端口号输入有误
  clusterUrlIpWranMsg: "wrong ip address", // ip地址输入有误
  clusterUrlPortWranMsg: "Port number entered incorrectly", // 端口号输入有误
  clusterUrlprotocol: "protocol", // 协议
  clusterUrlprotNum: "The port number", // 端口号
  clusterUrlContent:
    "Enter the IP of all CM/CM_VDI nodes in http or https format", // 输入所有CM/CM_VDI节点的IP，格式http或https
  clustertype: "Cluster type", // 集群类型
  clustertypeplaceholder: "Please select a cluster type", // 集群类型
  clustercpurate: "CPU utilization", // CPU利用率
  clustermemoryrate: "memory utilization", // 内存利用率
  clusterstoragerate: "storage utilization", // 存储利用率
  toCluster: "login", // 登入

  clusterAdd: "Add a physical cluster", // 添加物理集群
  clusterAddtSussess: "Created physical cluster successfully!", // 添加物理集群
  clusterEdit: "Edit physical clusters", // 编辑物理集群
  clusterEditSussess: "Editing physical cluster succeeded!", // 编辑物理集群

  clusterEdleteConfirm:
    "Are you sure you want to delete this physical cluster?", // 确定删除该物理集群吗?
  clusterEdleteSuccess: "Delete physical cluster successfully!", // 删除物理集群成功!
  clusterBaseInfo: "Basic Information", // 基本信息
  clusterStorageInfo: "store information", // 存储信息
  clusterSettingInfo: "setting information", // 存储信息
  clusterConfirmInfo: "Confirm information", // 确认信息

  clusterAdminName: "username", // 用户名
  clusterAdmin: "cluster administrator", // 集群管理员
  clusterAdminPasswordplac: "Please enter the cluster administrator password", // 请输入集群管理员密码
  clusterAdminPassword: "password", // 密码
  clusterEditPassword: "change Password", // 修改密码
  rootPassword: "root password", // root密码
  rootPasswordplac: "Please enter root password", // 请输入root密码

  clusterStorage: "storage", // 存储
  clusterStorageName: "name", // 名称
  storageName: "storage name", // 存储名称
  storageType: "storage type", // 存储类型
  storageStatus: "storage state", // 存储状态
  storageUsage: "storage use", // 存储用途
  storagetotalSize: "total capacity", // 存储用途
  storageUsedSize: "Available capacity", // 存储用途
  storageUserate: "Utilization", // 存储用途
  clusterSummary: "summary", // 概要
  clusterPhysicalHost: "physical host", // 物理主机
  clusterVersion: "Cluster version", // 集群版本
  clusterCeateTime: "add time", // 添加时间
  cpuModelName: "name", // 名称
  cpuModelstatus: "state", // 状态
  cpuModelType: "CPU type", // CPU类型
  cpuModelserverArch: "server architecture", // 服务器架构
  cpuModelserverType: "server type", // 服务器类型
  cpuModelcpurate: "CPU utilization", // CPU利用率
  cpuModelmemoryrate: "memory utilization", // 内存利用率

  zoneNameDesc: "Availability Zone Name", // 可用区名称
  zoneRemark: "describe", // 描述
  zoneType: "Resource Type", // 资源类型
  zoneCPUallocationratio: "CPU allocation ratio", // CPU分配比
  zoneMemoryallocationratio: "memory allocation ratio", // 内存分配比
  zoneStorageallocationratio: "storage allocation ratio", // 存储分配比
  cpuTotal: "Total CPU capacity", // CPU总容量
  memTotal: "total memory capacity", // 内存总容量
  storageTotal: "total storage capacity", // 存储总容量
  zoneAdd: "Add Availability Zone", // 添加可用区
  zoneAddSuccess: "Created Availability Zone Successfully!", // 创建可用区成功!
  zoneEdit: "Edit Availability Zone", // 编辑可用区
  zoneEditSuccess: "Edit Availability Zone Successfully!", // 编辑可用区成功!
  zoneDleteConfirm: "Are you sure you want to delete this Availability Zone??", // 确定删除该可用区吗?
  zoneDleteSuccess: "Deleted Availability Zone Successfully!", //删除可用区成功!

  zoneBaseInfo: "Basic Information", // 基本信息
  zoneCluster: "Associated clusters", // 存储信息
  zoneConfirmInfo: "Confirm information", // 确认信息
  zoneNoClusterTo: "Don't have a suitable physical cluster? Go to", // 没有合适的物理集群? 前往
  zoneClusterDesc: "physical cluster", // 物理集群
  zoneSummary: "summary", // 概要
  zoneCreateTime: "add time", // 添加时间

  vdcName: "name", // 名称
  vdcparentName: "superior vdc", // 上级vdc
  vdcorgName: "organization", // 组织机构
  vdcnetworkNum: "The internet", // 网络
  vdcCPUallocationratio: "CPU allocation ratio", // CPU分配比
  vdcmemoryallocationratio: "memory allocation ratio", // 内存分配比
  vdcStorageallocationratio: "storage allocation ratio", // 存储分配比
  vdcAdd: "Create VDC", // 创建虚拟数据中心
  vdcAddSuccess: "Create virtual data center successfully!", // 创建虚拟数据中心成功！'
  vdcEdit: "Edit VDC", // 编辑虚拟数据中心
  vdcEditSuccess: "Edit VDC success!", // 编辑虚拟数据中心成功！
  cdcDleteConfirm: "Are you sure you want to delete this VDC?", // 创建虚拟数据中心
  cdcDdleteSuccess: "Deleting this VDC succeeded!", // 删除该VDC成功!
  vdcBaseInfo: "Basic Information", // 基本信息
  vdcResouse: "resource allocation", // 分配资源
  vdcConfirmInfo: "Confirm information", // 确认信息
  vdcArchitecture: "Architecture", // 架构
  vdcUsable: "available", // 可用
  vdcTotal: "total size", // 总大小
  vdcAllocationChild: "Subordinates assigned", // 总大小
  vdcClusterDesc: "physical cluster", // 物理集群
  vdcNetWorkDesc: "name", // 名称
  vdcallocationCpuEditMsg:
    "The number of allocated CPUs cannot be greater than the number of available upper levels, and cannot be less than the number of allocated lower levels", // '分配CPU数不能大于上级可用数，并且不能小于已使用数'
  vdcallocationCpuAddMsg:
    "The number of allocated CPUs is a positive integer greater than 1 and less than the number of available CPUs", // '分配CPU数不能大于上级可用数，并且不能小于已使用数'
  vdcallocationCpuMinMsg:
    "The number of allocated CPUs cannot be less than the number of used CPUs", // '分配CPU数不能小于已使用数'
  vdcallocationMemEditMsg:
    "The number of allocated memory cannot be greater than the number of available upper levels, and cannot be less than the number of allocated lower levels", // '分配内存不能大于上级可用数，并且不能小于已使用数'
  vdcallocationMemAddMsg:
    "The number of allocated memory is a positive integer greater than 1 and less than the number of available memory", // '分配CPU数不能大于上级可用数，并且不能小于已使用数'
  vdcallocationMemMinMsg:
    "The number of allocated memory cannot be less than the number of used memory", // '分配内存数不能小于已使用数'
  allocationStorageAddMsg:
    "The allocated storage size is a positive integer greater than 1 and less than the amount of available storage", // 分配存储大小为大于1的正整数，且小于可用存储数
  allocationStorageEditMsg:
    "The number of allocated storage cannot be greater than the number of available upper levels, and cannot be less than the number of allocated lower levels", // 分配存储数不能大于上级可用数，并且不能小于已使用数
  allocationStorageMinMsg:
    "The number of allocated storage cannot be less than the number of used", // '分配存储数不能小于已使用数'
  vdcNetWorkResouse: " Network resource information", // 网络资源信息
  vdcSummary: "summary", // 概要
  vdccreateTime: "add time", // 添加时间
  vdc: {
    nomatchingVDC: "No matching VDC, go to", // 无匹配VDC，前往 No matching VDC, go to
    bindVDC: "bind VDC", // 绑定VDC，前往 bind VDC
  },
  vdcallocatedtooltip:
    "Allocate resource quotas, which can exceed the total amount of resources", // 分配资源额度,其可超过资源总量
  vdcSupCanassigned: "Can be assigned by superiors", // 上级可分配
  firstvdcSupCanassigned: "total resources", // 资源总量
  vdcAllocateCPUused:
    "The number of allocated CPUs should be greater than the number of used CPUs", // 分配CPU数应大于已使用CPU数
  vdcAllocateCPUequal:
    "The number of allocated CPUs is a positive integer greater than or equal to 1", // 分配CPU数为大于等于1的正整数
  vdcAllocateMemused:
    "The amount of allocated memory should be greater than the amount of used memory", // 分配内存数应大于已使用内存数
  vdcAllocateMemequal:
    "The number of allocated memory is a positive integer greater than or equal to 1", // 分配内存数为大于等于1的正整数
  vdcAllocateStorageused:
    "Allocated storage should be greater than used storage", // 分配存储数应大于已使用存储数
  vdcAllocateStorageequal:
    "Allocate storage size as a positive integer greater than or equal to 1", // 分配存储大小为大于等于1的正整数
  vdcauditOpinion: "Reason for change", // 变更原因不能为空
  vdcauditOpinionEmpt: "Change reason cannot be empty", // 变更原因不能为空
  vdcauditOpinionspecialChar:
    "The reason for change can only be a combination of Chinese, English and numbers", // 变更原因只能由中文、英文、数字组合
  vdcSubAssigned: "Subordinates assigned", // 已分配下级
  vdcThislevelUsed: "This level has been used", // 本级已使用
  surePowerOffTips: 'Confirm to shut down "{name}"？',
  zonelist: "Availability Zone List", // 可用区列表
  zoneerror: "expired", // 已过期
  zonewarn: "Expiring soon", // 即将过期
  rootPasswordCantNull: "The root password cannot be empty",
  bmcIpCantNull: "BMC IP cannot be empty",
  bmcAccountCantNull: "BMC account cannot be empty",
  start_servervm: "boot", // 开机
  shutdown_servervm: "shutdown", // 关机
  shutdownSucc: "Shut down successfully!", // 关机成功!
  shutdownErr: "Shutdown failed!", // 关机失败!
  hostIpCantNull: "Host management IP must not be empty",
  deleteSuccess: "Delete Success",
  shutdownTips: "Confirm to shut down the bare metal server '{name}'?",
  shutdownManyTips:
    "Confirm to shut down the choosen bare metal server '{name}'?",
  restart_servervm: "reboot", // 重启
  restartSucc: "restarted successfully!", // 重启成功!
  restartErr: "restart failed!", // 重启失败!
  servervmmore: "More", // 更多
  batchAbort: "Force shutdown", // 强制关机
  batchForceReboot: "Force restart", // 强制重启
  batchDelete: "delete", // 删除
  deleteSucc: "successfully deleted!", // 删除成功!
  deleteErr: "failed to delete!", // 删除失败!
  batchstartSucc: "Batch boot successfully!", // 批量开机成功!
  batchstartErr: "Batch boot failed!", // 批量开机失败!
  batchcloseSucc: "Batch shutdown succeeded!", // 批量关机成功!
  batchcloseErr: "Batch shutdown failed!", // 批量关机失败!
  batchrebootSucc: "Batch restart succeeded!", // 批量重启成功!
  batchrebootErr: "Batch restart failed!", // 批量重启失败!
  batchDeleteSucc: "successfully deleted!", // 删除成功!
  batchDeleteErr: "failed to delete!", // 删除失败!
  deleteconfirmMsg:
    "Are you sure you want to delete the selected cloud server?", // 确定要删除所选云服务器？
  deleteconfirmTit: "delete", // 删除
  abortconfirmMsg:
    "This operation may result in the loss of unsaved data in the cloud server. Do you want to confirm the forced shutdown?", // 此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？
  abortconfirmTit: "Force shutdown", // 强制关机
  abortSucc: "Forced shutdown succeeded!", // 强制关机成功!
  abortErr: "Forced shutdown failed!", // 强制关机失败!
  addBareMetal: "Add Bare Metal Server",
  editBareMetal: "edit Bare Metal Server",
  BMCAccount: "BMC account",
  nameCantNull: "Name cannot be empty",
  forcedRestartconfirmMsg:
    "This operation may result in the loss of unsaved data in the cloud server. Are you sure you want to force a restart?", // 此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？
  forcedRestartconfirmTit: "Force restart", // 强制关机
  forcedRestartSucc: "Force restart succeeded!", // 强制重启成功!
  forcedRestartErr: "Force restart failed!", // 强制重启失败!
  openVnc: "console", // 控制台
  systemImg: "system", // 系统
  aliasName: "name", // 名称
  zonestatus: "condition", // 状态
  zonetaskStatus: "task status", // 任务状态
  zoneorgName: "Organization", // 所属组织
  zoneuserName: "owning user", // 所属用户
  zoneclusterName: "owning cluster", // 所属集群
  zoneip: "IP address", // IP地址
  zoneos: "operating system", // 操作系统
  architecture: "Architecture", // 操作系统
  zonecpu: "CPU(core)", //  CPU(核)
  zonememory: "Memory(GB)", //  内存(GB)
  zonedisks: "Disk(GB)", //  磁盘(GB)
  zoneusage: "Utilization", //  利用率
  zonecreateDate: "creation time", //  创建时间
  zonedeadlineTime: "Expiration time (days)", //  到期时间(天)
  zonedescription: "describe", //  描述
  zoneAVAILABLE: "online", //  在线
  zoneOFFLINE: "offline", //  离线
  zoneINSTALLING: "Install", //  安装
  zoneCONNECTED: "connected", //  已连接
  zoneSUSPEND: "pause", //  暂停
  zoneOVERDUE: "expired", //  已过期
  zoneUNKNOWN: "other", //  其他
  startServerVm: "boot successfully", //  开机成功
  startServerVmErr: "Failed to boot", //  开机失败
  zoneLEISURE: "idle", //  空闲
  zoneNEW: "new", //  新建
  zonetaskINSTALLING: "installing", //  安装中
  zoneNEWFAILED: "New failed", //  新建失败
  zoneINSTALLFAILED: "installation failed", //  安装失败
  zoneCREATING: "creating", //  正在创建
  zoneSTARTING: "booting", //  正在开机
  zoneSHUTDOWNING: "shutting down", //  正在关机
  zoneREBOOTING: "restarting", //  正在重启
  zoneSUSPENDING: "Pausing", //  正在暂停
  zoneRESUMING: "waking up", //  正在唤醒
  zoneVOLUME_MIGRATING: "Storage migration in progress", //  正在存储迁移
  zoneHOST_MIGRATING: "Host migration in progress", //  正在主机迁移
  zoneBACKUP_RUNNING: "backing up", //  正在备份
  zoneBACKUP_RECOVERING: "Backup and restore", //  正在备份恢复
  zoneSNAPSHOT_RUNNING: "taking a snapshot", //  正在快照
  zoneSNAPSHOT_RECOVERING: "Snapshot restore in progress", //  正在快照恢复
  zoneIMPORTING: "importing", //  正在导入
  zoneEXPORTING: "exporting", //  正在导出
  zoneCLONING: "cloning", //  正在克隆
  zoneDISK_COPYING: "disk copying", //  正在磁盘复制
  zoneCREATE_KCP_IMAGE: "Template mirroring in progress", //  正在制作模板镜像
  zoneSNAPSHOT_RUNNING: "taking a snapshot", //  正在快照
  zoneOther: "other", //  其他
  type: "type", //  类型
  userName: "owner", //  所有者
  vncAddr: "VNC address", //  VNC地址
  operationHours: "boot time", //  开机时间
  powerOnDate: "operation hours", //  运行时间
  selectCluster: "computing resources", //  计算资源
  runMachine: "run host", //  运行主机
  monitor: "monitor", //  监控
  log: "Task", //  任务
  summary: {
    summary: "summary", //  概要
    type: "Alert Type", //  告警类型
    date: "Alarm time", //  告警时间
    severity: "Alarm level", //  告警等级
    info: "Alarm info", //  告警详情
    objectName: "Alert object", //  告警对象
  },
  network: {
    network: "The internet", //  网络
    modelType: "NIC type", //网卡类型
    macAddress: "MAC address", //  MAC地址
    ipAddress: "IP address", //  IP地址
    numberOfQueues: "Number of queues", // Number of queues
    networkName: "Network Name ", // Network name
    virtualSwitch: "virtual switch ", // Virtual switch
    portGroup: "Owning port group ", // Owning port group
    pool: "address pool ", // Address pool
    uploadSpend: "Downstream bandwidth (KB/S)", // Downstream bandwidth (KB/S)
    downloadSpend: "Upstream bandwidth (KB/S)", // Upstream bandwidth (KB/S)
    setUp: "Network Settings ", // network Settings
    cluster: "physical cluster ", // physical cluster
    selectcluster: "Please select physical cluster ", // Please select physical cluster
    networkName: "Network Name ", // Network name
    networkNameplac: "Please enter the network name ", // Please enter the network name
    networkNametooltip:
      "Support Chinese, English, digital, limited 2~18 words ", // Support Chinese, English, digital, limited 2~18 words
    networkCard: "network card ", // network card
    modelTypeplac: "Please select NIC type ", // Please select NIC type
    addressPool: "address pool ", // Address pool
    addressPoolplac: "Please select the address pool ", // Please select the address pool
    virtualSwitch: "virtual switch ", // Virtual switch
    virtualSwitchplac: "Please select a virtual switch ", // Please select a virtual switch
    portGroup: "port group ", // Port group
    portGroupplac: "Please select a port group ", // Please select a port group
    permission: "security group ", // security group
    permissionresouse: "Security group resource ", // Security group resource
    effectivepermission: "Effectivesecurity group resource ", // Effectiveresource
    networkNamelen: "Name length shall be 2 to 18 characters ", // Name length shall be 2 to 18 characters
    securityPolicy: "Security policy ", // Security policy
    virtualFirewallName: "Virtual Firewall ", // Virtual firewall
    virtualFirewallNamePlc: "Please select Virtual Protection Wall ", // Please select virtual protection wall
    networkHierarchy: "Networkhierarchy",
    networkType: " Network type ",
    none: " No ",
    netSpecEditSuccess: "The network specifications were edited successfully", //
    netSpecCreatSuccess: "The network specifications are created successfully", //The network specifications are created successfully
    advacedSetting: "Advanced Settings", //Advanced Settings
    auto: "automatic", //automatic
    netSpecSec: "Secondary network", //Secondary network
    netSpec3rd: "Three-level network", //Three-level network
    netSpecName: " Network specification name ",
    selectnetworkType: " Please select a network type ",
    addNetTop1: " Don`t have the right network specifications? To ",
    addNetTop2:
      " Access to Physical Cluster Details -> Network -> Create Network Specifications",
  },
  task: {
    action: "operate", //  操作
    objName: "object name", //  对象名称
    operUser: "operating user", //  操作用户
    startTime: "Starting time", //  开始时间
    finishTime: "End Time", //  结束时间
    status: "condition", //  状态
    detail: "Details", //  详情
    reason: "reason", //  原因
  },
  bindTheVirtualFirewall: "Bind the virtual firewall", // 绑定虚拟防火墙
  virtualFirewallName: "name", // 名称
  virtualFirewallRemark: "illustrate", // 说明

  statuscell: {
    OVERDUE: "expired", // 已过期
    AVAILABLE: "online", // 在线
    CONNECTED: "connected", // 已连接
    INSTALLING: "Install", // 安装
    SUSPEND: "pause", // 暂停
    UNKNOWN: "other", // other
    ONLINE: "online", // 在线
    OFFLINE: "offline", // 离线
    HALT: "abnormal", // 异常
    EXCEPTION: "abnormal", // 异常
    NORMAL: "normal", // 正常
    WARNING: "warn", // 警告
    ERROR: "mistake", // 错误
    POWERED_ON: "online", // 在线
    POWERED_OFF: "closure", // 关闭
  },

  // VMware纳管
  vMwareMgr: {
    name: "name", // 名称
    namePlac: "Name is required", // 名称不能为空
    remark: "describe", // 描述
    vcenterIp: "ip address", // ip地址
    vcenterPort: "port", // 端口
    vcenterAccount: "account", // 账号
    vcenterAdminName: "username", // 用户名
    vcenterAdminNameNot: "Username can not be empty", // 用户名不能为空
    vcenterAdminNamePlac: "Enter the vCenter administrator username", // 输入vCenter管理员用户名
    vcenterAdminPassword: "password", // 密码
    vcenterAdminPasswordNot: "password can not be blank", // 密码不能为空
    vcenterAdminPasswordPlac: "Please enter password", // 请输入密码
    addvMwareMgr: "Add VMware Managed", // 添加VMware纳管
    editvMwareMgr: "Edit VMware Managed", // 编辑VMware纳管
    type: "type", // 类型
    typePlac: "Type cannot be null", // 类型不能为空
    addSucc: "Added successfully", // 添加成功
    editSucc: "Edited successfully", // 编辑成功
    vmlist: "Cloud server list", // 云服务器列表
    powerStatus: "state", // 状态
    memory: "Memory", // 内存
  },
  storage: {
    disk: "storage", //  存储
    diskName: "name", //  名称
    device: "storage type", //  存储类型
    targetBus: "storage controller", //  存储控制器
    diskCapacity: "capacity(G)", //  容量(G)
    sourceFile: "Storage path", //  存储路径
    raw: "block device", //  块设备
    existed: "Local Disk", //  本地磁盘
    qcow2: "Local Disk", //  本地磁盘
    enable: "enable",
    disable: "disable",
    enableState: "Enabled state",
    sure: "determine",
    cancel: "cancel",
    disTips:
      "After the storage pool is disabled, the cloud server of the self-service user cannot use the storage pool",
    enableTips:
      "After the storage pool is enabled, the cloud servers of self-service users can use the storage pool",
    success: "success",
  },
  addSpec: "Add specifications",
  delSpec: "Delete Specification",
  layerNet2: "2-layer network",
  layerNet3: "3-layer network",
  delSpecTips:
    "This operation will delete the network specification. Do you want to continue?",
  delManySpecTips:
    "This operation will batch delete the selected network specifications. Do you want to continue?",
  prompt: "prompt",
  tips: "tips",
  pubNet: "Host Managed Public Network",
  vpcNet: "VPC network",
  netSeg: "Network segment",
  editNetSpec: "Edit network specifications",
  createNetSpec: "Create network specifications",
  ipAcq: "IP acquisition",
  selectNetLevel: "Please select a network level",
  selectCardType: "Please select a network card type",
  selectSecPolicy: "Please select a security policy",
  selectVirFirewall: "Please select a virtual firewall",
  selectThreeLayerNet: "Please select a three-layer network",
  selectEffectGroup:
    "Please select the security group that needs to be effective",
  macPool: "MAC address pool",
  netSepcDetail: "Network specification details",
  autoDhcp: "Automatic (DHCP)",
};
