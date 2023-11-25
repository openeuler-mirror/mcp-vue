/**
 * 公共数据转换方法.
 */

export default {
    // 时间戳转换
    transTime(timestamp) {
        if (timestamp) {
            timestamp = Number(timestamp)
            const time = new Date(timestamp)
            return time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + "/ " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "." + time.getMilliseconds();
        }
        return 0
    },

    // 文件大小转换
    transFileSize(limit) {
        let size = "";
        if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B  
            size = limit.toFixed(2) + "B";
        } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB  
            size = (limit / 1024).toFixed(2) + "KB";
        } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";
        } else { //其他转化成GB  
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }

        let sizestr = size + "";
        let len = sizestr.indexOf("\.");
        let dec = sizestr.substr(len + 1, 2);
        if (dec == "00") {//当小数点后为00时 去掉小数部分  
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
        }
        return sizestr;
    },
    getPercent(num, total) {
        /// <summary>
        /// 求百分比
        /// </summary>
        /// <param name="num">当前数</param>
        /// <param name="total">总数</param>
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
            return 0;
        }
        return total <= 0 ? 0 : Math.round((num / total) * 10000) / 100.00;
    },

    formatterData(val) {
        var timediff = val / 1000
        // 计算天数 
        var days = Math.floor(timediff / 86400)
        // 计算小时数 
        var remain = timediff % 86400
        var hours = Math.floor(remain / 3600)
        // 计算分钟数
        remain = remain % 3600
        var mins = Math.floor(remain / 60)
        // 计算秒数
        remain = remain % 60
        var seconds = Math.ceil(remain)
        var d = ''
        var h = ''
        var m = ''
        var s = ''
        if (days > 0) { d = days + '天' }
        if (hours > 0) { h = hours + '小时' }
        if (mins > 0) { m = mins + '分钟' }
        if (seconds > 0) { s = seconds + '秒' }
        return d || h || m || s ? d + h + m + s : ''
    },
    // 保留几位小数
    keepTwoDecimal(num, dec) {
        var strNum = num + '';/*把要转换的小数转换成字符串*/
        var index = strNum.indexOf("."); /*获取小数点的位置*/
        if (index < 0) {
            return num;/*如果没有小数点，那么无需四舍五入，返回这个整数*/
        }
        var n = strNum.length - index - 1;/*获取当前浮点数，小数点后的位数*/
        if (dec < n) {
            /*把小数点向后移动要保留的位数，把需要保留的小数部分变成整数部分，只留下不需要保留的部分为小数*/
            var e = Math.pow(10, dec);
            num = num * e;
            /*进行四舍五入，只保留整数部分*/
            num = Math.round(num);
            /*再把原来小数部分还原为小数*/
            return num / e;
        } else {
            return num;/*如果当前小数点后的位数等于或小于要保留的位数，那么无需处理，直接返回*/
        }
    }
}