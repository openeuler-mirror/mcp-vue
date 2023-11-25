export default {
    /** ******************  日志告警—服务器事件  *********************************/
    monitoring: {
        evtSeverity: {
            ALL: '全部级别',
            INFO: '信息',
            WARN: '警告',
            ERROR: '错误'
        },
        event: {
            type: {
                "ALL": "全部类型",
                "SERVER_ONLINE": "服务器联机",
                "SERVER_OFFLINE": "服务器脱机",
                "SERVER_STATUS": "服务器状态",
                "SERVER_KSVD_START": "KSVD服务启动",
                "SERVER_KSVD_STOP": "KSVD服务停止",
                "SERVER_KSVD_MSG": "KSVD消息",
                "CM_ACTIVE": "集群主机活动",
                "CM_STANDBY": "集群主机待机",
                "DBMONITOR_OUT_SYNC": "服务器时间不同步",
                "MC_SERVICE_ALERT": "MC 服务警报",
                "SESSION_MIGRATE": "会话迁移",
                "KSVDCMD_RESTART": "ksvd-cmd进程重启",
                "KSVDCMD_DOWN": "ksvd-cmd进程退出",
                "KSVDMPCD_RESTART": "ksvdmpcd进程重启",
                "KSVDMPCD_DOWN": "ksvdmpcd进程退出",
                "KSVDSMARTD_RESTART": "ksvdsmartd进程重启",
                "KSVDSMARTD_DOWN": "ksvdsmartd进程退出",
                "KSVDBRANCHD_RESTART": "ksvdbranchd进程重启",
                "KSVDBRANCHD_DOWN": "ksvdbranchd进程退出",
                "DHCPD_RESTART": "dhcpd进程重启",
                "DHCPD_DOWN": "dhcpd进程退出",
                "KSVDUDPD_RESTART": "ksvdudp进程重启",
                "KSVDUDPD_DOWN": "ksvdudp进程退出",
                "KSVDP2P_RESTART": "ksvdp2p进程重启",
                "KSVDP2P_DOWN": "ksvdp2p进程退出",
                "KSVDCACHEIO_RESTART": "ksvdcacheio进程重启",
                "KSVDCACHEIO_DOWN": "ksvdcacheio进程退出",
                "KSVD_NETD_RESTART": "ksvdnetd进程重启",
                "KSVD_NETD_DOWN": "ksvdnetd进程退出",
                "KSVD_DPM_WAKEUP": "DPM唤醒主机",
                "KSVD_DPM_POWEROFF": "DPM回收主机",
                "VITUALSERVER_START": "开机",
                "VITUALSERVER_SHUTDOWN": "关机",
                "VITUALSERVER_INSTALL": "安装",
                "VITUALSERVER_REBOOT": "重启",
                "VITUALSERVER_FORCEREBOOT": "强制重启",
                "VITUALSERVER_SUSPEND": "暂停",
                "VITUALSERVER_WAKEUP": "唤醒",
                "VITUALSERVER_DELETE": "删除",
                "VITUALSERVER_ABORT": "强制关机",
                "VIRTUALSERVER_ERROR": "错误",
                "VIRTUALSERVER_WARN": "警告",
                "VITUALSERVER_IMAGE": "云服务器创建",
                "VITUALSERVER_CLONEIMAGE": "模版创建云服务器",
                "VIRTUALSERVER_INSTALL_ERROR": "安装失败",
                "VIRTUALSERVER_CONNECT_STATUS": "VNC连接",
                "VIRTUALSERVER_ONLINE_ERROR": "在线编辑失败",
                "VIRTUALSERVER_CLONE_VM": "克隆云服务器",
                "VIRTUALSERVER_DYNAMIC_ADD": "动态热添加",
                "VIRTUALSERVER_KYLINTOOL": "qga状态",
                "VIRTUALSERVER_KSVDTOOL_EVENT": "设置IP/用户名/密码"
            }
        },
        serverEvtMap: {
            severity: '严重性', // 严重性
            desktopName: '云服务器名称', // 云服务器名称
            type: '类型', // 类型
            username: '用户', // 用户
            hostname: '运行主机', // 运行主机
            timestamp: '日期', // 日期
            info: '信息', // 信息
            server: '服务器', // 服务器
            mutableTags: '资源', // 资源
        },
        alarmEvtMap: {
            severity: '告警级别',
            date: '告警时间',
            type: '告警名称',
            objectName: '告警对象',
            objectType: '对象类型',
            info: '详情'
        },
    }
}