import Table from './src/Table'
import TableCRUD from './src/TableCRUD'

Table.install = (Vue) => {
  Vue.component(Table.name, Table)
}

TableCRUD.install = (Vue) => {
  Vue.component(TableCRUD.name, TableCRUD)
}

export {
  Table,
  TableCRUD
}
