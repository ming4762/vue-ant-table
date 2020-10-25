import { ApiUtils } from 'cloud-js-utils'

export default class ApiService {
  static postAjax (url: string, parameter?: any, headers?: any, timeout?: number) {
    headers = headers || {}
    // const token = AuthUtil.getToken()
    // if (token) {
    //   headers[TOKEN_KEY] = AuthUtil.getToken()
    // }
    return ApiUtils.postAjax(url, parameter, headers, timeout)
      .then(data => {
        if (data && data.success === true) {
          return data.data
        } else {
          return Promise.reject(data)
        }
      })
  }
}
