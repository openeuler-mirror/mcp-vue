export default {
    drStragtegyInfor:{
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thurday: 'Thurday',
        Friday: 'Friday',
        Saturday: 'Saturday',
        Sunday: 'Sunday',
    },
    weekObj: {
        MONDAY: "Monday",
        TUESDAY: "Tuesday",
        WEDNESDAY: "Wednesday",
        THURSDAY: "Thurday",
        FRIDAY: "Friday",
        STAURDAY: "Saturday",
        SUNDAY: "Sunday",
      },
    configurationGuide:' Configuration guide:',
    configurationGuideStep1:'1. Install a new KCP and set the IP address',
    configurationGuideStep2:'2. Add the new KCP as the standby KCP. The system automatically synchronizes the configuration and data of the active KCP to this node',
    configurationGuideStep3:'3. If the active KCP is faulty, log in to the IP address of the standby KCP and switch the standby KCP to the active KCP',
    nodeIp:'Node IP',
    password:'password',
    addStandyAdd:'The standby KCP is added',
    standySlaveShip:'Master/slave relationship',
    Switch:'Switch to primary site',
    undeleted:'undeleted',
    promotedTips:'This operation promotes the standby KCP node to the active node. Do you want to continue?',
    promotedSuccess:'The active node is promoted successfully. Procedure',
    cancelPromoted:'Cancelled promotion',
    delNode:'This operation will delete the standby KCP node. Decide whether to continue',
    masterNoe:'Master (current access)',
    slave:'slave',
    main:'The main',
    slaveNow:'slave (current access)',
    selectNic:'Select NIC specifications',
    net2:'Two-layer network',
    net3:'Three-layer network',
    netName:'Network name',
    netDes:'Network description',
    netHie:'Network hierarchy',
    nicType:'Nic type',
    netType:'Network type',
    addPool:'Address pool',
    virSwitch:'Virtual switch',
    primarySite:'Primary site recovery point list',
    secSiteList:'Secondary site recovery point list',
    fullBackup:'Full backup',
    incBackup:'Incremental backup',
    secSite:'Secondary site',
    primarySite:'Primary site',
    synTo:'Synchronize to',
    backName:'Backup file name',
    backPath:'Backup path',
    backMode:'Backup mode',
    backSize:'Backup size',
    backComTime:'Backup completion time',
    selectRePoint:'Select a recovery point',
    mainSlaveSite:'Dr Data at the primary and secondary sites',
    disasterPolicy:'Disaster recovery policy',
    siteManage:'Site management',
    addSite:'Add a site',
    siteName:'Site name',
    addSiteSuccess:'add Site Success',
    linkManage:'Link management',
    delSiteTips:'The deletion cannot be restored. Exercise caution when performing this operation',
    delSiteTite:'Are you sure to delete data?',
    remark:'remark',

    createDrPolicy:'Create a Dr Policy',
    executeDrPolicy:'Execute the Dr Policy immediately',
    enable:'enable',
    disable:'disable',
    connectivityTest:'Connectivity test',
    probeObj:'Probe object',
    detectionRes:'Detection result',
    underDete:'Under detection',
    probObjectCom:'The probe object communicates properly',
    communicationError:'The communication between the probe object is abnormal. Check the network and try again',
    linkDetection:'Link detection',
    retest:'retest',
    addLink:'Add link',
    limited:'limited',
    unlimited:'unlimited',
    edit:'edit',
    conTest:'Connectivity test',
    delete:'delete',
    site1:'Site 1',
    site2:'Site 2',
    linkStatusSite:'Link status of the site',
    transRateLim:'Transmission rate limit',
    normal:'normal',
    anomaly:'anomaly',
    editLink:'Edit link',
    sectionDescri:'This section describes how to configure IP addresses for the management nodes of sites and sites so that data can be transmitted between sites.',
    linkRestr:'Link broadband restriction',
    configureDrIp:'Configure the Dr IP address',
    communicationIpAddress:'The communication ip address cannot be empty',
    enterNormalIp:'Please enter a normal ip address',
    selectThePrimary:'Select the primary site and secondary site',
    site1Tips:'Site 1 must not be empty',
    site2Tips:'Site 2 must not be empty',
    linkBroadBand:'The link broadband limit cannot be empty',
    dataCommit:'Data commit, please close the window later',
    linkEditSucc:'Link editing succeeded',
    linkDete:'Link detection exception',
    addLinkSuccess:'add Link Success',

    backupServerLoc: 'Backup server location',
    backupServer: 'Backup server',
    state: 'State',
    totalCapacity: 'Total capacity',
    availableSpace: 'Available space',
    selectCloudServer: 'Select cloud server',
    cloudServerSelected: 'selected',
    clear: 'Clear',
    noDataSelected: 'No data selected',
    packetDataLoading: 'Packet data loading',
    cloudServerName: 'Cloud server name',
    description: 'Description',
    createDrPolicy: 'Create DR policy',
    executeDrPolicyImmediately: 'Execute DR policy immediately',
    compressedTransmission: 'Compressed transmission',
    uncompressedTransmission: 'Uncompressed transmission',
    immediately: 'Immediately',
    hour: 'Hour',
    drPolicyName: 'DR policy name',
    primarySite: 'Primary site',
    secondarySite: 'Secondary site',
    cloudServer: 'Cloud server',
    primarySiteBackupLoc: 'Primary site backup location',
    primarySiteBackupPeriod: 'Primary site backup period',
    secondarySiteDrLoc: 'Secondary site DR location',
    drTransmissionMode: 'DR transmission mode',
    drPro: 'DR Pro',
    enabledState: 'Enabled state',
    nextDrTime: 'Next DR time',
    enableConfirmation: 'Enable confirmation',
    disableConfirmation: 'Disable confirmation',
    deletionConfirmation: 'Deletion confirmation',
    enabledSuccessfully: 'Enabled successfully',
    disabledSuccessfully: 'Disabledsuccessfully',
    hourlyBackup: 'Hourly backup',
    dailyBackup: 'Daily backup',
    everyDay: 'Every day',
    startTime: 'Start time',
    endTime: 'End time',
    weeklyBackup: 'Weekly backup',
    everyWeek: 'Every week',
    executedSuccessfully: 'Executed successfully',
    batchEnabledSuccessfully: 'Batch enabled successfully',
    batchDisabledSuccessfully: 'Batch disabled successfully',
    disabledStatusPolicySelected: 'Disabled status policy selected, cannot execute immediately',
    enabledPolicyExists: 'Enabled policy exists, cannot start',
    disabledStatusPolicyExists: 'Disabled status policy exists, cannot disable',
    basicInfo: 'Basic information',
    drConfig: 'DR configuration',
    definiteInfo: 'Definite information',
    choose: 'Choose',
    schematicDiagram: 'Schematic diagram',
    primarySiteLocalBackup: 'Primary site local backup',
    backupLoc: 'Backup location',
    pleaseEnter: 'Please enter',
    backupFreq: 'Backup frequency',
    day: 'Day',
    weeks: 'Weeks',
    backupCycle: 'Backup cycle',
    backupPeriod: 'Backup period',
    nextDay: 'Next day',
    backupStartTime: 'Backup start time',
    arbitraryPointInTime: 'Arbitrary point in time',
    policyDuration: 'Policy duration',
    singleServerTimeoutDuration: 'Single server timeout duration',
    backupCopy: 'Backup copy',
    secondarySiteRemoteDr: 'Secondary site remote DR',
    drLocation: 'DR location',
    drRpoPeriod: 'DR RPO period',
    transmissionMode: 'Transmission mode',
    dataSyncCompressed: 'Data sync compressed to improve transmission efficiency and reduce bandwidth consumption, but may consume more CPU resources. Please choose whether to enable based on bandwidth conditions.',
    enterDrPolicyName: 'Enter DR policy name',
    policyNameFormat: 'Supports 2-32 characters of Chinese, English, digits, and special characters',
    selectPrimarySite: 'Select primary site',
    selectSecondarySite: 'Select secondary site',
    selectCloudServer: 'Select cloud server',
    selectBackupLoc: 'Select backup location',
    selectDrLoc: 'Select DR location',
    selectStartTime: 'Select start time',
    selectEndTime: 'Select end time',
    selectBackupPeriod: 'Select backup period',
    enterPolicyDuration: 'Enter policy duration',
    enterSingleTimeout: 'Enter single timeout duration',
    enterBackupCopies: 'Enter backup copies',
    selectDrRpoPeriod: 'Select DR RPO period',
    cloudServerName: 'Cloud server name',
    cloudServerStatus: 'Cloud server status',
    createDrPolicy: 'Create DR policy',
    editDrPolicy: 'Edit DR policy',
    policyCreationSucceeded: 'Policy creation succeeded',
    policyModificationSucceeded: 'Policy modification succeeded',
    enableConfirmation: 'Confirm enable this policy?',
    disableConfirmation: 'Confirm disable this policy?',
    deletionConfirmation: 'Confirm delete this policy?',
    startTime: 'Start time',
    primarySiteBackupMethod: 'primary Site Backup Method',
    secondarySiteDrMethod: 'secondary Site Dr Method',
    weeklyBackup: 'weekly Backup',
    hourlyBackup: 'hourly Backup',
    cloudServerList: 'Cloud server list',
    cloudServerName: 'Cloud server name',
    cloudServerStatus: 'Cloud server status',
    drmRecoveryMethod: 'Disaster recovery method',
    startPractice: 'Start practice',
    endPractice: 'End practice',
    practiceCloudServer: 'Practice cloud server',
    practiceToSecondarySite: 'Practice to secondary site',
    practiceRecoveryPoint: 'Practice recovery point',
    selectPracticeRecoveryPoint: 'Select practice recovery point',
    automatic: 'Automatic',
    storageLocation: 'Storage location',
    selectStorageLocation: 'Select storage location',
    networkInterface: 'Network interface',
    selectNetworkInterfaceData: 'Select network interface data',
    drmSubmitSuccess: 'Disaster recovery practice submitted successfully, please check the progress in the task bar',
    endDrmSubmitSuccess: 'End disaster recovery practice submitted successfully, please check the progress in the task bar',
    notExist: 'Not exist',
    rpoSyncing: 'RPO syncing',
    deleting: 'Deleting',
    allCloudServer: 'All cloud servers',
    primarySiteRecovery: 'Primary site recovery',
    secondarySiteRecovery: 'Secondary site recovery',
    migrateToPrimarySite: 'Migrate to primary site',
    differentialDetection: 'Differential detection',
    primarySiteName: 'Primary site name',
    primarySiteBackupNum: 'Primary site backup number',
    primarySiteBackupTotalSize: 'Primary site backup total size',
    primarySiteLatestRecoveryTime: 'Primary site latest recovery time',
    primarySecondaryDataDiff: 'Primary and secondary site data difference',
    secondarySiteName: 'Secondary site name',
    secondarySiteBackupTotalSize: 'Secondary site backup total size',
    secondarySiteBackupNum: 'Secondary site backup number',
    secondarySiteLatestRecoveryTime: 'Secondary site latest recovery time',
    cloudServerBackupDiffDetection: 'Cloud server backup differential detection',
    prompt: 'Prompt',
    confirm: 'Confirm',
    cancel: 'Cancel',
    cloudServerBackupDiffSubmitSuccess: 'Cloud server backup differential detection submitted successfully, please check the progress in the task bar',
    primarySiteRecoveryTaskSubmitSuccess: 'Primary site recovery task submitted successfully, please check the progress in the task center',
    migrateToPrimarySiteTip: 'Note: After the migration, the cloud server at the secondary site will be immediately shut down, the latest data will be migrated to the primary site, and the cloud server will be automatically started at the primary site after the data migration is completed. There will be a short interruption in the service during this process. If an error occurs during the migration, the migration will be canceled and the cloud server at the secondary site will be restarted.',
    migrateCloudServer: 'Migrate cloud server',
    migrateSubmitSuccess: 'Migrate data submitted successfully, please check the progress in the task bar',
    secondarySiteStatus: 'Secondary site status',
    primarySiteStatus: 'Primary site status',
    synchronizeBackupRecoveryPointTo: 'Sync backup recovery point to',
    confirmSyncTo: 'Confirm sync to',
    data: 'Data',
    dataSyncSubmitSuccess: 'Data sync submitted successfully, please check the progress in the task bar',
    plannedRecovery: 'Planned recovery (primary site must be online)',
    disasterRecovery: 'Disaster recovery',
    recoverCloudServer: 'Recover cloud server',
    recoverToSecondarySite: 'Recover to secondary site',
    recoveryPoint: 'Recovery point',
    runningLocation: 'Running location',
    plannedRecoverySubmitSuccess: 'Planned recovery submitted successfully, please check the progress in the task bar',
    disasterRecoverySubmitSuccess: 'Disaster recovery submitted successfully, please check the progress in the task bar',
    "DRTest": "Disaster Recovery Test",
    "recoveryMethod": "Recovery Method",
    "startTest": "Start Test",
    "endTest": "End Test",
    startDrNote:" Note: After the drill starts, the cloud server at the primary site shuts down immediately and the Dr Machine is automatically started at the secondary site." ,
    endDrNote:" Note: After the drill is complete, delete the Dr Machine and clear the Dr Data during the drill." ,
    endDrNote2:" Ending the drill will not affect cloud server services at the primary site ",
    startTestNote: "Note: During scheduled recovery, the cloud server at the primary site will be shut down immediately and the latest data will be synchronized to the secondary site. After data synchronization is complete, the Dr Machine will be automatically started at the secondary site.",
    startTestNote1: "There will be a brief interruption of service during this process." ,
    startTestNote2: "If an error occurs during the recovery, the recovery will be canceled and the primary site cloud server will be restarted." ,
    endTestNote: "Note: Pull up the Dr Machine at the secondary site immediately after disaster recovery. ",
    endTestNote2: "Data that is not synchronized to the secondary site will be lost." ,
    "testServer": "Test Cloud Server",
    "testToBackup": "Test to Backup Site",
    "testRecoveryPoint": "Test Recovery Point",
    "chooseRecoveryPoint": "Please choose a recovery point for the test",
    "auto": "Auto",
    "storageLocation": "Storage Location",
    "chooseStorageLocation": "Please choose a storage location",
    "networkInterface": "Network Interface",
    "chooseNetworkInterfaceData": "Please choose network interface data",
    "testSubmitted": "The disaster recovery test has been submitted successfully. Please check the progress in the task list.",
    "endTestSubmitted": "The end of the disaster recovery test has been submitted successfully. Please check the progress in the tasklist.",
    "notExist": "Does not exist",
    "RPOSyncing": "RPO syncing",
    "deleting": "Deleting",
    "allServers": "All Cloud Servers",
    "mainSiteDRRecovery": "Primary Site Disaster Recovery Recovery",
    "backupSiteDRRecovery": "Backup Site Disaster Recovery Recovery",
    "revertToMainSite": "Revert to Primary Site",
    "differencesCheck": "Differences Check",
    "mainSiteName": "Primary Site Name",
    "mainSiteBackupCount": "Number of Backups at Primary Site",
    "mainSiteBackupSize": "Total Backup Data Size at Primary Site",
    "mainSiteLastRecoveryTime": "Primary Site Last Recovery Time",
    "mainBackupDifferences": "Data Differences between Primary and Backup Sites",
    "backupSiteName": "Backup Site Name",
    "backupSiteBackupSize": "Total Backup Data Size at Backup Site",
    "backupSiteBackupCount": "Number of Backups at Backup Site",
    "backupSiteLastRecoveryTime": "Backup Site Last Recovery Time",
    "performBackupCheck": "Perform backup file differences check between the primary and backup sites?",
    "prompt": "Prompt",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "backupCheckSubmitted": "The submission of the backup file differences check has been successful. Please check the progress in the task list.",
    "mainSiteDRRecoverySubmitted": "The submission of the primary site disaster recovery recovery task has been successful. Please check the progress in the task list.",
    "revertNote": "Note: After the revert, the cloud server at the backup site will immediately shut down, and the latest data will be reverted to the primary site. After the data is reverted, the cloud server will be automatically started at the primary site. During this process, there will be a brief interruption of the business. If an error occurs during the revert, the revert will be canceled, and the cloud server at the backup site will be restarted.",
    "revertServer": "Revert Cloud Server",
    "revertSubmitted": "The revert data submission has been successful. Please check the progress in the task list.",
    "backupSiteStatus": "Backup Site Status",
    "mainSiteStatus": "Primary Site Status",
    "syncTo": "Sync and overwrite the backup recovery point to",
    "confirmSyncTo": "Confirm to sync to",
    "data": "Data",
    "syncSubmitted": "The data synchronization submission has been successful. Please check the progress in the task list.",
    "plannedRecovery": "Planned Recovery (Primary Site Must Be Online)",
    "DRRecovery": "Disaster Recovery Recovery",
    "recoveryServer": "Recovery Cloud Server",
    "recoveryToBackup": "Recovery to BackupSite",
    "recoveryPoint": "Recovery Point",
    "runLocation": "Run Location",
    "plannedRecoverySubmitted": "The submission of the planned backup recovery has been successful. Please check the progress in the task list.",
    "DRRecoverySubmitted": "The submission of the disaster recovery backup recovery has been successful. Please check the progress in the task list.",
    NORMAL: "Protected",
    PLAN_RECOVER: "Planned Recovery",
    PLAN_RECOVERING: "Planned Recovery in Progress",
    FAIL_RECOVER: "Failover Recovery",
    FAIL_RECOVERING: "Failover Recovery in Progress",
    BACKUPING: "Backing Up",
    DELETEING: "Deleting Backup Files",
    PRONG: "Backing Up (pro sync)",
    START_DRILL: "Starting Disaster Recovery Drill",
    DRILL: "Disaster Recovery Drill in Progress",
    END_DRILL: "Ending Disaster Recovery Drill",
    MOVE_BACK: "Data Reversion in Progress",
    MASTER_RECOVERING: "Primary Site Recovery in Progress",
    backupFileStatus:'backup File Status',
    chooseMainRecoveryPoint:'choose recover point',
    bdStatus:'Disaster recovery status',
    backStatus:'backup status',
    will:'will',
    runnowTips: 'Due to the high resource usage of remote disaster recovery, please operate with caution',
    runnowTitleTips: 'Execute disaster recovery strategy immediately for"{name}"?',
    serverSearchTips:'Server Name/IP/UUID/Label',
    PRONG:'Pro synchronization in progress',
    HourBackupTips: 'The first backup is a full backup, and after a successful backup, the backup cycle task is executed.',
    DayBackupTips: 'After exceeding the duration, the virtual machine being backed up will continue to be backed up, and virtual machines that have not yet started backup will be backed up first in the next backup cycle',
    WeekBackupTips: 'After exceeding the duration, the virtual machine being backed up will continue to be backed up, and virtual machines that have not yet started backup will be backed up first in the next backup cycle',
    SingleBackupTimeOut: 'The single backup timeout time refers to the backup timeout time of a single cloud server in the backup strategy. After exceeding the timeout period, the cloud server recognizes it as timeout and executes the next cloud server backup in the backup strategy'
}
