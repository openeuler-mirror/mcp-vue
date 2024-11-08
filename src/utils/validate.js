/**
 * 公共校验方法.
 */

const rules = {
  external: /^(https?:|mailto:|tel:)/, // 是否是外部链接
  number: /^[0-9]*$/, // 任意数字
  int: /^-?[1-9]\d*$/, // 整数
  int_p: /^[1-9]\d*$/, // 正整数
  int_n: /^-[1-9]\d*$/, // 负整数
  int_p0: /^[1-9]\d*|0$/, // 非负整数（正整数 + 0）
  int_n0: /^-[1-9]\d*|0$/, // 非正整数（负整数 + 0）
  float: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, // 匹配浮点数
  float_p: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, // 匹配正浮点数
  float_n: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/, // 匹配负浮点数
  float_p0: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/, // 匹配非负浮点数（正浮点数 + 0）
  float_n0: /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/, // 匹配非正浮点数（负浮点数 + 0）

  password_en_num: /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{4,23}/, // 英文字母、数字的组合
  en_num: /^[a-z0-9]+$/i, // 英文字母、数字的组合
  char_zh_en_num: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, // 中文、英文字母、数字的组合
  char_num: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, // 中文、英文字母、数字和下划线的组合
  special_char: /[`~!@#$%^&*\+=<>?:"{}()|\\[\]·~@#￥%……&*（）——\+={}|《》“”【】‘’]/  //特殊字符

}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const char_en_num = (str) => {
  const testRule = rules['en_num']
  return testRule.test(str)
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const en_num = (str) => {
  const testRule = rules['en_num']
  return testRule.test(str)
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const char_num = (str) => {
  const testRule = rules['char_num']
  return testRule.test(str)
}
/**
   * @param {string} str
   * @returns {Boolean}
   */
const char_zh_en_num = (str) => {
  const testRule = rules['char_zh_en_num']
  return testRule.test(str)
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const special_char = (str) => {
  const testRule = rules['special_char']
  return testRule.test(str)
}

/**
 * @param {string} path
 * @returns {Boolean}
 * 是否是外部链接
 */
export function isExternal(path) {
  const testRule = rules['external']
  return testRule.test(path)
}
// 正则规则
export function validRule() {
  return {
    num_letter_: /^[a-zA-Z0-9_]+$/, // 字母、数字、下划线
    num_letter_midline: /^[A-Za-z0-9\-]+$/, // 匹配字母、数字、中划线
    num: /(^[0-9]\d*$)/, // 数字
    character1: /^[A-Za-z0-9_\-.@]+$/, // 匹配字母、数字、下划线、中划线、点、@符号
    character2: /^[A-Za-z0-9_\u4E00-\u9FA5A\-.。；;,，'"]+$/, // 匹配字母、数字、下划线、中文、中划线、点、以及“。；;,，”
    character3: /^[a-zA-Z0-9_\u4E00-\u9FA5A\-]+$/, // 字母、数字、下划线、中划线、中文
    ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  }
}
// 校验纯数字类型
export function validNum(value) {
  const reg = validRule()
  return reg.num.test(value)
}

export default {
  // 校验英文、数字
  validateEnNum(rule, value, callback) {
    if (!en_num(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 校验中文、英文字母、数字和下划线
  validateCharNum(rule, value, callback) {
    if (String(value).length && !char_num(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 校验中文、英文字母、数字
  validateCharZhEnNum(rule, value, callback) {
    if (!value) {
      callback()
      return
    }
    if (!char_zh_en_num(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  //校验特殊字符
  special_char(rule, value, callback) {
    if (special_char(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 校验ip
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
  },
  // 端口号
  isPort(port) {
    if (/^[1-9]\d*|0$/.test(port) && port * 1 >= 0 && port * 1 <= 65535) {
      return true
    }
    return false;
  },
  // 校验纯数字类型
  validNum(value) {
    const reg = validRule()
    return reg.num.test(value)
  }
}
