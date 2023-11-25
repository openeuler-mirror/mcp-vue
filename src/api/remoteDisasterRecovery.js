import request from '@/utils/request'

// 获取站点列表 
export function drSiteList(data) {
    return request({
        url: '/bdr/site/list',
        method: 'post',
        data
    })
}
// 删除站点数据
export function delSiteConnect(data) {
    return request({
        url: '/bdr/site/delete',
        method: 'post',
        data
    })
}

// 获取集群列表
export function getClusterList(data) {
    return request({
        url: '/bdr/site/clusterList',
        method: 'post',
        data
    })
}

// 添加集群
export function addCluster(data) {
    return request({
        url: '/bdr/site/add',
        method: 'post',
        data
    })
}
// 删除集群
export function delCluster(data) {
    return request({
        url: '/bdr/site/delete',
        method: 'post',
        data
    })
}
//获取站点列表
export function getSiteArr(data) {
    return request({
        url: '/bdr/site/link/siteNodeList',
        method: 'post',
        data
    })
}
//添加链路
export function addLinkSite(data) {
    return request({
        url: '/bdr/site/link/add',
        method: 'post',
        data
    })
}
//链路列表
export function linkSiteList(data) {
    return request({
        url: '/bdr/site/link/list',
        method: 'post',
        data
    })
}
//检测链路
export function checkLinkConnect(data) {
    return request({
        url: '/bdr/site/link/check',
        method: 'post',
        data
    })
}
//删除链路
export function delLinkConnect(data) {
    return request({
        url: '/bdr/site/link/delete',
        method: 'post',
        data
    })
}

//链路编辑详情
export function bdrLinkDetail(data) {
    return request({
        url: '/bdr/site/link/detail',
        method: 'post',
        data
    })
}
//链路编辑提交
export function editLinkSite(data) {
    return request({
        url: '/bdr/site/link/edit',
        method: 'post',
        data
    })
}
//容灾策略列表
export function getBdrPlanList(data) {
    return request({
        url: '/bdr/plan/page',
        method: 'post',
        data
    })
}
//容灾策略虚拟机列表
export function getPlanVmList(data) {
    return request({
        url: '/bdr/plan/machineList',
        method: 'post',
        data
    })
}
//创建策略
export function handelAddPlan(data) {
    return request({
        url: '/bdr/plan/add',
        method: 'post',
        data
    })
}
//删除容灾策略
export function handelDelPlan(data){
    return request({
        url: '/bdr/plan/delete',
        method: 'post',
        data
    })
}
//容灾策略启用禁用
export function handelSwitchPlan(data){
    return request({
        url: '/bdr/plan/switch',
        method: 'post',
        data
    })
}

//获取容灾策略详情
export function handelGetDeatail(data){
    return request({
        url: '/bdr/plan/detail',
        method: 'post',
        data
    })
}
//修改容灾策略详情
export function handelEditPlan(data){
    return request({
        url: '/bdr/plan/edit',
        method: 'post',
        data
    })
}
//立即执行
export function handelRunBdrNow(data){
    return request({
        url: '/bdr/plan/batchImmediateExecution',
        method: 'post',
        data
    })
}
//批量
export function handelbatchSwitchBdr(data){
    return request({
        url: '/bdr/plan/batchSwitch',
        method: 'post',
        data
    })
}
export function siteBackupData(data){
    return request({
        url: '/bdr/machine/siteBackupData',
        method: 'post',
        data
    })
}
//恢复站点数据
export function getBackupDataList(data){
    return request({
        url: '/bdr/machine/backupList',
        method: 'post',
        data
    })
}
//同步恢复
export function handelRpoBackupFile(data){
    return request({
        url: '/bdr/machine/rpoBackupFile',
        method: 'post',
        data
    })
}
//差异性比较
export function handelCheckDifference(data){
    return request({
        url: '/bdr/machine/checkDifference',
        method: 'post',
        data
    })
}
//提交容灾演练
export function handelStartDrill(data){
    return request({
        url: '/bdr/machine/startDrill',
        method: 'post',
        data
    })
}
//提交结束容灾演练
export function handelEndDrill(data){
    return request({
        url: '/bdr/machine/endDrill',
        method: 'post',
        data
    })
}
// 主站点备份恢复
export function handelMasterSiteRecover(data){
    return request({
        url: '/bdr/machine/masterSiteRecover',
        method: 'post',
        data
    })
}
// 计划内备份恢复
export function handelPlanRecover(data){
    return request({
        url: '/bdr/machine/planRecover',
        method: 'post',
        data
    })
}
// 灾难后恢复备份恢复
export function handelfailureRecover(data){
    return request({
        url: '/bdr/machine/failureRecover',
        method: 'post',
        data
    })
}
// 数据回迁
export function handelmoveBack(data){
    return request({
        url: '/bdr/machine/moveBack',
        method: 'post',
        data
    })
}

//主备kcp列表
export function handelGetKcpHa(data){
    return request({
        url: '/ha/nodeList',
        method: 'post',
        data
    })
}
//主备kcp列表删除
export function handelDelKcpHa(data){
    return request({
        url: '/ha/deleteSlave',
        method: 'post',
        data
    })
}
//主备kcp 备变主
export function handelChangeToMaster(data){
    return request({
        url: '/ha/changeToMaster',
        method: 'post',
        data
    })
}
//主备kcp 添加
export function handelAddHa(data){
    return request({
        url: '/ha/addSlave',
        method: 'post',
        data
    })
}
//主备站点备份文件列表
export function backupDataList(data){
    return request({
        url: '/bdr/machine/backupDataList',
        method: 'post',
        data
    })
}