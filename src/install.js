/**
 * form组件
 */
import { Form } from '../packages/form'

import { TableCrud, Table } from '../packages/table'

const components = [
  Form, TableCrud, Table
]

const install = function (Vue) {
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
