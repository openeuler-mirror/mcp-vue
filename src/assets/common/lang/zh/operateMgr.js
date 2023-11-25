/** ****************** 操作  ******************************* **/
export default {

    workOrder: {
      choseRole:'选择角色',
        workOrderId: '工单ID', // 工单ID
        applyUser: '申请人', // 申请人
        organizationName: '所属组织', // 所属组织
        typeDesc: '工单类型', // 工单类型
        typeDescplaceholder: '请选择工单类型', // 请选择工单类型
        type: '类型', // 类型
        target: '工单对象', // 工单对象
        statusDesc: '状态', // 状态
        status: '工单状态', // 工单状态
        statusplaceholder: '请选择工单状态', // 请选择工单状态
        applyReason: '申请原因', // 申请原因
        auditOpinion: '反馈意见', // 反馈意见
        applyTime: '申请时间', // 申请时间
        auditTime: '处理时间', // 处理时间
        reviewComments: '审核意见', // 审核意见
        commentsNotempty: '审核意见不能为空', // 审核意见不能为空
        commentsspecialChar: '审核意见不能出现特殊字符', // 审核意见不能出现特殊字符
        statusOptions:
        {
            ALL: "全部",

            WAIT_CHECK: "待审核",

            CHECK_PASS: "审核已通过",

            CHECK_NO_PASS: "已拒绝",
        },

        orderTypeOptions:
        {
            ALL: "全部",

            REGISTER_USER: "账号注册",

            MODIFY_USER: "修改账号",

            APPLY_SERVERVM: "申请云服务器",

            MODIFY_SERVERVM: "变更云服务器",

            DEFERRED_SERVERVM: "延期云服务器",

            MODIFY_VDC: "变更VDC资源",

        },
        ipSet: {
            ipBindMac: 'IP/MAC绑定', // IP/MAC绑定
            ip: 'IP地址', // IP地址
            ipNotNull: 'IP地址不能为空', // IP地址不能为空
            ipWran: 'IP地址输入有误', // IP地址不能为空
            manualSetIp: '手动设置IP', // 手动设置IP
            mask: '子网掩码', // 子网掩码
            maskNotNull: '子网掩码不能为空', // 子网掩码不能为空
            maskWran: '子网掩码输入有误', // 子网掩码输入有误
            gw: '默认网关', // 默认网关
            gwWran: '网关输入有误', // 网关输入有误
            dns1: '首先DNS', // 首先DNS
            dns1Wran: '首选DNS输入有误', // 首选DNS输入有误
            dns2: '备先DNS', // 备先DNS
            dns2Wran: '备用DNS输入有误', // 备用DNS输入有误
            ipMethod: 'ip方式', // ip方式
            automaticDHCP: '自动DHCP', // 自动DHCP
            auto: '自动', // 自动
            manual: '手动', // 手动
            tooltip: '云服务器未安装QGA工具, 手动设置不生效', // 云服务器未安装QGA工具, 手动设置不生效
        },
        vdcstatus: '状态', // 状态
        oldResouse: '原始资源', // 原始资源
        applyResouse: '申请资源', // 申请资源
        realResouse: '审核资源', // 审核资源
        auditionUser: '审核者', // 审核者
        auditionTime: '审核时间', // 审核时间
        deadlineTypeDesc: '到期处理', // 到期处理
        reason: '原因', // 原因
        mobile: '手机号', // 手机号
        osMachine: '操作系统', // 操作系统
        posMachine: '请选择操作系统', // 请选择操作系统
        architecture: '架构', // 架构
        parchitecture: '请选择架构', // 请选择架构
        specification: '规格', // 规格
        deadLineTime: '到期时间', // 到期时间
        howtocreate: '创建方式', // 创建方式
        clusterName: '所属集群', // 所属集群
        iso: '镜像', // 镜像
        selectiso: '选择ISO镜像', // 选择ISO镜像
        isoLabel: 'ISO镜像名称', // ISO镜像名称
        templateName: '模板名称', // 模板名称
        applyNum: '申请个数', // 申请个数
        description: '描述', // 描述
        useMonth: '使用时间', // 使用时间
        useMonthUnit: '个月', // 个月
        oldDeadlineTime: '原到期时间', // 原到期时间
        newDeadlineTime: '延期时间', // 延期时间
        realName: '真实姓名', // 真实姓名
        newRealName: '新真实姓名', // 新真实姓名
        pwd: '密码', // 密码
        serverClusterType: '计算资源', // 计算资源
        serverClusterTypeObj: {
            CUSTOM: '自定义',
            BIND_RESOURCE: '绑定资源',
            AUTO: '自动'
        },
        pselectCluster: '请选择主机', // 请选择主机
        pselectTagNames: '请绑定资源', // 请绑定资源
        passapplyservervm: '申请云服务器审核', // 申请云服务器审核
        workorderpass: '审核通过', // 审核通过
        passmodifyservervm: '变更云服务器审核', // 变更云服务器审核
        aliasName: '名称', // 名称
        aliasNameNotNull: '名称不能为空', // 名称不能为空
        aliasNameLength: '名称长度应控制在 6 ~ 32 个字符', // 名称长度应控制在 6 ~ 32 个字符
        serverNum: '数量', // 数量
        serverNumNotNull: '申请个数不能为空', // 申请个数不能为空
        serverNumIsoRange: '申请个数应控制在 1 ~ 4 范围', // 申请个数应控制在 1 ~ 4 范围
        serverNumRange: '申请个数应控制在 1 ~ 100 范围', // 申请个数应控制在 1 ~ 100 范围
        servertemplate: '模板', // 模板
        systemType: '类型', // 类型
        cloneType: '创建类型', // 创建类型
        autoConfiguration: '自动安置', // 自动安置
        autoConfigurationOn: '开', // 自动安置开
        autoConfigurationOff: '关', // 自动安置关
        storageLocation: '存储位置', // 存储位置
        placstorageLocation: '请选择存储位置', // 请选择存储位置
        serverVmType: {
            ISO: 'ISO镜像', // ISO镜像
            TEMPLATE: '模板', // 模板
        },
        pserverVmTypeISO: '选择或搜索ISO镜像', // 选择或搜索ISO镜像
        sureApproved: "确定审核通过？", // 确定审核通过？
        reviewRejection: "审核拒绝", // 审核拒绝
        rejectOpinion: "拒绝意见", // 拒绝意见
        chooseComputingRes: "选择计算资源", // 选择计算资源
        serverAddr: "IP地址", // IP地址
        serverArch: "架构", // 架构
        serverType: "类型", // 类型
        cpuModelName: "CPU类型", // CPU类型
        cpuUtil: "CPU", // CPU
        memUtil: "内存", // 内存
        currentSessions: "运行云服务器", // 运行云服务器
        loadaverage: "平均负载", // 平均负载
        pchooseComputingRes: "请至少勾选一个计算资源节点", // 请至少勾选一个计算资源节点
        chooseNetworkInfo: "选择网络信息", // 选择网络信息
        pchooseNetworkInfo: "请至少勾选一个网络配置", // 请至少勾选一个网络配置

    },
}
