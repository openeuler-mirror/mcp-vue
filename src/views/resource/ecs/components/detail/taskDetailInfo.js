/**
 * Created by kylin-ksvd on 21-10-25.
 */

/*
 * Declare our namespace
 */
import $ from 'jquery' //在需要使用的页面中
import { serveri18nMap } from './serverI18nMap'
import i18n from '@/assets/common/lang/index' // 国际化

let KSVD
if (typeof KSVD == 'undefined') {
    KSVD = {};
}

KSVD.i18n = new Object();



KSVD.updatei18nMap = function (newi18nMap) {
    for (let key in newi18nMap) {
        let mapKey = newi18nMap[key]
        // KSVD.i18n[key] = newi18nMap[key];
        KSVD.i18n[key] = i18n.t(mapKey)
    }
}
KSVD.updatei18nMap(serveri18nMap)


if (typeof KSVD.taskDetailInfo == 'undefined') {
    KSVD.taskDetailInfo = {};
}



//数据初始化
KSVD.taskDetailInfo.init = function (vmName, detailInfo) {
    //操作对应关系
    var operData = {
        "servervirtualEdit": KSVD.i18n.servervirtualEdit,
        "serverVirtaulHostMigrate": KSVD.i18n.serverVirtaulHostMigrate,
        "servervirtualVolMigrate": KSVD.i18n.servervirtualVolMigrate,
        "servervirtualForceReboot": KSVD.i18n.servervirtualForceReboot,
        "servervirtualReboot": KSVD.i18n.servervirtualReboot,
        "servervirtualPowerOn": KSVD.i18n.servervirtualPowerOn,
        "servervirtualShutDown": KSVD.i18n.servervirtualShutDown,
        "servervirtualResume": KSVD.i18n.servervirtualResume,
        "servervirtualPause": KSVD.i18n.servervirtualPause,
        "servervirtualForceShutDown": KSVD.i18n.servervirtualForceShutDown,
        "servervirtualDelete": KSVD.i18n.servervirtualDelete,
        "servervirtualDeleteSoft": KSVD.i18n.servervirtualDeleteSoft,
        "servervirtualClone": KSVD.i18n.servervirtualClone,
        "servervirtualCloneLink": KSVD.i18n.servervirtualCloneLink,
        "servervirtualCreate": KSVD.i18n.servervirtualCreate,
        "servervirtualCreateByTemplate": KSVD.i18n.servervirtualCreateByTemplate,
        "servervirtualExport": KSVD.i18n.servervirtualExport,
        "servervirtualImport": KSVD.i18n.servervirtualImport,
        "servervirtualCreateServerSnap": KSVD.i18n.servervirtualCreateServerSnap,
        "servervirtualCreateNoMemServerSnap": KSVD.i18n.servervirtualCreateNoMemServerSnap,
        "servervirtualSnapshotDelete": KSVD.i18n.servervirtualSnapshotDelete,
        "servervirtualSnapshotApply": KSVD.i18n.servervirtualSnapshotApply,
        "servervirtualBatchApply": KSVD.i18n.servervirtualBatchApply,
        "servervirtualBatchCreateSnap": KSVD.i18n.servervirtualBatchCreateSnap,
        "servervirtualCreateBackUp": KSVD.i18n.servervirtualCreateBackUp,
        "servervirtualDeleteBackUp": KSVD.i18n.servervirtualDeleteBackUp,
        "servervirtualRecoverBackUp": KSVD.i18n.servervirtualRecoverBackUp,
        "servervirtualDiskCopy": KSVD.i18n.servervirtualDiskCopy,
        "serverVirtaulHostStorageMigrate": KSVD.i18n.serverVirtaulHostStorageMigrate,

    };
    //编辑设备的添加删除对应关系
    var deviceData = {
        "addIso": KSVD.i18n.addIso,
        "delIso": KSVD.i18n.delIso,
        "addInterface": KSVD.i18n.addInterface,
        "delInterface": KSVD.i18n.delInterface,
        "delDisk": KSVD.i18n.delDisk,
        "addDisk": KSVD.i18n.addDisk,
        "addUsb": KSVD.i18n.addUsb,
        "delUsb": KSVD.i18n.delUsb,

        "editDisk": KSVD.i18n.editDisk,
        "editInterface": KSVD.i18n.editInterface,
        "editIso": KSVD.i18n.editIso,
        "editUsb": KSVD.i18n.editUsb,
    };
    //操作与属性的对应关系
    var initData = {
        "servervirtualEdit": {
            "addIso": KSVD.i18n.addIso,
            "delIso": KSVD.i18n.delIso,
            "addInterface": KSVD.i18n.addInterface,
            "delInterface": KSVD.i18n.delInterface,
            "delDisk": KSVD.i18n.delDisk,
            "addDisk": KSVD.i18n.addDisk,
            "addUsb": KSVD.i18n.addUsb,
            "delUsb": KSVD.i18n.delUsb,

            "aliasName": KSVD.i18n.aliasName,
            "selectCluster": KSVD.i18n.aliasName,
            "description": KSVD.i18n.description,
            "selectCluster": KSVD.i18n.selectCluster,

            "vcpuSocket": KSVD.i18n.vcpuSocket,
            "vcpuCores": KSVD.i18n.vcpuCores,
            "cpuMode": {
                name: KSVD.i18n.cpuMode,
                values: {
                    'CUSTOM': KSVD.i18n.CUSTOM,
                    'HOST_MODEL': KSVD.i18n.HOST_MODEL,
                    'HOST_PASSTHROUGH': KSVD.i18n.HOST_PASSTHROUGH,
                }
            },
            "schedulingPriority": {
                name: KSVD.i18n.schedulingPriority,
                values: {
                    '1': KSVD.i18n.schedulingPriorityLow,
                    '2': KSVD.i18n.schedulingPriorityMiddle,
                    '3': KSVD.i18n.schedulingPriorityHigh,
                }
            },

            "cpuLimit": KSVD.i18n.cpuLimit,
            "numaConfig": {
                name: KSVD.i18n.numaConfig,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            "memory": KSVD.i18n.memory,
            "memoryHugeConfig": {
                name: KSVD.i18n.memoryHugeConfig,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },


            "memoryBubbleConfig": {
                name: KSVD.i18n.memoryBubbleConfig,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            //磁盘属性对应关系
            "diskCapacity": KSVD.i18n.diskCapacity,
            "targetBus": KSVD.i18n.targetBus,
            "cacheType": KSVD.i18n.cacheType,
            "provisionType": KSVD.i18n.provisionType,
            "readIOLimit": KSVD.i18n.readIOLimit,
            "writeIOLimit": KSVD.i18n.writeIOLimit,
            "readIOPSLimit": KSVD.i18n.readIOPSLimit,
            "writeIOPSLimit": KSVD.i18n.writeIOPSLimit,
            //网卡属性对应关系
            "interfaceType": KSVD.i18n.interfaceType,
            "modeltype": KSVD.i18n.modeltype,
            "poolName": KSVD.i18n.poolName,
            "virtualSwitch": KSVD.i18n.virtualSwitch,
            "portGroup": KSVD.i18n.portGroup,
            "ipAddress": KSVD.i18n.ipAddress,
            "mac": KSVD.i18n.mac,
            "queueCount": KSVD.i18n.queueCount,
            "mtuCount": KSVD.i18n.mtuCount,
            "hotDrawing": {
                name: KSVD.i18n.hotDrawing,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            //光驱属性对应关系
            "sourceFile": KSVD.i18n.sourceFile,
            //其他设备属性对应关系
            "graphicsCard": {
                name: KSVD.i18n.graphicsCard,
                values: {
                    'qxl': KSVD.i18n.graphicsCardQXL,
                    'vga': KSVD.i18n.graphicsCardVGA,
                    'cirrus': KSVD.i18n.graphicsCardCirrus,
                    'virtio': KSVD.i18n.virtio,
                }
            },
            "mouseType": KSVD.i18n.mouseType,
            "biosSwitch": {
                name: KSVD.i18n.biosSwitch,
                values: {
                    '3': KSVD.i18n.legacy,
                    '2': KSVD.i18n.uefi,
                    '1': KSVD.i18n.userUpload,
                }
            },
            "biosFile": KSVD.i18n.biosFile,
            "biosWaitTime": KSVD.i18n.biosWaitTime,
            //usb属性对应关系
            "hostId": KSVD.i18n.hostId,
            "usbId": KSVD.i18n.usbId,
            //高级配置属性对应关系
            "vmBluescreen": {
                name: KSVD.i18n.vmBluescreen,
                values: {
                    '0': KSVD.i18n.noConfig,
                    '1': KSVD.i18n.reOpen,
                    '2': KSVD.i18n.byOther,
                }
            },
            "uniqbVmHA": {
                name: KSVD.i18n.uniqbVmHA,
                values: {
                    '0': KSVD.i18n.close,
                    '1': KSVD.i18n.open,
                }
            },
            "enableCpuDynamic": {
                name: KSVD.i18n.enableCpuDynamic,
                values: {
                    '0': KSVD.i18n.close,
                    '1': KSVD.i18n.open,
                }
            },
            "enableMemDynamic": {
                name: KSVD.i18n.enableMemDynamic,
                values: {
                    '0': KSVD.i18n.close,
                    '1': KSVD.i18n.open,
                }
            },
            "aotuMigrateSwitch": {
                name: KSVD.i18n.aotuMigrateSwitch,
                values: {
                    '0': KSVD.i18n.close,
                    '1': KSVD.i18n.open,
                }
            },
            "followHostStartAuto": {
                name: KSVD.i18n.followHostStartAuto,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            "bootOrder": {
                name: KSVD.i18n.bootOrder,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            "remoteOpen": {
                name: KSVD.i18n.remoteOpen,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            "remotePassword": KSVD.i18n.remotePassword,
            "wholeness": {
                name: KSVD.i18n.wholeness,
                values: {
                    '0': 'false',
                    '1': 'true',
                    'false': 'false',
                    'true': 'true',

                }
            },
            "existedTime": {
                name: KSVD.i18n.existedTime,
                values: {
                    'noTime': KSVD.i18n.noTime,
                    'customize': KSVD.i18n.customizeTime,

                }
            },


        },
        "serverVirtaulHostMigrate": {},
        "serverVirtaulHostStorageMigrate": {},
        "servervirtualVolMigrate": {},
        "servervirtualForceReboot": {},
        "servervirtualReboot": {},
        "servervirtualPowerOn": {},
        "servervirtualShutDown": {},
        "servervirtualResume": {},
        "servervirtualForceShutDown": {},
        "servervirtualDelete": {},
        "servervirtualDeleteSoft": {},
        "servervirtualClone": {},
        "servervirtualCloneLink": {},
        "servervirtualCreate": {},
        "servervirtualCreateByTemplate": {},
        "servervirtualExport": {},
        "servervirtualImport": {},
        "servervirtualCreateServerSnap": {},
        "servervirtualSnapshotDelete": {},
        "servervirtualSnapshotApply": {},

        "servervirtualCreateNoMemServerSnap": {},

        "servervirtualBatchApply": {},
        "servervirtualBatchCreateSnap": {},
        "servervirtualCreateBackUp": {},
        "servervirtualDeleteBackUp": {},
        "servervirtualRecoverBackUp": {},
        "servervirtualDiskCopy": {},

    };
    return KSVD.taskDetailInfo.detailJsonParse(vmName, detailInfo, operData, deviceData, initData);
}

//任务中心详情的解析显示
KSVD.taskDetailInfo.detailJsonParse = function (vmName, detailInfo, operData, deviceData, initData) {
    if (!detailInfo) {
        return '';
    }

    if (!KSVD.taskDetailInfo.isJSON(detailInfo)) {
        return detailInfo;
    }
    var _obj = JSON.parse(detailInfo);
    //操作类型
    var _objKey = Object.keys(_obj)[0];
    //操作明细
    var _objVal = _obj[_objKey];
    //操作类型名称
    var operName = operData[_objKey];
    var result = [];
    //任务详情解释
    $.each(_objVal, function (index, ele) {
        var properInfo = initData[_objKey][ele.enName];
        //属性单位对应关系
        var preUnit = (ele.preUnit) ? ele.preUnit : '';
        var nowUnit = (ele.nowUnit) ? ele.nowUnit : '';
        //修改的设备以及索引关系解析 测盘 光驱等
        var preInfo = '';
        if (ele.preName) {
            var device = ele.preName.replace(/\d/g, '');
            var deviceIndex = ele.preName.replace(/\D/g, '');
            preInfo = deviceData[device] + deviceIndex;
        }
        //修改的属性关系解析
        var preValue = (ele.preValue || ele.preValue == false || ele.preValue == 0) ? ele.preValue : '';
        var nowValue = (ele.nowValue || ele.nowValue == false || ele.nowValue == 0) ? ele.nowValue : '';
        if (KSVD.taskDetailInfo.isJSON(properInfo)) {
            preValue = (properInfo["values"][preValue] || properInfo["values"][preValue] == false || properInfo["values"][preValue] == 0) ? properInfo["values"][preValue] : '';
            nowValue = (properInfo["values"][nowValue] || properInfo["values"][nowValue] == false || properInfo["values"][nowValue] == 0) ? properInfo["values"][nowValue] : '';
            properInfo = properInfo["name"];
        }
        var isEditDevice = deviceData[ele.enName];
        var temp = '';
        //没有目的的修改关系解析
        if (isEditDevice) {
            temp += '[' + properInfo + ']';
        } else {
            //用于匹配operType:[objName]的格式 必须包含objName
            if (ele.objName) {
                temp += '[' + ele.objName + ']';
            } else {
                temp += '[' + preInfo + (properInfo ? properInfo + ':' : '') + preValue + preUnit + '->' + nowValue + nowUnit + ']';
            }

        }
        result.push(temp);
    });

    var detailMess = (result.length > 0) ? result.join('、') : '[' + vmName + ']';
    return operName + ':' + detailMess;
}
//除去编辑的其他任务生成任务中心详情
KSVD.taskDetailInfo.taskDetailForOthers = function (operType, preData, nowData, objName) {
    var tempData = [{ "preValue": preData, "nowValue": nowData, "enName": "", "objName": objName ? objName : '' }];
    var result = [];
    //发生变动的属性对应关系
    $.each(tempData, function (index, ele) {
        if (ele.preValue != ele.nowValue) {
            result.push(ele);
        }
    });
    var taskDetail = {};
    taskDetail[operType] = result;
    return JSON.stringify(taskDetail);
}
//编辑云服务器生成改动的内容
KSVD.taskDetailInfo.taskDetailNativeInfo = function (operType, preData, nowData) {
    //修改前的内容
    var pMachine = preData.machine;
    var pvcpuSocket = preData.cpu.vcpuSocket;
    var pvcpuCores = preData.cpu.vcpuCores;
    var pcpuMode = preData.cpu.cpuMode.name;
    var pschedulingPriority = preData.cpu.schedulingPriority;
    var pcpuLimit = preData.cpu.limit ? preData.cpu.limit : '';
    var pcpuNuma = preData.cpu.cpuNuma;
    var pmemory = preData.machine.memory;
    var pmemHugePage = preData.machine.memHugePage;
    var pmemoryBubbleConfig = preData.machine.memBalloon;
    var diskArr = [];
    var iosObjArr = [];
    var interfaceArr = preData.interfaces ? preData.interfaces : [];
    var usbsArr = preData['usbs'] ? preData['usbs'] : [];
    for (var i = 0; i < preData.disks.length; i++) {
        if (preData.disks[i].device == 'cdrom') {
            iosObjArr.push(preData.disks[i])
        } else {
            diskArr.push(preData.disks[i]);
        }
    }
    var pgraphicsCard = preData.graphicsCard;
    var pmouseType = preData.mouse;
    var pbiosWaitTime = preData.bios ? preData.bios.biosWaitTime : '';
    var pbiosFile = preData.bios ? preData.bios.biosFile : '';
    if (pbiosFile == 'null') {
        pbiosFile = '';
    }

    var pbiosSwitch = preData.bios ? preData.bios.biosSwitch : '';

    var pvmBluescreen = preData.hapolicy.vmBluescreen;
    var puniqbVmHa = preData.hapolicy.uniqbVmHa;
    var pcpuThresholdFlag = preData.dynamicModel ? preData.dynamicModel.cpuThresholdFlag : '';
    var pmemThresholdFlag = preData.dynamicModel ? preData.dynamicModel.memThresholdFlag : '';
    var pautoMigrate = preData.autoMigrate;

    var pisOpenRemote = preData.vnc ? preData.vnc.isOpenRemote : '';
    var premotePassword = preData.vnc ? preData.vnc.remotePassword : '';
    var pwholeness = preData.wholeness;
    var pserverRecyleSwitch = preData.serverRecyleSwitch;
    var pselectCluster = pMachine.select_Cluster;

    //修改后的内容
    var nName = nowData.aliasName;
    var nDescription = nowData.description;
    var nvcpuSocket = nowData.vcpu_socket;
    var nvcpuCores = nowData.vcpu_cores;
    var ncpuMode = nowData.cpu_mode;
    var nschedulingPriority = nowData.schedulingPriority;
    var ncpuLimit = nowData.limit ? nowData.limit : '';
    var ncpuNuma = nowData.cpu_numa;
    var nmemory = nowData.memory;
    var nmemoryUnit = nowData.mem_unit;
    var nmemHugePage = nowData.mem_hugePage;
    var nmemoryBubbleConfig = nowData.mem_balloon;
    var disksObj = JSON.parse(nowData.diskCapacity);
    var iosObj = JSON.parse(nowData.isoSelect);
    var interfaceObj = JSON.parse(nowData.interfaces);
    var usbsObj = JSON.parse(nowData.usbList);

    var ngraphicsCard = nowData.graphicsCard;
    var nmouseType = nowData.mouseType;
    var nbiosWaitTime = nowData.biosWaitTime;
    var nbiosFile = (nowData.biosFile && nowData.biosFile != 'null') ? nowData.biosFile : '';
    var nbiosSwitch = nowData.biosSwitch;

    var nvmBluescreen = nowData.vmBluescreen;
    var nuniqbVmHa = nowData.uniqbVmHa;
    var ncpuThresholdFlag = nowData.cpuThresholdFlag;
    var nmemThresholdFlag = nowData.memThresholdFlag;
    var nautoMigrate = nowData.autoMigrate;
    var nisOpenRemote = nowData.isOpenRemote;
    var nremotePassword = nowData.remotePassword;

    var nwholeness = nowData.wholeness;
    var nserverRecyleSwitch = nowData.serverRecyleSwitch;
    var nselectCluster = nowData.select_Cluster;
    //修改前后内容的映射关系
    var initData = [
        {
            "preValue": pMachine.aliasName,
            "nowValue": nName,
            "enName": "aliasName",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pMachine.description,
            "nowValue": nDescription,
            "enName": "description",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pvcpuSocket,
            "nowValue": nvcpuSocket,
            "enName": "vcpuSocket",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pvcpuCores,
            "nowValue": nvcpuCores,
            "enName": "vcpuCores",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pcpuMode,
            "nowValue": ncpuMode,
            "enName": "cpuMode",
            preUnit: "",
            nowUnit: "",
        },
        {
            "preValue": pschedulingPriority,
            "nowValue": nschedulingPriority,
            "enName": "schedulingPriority",
            preUnit: "",
            nowUnit: "",
        },
        {
            "preValue": pcpuLimit,
            "nowValue": ncpuLimit,
            "enName": "cpuLimit",
            preUnit: "",
            nowUnit: "",
        },
        {
            "preValue": pcpuNuma,
            "nowValue": ncpuNuma,
            "enName": "numaConfig",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pmemory,
            "nowValue": nmemory,
            "enName": "memory",
            preUnit: pMachine.memUnit,
            nowUnit: nmemoryUnit
        },
        {
            "preValue": pmemHugePage,
            "nowValue": nmemHugePage,
            "enName": "memoryHugeConfig",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pmemoryBubbleConfig,
            "nowValue": nmemoryBubbleConfig,
            "enName": "memoryBubbleConfig",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pgraphicsCard,
            "nowValue": ngraphicsCard,
            "enName": "graphicsCard",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pmouseType,
            "nowValue": nmouseType,
            "enName": "mouseType",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pbiosWaitTime,
            "nowValue": nbiosWaitTime,
            "enName": "biosWaitTime",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pbiosFile,
            "nowValue": nbiosFile,
            "enName": "biosFile",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pbiosSwitch,
            "nowValue": nbiosSwitch,
            "enName": "biosSwitch",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pvmBluescreen,
            "nowValue": nvmBluescreen,
            "enName": "vmBluescreen",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": puniqbVmHa,
            "nowValue": nuniqbVmHa,
            "enName": "uniqbVmHA",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pcpuThresholdFlag,
            "nowValue": ncpuThresholdFlag,
            "enName": "enableCpuDynamic",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pmemThresholdFlag,
            "nowValue": nmemThresholdFlag,
            "enName": "enableMemDynamic",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pautoMigrate,
            "nowValue": nautoMigrate,
            "enName": "aotuMigrateSwitch",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pisOpenRemote,
            "nowValue": nisOpenRemote,
            "enName": "remoteOpen",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": premotePassword,
            "nowValue": nremotePassword,
            "enName": "remotePassword",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pwholeness,
            "nowValue": nwholeness,
            "enName": "wholeness",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pserverRecyleSwitch,
            "nowValue": nserverRecyleSwitch,
            "enName": "existedTime",
            preUnit: "",
            nowUnit: ""
        },
        {
            "preValue": pselectCluster,
            "nowValue": nselectCluster,
            "enName": "selectCluster",
            preUnit: "",
            nowUnit: ""
        },


    ];

    //光驱和磁盘修改
    if (diskArr.length == disksObj.length) {
        var delFlag = false;
        for (var i = 0; i < diskArr.length; i++) {
            if (disksObj[i].lastUpdateType == 'delete') {
                delFlag = true;
            } else {
                var preadIoUnit = diskArr[i].readIOLimitUnit ? diskArr[i].readIOLimitUnit : 0;
                var nreadIoUnit = disksObj[i].readIOLimitUnit ? disksObj[i].readIOLimitUnit : 0;

                var pwriteIoUnit = diskArr[i].writeIOLimitUnit ? diskArr[i].writeIOLimitUnit : 0;
                var nwriteIoUnit = disksObj[i].writeIOLimitUnit ? disksObj[i].writeIOLimitUnit : 0;
                var ioUnit = ['KB/S', 'MB/S', 'GB/S'];
                var jsonArr = [
                    {
                        "preValue": diskArr[i].diskCapacity,
                        "nowValue": disksObj[i].diskCapacity,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "diskCapacity"
                    },
                    {
                        "preValue": diskArr[i].targetBus,
                        "nowValue": disksObj[i].diskType,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "targetBus"
                    },
                    {
                        "preValue": diskArr[i].cacheType,
                        "nowValue": disksObj[i].cacheType,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "cacheType"
                    },
                    {
                        "preValue": diskArr[i].provisionType,
                        "nowValue": disksObj[i].provisionType,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "provisionType"
                    },
                    {
                        "preValue": diskArr[i].readIOLimit,
                        "nowValue": disksObj[i].readIOLimit,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "readIOLimit",
                        preUnit: ioUnit[preadIoUnit],
                        nowUnit: ioUnit[nreadIoUnit],
                    },
                    {
                        "preValue": diskArr[i].writeIOLimit,
                        "nowValue": disksObj[i].writeIOLimit,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "writeIOLimit",
                        preUnit: ioUnit[pwriteIoUnit],
                        nowUnit: ioUnit[nwriteIoUnit],
                    },
                    {
                        "preValue": diskArr[i].readIOPSLimit,
                        "nowValue": disksObj[i].readIOPSLimit,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "readIOPSLimit"
                    },
                    {
                        "preValue": diskArr[i].writeIOPSLimit,
                        "nowValue": disksObj[i].writeIOPSLimit,
                        "preName": 'editDisk' + (i != 0 ? i : ''),
                        enName: "writeIOPSLimit"
                    }
                ];

                initData = initData.concat(jsonArr);
            }

        }
        //dele disk
        if (delFlag) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "delDisk" };
            initData.push(jsonMap);
        }

    } else {
        if (disksObj.length > diskArr.length) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "addDisk" };
            initData.push(jsonMap);
        }
    }

    //网卡修改
    if (interfaceArr.length == interfaceObj.length) {
        var delFlag = false;
        for (var i = 0; i < interfaceArr.length; i++) {
            if (interfaceObj[i].lastUpdateType == 'delete') {
                delFlag = true;
            } else {

                var jsonArr = [
                    {
                        "preValue": (interfaceArr[i].interfaceType.name).toLowerCase(),
                        "nowValue": (interfaceObj[i].interfaceType).toLowerCase(),
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "interfaceType"
                    },
                    {
                        "preValue": interfaceArr[i].modeltype,
                        "nowValue": interfaceObj[i].modeltype,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "modeltype"
                    },
                    {
                        "preValue": interfaceArr[i].poolName,
                        "nowValue": interfaceObj[i].macAddress,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "poolName"
                    },
                    {
                        "preValue": interfaceArr[i].virtualSwitch,
                        "nowValue": interfaceObj[i].virtualSwitch,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "virtualSwitch"
                    },
                    {
                        "preValue": interfaceArr[i].portGroup,
                        "nowValue": interfaceObj[i].portGroup,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "portGroup"
                    },
                    {
                        "preValue": interfaceArr[i].ip ? interfaceArr[i].ip : '',
                        "nowValue": interfaceObj[i].ip ? interfaceObj[i].ip : '',
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "ipAddress"
                    },
                    {
                        "preValue": interfaceArr[i].mac ? interfaceArr[i].mac : '',
                        "nowValue": interfaceObj[i].mac ? interfaceObj[i].mac : '',
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "mac"
                    },

                    {
                        "preValue": interfaceArr[i].queueCount,
                        "nowValue": interfaceObj[i].queueCount,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "queueCount"
                    },
                    {
                        "preValue": interfaceArr[i].mtuCount,
                        "nowValue": interfaceObj[i].mtuCount,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "mtuCount"
                    },
                    {
                        "preValue": interfaceArr[i].hotDrawing,
                        "nowValue": interfaceObj[i].hotDrawing,
                        "preName": 'editInterface' + (i != 0 ? i : ''),
                        enName: "hotDrawing"
                    },
                ];

                initData = initData.concat(jsonArr);
            }


        }
        //dele interface
        if (delFlag) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "delInterface" };
            initData.push(jsonMap);
        }
    } else {
        if (interfaceObj.length > interfaceArr.length) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "addInterface" };
            initData.push(jsonMap);
        }
    }
    //光驱性对应关系
    if (iosObjArr.length == iosObj.length) {
        var delFlag = false;
        for (var i = 0; i < iosObjArr.length; i++) {
            if (iosObj[i].lastUpdateType == 'delete') {
                delFlag = true;
            } else {


                var jsonArr = [
                    {
                        "preValue": iosObjArr[i].sourceFile ? iosObjArr[i].sourceFile : '',
                        "nowValue": iosObj[i].isoSelect ? iosObj[i].isoSelect : '',
                        "preName": 'editIso' + (i != 0 ? i : ''),
                        "enName": "sourceFile"
                    },
                ];
                initData = initData.concat(jsonArr);
            }
        }
        //dele iso
        if (delFlag) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "delIso" };
            initData.push(jsonMap);
        }
    } else {
        if (iosObj.length > iosObjArr.length) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "addIso" };
            initData.push(jsonMap);
        }

    }
    //usbs
    if (usbsArr.length == usbsObj.length) {
        var delFlag = false;
        for (var i = 0; i < usbsArr.length; i++) {
            if (usbsObj[i].lastUpdateType == 'delete') {
                delFlag = true;
            } else {


                var jsonArr = [
                    {
                        "preValue": usbsArr[i].hostIp ? usbsArr[i].hostIp : '',
                        "nowValue": usbsObj[i].hostId ? usbsObj[i].hostId : '',
                        "preName": 'editUsb' + (i != 0 ? i : ''),
                        "enName": "hostId"
                    },
                    {
                        "preValue": usbsArr[i].id ? usbsArr[i].id : '',
                        "nowValue": usbsObj[i].usbId ? usbsObj[i].usbId : '',
                        "preName": 'editUsb' + (i != 0 ? i : ''),
                        "enName": "usbId"
                    },
                ];
                initData = initData.concat(jsonArr);
            }
        }
        //dele usb
        if (delFlag) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "delUsb" };
            initData.push(jsonMap);
        }
    } else {
        if (usbsObj.length > usbsArr.length) {
            var jsonMap = { "preValue": "0", "nowValue": "1", "enName": "addUsb" };
            initData.push(jsonMap);
        }

    }

    var tempData = initData;
    var result = [];
    //发生变动的属性对应关系
    $.each(tempData, function (index, ele) {
        if (ele.preValue != ele.nowValue) {
            if (!(commonUtils.inputIsNull(ele.preValue) == true
                && commonUtils.inputIsNull(ele.nowValue) == true)) {
                result.push(ele);
            }

        }
    });
    var taskDetail = {};
    taskDetail[operType] = result;
    return JSON.stringify(taskDetail);

}
//判断是否为json串
KSVD.taskDetailInfo.isJSON = function (str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
          console.error('error：' + str + '!!!' + e);
            return false;
        }
    }
    var isjson = typeof (str) == "object" && Object.prototype.toString.call(str).toLowerCase() == "[object object]" && !str.length;
    return isjson;
}

export {
    KSVD
}
