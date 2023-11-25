/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * 传入中文的时候直接生成编码过的url
 * @param {sting} url
 * @param {sting} key
 * @param {sting} value
 * @returns
 */
export function getUrlWithParam(url, key, value) {
  // 使用URL对象解析URL
  let urlObj = new URL(url);

  // 获取搜索参数对象
  let params = urlObj.searchParams;

  // 遍历已有参数,先解码再编码
  params.forEach((value, key) => {
    params.set(key, encodeURIComponent(decodeURIComponent(value)));
  });

  // 设置新的参数
  params.set(key, encodeURIComponent(value));

  // 拼接成新的URL
  return urlObj.origin + urlObj.pathname + "?" + params;
}
