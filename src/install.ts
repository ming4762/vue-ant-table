import { use, i18n } from './locale'

import { Table, TableCrud } from '../packages/table'
import { Form, FormItem } from '../packages/form'

declare const window: Window & { Vue: any }

const components: Array<any> = [
  Table,
  TableCrud,
  Form,
  FormItem
]

const install: any = function (Vue: any, options: any = {}) {
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
