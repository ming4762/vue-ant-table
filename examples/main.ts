import { createApp } from 'vue'
import App from './App.vue'
import vueAntTable from '../src/install'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.use(vueAntTable, {
  // i18n: (key, value) => i18n.t(key, value)
})
app.use(Antd)

app.mount('#app')
