export default {
    /** ******************  日志告警—服务器事件  *********************************/
    monitoring: {
        evtSeverity: {
            ALL: 'All Levels',
            INFO: 'Info',
            WARN: 'Warning',
            ERROR: 'Error'
        },
        event: {
            type: {
                ALL: 'All Types',
                SERVER_ONLINE: 'Server Online',
                SERVER_OFFLINE: 'Server Offline',
                SERVER_STATUS: 'Server Status',
                SERVER_KSVD_START: 'System Services Start',
                SERVER_KSVD_STOP: 'System Services Stop',
                SERVER_KSVD_MSG: 'System Message',
                CM_ACTIVE: 'Cluster Master Active',
                CM_STANDBY: 'Cluster Master Standby',
                DBMONITOR_OUT_SYNC: 'DBMonitor Touch Long',
                MC_SERVICE_ALERT: 'MC Service Alert',
                SESSION_MIGRATE: 'Session Migration',
                KSVDCMD_RESTART: 'ksvd-cmd daemon restart',
                KSVDCMD_DOWN: 'ksvd-cmd daemon down',
                KSVDMPCD_RESTART: 'ksvdmpcd daemon restart',
                KSVDMPCD_DOWN: 'ksvdmpcd daemon down',
                KSVDSMARTD_RESTART: 'ksvdsmartd daemon restart',
                KSVDSMARTD_DOWN: 'ksvdsmartd daemon down',
                KSVDBRANCHD_RESTART: 'ksvdbranchd daemon restart',
                KSVDBRANCHD_DOWN: 'ksvdbranchd daemon down',
                DHCPD_RESTART: 'dhcpd daemon restart',
                DHCPD_DOWN: 'dhcpd daemon down',
                KSVDUDPD_RESTART: 'ksvdudp daemon restart',
                KSVDUDPD_DOWN: 'ksvdudp daemon down',
                KSVDP2P_RESTART: 'ksvdp2p daemon restart',
                KSVDP2P_DOWN: 'ksvdp2p daemon down',
                KSVDCACHEIO_RESTART: 'ksvdcacheio daemon restart',
                KSVDCACHEIO_DOWN: 'ksvdcacheio daemon down',
                KSVD_NETD_RESTART: 'Ksvdnetd process restart',
                KSVD_NETD_DOWN: 'ksvdnetd process  down',
                KSVD_DPM_WAKEUP: 'dpm wake up',
                KSVD_DPM_POWEROFF: 'dpm power off',

                VITUALSERVER_START: 'virtual server start',
                VITUALSERVER_SHUTDOWN: 'virtual server shutdown',
                VITUALSERVER_INSTALL: 'virtual server install',
                VITUALSERVER_REBOOT: 'virtual server reboot',
                VITUALSERVER_FORCEREBOOT: 'force restart',
                VITUALSERVER_SUSPEND: 'virtual server suspend',
                VITUALSERVER_WAKEUP: 'virtual server wake up',
                VITUALSERVER_DELETE: 'virtual server delete',
                VITUALSERVER_ABORT: 'virtual server  force shut down',
                VIRTUALSERVER_ERROR: 'error',
                VIRTUALSERVER_WARN: 'warning',
                VITUALSERVER_IMAGE: 'virtual servercreate Image',
                VITUALSERVER_CLONEIMAGE: 'virtual server clone create Image',
                VIRTUALSERVER_INSTALL_ERROR: 'Installation failed',
                VIRTUALSERVER_CONNECT_STATUS: 'VNC connection',
                VIRTUALSERVER_ONLINE_ERROR: 'Online editing failed',
                VIRTUALSERVER_CLONE_VM: 'Clone Cloud Server',
                VIRTUALSERVER_DYNAMIC_ADD: 'virtualserver dynamic add',
                VIRTUALSERVER_KYLINTOOL: 'qga status',
                VIRTUALSERVER_KSVDTOOL_EVENT: 'Set IP/Username/Password',
            }
        },
        serverEvtMap: {
            severity: 'Severity', // 严重性
            desktopName: 'Cloud Server', // 云服务器名称
            type: 'Type', // 类型
            username: 'User', // 用户
            hostname: 'Run Host', // 运行主机
            timestamp: 'Date', // 日期
            info: 'Info', // 信息
            server: 'Server', // 服务器
            mutableTags: 'Sesource', // 资源
        },
        alarmEvtMap: {
            severity: 'Alarm level',
            date: 'Warning time',
            type: 'Alert Name',
            objectName: 'Alert object',
            objectType: 'Object Type',
            info: 'Info'
        },
    }
}