import Form from './src/Form'
import FormItem from './src/FormItem'

Form.install = (Vue) => {
  Vue.component(Form.name, Form)
}

FormItem.install = (Vue) => {
  Vue.component(FormItem.name, FormItem)
}

export {
  Form,
  FormItem
}
