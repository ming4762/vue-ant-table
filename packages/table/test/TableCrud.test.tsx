import { defineComponent } from 'vue'

import TableCrud from '../src/TableCrud'

import { TableColumn, CrudSearch } from '../../utils/types/Types'

export default defineComponent({
  components: {
    TableCrud
  },
  data () {
    return {
      columns: [
        {
          prop: 'name',
          label: '姓名',
          search: {
            symbol: 'like'
          }
        }
      ] as Array<TableColumn>,
      search: {
        defaultVisible: true
      } as CrudSearch
    }
  },
  render () {
    return <div>
      <s-table-crud
        keys={['name']}
        search={this.search}
        columns={this.columns}></s-table-crud>
    </div>
  }
})
