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
        var timediff = val / 1000 // 计算天数 
        var days = Math.floor(timediff / 86400) // 计算小时数 
        var remain = timediff % 86400
        var hours = Math.floor(remain / 3600) // 计算分钟数
        remain = remain % 3600
        var mins = Math.floor(remain / 60)
        var d = ''
        var h = ''
        var m = ''
        if (days > 0) { d = days + '天' }
        if (hours > 0) { h = hours + '小时' }
        if (mins > 0) { m = mins + '分钟' }
        return d || h || m ? d + h + m : ''
    },
}