import defaultLang from './lang/zh_CN'
import enUS from './lang/en_US'
import koKR from './lang/ko_KR'
import vue from 'vue'
import deepmerge from 'deepmerge'

let lang = defaultLang || enUS || koKR
let merged = false

const Vue = vue || window.Vue

let i18nHandler = (path, options) => {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true
      Vue.locale(
        Vue.config.lang,
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      )
    }
    return vuei18n.apply(this, [path, options])
  }
}

export const t = (path, options) => {
  let value = i18nHandler.apply(this, [path, options])

  if (value !== null && value !== undefined) return value
  const array = path.split('.')
  let current = lang
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

export const use = function (l) {
  lang = l || lang
}

export const i18n = function (handler) {
  i18nHandler = handler || i18nHandler
}

export default {
  use,
  i18n
}
