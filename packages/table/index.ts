import { App } from 'vue'

import Table from './src/Table'
import TableCrud from './src/TableCrud'

Table.install = (app: App) => {
  app.component(Table.name, Table)
}

TableCrud.install = (app: App) => {
  app.component(TableCrud.name, Table)
}

export {
  Table,
  TableCrud
}
