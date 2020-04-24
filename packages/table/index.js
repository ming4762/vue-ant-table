import Table from './src/Table'
import TableCrud from './src/TableCrud'

Table.install = (Vue) => {
  Vue.component(Table.name, Table)
}

TableCrud.install = (Vue) => {
  Vue.component(TableCrud.name, TableCrud)
}

export {
  Table,
  TableCrud
}
