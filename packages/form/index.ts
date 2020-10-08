import { App } from 'vue'

import FormItem from './src/FormItem'
import Form from './src/Form'

FormItem.install = (app: App) => {
  app.component(FormItem.name, FormItem)
}

Form.install = (app: App) => {
  app.component(Form.name, Form)
}

export {
  FormItem,
  Form
}
