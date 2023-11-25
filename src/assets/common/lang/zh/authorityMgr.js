// authorityMgr 权限管理
export default {
    orgList: '组织列表', // 组织列表
    userList: '用户列表', // 用户列表
    userName: '用户名', // 用户名
    realName: '真实姓名', // 真实姓名
    role: '角色', // 角色
    mobile: '手机号', // 手机号
    avtstatus: '激活状态', // 激活状态
    createTime: '创建时间', // 创建时间
    SYSTEM: "系统管理", // 系统管理
    ORG: "组织管理", // 组织管理
    SELF_SERVICE: "自服务", // 自服务
    PLATFORM: "平台管理", // 平台管理
    ACTIVATE: "激活", // 激活
    NO_ACTIVATE: "未激活", // 未激活
    creatUser: "创建用户", // 创建用户
    modifyUser: "编辑用户", // 编辑用户
    deleteUsers: "删除用户", // 删除用户
    deleteTipMsg: "确定删除该用户吗?", // 确定删除该用户吗?
    deleteSuccessMsg: "删除用户成功!", // 确定删除该用户吗?
    deletesTipMsg: "确定批量删除该用户嘛?", // 确定批量删除该用户组吗?
    deletesSuccessMsg: "批量删除用户成功!", // 确定批量删除该用户组吗?


    userNameplaceholder: "请输入用户名", // 请输入用户名
    userNametootip: "用户名支持数字、字母进行组合，字符长度为6 ~ 18位", // 用户名支持数字、字母进行组合，字符长度为6 ~ 18位

    realNameplaceholder: "请输入真实姓名", // 请输入真实姓名
    loginPwd: "登录密码", // 登录密码
    loginPwdplaceholder: "请输入登录密码", // 请输入登录密码
    editpassword: "修改密码", // 修改密码
    confirmPwd: "确认密码", // 确认密码
    confirmPwdplaceholder: "请输入确认密码", // 请输入确认密码
    loginNewPwd: "新密码", // 新密码
    loginNewPwdplaceholder: "请输入新密码", // 请输入新密码
    bindorgName: "绑定组织", // 绑定组织
    bindorgNameplaceholder: "请绑定组织", // 请绑定组织
    noorgName: "没有组织前往", // 没有组织前往
    bindroleName: "绑定角色", // 绑定角色
    bindroleNameplaceholder: "请绑定角色", // 请绑定角色
    mobileplaceholder: "请输入手机号", // 请输入手机号
    userStatus: "激活", // 激活
    pwdInconsistent: "两次输入密码不一致!", // 两次输入密码不一致
    userNameNotNull: "用户名不能为空!", // 用户名不能为空
    userNameLength: "用户名长度应控制在 6 ~ 18 个字符!", // 用户名长度应控制在 6 ~ 18 个字符
    userNamecombination: "用户名只能由英文字母、数字组合!", // 用户名只能由英文字母、数字组合!
    orgNamecombination: "组织名只能由英文字母、数字组合!", // 组织名只能由英文字母、数字组合!
    realNameNotNull: "真实姓名不能为空!", // 真实姓名不能为空
    realNameLength: "真实姓名长度应控制在 6 ~ 18 个字符!", // 真实姓名长度应控制在 6 ~ 18 个字符
    realNamecombination: "真实姓名只能由英文字母、数字组合!", // 真实姓名只能由英文字母、数字组合!
    pwdNotNull: "密码不能为空!", // 密码不能为空!
    pwdNotLength: "密码长度应控制在 6 ~ 18 个字符!", // 密码长度应控制在 6 ~ 18 个字符!
    pwdNotcombination: "密码只能由英文字母、数字组合!", // 密码只能由英文字母、数字组合!
    confirmpwdNotNull: "确认密码不能为空!", // 确认密码不能为空!
    confirmpwdInconsistent: "确认密码和密码输入不一致!", // 确认密码和密码输入不一致!
    modifyUsersuccess: "编辑用户成功!", // 编辑用户成功!
    createUsersuccess: "创建用户成功!", // 创建用户成功!

    roleList: '角色列表', // 角色列表
    roleName: '角色名称', // 角色名称
    roleType: '角色类型', // 角色名称
    remark: '描述', // 描述
    createRole: '创建角色', // 创建角色
    roleDetail: '角色详情', // 角色详情
    modifyRole: '编辑角色', // 编辑角色
    deleteRoleMsg: '确定删除该角色吗?', // 确定删除该角色吗?
    deleteRoleSuccMsg: '删除角色成功!', // 删除角色成功!
    createRoleSuccMsg: '创建角色成功!', // 创建角色成功!
    modifyRoleSuccMsg: '编辑角色成功!', // 编辑角色成功!
    boundorg: '绑定组织', // 绑定组织
    setPermission: '权限设置', // 权限设置
    roleNameplaceholder: '请输入角色名称', // 请输入角色名称
    roleNametooltip: '支持中文、数字、字母进行组合，字符长度为2 ~ 18位', // 支持中文、数字、字母进行组合，字符长度为2 ~ 18位
    boundorgplaceholder: '请绑定组织', // 请绑定组织
    optionalPermissions: '可选权限', // 可选权限
    selectedPermissions: '已选权限', // 已选权限
    roleTypeplaceholder: ' 请选择角色类型', // 请选择角色类型
    roleNameNotNull: '角色名称不能为空', // 角色名称不能为空
    roleNameLength: '名称长度应控制在 2 ~ 18 个字符', // 名称长度应控制在 2 ~ 18 个字符
    setPermissionplaceholder: '请设置权限', // 请设置权限

    // 组织管理
    cpu: '核', // 核
    mem: '内存', // 内存
    disk: '存储', // 存储
    organizationName: '组织名称', // 组织名称
    userNum: '用户数', // 用户数
    serverVmNum: '云服务器',// 云服务器
    parentName: '上级组织', // 上级组织
    CPUallocationratio: 'CPU分配比', // CPU分配比
    memoryallocationratio: '内存分配比', // 内存分配比
    Storageallocationratio: '存储分配比', // 存储分配比
    editOrg: '编辑组织',// 编辑组织
    createOrg: '创建组织',// 创建组织
    delereOrgconfirm: "确定删除该组织吗?", // 确定删除该组织吗
    delereOrgSucc: '删除组织成功!', // 删除组织成功!
    organizationNameplc: '请输入组织名称',// 请输入组织名称
    parentNameSelect: '请选择上级组织', // 请选择上级组织
    selectSarentName: '选择上级组织', // 选择上级组织
    vdcId: '选择VDC', // 选择VDC
    vdcIdPlc: '未选默认为一级VDC',// 未选默认为一级VDC
    vdcIdPlcInput: '请选择VDC',// 未选默认为一级VDC
    createLeader: '组织管理员',// 组织管理员
    createLeaderis: '创建组织管理员',// 创建组织管理员
    createLeaderselect: '请选择是否创建组织管理员',// 请选择是否创建组织管理员
    createLeadernot: '暂不创建',// 暂不创建
    organizationNameNotNull: '组织名称不能为空', // 组织名称不能为空
    editOrgSucc: '编辑组织成功!',// 编辑组织成功!
    createOrgSucc: '创建组织成功!', // 创建组织成功!
    vdcName: 'VDC名称', // VDC名称
    vdcConfigure: '配置', // 配置
    editOrgName: '修改组织名称', // 修改组织名称
    editOrgNamesuccessMsg: '修改组织名称', // 修改组织名称
    bindOrgNamePlc: '请选择绑定组织', // 请选择绑定组织

    netWorkSet: {
        ID: 'ID', // ID
        networkName: '网络名称', // 网络名称
        interfaceType: '网络类型', // 网络类型
        virtualSwitch: '虚拟交换机', // 虚拟交换机
        modelType: '网卡类型', // 网卡类型
        addressPool: '地址池', // 地址池
        portGroup: '端口组', // 端口组
        securityGroup: '安全组', // 端口组
        clusterName: '集群名称', // 集群名称
    },
}