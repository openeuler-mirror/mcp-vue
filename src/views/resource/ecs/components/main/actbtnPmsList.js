
const actbtnPms = {
    // 开机按钮start
    startstatusShowList: [
        'OFFLINE', // '离线(OFFLINE)'
    ],
    startstatusunShowList: [
        'OVERDUE', // '已过期(OVERDUE)',
        'AVAILABLE', // '在线(AVAILABLE)',
        'CONNECTED', // '已连接(CONNECTED)',
        'INSTALLING', // '安装(INSTALLING)',
        'SUSPEND', // '暂停(SUSPEND)',
        'UNKNOWN', // '其他(UNKNOWN)',
    ],

    starttaskStatusShowList: [
        'NEW', // '新建(NEW)',
        'NEWFAILED',  // '新建失败(NEWFAILED)',
        'INSTALLFAILED',  // '安装失败(INSTALLFAILED)',
    ],
    starttaskStatusunShowList: [
        'INSTALLING', // '安装中(INSTALLING)',
        'CREATING',  // '正在创建(CREATING)',
        'STARTING', // '正在开机(STARTING)',
        'SHUTDOWNING', // '正在关机(SHUTDOWNING)',
        'REBOOTING', // '正在重启(REBOOTING)',
        'SUSPENDING', // '正在暂停(SUSPENDING)',
        'RESUMING', // '正在唤醒(RESUMING)',
        'VOLUME_MIGRATING', // '正在存储迁移(VOLUME_MIGRATING)',
        'HOST_MIGRATING', // '正在主机迁移(HOST_MIGRATING)',
        'BACKUP_RUNNING', // '正在备份(BACKUP_RUNNING)',
        'BACKUP_RECOVERING', // '正在备份恢复(BACKUP_RECOVERING)',
        'SNAPSHOT_RUNNING', // '正在快照(SNAPSHOT_RUNNING)',
        'SNAPSHOT_RECOVERING', // '正在快照恢复(SNAPSHOT_RECOVERING)',
        'IMPORTING', // '正在导入(IMPORTING)',
        'EXPORTING', // '正在导出(EXPORTING)',
        'CLONING', // '正在克隆(CLONING)',
        'DISK_COPYING', // '正在磁盘复制(DISK_COPYING)',
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],

    // 控制台按钮 vnc 
    vncstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
    ],
    vncstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)
    ],

    vnctaskStatusShowList: [
        'INSTALLING', // 安装中(INSTALLING)
        'REBOOTING', // 正在重启(REBOOTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)

    ],
    vnctaskStatusunShowList: [
        'NEW', // 新建(NEW)
        'STARTING', // 正在开机(STARTING)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'CREATING',// 正在创建(CREATING)
        'SHUTDOWNING',// 正在关机(SHUTDOWNING)
        'VOLUME_MIGRATING',// 正在存储迁移(VOLUME_MIGRATING)
        'BACKUP_RUNNING',// 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING',// 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING',// 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING',// 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING',// 正在导入(IMPORTING)
        'EXPORTING',// 正在导出(EXPORTING)
        'CLONING',// 正在克隆(CLONING)
        'DISK_COPYING',// 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],


    // 关机按钮 shutdown
    shutdownstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)

    ],
    shutdownstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)

    ],
    shutdowntaskStatusShowList: [
        'INSTALLING', // 安装中(INSTALLING)
        'STARTING', // 正在开机(STARTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)

    ],
    shutdowntaskStatusunShowList: [
        'NEW', // 新建(NEW)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'CREATING', // 正在创建(CREATING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'REBOOTING', // 正在重启(REBOOTING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)

    ],

    // 强制关机 abort
    abortstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)

    ],
    abortstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)
    ],

    aborttaskStatusShowList: [
        'INSTALLING', // 安装中(INSTALLING)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
    ],
    aborttaskStatusunShowList: [
        'NEW', // 新建(NEW)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'CREATING', // 正在创建(CREATING)
        'REBOOTING', // 正在重启(REBOOTING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],
    // 重启 reboot
    rebootstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
    ],
    rebootstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)
    ],
    reboottaskStatusShowList: [
        'INSTALLING', // 安装中(INSTALLING)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
    ],
    reboottaskStatusunShowList: [
        'NEW', // 新建(NEW)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'CREATING', // 正在创建(CREATING)
        'REBOOTING', // 正在重启(REBOOTING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],

    // 强制重启 forcereboot
    forcerebootstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)

    ],
    forcerebootstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)

    ],
    forcereboottaskStatusShowList: [
        'INSTALLING', // 安装中(INSTALLING)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)

    ],
    forcereboottaskStatusunShowList: [
        'NEW', // 新建(NEW)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'CREATING', // 正在创建(CREATING)
        'REBOOTING', // 正在重启(REBOOTING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)

    ],


    // 快照按钮 snapshot
    snapshotstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)

    ],
    snapshotstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
    ],
    snapshottaskStatusShowList: [
        'NEW', // 新建(NEW)
        'INSTALLING', // 安装中(INSTALLING)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'REBOOTING', // 正在重启(REBOOTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)

    ],
    snapshottaskStatusunShowList: [
        'CREATING', // 正在创建(CREATING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)

    ],

    // 变更规格按钮 edit
    editstatusShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)

    ],
    editstatusunShowList: [
        'OVERDUE', // 已过期(OVERDUE)
    ],
    edittaskStatusShowList: [
        'NEW', // 新建(NEW)
        'INSTALLING', // 安装中(INSTALLING)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'REBOOTING', // 正在重启(REBOOTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)

    ],
    edittaskStatusunShowList: [
        'NEWFAILED', // 新建失败(NEWFAILED)
        'CREATING', // 正在创建(CREATING)
        'RESUMING', // 正在唤醒(RESUMING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],

    // 申请延期按钮 applyDeferred
    applyDeferredstatusShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
        'OFFLINE', // 离线(OFFLINE)
        'UNKNOWN', // 其他(UNKNOWN)

    ],
    applyDeferredstatusunShowList: [
    ],
    applyDeferredtaskStatusShowList: [
        'NEW', // 新建(NEW)
        'INSTALLING', // 安装中(INSTALLING)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'CREATING', // 正在创建(CREATING)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'REBOOTING', // 正在重启(REBOOTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'NEWFAILED', // 新建失败(NEWFAILED)

    ],
    applyDeferredtaskStatusunShowList: [
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],


    // 删除按钮 delete
    deletestatusShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)

    ],
    deletestatusunShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
        'UNKNOWN', // 其他(UNKNOWN)
    ],
    deletetaskStatusShowList: [
        'NEW', // 新建(NEW)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)

    ],
    deletetaskStatusunShowList: [
        'INSTALLING', // 安装中(INSTALLING)
        'CREATING', // 正在创建(CREATING)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'REBOOTING', // 正在重启(REBOOTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],

    // 制作镜像按钮 makeImage
    makeImagestatusShowList: [
        'OVERDUE', // 已过期(OVERDUE)
        'OFFLINE', // 离线(OFFLINE)
    ],
    makeImagestatusunShowList: [
        'AVAILABLE', // 在线(AVAILABLE)
        'CONNECTED', // 已连接(CONNECTED)
        'INSTALLING', // 安装(INSTALLING)
        'SUSPEND', // 暂停(SUSPEND)
        'UNKNOWN', // 其他(UNKNOWN)
    ],
    deletetaskStatusShowList: [

    ],
    deletetaskStatusunShowList: [
        'NEW', // 新建(NEW)
        'NEWFAILED', // 新建失败(NEWFAILED)
        'INSTALLFAILED', // 安装失败(INSTALLFAILED)
        'INSTALLING', // 安装中(INSTALLING)
        'CREATING', // 正在创建(CREATING)
        'STARTING', // 正在开机(STARTING)
        'SHUTDOWNING', // 正在关机(SHUTDOWNING)
        'REBOOTING', // 正在重启(REBOOTING)
        'SUSPENDING', // 正在暂停(SUSPENDING)
        'RESUMING', // 正在唤醒(RESUMING)
        'VOLUME_MIGRATING', // 正在存储迁移(VOLUME_MIGRATING)
        'HOST_MIGRATING', // 正在主机迁移(HOST_MIGRATING)
        'BACKUP_RUNNING', // 正在备份(BACKUP_RUNNING)
        'BACKUP_RECOVERING', // 正在备份恢复(BACKUP_RECOVERING)
        'SNAPSHOT_RUNNING', // 正在快照(SNAPSHOT_RUNNING)
        'SNAPSHOT_RECOVERING', // 正在快照恢复(SNAPSHOT_RECOVERING)
        'IMPORTING', // 正在导入(IMPORTING)
        'EXPORTING', // 正在导出(EXPORTING)
        'CLONING', // 正在克隆(CLONING)
        'DISK_COPYING', // 正在磁盘复制(DISK_COPYING)
        'CREATE_KCP_IMAGE', // 正在磁盘复制(CREATE_KCP_IMAGE)
    ],

}
export default actbtnPms