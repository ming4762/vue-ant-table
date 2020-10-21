import defaultLang from './lang/zh_CN'
import enUS from './lang/en_US'
import koKR from './lang/ko_KR'
import * as vue from 'vue'
import deepmerge from 'deepmerge'

let lang: any = defaultLang || enUS || koKR
let merged = false

declare const window: Window & { Vue: any }
const Vue: any = vue || window.Vue

let i18nHandler: Function = (path: string, options: any) => {
  const vuei18n: Function = Object.getPrototypeOf(Vue).$t
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true
      Vue.locale(
        Vue.config.lang,
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      )
    }
    return vuei18n(path, options)
  }
}

export const t = (path: string, options?: any) => {
  let value = i18nHandler(path, options)

  if (value !== null && value !== undefined) return value
  const array: Array<string> = path.split('.')
  let current: any = lang
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i]
    value = current[property]
    if (i === j - 1) {
      return value
      // return format(value, options)
    }
    if (!value) return ''
    current = value
  }
  return ''
}

export const use = function (l: any) {
  lang = l || lang
}

export const i18n = function (handler: Function) {
  i18nHandler = handler || i18nHandler
}

export default {
  use,
  i18n
}
