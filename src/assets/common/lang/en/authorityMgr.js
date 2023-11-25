// authorityMgr 权限管理
export default {
    orgList: 'Organization list', // 组织列表
    userList: 'User list', // 用户列表
    userName: 'user name', // 用户名
    realName: 'actual name', // 真实姓名
    role: 'role', // 角色
    mobile: 'cell-phone number', // 手机号
    avtstatus: 'Active state', // 激活状态
    createTime: 'Creation time', // 创建时间
    SYSTEM: "System Management", // 系统管理
    ORG: "Organization Management", // 组织管理
    SELF_SERVICE: "Self-service", // 自服务
    PLATFORM: "Platform management", // 平台管理
    ACTIVATE: "activation", // 激活
    NO_ACTIVATE: "inactivated", // 未激活
    creatUser: "Create user", // 创建用户
    modifyUser: "Edit user", // 编辑用户
    deleteUsers: "delete users", // 删除用户
    deleteTipMsg: "Are you sure to delete this user?", // 确定删除该用户吗?
    deleteSuccessMsg: "User deleted successfully!", // 确定删除该用户吗?
    deletesTipMsg: "Are you sure to delete this user group in bulk??", // 确定批量删除该用户组吗?
    deletesSuccessMsg: "Successfully delete users in batches!", // 确定批量删除该用户组吗?


    userNameplaceholder: "please enter user name", // 请输入用户名
    userNametootip: "The user name supports a combination of numbers and letters, and the character length is 6 to 18 digits", // 用户名支持数字、字母进行组合，字符长度为6 ~ 18位

    realNameplaceholder: "please enter your real name", // 请输入真实姓名
    loginPwd: "login password", // 登录密码
    loginPwdplaceholder: "Please enter your password", // 请输入登录密码
    editpassword: "change Password", // 修改密码
    confirmPwd: "Confirm Password", // 确认密码
    confirmPwdplaceholder: "Please enter confirm password", // 请输入确认密码
    loginNewPwd: "new password", // 新密码
    loginNewPwdplaceholder: "Please enter a new password", // 请输入新密码
    bindorgName: "Bound organization", // 绑定组织
    bindorgNameplaceholder: "Please bind the organization", // 请绑定组织
    noorgName: "No organization to go", // 没有组织前往
    bindroleName: "Bound role", // 绑定角色
    bindroleNameplaceholder: "Please bind the role", // 请绑定角色
    mobileplaceholder: "Please enter phone number", // 请输入手机号
    userStatus: "activation", // 激活
    pwdInconsistent: "The two passwords are inconsistent!", // 两次输入密码不一致
    userNameNotNull: "Username can not be empty!", // 用户名不能为空
    userNameLength: "The length of the user name should be controlled within 6 ~ 18 characters!", // 用户名长度应控制在 6 ~ 18 个字符
    userNamecombination: "Username can only be a combination of English letters and numbers!", // 用户名只能由英文字母、数字组合!
    realNameNotNull: "Do not leave blank for real name!", // 真实姓名不能为空
    realNameLength: "Real name length should be controlled within 6 ~ 18 characters!", // 真实姓名长度应控制在 6 ~ 18 个字符
    realNamecombination: "The real name can only be a combination of English letters and numbers!", // 真实姓名只能由英文字母、数字组合!
    pwdNotNull: "password can not be blank!", // 密码不能为空!
    pwdNotLength: "The password length should be controlled within 6 ~ 18 characters!", // 密码长度应控制在 6 ~ 18 个字符!
    pwdNotcombination: "Password can only be a combination of English letters and numbers!", // 密码只能由英文字母、数字组合!
    confirmpwdNotNull: "confirm password can not be blank!", // 确认密码不能为空!
    confirmpwdInconsistent: "Confirm password and password input are inconsistent!", // 确认密码和密码输入不一致!
    modifyUsersuccess: "Edit user successfully!", // 编辑用户成功!
    createUsersuccess: "User created successfully!", // 创建用户成功!

    roleList: 'Role list', // 角色列表
    roleName: 'Role Name', // 角色名称
    roleType: 'Role type', // 角色名称
    remark: 'describe', // 描述
    createRole: 'Creating a Role', // 创建角色
    roleDetail: 'Role details', // 角色详情
    modifyRole: 'Edit role', // 编辑角色
    deleteRoleMsg: 'Are you sure to delete this role?', // 确定删除该角色吗?
    deleteRoleSuccMsg: 'Role deleted successfully!', // 删除角色成功!
    createRoleSuccMsg: 'Created the character successfully!', // 创建角色成功!
    modifyRoleSuccMsg: 'Edit character success!', // 编辑角色成功!
    boundorg: 'Bound organization', // 绑定组织
    setPermission: 'Permission settings', // 权限设置
    roleNameplaceholder: 'Please enter the role name', // 请输入角色名称
    roleNametooltip: 'Supports the combination of Chinese, numbers, and letters, with a character length of 2 to 18 digits', // 支持中文、数字、字母进行组合，字符长度为2 ~ 18位
    boundorgplaceholder: 'Please bind the organization', // 请绑定组织
    optionalPermissions: 'Optional permissions', // 可选权限
    selectedPermissions: 'Selected permissions', // 已选权限
    roleTypeplaceholder: 'Please select the role type', // 请选择角色类型
    roleNameNotNull: 'Role name cannot be empty', // 角色名称不能为空
    roleNameLength: 'The length of the name should be controlled within 2 ~ 18 characters', // 名称长度应控制在 2 ~ 18 个字符
    setPermissionplaceholder: 'Please set permissions', // 请设置权限

    // 组织管理
    cpu: 'core', // 核
    mem: 'RAM', // 内存
    disk: 'storage', // 存储
    organizationName: 'name of association', // 组织名称
    userNum: 'User number', // 用户数
    serverVmNum: 'Cloud Server',// 云服务器
    parentName: 'Parent organization', // 上级组织
    CPUallocationratio: 'CPU allocation ratio', // CPU分配比
    memoryallocationratio: 'Memory allocation ratio', // 内存分配比
    Storageallocationratio: 'Storage allocation ratio', // 存储分配比
    editOrg: 'Edit organization',// 编辑组织
    createOrg: 'Create an organization',// 创建组织
    delereOrgconfirm: "Are you sure to delete this organization?", // 确定删除该组织吗
    delereOrgSucc: 'Delete organization successfully!', // 删除组织成功!
    organizationNameplc: 'Please enter an organization name',// 请输入组织名称
    parentNameSelect: 'Please select the parent organization', // 请选择上级组织
    selectSarentName: 'select the parent organization', // 选择上级组织
    vdcId: 'Select VDC', // 选择VDC
    vdcIdPlc: 'If not selected, the default is the first-level VDC',// 未选默认为一级VDC
    vdcIdPlcInput: 'Please select VDC',// 未选默认为一级VDC
    createLeader: 'Organization Administrator',// 组织管理员
    createLeaderis: 'Create an organization administrator',// 创建组织管理员
    createLeaderselect: 'Please choose whether to create an organization administrator',// 请选择是否创建组织管理员
    createLeadernot: 'Not created yet',// 暂不创建
    organizationNameNotNull: 'Organization name cannot be empty', // 组织名称不能为空
    editOrgSucc: 'Edit organization successfully!',// 编辑组织成功!
    createOrgSucc: 'Create organization successfully!', // 创建组织成功!
    vdcName: 'VDC name', // VDC名称
    vdcConfigure: 'Configuration', // 配置
    editOrgName: 'Edit organization name', // 修改组织名称
    editOrgNamesuccessMsg: 'Modify the organization name successfully', // 修改组织名称成功
    bindOrgNamePlc: 'Please select a binding organization', // 请选择绑定组织

    netWorkSet: {
        ID: 'ID', // ID
        networkName: 'network name', // 网络名称
        interfaceType: 'Network Type', // 网络类型
        virtualSwitch: 'virtual switch', // 虚拟交换机
        modelType: 'NIC type', // 网卡类型
        addressPool: 'address pool', // 地址池
        portGroup: 'port group', // 端口组
        securityGroup: 'security group', // 端口组
        clusterName: 'cluster name', // 集群名称
    }
}