/** ****************** 操作  ******************************* **/
export default {

    workOrder: {
        workOrderId: 'Ticket ID', // 工单ID
        applyUser: 'applicant', // 申请人
        organizationName: 'Organization', // 所属组织
        typeDesc: 'Ticket type', // 工单类型
        typeDescplaceholder: 'Please select a ticket type', // 请选择工单类型
        type: 'type', // 类型
        target: 'Ticket object', // 工单对象
        statusDesc: 'state', // 状态
        status: 'work order status', // 工单状态
        statusplaceholder: 'Please select a ticket status', // 请选择工单状态
        applyReason: 'Reason for Application', // 申请原因
        auditOpinion: 'Feedback', // 反馈意见
        applyTime: 'application time', // 申请时间
        auditTime: 'processing time', // 处理时间
        reviewComments: 'Audit opinion', // 审核意见
        commentsNotempty: 'Review comments cannot be empty', // 审核意见不能为空
        commentsspecialChar: 'Review comments cannot contain special characters', // 审核意见不能出现特殊字符
        statusOptions:
        {
            ALL: "all",

            WAIT_CHECK: "pending review",

            CHECK_PASS: "Review passed",

            CHECK_NO_PASS: "rejected",
        },

        orderTypeOptions:
        {
            ALL: "all",

            REGISTER_USER: "Register an account",

            MODIFY_USER: "Modify account",

            APPLY_SERVERVM: "Apply for cloud server",

            MODIFY_SERVERVM: "Change cloud server",

            DEFERRED_SERVERVM: "Deferred cloud server",

            MODIFY_VDC: "Change VDC resources",

        },
        ipSet: {
            ipBindMac: 'IP/MAC binding', // IP/MAC绑定
            ip: 'IP address', // IP地址
            ipNotNull: 'IP address cannot be empty', // IP地址不能为空
            ipWran: 'IP address entered incorrectly', // IP地址不能为空
            manualSetIp: 'Set IP manually', // 手动设置IP
            mask: 'subnet mask', // 子网掩码
            maskNotNull: 'Subnet mask cannot be empty', // 子网掩码不能为空
            maskWran: 'Subnet mask entered incorrectly', // 子网掩码输入有误
            gw: 'default gateway', // 默认网关
            gwWran: 'Gateway input is incorrect', // 网关输入有误
            dns1: 'First DNS', // 首先DNS
            dns1Wran: 'Incorrect preferred DNS entry', // 首选DNS输入有误
            dns2: 'Backup DNS', // 备先DNS
            dns2Wran: 'Incorrect alternate DNS input', // 备用DNS输入有误
            ipMethod: 'ip method', // ip方式
            automaticDHCP: 'Automatic DHCP', // 自动DHCP
            auto: 'automatic', // 自动
            manual: 'manual', // 手动
            tooltip: 'The cloud server does not have the QGA tool installed, and the manual setting does not take effect', // 云服务器未安装QGA工具, 手动设置不生效
        },
        vdcstatus: 'state', // 状态
        oldResouse: 'original source', // 原始资源
        applyResouse: 'Application Resources', // 申请资源
        realResouse: 'Audit resources', // 审核资源
        auditionUser: 'Inspector', // 审核者
        auditionTime: 'Review time', // 审核时间
        deadlineTypeDesc: 'Expiration processing', // 到期处理
        reason: 'reason', // 原因
        mobile: 'phone number', // 手机号
        osMachine: 'operating system', // 操作系统
        posMachine: 'Please select an operating system', // 请选择操作系统
        architecture: 'Architecture', // 架构
        parchitecture: 'Please select a schema', // 请选择架构
        specification: 'Specification', // 规格
        deadLineTime: 'Expire date', // 到期时间
        howtocreate: 'how to create', // 创建方式
        clusterName: 'owning cluster', // 所属集群
        iso: 'mirror', // 镜像
        selectiso: 'Choose an ISO image', // 选择ISO镜像
        isoLabel: 'ISO image name', // ISO镜像名称
        templateName: 'template name', // 模板名称
        applyNum: 'number of applications', // 申请个数
        description: 'description', // 描述
        useMonth: 'usage time', // 使用时间
        useMonthUnit: 'month', // 个月
        oldDeadlineTime: 'original expiry time', // 原到期时间
        newDeadlineTime: 'Delay time', // 延期时间
        realName: 'actual name', // 真实姓名
        newRealName: 'new real name', // 新真实姓名
        pwd: 'password', // 密码
        serverClusterType: 'computing resources', // 计算资源
        serverClusterTypeObj: {
            CUSTOM: 'customize',
            BIND_RESOURCE: 'bind resources',
            AUTO: 'automatic'
        },
        pselectCluster: 'Please select a host', // 请选择主机
        pselectTagNames: 'Please bind the resource', // 请绑定资源
        passapplyservervm: 'Apply for cloud server audit', // 申请云服务器审核
        workorderpass: 'examination passed', // 审核通过
        passmodifyservervm: 'Change cloud server audit', // 变更云服务器审核
        aliasName: 'name', // 名称
        aliasNameNotNull: 'Name is required', // 名称不能为空
        aliasNameLength: 'Name length should be controlled between 6 ~ 32 characters', // 名称长度应控制在 6 ~ 32 个字符
        serverNum: 'quantity', // 数量
        serverNumNotNull: 'The number of applications cannot be empty', // 申请个数不能为空
        serverNumIsoRange: 'The number of applications should be controlled within the range of 1 to 4', // 申请个数应控制在 1 ~ 4 范围
        serverNumRange: 'The number of applications should be controlled in the range of 1 ~ 100', // 申请个数应控制在 1 ~ 100 范围
        servertemplate: 'template', // 模板
        systemType: 'type', // 类型
        cloneType: 'create type', // 创建类型
        autoConfiguration: 'automatic placement', // 自动安置
        autoConfigurationOn: 'on', // 自动安置开
        autoConfigurationOff: 'close', // 自动安置关
        storageLocation: 'storage location', // 存储位置
        placstorageLocation: 'Please select a storage location', // 请选择存储位置
        serverVmType: {
            ISO: 'ISO image', // ISO镜像
            TEMPLATE: 'template', // 模板
        },
        pserverVmTypeISO: 'Select or search for an ISO image', // 选择或搜索ISO镜像
        sureApproved: "Are you sure the review is passed?", // 确定审核通过？
        reviewRejection: "Review rejection", // 审核拒绝
        rejectOpinion: "reject opinion", // 拒绝意见
        chooseComputingRes: "Choose computing resources", // 选择计算资源
        serverAddr: "IP address", // IP地址
        serverArch: "Architecture", // 架构
        serverType: "type", // 类型
        cpuModelName: "CPU type", // CPU类型
        cpuUtil: "CPU", // CPU
        memUtil: "RAM", // 内存
        currentSessions: "run cloud server", // 运行云服务器
        loadaverage: "load average", // 平均负载
        pchooseComputingRes: "Please check at least one computing resource node", // 请至少勾选一个计算资源节点
        chooseNetworkInfo: "Select network information", // 选择网络信息
        pchooseNetworkInfo: "Please check at least one network configuration", // 请至少勾选一个网络配置

    },
}