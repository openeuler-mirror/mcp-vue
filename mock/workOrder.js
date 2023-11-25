module.exports = [
    // 工单列表查询
    {
        url: '/workOrder/pageWorkOrder',
        type: 'post',
        response: config => {
            return {
                "code": 200,
                "desc": "请求成功",
                "data": {
                    "list": [
                        {
                            "workOrderId": 1,
                            "type": "MODIFY_SERVERVM",
                            "typeDesc": "变更云服务器",
                            "target": "wanglei1",
                            "status": "WAIT_CHECK",
                            "statusDesc": "待审核",
                            "applyReason": "测试申请",
                            "auditOpinion": 'over',
                            "applyTime": "2021-06-18 14:13:05"
                        },
                        {
                            "workOrderId": 2,
                            "type": "APPLY_SERVERVM",
                            "typeDesc": "申请云服务器",
                            "target": "wanglei1",
                            "status": "WAIT_CHECK",
                            "statusDesc": "待审核",
                            "applyReason": "测试申请",
                            "auditOpinion": "over",
                            "applyTime": new Date()
                        },
                        {
                            "workOrderId": 3,
                            "type": "DEFERRED_SERVERVM",
                            "typeDesc": "延期云服务器",
                            "target": "wanglei1",
                            "status": "WAIT_CHECK",
                            "statusDesc": "待审核",
                            "applyReason": "测试申请",
                            "auditOpinion": "调试中...",
                            "applyTime": new Date()
                        },
                        {
                            "workOrderId": 4,
                            "type": "REGISTER_USER",
                            "typeDesc": "注册账号",
                            "target": "wanglei1",
                            "status": "WAIT_CHECK",
                            "statusDesc": "待审核",
                            "applyReason": "测试申请",
                            "auditOpinion": "调试中...",
                            "applyTime": new Date()
                        },
                        {
                            "workOrderId": 5,
                            "type": "MODIFY_USER",
                            "typeDesc": "修改账号",
                            "target": "wanglei1",
                            "status": "WAIT_CHECK",
                            "statusDesc": "待审核",
                            "applyReason": "测试申请",
                            "auditOpinion": "调试中...",
                            "applyTime": new Date()
                        }
                    ],
                    "pageInfo": {
                        "currentPage": 1,
                        "currentSize": 2,
                        "total": 40,
                        "totalPage": 2
                    }
                }
            }

        }
    },

    {
        url: '/workOrder/applyServerVmDetail',
        type: 'post',
        response: config => {
            return {
                "code": 200,
                "desc": "请求成功",
                "data": {
                    "workOrderType": "APPLY_SERVERVM",
                    "workOrderTypeDesc": "申请云服务器",
                    "workOrderTarget": "wanglei-test",
                    "status": "WAIT_CHECK",
                    "statusDesc": "待审核",
                    "applyTime": "2021-06-21 16:45:25",
                    "applyReason": "测试",
                    "auditOpinion": null,
                    "auditionTime": null,
                    "auditionUser": null,
                    "userId": 17,
                    "osMachine": "KylinsecOS",
                    "useMonth": 6,
                    "applyNum": 2,
                    "deadlineType": "POWER_OFF",
                    "deadlineTypeDesc": "关机",
                    "cpu": 2,
                    "mem": 4,
                    "disks": [
                        {
                            "diskSize": 500,
                            "purpose": "用途xx"
                        },
                        {
                            "diskSize": 200,
                            "purpose": "用途xx"
                        }
                    ],
                    "networks": [
                        {
                            "purpose": "网络类型(Bridge) 交换机（TPlinksafg）端口组（102）"
                        },
                        {
                            "purpose": "网络类型(Bridge) 交换机（TPlinksafg）端口组（103）"
                        },
                        {
                            "purpose": "外网网卡测试使用"
                        },
                        {
                            "purpose": "内网网卡，测试使用"
                        }
                    ]
                }
            }

        }
    },
    {
        url: '/workOrder/modifyServerVmDetail',
        type: 'post',
        response: config => {
            return {
                "code": 200,
                "desc": "请求成功",
                "data": {
                    "workOrderType": "MODIFY_SERVERVM",
                    "workOrderTypeDesc": "变更云服务器",
                    "workOrderTarget": "wanglei-test",
                    "status": "WAIT_CHECK",
                    "statusDesc": "待审核",
                    "applyTime": "2021-06-21 16:45:25",
                    "applyReason": "测试",
                    "auditOpinion": null,
                    "auditionTime": null,
                    "auditionUser": null,
                    "userId": 17,
                    "osMachine": "KylinsecOS",
                    "deadLineTime": "2022-09-22 23:59:59",
                    "applyNum": 2,
                    "deadlineType": "POWER_OFF",
                    "deadlineTypeDesc": "关机",
                    "cpu": 2,
                    "mem": 4,
                    "disks": [
                        {
                            "diskSize": 500,
                            "purpose": "测试磁盘1"
                        },
                        {
                            "diskSize": 200,
                            "purpose": "测试磁盘2"
                        }
                    ],
                    "networks": [
                        {
                            "purpose": "网络类型(Bridge) 交换机（TPlinksafg）端口组（102）"
                        },
                        {
                            "purpose": "网络类型(Bridge) 交换机（TPlinksafg）端口组（103）"
                        },
                        {
                            "purpose": "外网网卡测试使用"
                        },
                        {
                            "purpose": "内网网卡，测试使用"
                        }
                    ]
                }
            }
        }
    },
    {
        url: '/workOrder/applyDeferredDetail',
        type: 'post',
        response: config => {
            return {
                "code": 200,
                "desc": "请求成功",
                "data": {
                    "workOrderType": "DEFERRED_SERVERVM",
                    "workOrderTypeDesc": "延期云服务器",
                    "workOrderTarget": "wanglei",
                    "status": "WAIT_CHECK",
                    "statusDesc": "待审核",
                    "applyTime": "2021-06-18 14:48:07",
                    "applyReason": "修改真实姓名",
                    "auditOpinion": null,
                    "auditionTime": null,
                    "auditionUser": null,
                    "userId": 8,
                    "oldDeadlineTime": "2021-07-22 23:59:59",
                    "newDeadlineTime": "2021-08-22 23:59:59"
                }
            }

        }
    },
    {
        url: '/workOrder/registerUserDetail',
        type: 'post',
        response: config => {
            return {
                "code": 200,
                "desc": "请求成功",
                "data": {
                    "workOrderType": "REGISTER_USER",
                    "workOrderTypeDesc": "注册账号",
                    "workOrderTarget": "wanglei1",
                    "status": "WAIT_CHECK",
                    "statusDesc": "待审核",
                    "applyTime": "2021-06-18 14:13:05",
                    "applyReason": "测试申请",
                    "auditOpinion": null,
                    "auditionTime": null,
                    "auditionUser": null,
                    "userName": "wanglei1",
                    "realName": "汪雷",
                    "organizationName": "研发一部",
                    "mobile": 1234564433
                }
            }


        }
    },
    {
        url: '/workOrder/updateUserDetail',
        type: 'post',
        response: config => {
            return {
                "code": 200,
                "desc": "请求成功",
                "data": {
                    "workOrderType": "MODIFY_USER",
                    "workOrderTypeDesc": "修改账号",
                    "workOrderTarget": "wanglei",
                    "status": "WAIT_CHECK",
                    "statusDesc": "待审核",
                    "applyTime": "2021-06-18 14:48:07",
                    "applyReason": "修改真实姓名",
                    "auditOpinion": null,
                    "auditionTime": null,
                    "auditionUser": null,
                    "userId": 8,
                    "userName": "wanglei",
                    "realName": "汪雷",
                    "newRealName": "runningwang",
                    "organizationName": "研发一部",
                    "mobile": null
                }
            }
        }
    }
]