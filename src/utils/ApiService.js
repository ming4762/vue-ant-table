import { ApiUtils } from 'cloud-js-utils'

/**
 * token请求头key
 */
// const TOKEN_KEY = 'Authorization'
// const API_URK_KEY = 'API_URL'

export default class ApiService {
  /**
   * 发送ajax请求
   * @param url 请求地址
   * @param parameter 请求参数
   * @param headers 请求头
   * @param timeout 超时时间
   * @returns {Promise<AxiosResponse<T>>}
   */
  static postAjax (url, parameter, headers, timeout) {
    headers = headers || {}
    // const token = AuthUtil.getToken()
    // if (token) {
    //   headers[TOKEN_KEY] = AuthUtil.getToken()
    // }
    return ApiUtils.postAjax(url, parameter, headers, timeout)
      .then(data => {
        if (data && data.ok === true) {
          return data.data
        } else {
          return Promise.reject(data)
        }
      })
  }
}
