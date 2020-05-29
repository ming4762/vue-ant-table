/**
 * form组件
 */
import { Form, FormItem } from '../packages/form'

import { TableCrud, Table } from '../packages/table'

import { use, i18n } from './locale'

const components = [
  Form, TableCrud, Table, FormItem
]

const install = function (Vue, options = {}) {
  use(options.locale)
  i18n(options.i18n)

  if (install.installed) return
  install.installed = true
  // 遍历并注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const installComponent = {
  install,
  ...components
}
export default installComponent
